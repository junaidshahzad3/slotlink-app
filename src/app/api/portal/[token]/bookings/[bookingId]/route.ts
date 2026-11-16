import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar';

const PortalActionSchema = z.object({
  action: z.enum(['CANCEL', 'RESCHEDULE']),
  newStartsAt: z.string().datetime().optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ token: string; bookingId: string }> }
) {
  const { token, bookingId } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = PortalActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid reschedule or cancellation request.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const student = await prisma.student.findUnique({ where: { magicToken: token } });
  if (!student) return NextResponse.json({ error: 'Invalid portal link' }, { status: 404 });

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, studentId: student.id, status: 'CONFIRMED' },
    include: { service: true, user: { select: { googleRefreshToken: true } } },
  });
  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

  // 24-hour cutoff guard
  const hoursUntilStart = (booking.startsAt.getTime() - Date.now()) / 3_600_000;
  if (hoursUntilStart < 24) {
    return NextResponse.json(
      { error: 'Changes must be made at least 24 hours before the session.' },
      { status: 400 }
    );
  }

  if (parsed.data.action === 'CANCEL') {
    if (booking.calendarEventId) {
      await deleteGoogleCalendarEvent(booking.user.googleRefreshToken, booking.calendarEventId).catch(() => false);
    }
    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CANCELLED' },
    });
    return NextResponse.json({ booking: updated });
  }

  if (!parsed.data.newStartsAt) {
    return NextResponse.json({ error: 'newStartsAt is required to reschedule' }, { status: 400 });
  }

  const newStart = new Date(parsed.data.newStartsAt);
  if (Number.isNaN(newStart.getTime()) || newStart.getTime() <= Date.now() + 3_600_000) {
    return NextResponse.json(
      { error: 'New session time must be at least 1 hour in the future.' },
      { status: 400 }
    );
  }
  const newEnd = new Date(newStart.getTime() + booking.service.durationMin * 60_000);

  const conflict = await prisma.booking.findFirst({
    where: {
      userId: booking.userId,
      id: { not: booking.id },
      status: 'CONFIRMED',
      startsAt: { lt: newEnd },
      endsAt: { gt: newStart },
    },
  });
  if (conflict) {
    return NextResponse.json({ error: 'Selected slot is no longer available' }, { status: 409 });
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { startsAt: newStart, endsAt: newEnd },
  });
  return NextResponse.json({ booking: updated });
}
