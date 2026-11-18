import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { generateMagicToken } from '@/lib/magic-token';

const TopupSchema = z
  .object({
    hours: z.number().int().min(-20).max(100).optional(),
    rotateToken: z.boolean().optional(),
  })
  .refine(
    (data) => (typeof data.hours === 'number' && data.hours !== 0) || Boolean(data.rotateToken),
    { message: 'Provide hours adjustment or rotateToken=true.' }
  );

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = TopupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const student = await prisma.$transaction(async (tx) => {
      const existing = await tx.student.findUnique({ where: { id } });
      if (!existing) throw new Error('NOT_FOUND');
      if (existing.userId !== authed.id) throw new Error('FORBIDDEN');

      const deltaHours = parsed.data.hours ?? 0;
      const nextHours = Math.max(0, existing.hoursRemaining + deltaHours);

      let addedCents = 0;
      if (deltaHours > 0) {
        const services = await tx.service.findMany({
          where: { userId: authed.id },
          orderBy: { createdAt: 'asc' },
        });
        const exactPack = services.find((s) => s.packageHrs === deltaHours);
        if (exactPack) {
          addedCents = exactPack.priceCents;
        } else {
          const singleUnit =
            services.find((s) => s.packageHrs === 1) ??
            services.find((s) => s.packageHrs > 0);
          if (singleUnit) {
            const perHourCents = Math.round(singleUnit.priceCents / singleUnit.packageHrs);
            addedCents = perHourCents * deltaHours;
          }
        }
      }

      return tx.student.update({
        where: { id },
        data: {
          ...(typeof parsed.data.hours === 'number' && parsed.data.hours !== 0
            ? {
                hoursRemaining: nextHours,
                ...(addedCents > 0 ? { totalPaidCents: { increment: addedCents } } : {}),
              }
            : {}),
          ...(parsed.data.rotateToken ? { magicToken: generateMagicToken() } : {}),
        },
      });
    });

    return NextResponse.json({ student });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'NOT_FOUND') {
        return NextResponse.json({ error: 'Student not found' }, { status: 404 });
      }
      if (err.message === 'FORBIDDEN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    throw err;
  }
}
