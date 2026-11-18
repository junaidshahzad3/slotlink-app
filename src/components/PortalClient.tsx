'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarPlus,
  Copy,
  FileText,
  FolderArchive,
  Video,
  X,
} from 'lucide-react';
import { downloadSessionIcs } from '@/lib/ics';
import { resolveHomeworkHref } from '@/lib/notes';
import type { PortalBookingDTO } from '@/types/domain';

function getDayIso(offsetDays: number): string {
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10);
}

function getStatusBadgeClass(status: string): string {
  if (status === 'CONFIRMED') {
    return 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]';
  }
  if (status === 'CANCELLED') {
    return 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]';
  }
  return 'border-[#D5CFC0] bg-[#EFECE4] text-[#141413]';
}

function formatRelativeTiming(startsAtIso: string, nowMs: number | null): string {
  if (nowMs === null) return 'Upcoming';
  const diffHours = Math.round((new Date(startsAtIso).getTime() - nowMs) / 3_600_000);
  if (diffHours <= 0) return 'Live Window';
  if (diffHours < 24) return `In ${diffHours}h`;
  const diffDays = Math.ceil(diffHours / 24);
  return diffDays === 1 ? 'Tomorrow' : `In ${diffDays} days`;
}

export function PortalClient({
  token,
  proSlug,
  proName = 'your instructor',
  initialBookings,
}: {
  token: string;
  proSlug: string;
  proName?: string;
  initialBookings: PortalBookingDTO[];
}) {
  const [mounted, setMounted] = useState(false);
  const [todayIso, setTodayIso] = useState('');
  const [tomorrowIso, setTomorrowIso] = useState('');

  const [bookings, setBookings] = useState(initialBookings);
  const [viewFilter, setViewFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [copiedMeetId, setCopiedMeetId] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  useEffect(() => {
    setNowMs(Date.now());
    setTodayIso(getDayIso(0));
    const tmrw = getDayIso(1);
    setTomorrowIso(tmrw);
    setRescheduleDate(tmrw);
    setMounted(true);
  }, []);

  const activeBooking = bookings.find((b) => b.id === rescheduleId) ?? null;

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const vaultItems = bookings.filter((b) => b.homeworkUrl || b.sessionSummary);
  const nextUpcomingId =
    [...upcomingBookings].sort(
      (a, b) => new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime()
    )[0]?.id ?? null;

  const nextUpcomingBooking = bookings.find((b) => b.id === nextUpcomingId) ?? null;

  const filteredBookings = bookings.filter((b) => {
    if (viewFilter === 'UPCOMING') return b.status === 'CONFIRMED';
    if (viewFilter === 'COMPLETED') return b.status === 'COMPLETED';
    return true;
  });

  useEffect(() => {
    if (!rescheduleId || !rescheduleDate) return;
    let active = true;
    async function loadSlots() {
      setLoadingSlots(true);
      setSelectedSlot('');
      try {
        const dur = activeBooking?.durationMin ?? 60;
        const res = await fetch(
          `/api/availability?slug=${encodeURIComponent(proSlug)}&date=${encodeURIComponent(rescheduleDate)}&durationMin=${dur}`
        );
        const data = await res.json();
        if (active && Array.isArray(data.openSlots)) {
          setAvailableSlots(data.openSlots);
          if (data.openSlots[0]) setSelectedSlot(data.openSlots[0]);
        }
      } catch {
        if (active) setAvailableSlots([]);
      } finally {
        if (active) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => {
      active = false;
    };
  }, [proSlug, rescheduleId, rescheduleDate, activeBooking?.durationMin]);

  async function handleCancel(bookingId: string) {
    setBusyId(bookingId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/portal/${token}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CANCEL' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not cancel');
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'CANCELLED' } : b))
      );
      setFeedback({ type: 'success', message: 'Session cancelled and slot reopened.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Action failed',
      });
    } finally {
      setBusyId(null);
    }
  }

  async function handleReschedule(bookingId: string) {
    if (!selectedSlot) return;
    setBusyId(bookingId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/portal/${token}/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RESCHEDULE', newStartsAt: selectedSlot }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Could not reschedule');
      }
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, startsAtIso: selectedSlot } : b))
      );
      setRescheduleId(null);
      setSelectedSlot('');
      setFeedback({ type: 'success', message: 'Session rescheduled.' });
    } catch (err) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : 'Reschedule failed',
      });
    } finally {
      setBusyId(null);
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="surface-card rounded-2xl p-8 text-center space-y-3">
        <p className="text-sm text-[#575248]">
          No sessions scheduled yet with {proName}.
        </p>
        <Link
          href={`/${proSlug}?token=${encodeURIComponent(token)}`}
          className="inline-block rounded-lg bg-[#141413] px-4 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
        >
          Book Your First Session
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {feedback && (
        <div
          role={feedback.type === 'error' ? 'alert' : 'status'}
          className={
            feedback.type === 'error'
              ? 'rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-2.5 text-xs font-medium text-[#B91C1C]'
              : 'rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-2.5 text-xs font-medium text-[#15803D]'
          }
        >
          {feedback.message}
        </div>
      )}

      {/* Next Upcoming Session Spotlight Card */}
      {nextUpcomingBooking && (() => {
        const dt = new Date(nextUpcomingBooking.startsAtIso);
        const dateStr = mounted
          ? dt.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })
          : dt.toISOString().slice(0, 10);
        const timeStr = mounted
          ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : `${dt.toISOString().slice(11, 16)} UTC`;
        const timingBadge = formatRelativeTiming(nextUpcomingBooking.startsAtIso, nowMs);

        return (
          <section
            id="next-session-spotlight"
            className="surface-card rounded-2xl border-2 border-[#141413] p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-[#D94E28] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-white">
                    Next Session
                  </span>
                  <span className="rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#15803D]">
                    {timingBadge}
                  </span>
                  <span className="font-mono text-[11px] text-[#6E685C]">
                    · {nextUpcomingBooking.durationMin} min with {proName}
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#141413]">
                  {nextUpcomingBooking.serviceName}
                </h2>
                <div className="font-mono text-xs font-semibold text-[#141413]">
                  {dateStr} · {timeStr}
                </div>
                {nextUpcomingBooking.note && (
                  <p className="text-xs text-[#575248] pt-0.5">
                    <span className="font-mono text-[#6E685C]">Topic: </span>
                    {nextUpcomingBooking.note}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {nextUpcomingBooking.meetingUrl && (
                  <a
                    href={nextUpcomingBooking.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
                  >
                    <Video className="h-3.5 w-3.5 text-[#4ADE80]" />
                    {nextUpcomingBooking.meetingUrl.includes('meet.google.com')
                      ? 'Join Google Meet'
                      : 'Join Video Call'}
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (rescheduleId === nextUpcomingBooking.id) {
                      setRescheduleId(null);
                    } else {
                      setRescheduleDate(tomorrowIso);
                      setRescheduleId(nextUpcomingBooking.id);
                    }
                  }}
                  className="rounded-xl border border-[#CEC7B6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                >
                  Reschedule Time
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadSessionIcs({
                      title: nextUpcomingBooking.serviceName,
                      description: nextUpcomingBooking.note || `Session with ${proName}`,
                      location: nextUpcomingBooking.meetingUrl || 'Live Video Call',
                      startsAtIso: nextUpcomingBooking.startsAtIso,
                      durationMin: nextUpcomingBooking.durationMin,
                      filename: `slotlink-${nextUpcomingBooking.id}.ics`,
                    })
                  }
                  className="inline-flex items-center gap-1 rounded-xl border border-[#CEC7B6] bg-white px-3 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                >
                  <CalendarPlus className="h-3.5 w-3.5 text-[#D94E28]" />
                  .ics Invite
                </button>
                <button
                  type="button"
                  disabled={busyId === nextUpcomingBooking.id}
                  onClick={() => handleCancel(nextUpcomingBooking.id)}
                  className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 py-2.5 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] disabled:opacity-50 transition"
                >
                  {busyId === nextUpcomingBooking.id ? '...' : 'Cancel'}
                </button>
              </div>
            </div>

            {rescheduleId === nextUpcomingBooking.id && (
              <div className="surface-elevated rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <label
                      htmlFor={`spotlight-resched-date-${nextUpcomingBooking.id}`}
                      className="font-mono text-[11px] uppercase tracking-wider text-[#575248]"
                    >
                      Pick new date:
                    </label>
                    <input
                      id={`spotlight-resched-date-${nextUpcomingBooking.id}`}
                      type="date"
                      min={todayIso || undefined}
                      value={rescheduleDate}
                      onChange={(e) => setRescheduleDate(e.target.value)}
                      className="surface-input rounded-lg px-2.5 py-1.5 font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRescheduleId(null)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 text-xs font-medium text-[#575248] hover:text-[#141413]"
                    >
                      <X className="h-3 w-3" />
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={busyId === nextUpcomingBooking.id || !selectedSlot}
                      onClick={() => handleReschedule(nextUpcomingBooking.id)}
                      className="rounded-lg bg-[#141413] px-3.5 py-1.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] disabled:opacity-40 transition"
                    >
                      Save New Time
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {loadingSlots ? (
                    <span className="col-span-full font-mono text-xs text-[#6E685C]">
                      Checking slots...
                    </span>
                  ) : availableSlots.length === 0 ? (
                    <span className="col-span-full text-xs text-[#575248]">
                      No open slots on this date — pick another day.
                    </span>
                  ) : (
                    availableSlots.map((iso) => {
                      const label = new Date(iso).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      });
                      const active = selectedSlot === iso;
                      return (
                        <button
                          key={iso}
                          type="button"
                          onClick={() => setSelectedSlot(iso)}
                          className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] font-medium transition ${
                            active
                              ? 'border-[#141413] bg-[#141413] text-[#F6F4EE] font-semibold'
                              : 'border-[#CEC7B6] bg-white text-[#141413] hover:bg-[#F6F4EE]'
                          }`}
                        >
                          {label}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </section>
        );
      })()}

      {/* Study Vault & Homework Archive Shelf */}
      {vaultItems.length > 0 && (
        <section id="study-vault" className="surface-card rounded-2xl p-4 sm:p-5 space-y-3 scroll-mt-20">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2">
              <FolderArchive className="h-4 w-4 text-[#D94E28]" />
              <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#141413]">
                Study Vault &amp; Homework Archive
              </h2>
            </div>
            <span className="rounded-full border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#575248]">
              {vaultItems.length} resource{vaultItems.length > 1 ? 's' : ''} saved
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {vaultItems.map((item) => {
              const dtLabel = new Date(item.startsAtIso).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
              const resolvedHw = resolveHomeworkHref(item.homeworkUrl);
              return (
                <div
                  key={`vault-${item.id}`}
                  className="min-w-[240px] max-w-[290px] shrink-0 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/75 p-3.5 flex flex-col justify-between gap-2.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[#6E685C]">
                      <span>{dtLabel}</span>
                      <span className="truncate font-semibold text-[#141413]">
                        {item.serviceName}
                      </span>
                    </div>
                    {item.sessionSummary && (
                      <p className="text-xs leading-relaxed text-[#575248] line-clamp-2">
                        {item.sessionSummary}
                      </p>
                    )}
                  </div>

                  {resolvedHw.href ? (
                    resolvedHw.isInternal ? (
                      <Link
                        href={resolvedHw.href}
                        className="inline-flex items-center justify-between rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#D94E28] hover:border-[#141413] transition"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          Open Interactive Study Sheet
                        </span>
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    ) : (
                      <a
                        href={resolvedHw.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-between rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#D94E28] hover:border-[#141413] transition"
                      >
                        <span className="inline-flex items-center gap-1.5">
                          <FileText className="h-3 w-3" />
                          Open Homework PDF
                        </span>
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )
                  ) : (
                    <span className="font-mono text-[10px] text-[#6E685C]">
                      Takeaway archived ✓
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Segmented View Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-1 rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 font-mono text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setViewFilter('ALL')}
            className={`rounded-lg px-3 py-1.5 transition ${
              viewFilter === 'ALL'
                ? 'bg-[#141413] text-[#F6F4EE]'
                : 'text-[#575248] hover:text-[#141413]'
            }`}
          >
            ALL ({bookings.length})
          </button>
          <button
            type="button"
            onClick={() => setViewFilter('UPCOMING')}
            className={`rounded-lg px-3 py-1.5 transition ${
              viewFilter === 'UPCOMING'
                ? 'bg-[#141413] text-[#F6F4EE]'
                : 'text-[#575248] hover:text-[#141413]'
            }`}
          >
            UPCOMING ({upcomingBookings.length})
          </button>
          <button
            type="button"
            onClick={() => setViewFilter('COMPLETED')}
            className={`rounded-lg px-3 py-1.5 transition ${
              viewFilter === 'COMPLETED'
                ? 'bg-[#141413] text-[#F6F4EE]'
                : 'text-[#575248] hover:text-[#141413]'
            }`}
          >
            COMPLETED &amp; NOTES ({completedBookings.length})
          </button>
        </div>

        <span className="font-mono text-[11px] text-[#6E685C]">
          24h free reschedule &amp; cancel policy
        </span>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-center text-xs text-[#6E685C]">
          No {viewFilter === 'UPCOMING' ? 'upcoming' : 'completed'} sessions in this view.
        </div>
      ) : (
        filteredBookings.map((b) => {
          const dt = new Date(b.startsAtIso);
          const monthLabel = mounted
            ? dt.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
            : dt.toISOString().slice(5, 7);
          const dayNum = mounted
            ? dt.toLocaleDateString('en-US', { day: '2-digit' })
            : dt.toISOString().slice(8, 10);
          const timeLabel = mounted
            ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : `${dt.toISOString().slice(11, 16)} UTC`;
          const isNext = b.id === nextUpcomingId;
          const timingLabel = b.status === 'CONFIRMED' ? formatRelativeTiming(b.startsAtIso, nowMs) : null;

          return (
            <div
              key={b.id}
              className={`surface-card rounded-2xl p-4 sm:p-5 space-y-3.5 ${
                isNext ? 'ring-2 ring-[#141413]' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Left Date Badge Block */}
                  <div className="shrink-0 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-2 text-center min-w-[74px]">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#D94E28]">
                      {monthLabel}
                    </div>
                    <div className="font-serif text-2xl leading-none text-[#141413] mt-0.5">
                      {dayNum}
                    </div>
                    <div className="font-mono text-[10px] text-[#575248] mt-1">{timeLabel}</div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isNext && (
                        <span className="rounded bg-[#D94E28] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                          Next Upcoming
                        </span>
                      )}
                      {timingLabel && !isNext && (
                        <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5 font-mono text-[10px] font-medium text-[#575248]">
                          {timingLabel}
                        </span>
                      )}
                      {timingLabel && isNext && (
                        <span className="rounded border border-[#D5CFC0] bg-[#EFECE4] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#141413]">
                          {timingLabel}
                        </span>
                      )}
                      <span className="text-base font-semibold text-[#141413]">{b.serviceName}</span>
                      <span
                        className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${getStatusBadgeClass(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-[#6E685C]">
                      {dt.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      · {b.durationMin} min
                    </div>
                    {b.note && (
                      <div className="pt-0.5 text-xs text-[#575248]">
                        <span className="font-mono text-[#6E685C]">Topic: </span>
                        {b.note}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {b.meetingUrl && b.status === 'CONFIRMED' && (
                    <>
                      <a
                        href={b.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
                      >
                        <Video className="h-3.5 w-3.5 text-[#4ADE80]" />
                        {b.meetingUrl.includes('meet.google.com')
                          ? 'Join Google Meet'
                          : 'Join Video Call'}
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          if (!b.meetingUrl) return;
                          navigator.clipboard?.writeText(b.meetingUrl);
                          setCopiedMeetId(b.id);
                          setTimeout(() => setCopiedMeetId(null), 2000);
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                      >
                        <Copy className="h-3 w-3 text-[#575248]" />
                        {copiedMeetId === b.id ? 'Link Copied ✓' : 'Copy Link'}
                      </button>
                    </>
                  )}
                  {b.status === 'CONFIRMED' && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          downloadSessionIcs({
                            title: b.serviceName,
                            description: b.note || `Tutoring session via ${proSlug}`,
                            location: b.meetingUrl || 'Live Video Call',
                            startsAtIso: b.startsAtIso,
                            durationMin: b.durationMin,
                            filename: `slotlink-${b.id}.ics`,
                          })
                        }
                        className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                      >
                        <CalendarPlus className="h-3.5 w-3.5 text-[#D94E28]" />
                        .ics
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (rescheduleId === b.id) {
                            setRescheduleId(null);
                          } else {
                            setRescheduleDate(tomorrowIso);
                            setRescheduleId(b.id);
                            if (isNext) {
                              document
                                .getElementById('next-session-spotlight')
                                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }
                        }}
                        className="rounded-lg border border-[#CEC7B6] bg-white px-3 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                      >
                        Reschedule
                      </button>
                      <button
                        type="button"
                        disabled={busyId === b.id}
                        onClick={() => handleCancel(b.id)}
                        className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] disabled:opacity-50 transition"
                      >
                        {busyId === b.id ? '...' : 'Cancel'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {rescheduleId === b.id && !isNext && (
                <div className="surface-elevated rounded-xl p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label
                        htmlFor={`resched-date-${b.id}`}
                        className="font-mono text-[11px] uppercase tracking-wider text-[#575248]"
                      >
                        Pick new date:
                      </label>
                      <input
                        id={`resched-date-${b.id}`}
                        type="date"
                        min={todayIso || undefined}
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="surface-input rounded-lg px-2.5 py-1.5 font-mono text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setRescheduleId(null)}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 text-xs font-medium text-[#575248] hover:text-[#141413]"
                      >
                        <X className="h-3 w-3" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={busyId === b.id || !selectedSlot}
                        onClick={() => handleReschedule(b.id)}
                        className="rounded-lg bg-[#141413] px-3.5 py-1.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] disabled:opacity-40 transition"
                      >
                        Save New Time
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {loadingSlots ? (
                      <span className="col-span-full font-mono text-xs text-[#6E685C]">
                        Checking slots...
                      </span>
                    ) : availableSlots.length === 0 ? (
                      <span className="col-span-full text-xs text-[#575248]">
                        No open slots on this date — pick another day.
                      </span>
                    ) : (
                      availableSlots.map((iso) => {
                        const label = new Date(iso).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        });
                        const active = selectedSlot === iso;
                        return (
                          <button
                            key={iso}
                            type="button"
                            onClick={() => setSelectedSlot(iso)}
                            className={`rounded-lg border px-2 py-1.5 font-mono text-[11px] font-medium transition ${
                              active
                                ? 'border-[#141413] bg-[#141413] text-[#F6F4EE] font-semibold'
                                : 'border-[#CEC7B6] bg-white text-[#141413] hover:bg-[#F6F4EE]'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Distinct Study Takeaways & Homework Card */}
              {(b.sessionSummary || b.homeworkUrl) && (() => {
                const resolvedCardHw = resolveHomeworkHref(b.homeworkUrl);
                return (
                  <div className="rounded-xl border border-[#D5CFC0] bg-[#EFECE4]/65 p-4 text-xs text-[#141413] space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        <BookOpenCheck className="h-3.5 w-3.5" />
                        Study Takeaways &amp; Homework
                      </span>
                      {resolvedCardHw.href && (
                        resolvedCardHw.isInternal ? (
                          <Link
                            href={resolvedCardHw.href}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1 font-mono text-[11px] font-semibold text-[#141413] hover:border-[#141413] transition"
                          >
                            <FileText className="h-3 w-3 text-[#D94E28]" />
                            Open Interactive Study Sheet →
                          </Link>
                        ) : (
                          <a
                            href={resolvedCardHw.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1 font-mono text-[11px] font-semibold text-[#141413] hover:border-[#141413] transition"
                          >
                            <FileText className="h-3 w-3 text-[#D94E28]" />
                            Open Homework PDF
                          </a>
                        )
                      )}
                    </div>
                    {b.sessionSummary && (
                      <p className="text-sm leading-relaxed text-[#141413]">{b.sessionSummary}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          );
        })
      )}
    </div>
  );
}
