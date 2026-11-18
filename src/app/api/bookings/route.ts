import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { generateMagicToken } from '@/lib/magic-token';
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from '@/lib/google-calendar';
import { sendEmail, buildBookingConfirmationEmail } from '@/lib/email';

const CreateBookingSchema = z.object({
  proSlug: z.string().min(1),
  serviceId: z.string().min(1),
  startsAt: z.string().datetime(),
  studentName: z.string().min(1).max(120),
  studentEmail: z.string().email(),
  note: z.string().max(500).optional().default(''),
  useExistingCredit: z.boolean().optional().default(false),
  magicToken: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const authed = await getAuthenticatedPro();
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const proId = req.nextUrl.searchParams.get('proId') ?? authed.id;
  if (authed.id !== proId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const bookings = await prisma.booking.findMany({
    where: { userId: proId },
    include: { student: true, service: true },
    orderBy: { startsAt: 'asc' },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = CreateBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please provide valid booking details (name, email, and time slot).',
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { proSlug, serviceId, startsAt, studentName, studentEmail, note, useExistingCredit, magicToken } =
    parsed.data;

  const pro = await prisma.user.findUnique({ where: { slug: proSlug } });
  if (!pro) return NextResponse.json({ error: 'Portal not found' }, { status: 404 });

  const service = await prisma.service.findFirst({
    where: { id: serviceId, userId: pro.id },
  });
  if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });

  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime()) || start.getTime() <= Date.now()) {
    return NextResponse.json({ error: 'Cannot book a time slot in the past' }, { status: 400 });
  }
  const end = new Date(start.getTime() + service.durationMin * 60_000);

  const conflict = await prisma.booking.findFirst({
    where: {
      userId: pro.id,
      status: 'CONFIRMED',
      startsAt: { lt: end },
      endsAt: { gt: start },
    },
  });
  if (conflict) {
    return NextResponse.json({ error: 'Time slot is already booked' }, { status: 409 });
  }

  const authed = await getAuthenticatedPro();
  const isOwnerTutor = Boolean(authed && authed.id === pro.id);

  const cal = await createGoogleCalendarEvent({
    refreshToken: pro.googleRefreshToken,
    summary: `${service.name} — ${studentName}`,
    description: note || 'Booked via SlotLink',
    startsAtIso: start.toISOString(),
    endsAtIso: end.toISOString(),
    attendeeEmail: studentEmail,
  });

  const roomEntropy = randomBytes(4).toString('hex');
  const fallbackMeetUrl = `https://meet.jit.si/slotlink-${pro.slug}-${start.getTime().toString(36)}-${roomEntropy}`;
  const finalMeetingUrl = cal?.meetingUrl || fallbackMeetUrl;

  let result: {
    booking: Awaited<ReturnType<typeof prisma.booking.create>>;
    magicToken: string;
    exposeToken: boolean;
  };
  try {
    result = await prisma.$transaction(async (tx) => {
      const txConflict = await tx.booking.findFirst({
        where: {
          userId: pro.id,
          status: 'CONFIRMED',
          startsAt: { lt: end },
          endsAt: { gt: start },
        },
      });
      if (txConflict) {
        throw new Error('SLOT_CONFLICT');
      }

      const normalizedEmail = studentEmail.trim().toLowerCase();
      const existingStudent = await tx.student.findUnique({
        where: { userId_email: { userId: pro.id, email: normalizedEmail } },
      });

      const hasValidToken = Boolean(
        existingStudent && magicToken && existingStudent.magicToken === magicToken
      );

      if (useExistingCredit) {
        if (!existingStudent || (!hasValidToken && !isOwnerTutor)) {
          throw new Error('NO_CREDIT_REMAINING');
        }
        const activeConfirmedCount = await tx.booking.count({
          where: { studentId: existingStudent.id, status: 'CONFIRMED' },
        });
        if (existingStudent.hoursRemaining <= activeConfirmedCount) {
          throw new Error('NO_CREDIT_REMAINING');
        }
      }

      const redeemExistingPack =
        Boolean(useExistingCredit) && Boolean(existingStudent) && (hasValidToken || isOwnerTutor);

      const student = existingStudent
        ? redeemExistingPack
          ? existingStudent
          : await tx.student.update({
              where: { id: existingStudent.id },
              data: {
                hoursRemaining: { increment: service.packageHrs },
                totalPaidCents: { increment: service.priceCents },
              },
            })
        : await tx.student.create({
            data: {
              userId: pro.id,
              name: studentName,
              email: normalizedEmail,
              magicToken: generateMagicToken(),
              hoursRemaining: service.packageHrs,
              totalPaidCents: service.priceCents,
            },
          });

      const booking = await tx.booking.create({
        data: {
          userId: pro.id,
          studentId: student.id,
          serviceId: service.id,
          startsAt: start,
          endsAt: end,
          status: 'CONFIRMED',
          note,
          calendarEventId: cal?.eventId ?? null,
          meetingUrl: finalMeetingUrl,
        },
      });

      return {
        booking,
        magicToken: student.magicToken,
        exposeToken: !existingStudent || hasValidToken || isOwnerTutor,
      };
    });
  } catch (err) {
    if (cal?.eventId) {
      await deleteGoogleCalendarEvent(pro.googleRefreshToken, cal.eventId).catch(() => false);
    }
    if (err instanceof Error && err.message === 'SLOT_CONFLICT') {
      return NextResponse.json({ error: 'Time slot is already booked' }, { status: 409 });
    }
    if (err instanceof Error && err.message === 'NO_CREDIT_REMAINING') {
      return NextResponse.json(
        { error: 'No available prepaid pack credits remaining. Please purchase or select a package.' },
        { status: 400 }
      );
    }
    throw err;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const magicUrl = `${appUrl}/p/${result.magicToken}`;

  await sendEmail({
    to: studentEmail,
    subject: `Confirmed: ${service.name} with ${pro.name}`,
    html: buildBookingConfirmationEmail({
      studentName,
      proName: pro.name,
      serviceName: service.name,
      startsAtIso: start.toISOString(),
      magicUrl,
      meetingUrl: finalMeetingUrl,
    }),
  }).catch(() => false);

  return NextResponse.json(
    {
      booking: result.booking,
      magicToken: result.exposeToken ? result.magicToken : null,
      tokenSentViaEmail: !result.exposeToken,
    },
    { status: 201 }
  );
}
