import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { generateMagicToken } from '@/lib/magic-token';
import { createGoogleCalendarEvent } from '@/lib/google-calendar';
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
  if (!authed && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const proId = req.nextUrl.searchParams.get('proId') ?? authed?.id;
  if (!proId) {
    return NextResponse.json({ error: 'proId is required' }, { status: 400 });
  }
  if (authed && authed.id !== proId) {
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

  const cal = await createGoogleCalendarEvent({
    refreshToken: pro.googleRefreshToken,
    summary: `${service.name} — ${studentName}`,
    description: note || 'Booked via SlotLink',
    startsAtIso: start.toISOString(),
    endsAtIso: end.toISOString(),
    attendeeEmail: studentEmail,
  });

  const result = await prisma.$transaction(async (tx) => {
    const existingStudent = await tx.student.findUnique({
      where: { userId_email: { userId: pro.id, email: studentEmail.toLowerCase() } },
    });

    const redeemExistingPack =
      Boolean(useExistingCredit) &&
      Boolean(existingStudent) &&
      existingStudent!.hoursRemaining > 0 &&
      (!magicToken || existingStudent!.magicToken === magicToken);

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
            email: studentEmail.toLowerCase(),
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
        meetingUrl: cal?.meetingUrl ?? '',
      },
    });

    return { booking, magicToken: student.magicToken };
  });

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
      meetingUrl: cal?.meetingUrl,
    }),
  }).catch(() => false);

  return NextResponse.json(result, { status: 201 });
}
