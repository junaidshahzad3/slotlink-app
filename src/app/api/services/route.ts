import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';

const CreateServiceSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1).max(80),
  description: z.string().max(200).optional().default(''),
  durationMin: z.number().int().min(10).max(240),
  priceCents: z.number().int().min(0).max(1_000_000),
  packageHrs: z.number().int().min(0).max(100),
});

export async function POST(req: NextRequest) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = CreateServiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.userId && parsed.data.userId !== authed.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const service = await prisma.service.create({
    data: {
      userId: authed.id,
      name: parsed.data.name,
      description: parsed.data.description,
      durationMin: parsed.data.durationMin,
      priceCents: parsed.data.priceCents,
      packageHrs: parsed.data.packageHrs,
    },
  });

  return NextResponse.json({ service }, { status: 201 });
}
