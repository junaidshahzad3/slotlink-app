import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { escapeHtml, isSafeHttpUrl } from '@/lib/security';
import { safeEqual } from '@/lib/server-security';

async function runReminders(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim() ?? '';
  const auth = req.headers.get('authorization') ?? '';
  if (!secret || secret.startsWith('replace-') || !safeEqual(auth, `Bearer ${secret}`)) {
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
    const claim = await prisma.booking.updateMany({
      where: { id: b.id, reminderSentAt: null },
      data: { reminderSentAt: new Date() },
    });
    if (claim.count === 0) continue;

    const portalUrl = `${appUrl}/p/${encodeURIComponent(b.student.magicToken)}`;
    const safePortalUrl = isSafeHttpUrl(portalUrl) ? escapeHtml(portalUrl) : '#';

    const ok = await sendEmail({
      to: b.student.email,
      subject: `Reminder: ${b.service.name} with ${b.user.name} tomorrow`,
      html: `<p>Hi ${escapeHtml(b.student.name)}, your session starts at ${escapeHtml(b.startsAt.toISOString())}.</p>
             <p><a href="${safePortalUrl}">Open Student Portal</a></p>`,
    });

    if (ok) {
      sentCount++;
    } else {
      await prisma.booking.update({
        where: { id: b.id },
        data: { reminderSentAt: null },
      });
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
