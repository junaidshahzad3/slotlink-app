import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';

const TopupSchema = z.object({ hours: z.number().int().min(1).max(100) });

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthenticatedPro();
  if (!authed && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = TopupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.student.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: 'Student not found' }, { status: 404 });
  if (authed && existing.userId !== authed.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const addedCents = parsed.data.hours === 5 ? 25000 : parsed.data.hours * 5500;

  const student = await prisma.student.update({
    where: { id },
    data: {
      hoursRemaining: { increment: parsed.data.hours },
      totalPaidCents: { increment: addedCents },
    },
  });
  return NextResponse.json({ student });
}
