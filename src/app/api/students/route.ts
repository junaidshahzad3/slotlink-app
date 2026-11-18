import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { generateMagicToken } from '@/lib/magic-token';

const CreateStudentSchema = z.object({
  name: z.string().trim().min(2, 'Client name is required').max(120),
  email: z.string().trim().email('Valid client email is required'),
  hoursRemaining: z.number().int().min(0).max(200).default(0),
  totalPaidCents: z.number().int().min(0).max(10_000_000).default(0),
});

export async function POST(req: NextRequest) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateStudentSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid client details';
    return NextResponse.json(
      { error: firstIssue, details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const normalizedEmail = parsed.data.email.toLowerCase();
  const existing = await prisma.student.findUnique({
    where: { userId_email: { userId: authed.id, email: normalizedEmail } },
  });

  if (existing) {
    const student = await prisma.student.update({
      where: { id: existing.id },
      data: {
        name: parsed.data.name,
        hoursRemaining: { increment: parsed.data.hoursRemaining },
        totalPaidCents: { increment: parsed.data.totalPaidCents },
      },
    });
    return NextResponse.json({ student, updated: true }, { status: 200 });
  }

  const student = await prisma.student.create({
    data: {
      userId: authed.id,
      name: parsed.data.name,
      email: normalizedEmail,
      magicToken: generateMagicToken(),
      hoursRemaining: parsed.data.hoursRemaining,
      totalPaidCents: parsed.data.totalPaidCents,
    },
  });

  return NextResponse.json({ student, updated: false }, { status: 201 });
}
