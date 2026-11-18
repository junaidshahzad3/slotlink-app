import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

const SUBSCRIPTION_EVENTS = new Set([
  'subscription.created',
  'subscription.activated',
  'subscription.updated',
  'subscription.canceled',
  'subscription.past_due',
  'subscription.paused',
]);

function verifyPaddleSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !secret || secret.startsWith('pdl_ntfset_...')) return false;

  const parts: Record<string, string> = {};
  for (const segment of header.split(';')) {
    const trimmed = segment.trim();
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex <= 0) continue;
    parts[trimmed.slice(0, eqIndex).trim()] = trimmed.slice(eqIndex + 1).trim();
  }

  const ts = parts['ts'];
  const h1 = parts['h1'];
  if (!ts || !h1) return false;

  const tsSeconds = Number(ts);
  if (!Number.isFinite(tsSeconds)) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - tsSeconds) > 300) {
    return false;
  }

  const expected = createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex');
  const expectedBuf = Buffer.from(expected, 'utf8');
  const receivedBuf = Buffer.from(h1, 'utf8');
  if (expectedBuf.length !== receivedBuf.length) return false;

  try {
    return timingSafeEqual(expectedBuf, receivedBuf);
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get('paddle-signature');
  const secret = process.env.PADDLE_WEBHOOK_SECRET ?? '';

  if (!verifyPaddleSignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: 'Invalid Paddle signature' }, { status: 401 });
  }

  let event: {
    event_type?: string;
    data?: {
      customer_id?: string;
      status?: string;
      custom_data?: { userId?: string };
      items?: Array<{ price?: { id?: string } }>;
    };
  };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const eventType = event?.event_type;
  if (!eventType || !SUBSCRIPTION_EVENTS.has(eventType)) {
    return NextResponse.json({ received: true, ignored: true });
  }

  const customerId = event?.data?.customer_id;
  const status = event?.data?.status;
  const userId = event?.data?.custom_data?.userId;
  const priceId = event?.data?.items?.[0]?.price?.id;

  const tier =
    status === 'active' || status === 'trialing'
      ? priceId === process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO
        ? 'PRO_19'
        : 'SOLO_12'
      : 'TRIAL';

  if (userId) {
    await prisma.user.updateMany({
      where: { id: userId },
      data: {
        ...(customerId ? { paddleCustomerId: customerId } : {}),
        ...(status ? { paddleSubStatus: status } : {}),
        subscriptionTier: tier,
      },
    });
  } else if (customerId && status) {
    await prisma.user.updateMany({
      where: { paddleCustomerId: customerId },
      data: { paddleSubStatus: status, subscriptionTier: tier },
    });
  }

  return NextResponse.json({ received: true });
}
