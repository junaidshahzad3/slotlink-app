import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthenticatedPro();
  if (!authed && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }
  if (authed && existing.userId !== authed.id) {
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
