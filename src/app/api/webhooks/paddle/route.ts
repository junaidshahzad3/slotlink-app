import { NextRequest, NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';

function verifyPaddleSignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(';').map((kv) => kv.split('=')));
  const ts = parts['ts'];
  const h1 = parts['h1'];
  if (!ts || !h1) return false;

  const expected = createHmac('sha256', secret).update(`${ts}:${rawBody}`).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(h1));
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

  const event = JSON.parse(rawBody);
  const customerId = event?.data?.customer_id as string | undefined;
  const status = event?.data?.status as string | undefined;
  const userId = event?.data?.custom_data?.userId as string | undefined;
  const priceId = event?.data?.items?.[0]?.price?.id as string | undefined;

  const tier =
    status === 'active'
      ? priceId === process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO
        ? 'PRO_19'
        : 'SOLO_12'
      : 'TRIAL';

  if (userId) {
    await prisma.user.update({
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
