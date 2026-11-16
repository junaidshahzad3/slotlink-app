import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { deleteGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendEmail, buildCancellationEmail } from '@/lib/email';

const UpdateBookingSchema = z.object({
  status: z.enum(['COMPLETED', 'CANCELLED']).optional(),
  sessionSummary: z.string().max(1000).optional(),
  homeworkUrl: z.string().url().or(z.literal('')).optional(),
});

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const authed = await getAuthenticatedPro();
  if (!authed && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.booking.findUnique({
    where: { id },
    include: {
      student: true,
      service: true,
      user: { select: { id: true, name: true, slug: true, googleRefreshToken: true } },
    },
  });
  if (!existing) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  if (authed && existing.userId !== authed.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (parsed.data.status === 'CANCELLED' && existing.calendarEventId) {
    await deleteGoogleCalendarEvent(existing.user.googleRefreshToken, existing.calendarEventId).catch(() => false);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.update({
      where: { id },
      data: {
        ...(parsed.data.status ? { status: parsed.data.status } : {}),
        ...(parsed.data.sessionSummary !== undefined ? { sessionSummary: parsed.data.sessionSummary } : {}),
        ...(parsed.data.homeworkUrl !== undefined ? { homeworkUrl: parsed.data.homeworkUrl } : {}),
      },
    });

    if (parsed.data.status === 'COMPLETED' && existing.status === 'CONFIRMED') {
      await tx.student.updateMany({
        where: { id: existing.studentId, hoursRemaining: { gt: 0 } },
        data: { hoursRemaining: { decrement: 1 } },
      });
    }

    return booking;
  });

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
