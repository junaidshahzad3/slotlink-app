import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';

const UpdateServiceSchema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().max(200).optional().default(''),
  durationMin: z.number().int().min(10).max(240).optional(),
  priceCents: z.number().int().min(0).max(1_000_000),
  packageHrs: z.number().int().min(0).max(100),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateServiceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  if (existing.userId !== authed.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      ...(parsed.data.durationMin !== undefined
        ? { durationMin: parsed.data.durationMin }
        : {}),
      priceCents: parsed.data.priceCents,
      packageHrs: parsed.data.packageHrs,
    },
  });

  return NextResponse.json({ service });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  if (existing.userId !== authed.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const bookingCount = await prisma.booking.count({ where: { serviceId: id } });
  if (bookingCount > 0) {
    return NextResponse.json(
      { error: 'Cannot delete a service with existing bookings' },
      { status: 409 }
    );
  }

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ deleted: true });
}
