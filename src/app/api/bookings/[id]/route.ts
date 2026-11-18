import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendEmail, buildCancellationEmail } from '@/lib/email';
import { safeHttpUrlSchema } from '@/lib/security';

const UpdateBookingSchema = z.object({
  status: z.enum(['COMPLETED', 'CANCELLED']).optional(),
  sessionSummary: z.string().max(1000).optional(),
  homeworkUrl: safeHttpUrlSchema.or(z.literal('')).optional(),
  startsAt: z.string().datetime().optional(),
  meetingUrl: safeHttpUrlSchema.or(z.literal('')).optional(),
  note: z.string().max(500).optional(),
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
  const parsed = UpdateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid booking update payload.', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  type BookingTxResult = {
    booking: Awaited<ReturnType<typeof prisma.booking.update>>;
    existing: NonNullable<Awaited<ReturnType<typeof prisma.booking.findUnique<{
      where: { id: string };
      include: {
        student: true;
        service: true;
        user: { select: { id: true; name: true; slug: true; googleRefreshToken: true } };
      };
    }>>>>;
  };

  let txResult: BookingTxResult;
  try {
    txResult = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUnique({
        where: { id },
        include: {
          student: true,
          service: true,
          user: { select: { id: true, name: true, slug: true, googleRefreshToken: true } },
        },
      });
      if (!existing) throw new Error('NOT_FOUND');
      if (existing.userId !== authed.id) throw new Error('FORBIDDEN');

      if ((parsed.data.status || parsed.data.startsAt) && existing.status !== 'CONFIRMED') {
        throw new Error('INVALID_STATE');
      }

      let nextStartsAt: Date | undefined;
      let nextEndsAt: Date | undefined;
      if (parsed.data.startsAt) {
        const startCandidate = new Date(parsed.data.startsAt);
        if (Number.isNaN(startCandidate.getTime()) || startCandidate.getTime() <= Date.now()) {
          throw new Error('PAST_TIME');
        }
        const endCandidate = new Date(
          startCandidate.getTime() + existing.service.durationMin * 60_000
        );

        const conflict = await tx.booking.findFirst({
          where: {
            userId: existing.userId,
            id: { not: existing.id },
            status: 'CONFIRMED',
            startsAt: { lt: endCandidate },
            endsAt: { gt: startCandidate },
          },
        });
        if (conflict) throw new Error('CONFLICT');

        nextStartsAt = startCandidate;
        nextEndsAt = endCandidate;
      }

      const updateFields = {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.sessionSummary !== undefined
          ? { sessionSummary: parsed.data.sessionSummary }
          : {}),
        ...(parsed.data.homeworkUrl !== undefined
          ? { homeworkUrl: parsed.data.homeworkUrl }
          : {}),
        ...(parsed.data.meetingUrl !== undefined
          ? { meetingUrl: parsed.data.meetingUrl }
          : {}),
        ...(parsed.data.note !== undefined ? { note: parsed.data.note } : {}),
        ...(nextStartsAt ? { startsAt: nextStartsAt } : {}),
        ...(nextEndsAt ? { endsAt: nextEndsAt } : {}),
      };

      if (parsed.data.status === 'COMPLETED' || parsed.data.status === 'CANCELLED') {
        const claim = await tx.booking.updateMany({
          where: { id, userId: authed.id, status: 'CONFIRMED' },
          data: updateFields,
        });
        if (claim.count === 0) throw new Error('INVALID_STATE');

        if (parsed.data.status === 'COMPLETED') {
          await tx.student.updateMany({
            where: { id: existing.studentId, hoursRemaining: { gt: 0 } },
            data: { hoursRemaining: { decrement: 1 } },
          });
        }
      } else {
        await tx.booking.update({
          where: { id },
          data: updateFields,
        });
      }

      const booking = await tx.booking.findUniqueOrThrow({ where: { id } });
      return { booking, existing };
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'NOT_FOUND') return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
      if (err.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      if (err.message === 'INVALID_STATE') {
        return NextResponse.json(
          { error: 'Only confirmed sessions can change status or be rescheduled.' },
          { status: 400 }
        );
      }
      if (err.message === 'PAST_TIME') {
        return NextResponse.json({ error: 'Rescheduled time must be in the future.' }, { status: 400 });
      }
      if (err.message === 'CONFLICT') {
        return NextResponse.json(
          { error: 'Selected time overlaps with another confirmed session.' },
          { status: 409 }
        );
      }
    }
    throw err;
  }

  const { booking: updated, existing } = txResult;

  if (parsed.data.status === 'CANCELLED' && existing.calendarEventId) {
    await deleteGoogleCalendarEvent(
      existing.user.googleRefreshToken,
      existing.calendarEventId
    ).catch(() => false);
  }

  if (parsed.data.status === 'CANCELLED') {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    await sendEmail({
      to: existing.student.email,
      subject: `Cancelled: ${existing.service.name} with ${existing.user.name}`,
      html: buildCancellationEmail({
        studentName: existing.student.name,
        proName: existing.user.name,
        serviceName: existing.service.name,
        startsAtIso: existing.startsAt.toISOString(),
        rebookUrl: `${appUrl}/${existing.user.slug}`,
      }),
    }).catch(() => false);
  }

  return NextResponse.json({ booking: updated });
}
