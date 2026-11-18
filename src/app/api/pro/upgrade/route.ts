import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { isLivePaddleConfigured } from '@/lib/security';

const UpgradeSchema = z.object({
  tier: z.enum(['SOLO_12', 'PRO_19']).default('PRO_19'),
});

export async function POST(req: NextRequest) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (process.env.NODE_ENV === 'production' && isLivePaddleConfigured()) {
    return NextResponse.json(
      { error: 'Complete Paddle checkout to activate or change your subscription.' },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = UpgradeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: authed.id },
    data: {
      subscriptionTier: parsed.data.tier,
      paddleSubStatus: 'active',
    },
    select: {
      id: true,
      email: true,
      slug: true,
      subscriptionTier: true,
      paddleSubStatus: true,
    },
  });

  return NextResponse.json({ user });
}
