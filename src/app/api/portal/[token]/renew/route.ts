import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const RenewSchema = z.object({
  hours: z.number().int().min(1).max(20),
  priceCents: z.number().int().min(0).max(500_000).optional(),
});

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  const { token } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = RenewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid renewal pack request.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.student.findUnique({ where: { magicToken: token } });
  if (!existing) {
    return NextResponse.json({ error: 'Invalid portal link' }, { status: 404 });
  }

  const addedCents =
    parsed.data.priceCents ??
    (parsed.data.hours === 5 ? 25000 : parsed.data.hours * 5500);

  const student = await prisma.student.update({
    where: { id: existing.id },
    data: {
      hoursRemaining: { increment: parsed.data.hours },
      totalPaidCents: { increment: addedCents },
    },
  });

  return NextResponse.json({ student });
}
