import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';

async function runReminders(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60_000);

  const due = await prisma.booking.findMany({
    where: {
      status: 'CONFIRMED',
      reminderSentAt: null,
      startsAt: { gte: now, lte: in24Hours },
    },
    include: { student: true, user: true, service: true },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  let sentCount = 0;

  for (const b of due) {
    const ok = await sendEmail({
      to: b.student.email,
      subject: `Reminder: ${b.service.name} with ${b.user.name} tomorrow`,
      html: `<p>Hi ${b.student.name}, your session starts at ${b.startsAt.toISOString()}.</p>
             <p><a href="${appUrl}/p/${b.student.magicToken}">Open Student Portal</a></p>`,
    });

    if (ok) {
      await prisma.booking.update({
        where: { id: b.id },
        data: { reminderSentAt: new Date() },
      });
      sentCount++;
    }
  }

  return NextResponse.json({ checked: due.length, sentCount });
}

export async function GET(req: NextRequest) {
  return runReminders(req);
}

export async function POST(req: NextRequest) {
  return runReminders(req);
}
