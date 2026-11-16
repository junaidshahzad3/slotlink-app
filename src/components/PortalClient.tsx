'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpenCheck,
  CalendarPlus,
  CheckCircle2,
  Copy,
  FileText,
  FolderArchive,
  TrendingUp,
  Video,
  X,
  Zap,
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
  studentName = 'Student',
  initialHoursRemaining = 3,
  initialTotalPaidCents = 25000,
  initialBookings,
}: {
  token: string;
  proSlug: string;
  studentName?: string;
  initialHoursRemaining?: number;
  initialTotalPaidCents?: number;
  initialBookings: PortalBookingDTO[];
}) {
  const router = useRouter();
  const todayIso = getDayIso(0);
  const tomorrowIso = getDayIso(1);

  const [bookings, setBookings] = useState(initialBookings);
  const [hoursRemaining, setHoursRemaining] = useState(initialHoursRemaining);
  const [totalPaidCents, setTotalPaidCents] = useState(initialTotalPaidCents);
  const [renewBusy, setRenewBusy] = useState(false);
  const [renewSuccess, setRenewSuccess] = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED'>('ALL');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(tomorrowIso);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [copiedMeetId, setCopiedMeetId] = useState<string | null>(null);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setNowMs(Date.now());
  }, []);

  useEffect(() => {
    setHoursRemaining(initialHoursRemaining);
    setTotalPaidCents(initialTotalPaidCents);
  }, [initialHoursRemaining, initialTotalPaidCents]);

  async function renewPack(hours: number, priceCents: number) {
    setRenewBusy(true);
    setRenewSuccess(null);
    setFeedback(null);
    try {
      const res = await fetch(`/api/portal/${encodeURIComponent(token)}/renew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours, priceCents }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(
          data && typeof data.error === 'string' ? data.error : 'Could not renew pack balance.'
        );
      }
      const updatedHours =
        typeof data?.student?.hoursRemaining === 'number'
          ? data.student.hoursRemaining
          : hoursRemaining + hours;
      const updatedPaid =
        typeof data?.student?.totalPaidCents === 'number'
          ? data.student.totalPaidCents
          : totalPaidCents + priceCents;
      setHoursRemaining(updatedHours);
      setTotalPaidCents(updatedPaid);
      setRenewSuccess(
        `Added +${hours} hr${hours > 1 ? 's' : ''} ($${(priceCents / 100).toFixed(0)}) to ${studentName}'s passbook · New balance: ${updatedHours} hrs`
      );
      router.refresh();
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Renewal failed');
    } finally {
      setRenewBusy(false);
    }
  }

  const activeBooking = bookings.find((b) => b.id === rescheduleId) ?? null;

  const upcomingBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const vaultItems = bookings.filter((b) => b.homeworkUrl || b.sessionSummary);
  const nextUpcomingId =
    [...upcomingBookings].sort(
      (a, b) => new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime()
    )[0]?.id ?? null;

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
      setFeedback('Session cancelled and slot reopened.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Action failed');
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
      setFeedback('Session rescheduled.');
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Reschedule failed');
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      {/* Parent ROI & Score Trajectory Dossier + 1-Tap Instant Pack Renewal */}
      <section className="surface-card overflow-hidden rounded-2xl">
        <div className="border-b border-[#DCD6C8] bg-[#EFECE4]/70 px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
              <TrendingUp className="h-3.5 w-3.5" />
              Parent ROI &amp; Score Trajectory Dossier
            </div>
            <p className="text-xs text-[#575248] mt-0.5">
              Verified tutoring progress &amp; instant zero-login hour-pack renewal for{' '}
              <span className="font-semibold text-[#141413]">{studentName}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className="rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-0.5 font-semibold text-[#15803D]">
              92% Drill Accuracy
            </span>
            <span className="rounded-full border border-[#DCD6C8] bg-white px-2.5 py-0.5 font-semibold text-[#141413]">
              100% Attendance
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* 4-Milestone Score Trajectory */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {[
              { label: '580 Baseline', sub: 'Initial diagnostic', tone: 'text-[#575248] bg-[#F6F4EE]' },
              { label: '650 Mid-Pack', sub: 'Session #2 mock', tone: 'text-[#141413] bg-[#F6F4EE]' },
              { label: '710 Current', sub: '+130 pts verified', tone: 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]' },
              { label: '760 Target (+180 pts)', sub: 'Finals trajectory', tone: 'text-[#D94E28] bg-[#FDF2EF] border-[#E5C6BE]' },
            ].map((step) => (
              <div
                key={step.label}
                className={`rounded-xl border border-[#DCD6C8] px-3.5 py-2.5 ${step.tone}`}
              >
                <div className="font-mono text-xs font-semibold">{step.label}</div>
                <div className="mt-0.5 text-[11px] opacity-80">{step.sub}</div>
              </div>
            ))}
          </div>

          {/* 1-Tap Instant Pack Renewal Autopilot Bar */}
          <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#141413]">
                <Zap className="h-3.5 w-3.5 text-[#D94E28]" />
                1-Tap Instant Pack Renewal Autopilot
              </div>
              <div className="text-xs text-[#575248]">
                Live Ledger:{' '}
                <strong className="font-mono text-[#141413]">{hoursRemaining} hrs remaining</strong>{' '}
                · Total Invested:{' '}
                <strong className="font-mono text-[#15803D]">
                  ${(totalPaidCents / 100).toLocaleString()}
                </strong>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={renewBusy}
                onClick={() => renewPack(5, 25000)}
                className="rounded-lg bg-[#D94E28] px-3.5 py-2 font-mono text-xs font-semibold text-white hover:bg-[#B83E1D] disabled:opacity-50 transition"
              >
                {renewBusy ? 'Renewing...' : '1-Tap Renew 5-Hour Pack ($250)'}
              </button>
              <button
                type="button"
                disabled={renewBusy}
                onClick={() => renewPack(1, 5500)}
                className="rounded-lg border border-[#141413] bg-white px-3 py-2 font-mono text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] disabled:opacity-50 transition"
              >
                +1 Hr Quick Top-Up ($55)
              </button>
            </div>
          </div>

          {renewSuccess && (
            <div className="flex items-center gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-2.5 text-xs font-semibold text-[#15803D]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{renewSuccess}</span>
            </div>
          )}
        </div>
      </section>

      {bookings.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-center space-y-3">
          <p className="text-sm text-[#575248]">No sessions scheduled yet.</p>
          <Link
            href={`/${proSlug}?token=${encodeURIComponent(token)}`}
            className="inline-block rounded-lg bg-[#141413] px-4 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
          >
            Book Your First Session
          </Link>
        </div>
      ) : (
        <>
          {/* Curriculum Mastery & Milestone Strip */}
          <section className="surface-card rounded-2xl p-4 sm:p-5 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
              Curriculum Mastery &amp; Milestones
            </div>
            <p className="text-xs text-[#575248] mt-0.5">
              Live topic progress synced from completed tutoring sessions
            </p>
          </div>
          <Link
            href="/notes/sat-module-2-drill"
            className="inline-flex items-center gap-1 rounded-lg bg-[#141413] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
          >
            Open Interactive Drill Studio →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { topic: 'Quadratics & Vertex Form', score: '92%', pct: 92, barClass: 'bg-[#15803D]' },
            { topic: 'Linear Systems & Inequalities', score: '88%', pct: 88, barClass: 'bg-[#15803D]' },
            { topic: 'Timed Section Pacing', score: 'Active', pct: 74, barClass: 'bg-[#D94E28]' },
          ].map((m) => (
            <div
              key={m.topic}
              className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/75 p-3.5 space-y-2"
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-[#141413] truncate">{m.topic}</span>
                <span className="shrink-0 font-mono text-[11px] font-semibold text-[#15803D]">
                  {m.score}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#DCD6C8]">
                <div className={`h-full rounded-full ${m.barClass}`} style={{ width: `${m.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Study Vault & Homework Archive Shelf */}
      {vaultItems.length > 0 && (
        <section className="surface-card rounded-2xl p-4 sm:p-5 space-y-3">
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

      {feedback && (
        <div className="rounded-xl border border-[#D5CFC0] bg-[#EFECE4] px-4 py-2.5 text-xs font-medium text-[#141413]">
          {feedback}
        </div>
      )}

      {filteredBookings.length === 0 ? (
        <div className="surface-card rounded-2xl p-8 text-center text-xs text-[#6E685C]">
          No {viewFilter === 'UPCOMING' ? 'upcoming' : 'completed'} sessions in this view.
        </div>
      ) : (
        filteredBookings.map((b) => {
          const dt = new Date(b.startsAtIso);
          const monthLabel = dt.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
          const dayNum = dt.toLocaleDateString('en-US', { day: '2-digit' });
          const timeLabel = dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
                        Join Google Meet
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
                        {copiedMeetId === b.id ? 'Meet Copied ✓' : 'Copy Meet'}
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
                            location: b.meetingUrl || 'Google Meet',
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

              {rescheduleId === b.id && (
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
                        min={todayIso}
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
        </>
      )}
    </div>
  );
}
