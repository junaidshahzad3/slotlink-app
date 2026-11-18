import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGoogleBusyIntervals } from '@/lib/google-calendar';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  const dateStr = req.nextUrl.searchParams.get('date'); // YYYY-MM-DD
  const durationMin = Number(req.nextUrl.searchParams.get('durationMin') ?? '60');

  if (!slug || !dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'slug and valid date (YYYY-MM-DD) are required' }, { status: 400 });
  }

  const rawDuration = Number.isFinite(durationMin) && durationMin > 0 ? Math.floor(durationMin) : 60;
  const safeDurationMin = Math.min(240, Math.max(10, rawDuration));

  const pro = await prisma.user.findUnique({ where: { slug } });
  if (!pro) return NextResponse.json({ error: 'Portal not found' }, { status: 404 });

  const dayStart = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(dayStart.getTime())) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
  }
  const dayEnd = new Date(dayStart.getTime() + 24 * 3_600_000);
  const workEnd = new Date(dayStart.getTime() + pro.workEndHour * 3_600_000);

  const [dbBookings, gcalBusy] = await Promise.all([
    prisma.booking.findMany({
      where: {
        userId: pro.id,
        status: 'CONFIRMED',
        startsAt: { lt: dayEnd },
        endsAt: { gt: dayStart },
      },
      select: { startsAt: true, endsAt: true },
    }),
    getGoogleBusyIntervals(pro.googleRefreshToken, dayStart.toISOString(), dayEnd.toISOString()),
  ]);

  const busyRanges = [
    ...dbBookings.map((b) => ({ start: b.startsAt.getTime(), end: b.endsAt.getTime() })),
    ...gcalBusy.map((g) => ({ start: new Date(g.start).getTime(), end: new Date(g.end).getTime() })),
  ];

  const nowMs = Date.now();
  const openSlots: string[] = [];
  for (let hour = pro.workStartHour; hour < pro.workEndHour; hour++) {
    const slotStart = new Date(dayStart.getTime() + hour * 3_600_000);
    const slotEnd = new Date(slotStart.getTime() + safeDurationMin * 60_000);
    if (slotStart.getTime() <= nowMs) continue;
    if (slotEnd.getTime() > workEnd.getTime()) continue;
    const overlaps = busyRanges.some(
      (r) => slotStart.getTime() < r.end && slotEnd.getTime() > r.start
    );
    if (!overlaps) openSlots.push(slotStart.toISOString());
  }

  return NextResponse.json({ openSlots });
}
