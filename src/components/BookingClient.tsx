'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  CalendarCheck2,
  CalendarPlus,
  Check,
  Clock,
  Copy,
  RotateCcw,
} from 'lucide-react';
import { downloadSessionIcs } from '@/lib/ics';
import type { PrefillStudentDTO, ServiceDTO } from '@/types/domain';

interface SlotGroup {
  label: string;
  slots: string[];
}

function groupSlotsByTimeOfDay(openSlots: string[]): SlotGroup[] {
  const morning: string[] = [];
  const afternoon: string[] = [];
  const evening: string[] = [];

  for (const iso of openSlots) {
    const h = new Date(iso).getHours();
    if (h < 12) {
      morning.push(iso);
    } else if (h < 17) {
      afternoon.push(iso);
    } else {
      evening.push(iso);
    }
  }

  return [
    { label: 'Morning', slots: morning },
    { label: 'Afternoon', slots: afternoon },
    { label: 'Evening', slots: evening },
  ].filter((g) => g.slots.length > 0);
}

export function BookingClient({
  proSlug,
  services,
  prefillStudent = null,
}: {
  proSlug: string;
  services: ServiceDTO[];
  prefillStudent?: PrefillStudentDTO | null;
}) {
  const upcomingDays = useMemo(() => {
    const days: { iso: string; dayName: string; dayNum: string }[] = [];
    const base = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(base.getTime() + i * 86_400_000);
      days.push({
        iso: d.toISOString().slice(0, 10),
        dayName:
          i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
    return days;
  }, []);

  const todayIso = upcomingDays[0].iso;
  const defaultDateIso = upcomingDays[1]?.iso ?? todayIso;
  const defaultServiceId =
    prefillStudent && prefillStudent.hoursRemaining > 0
      ? (services.find((s) => s.packageHrs === 1)?.id ?? services[0]?.id ?? '')
      : (services[0]?.id ?? '');

  const [selectedServiceId, setSelectedServiceId] = useState(defaultServiceId);
  const [selectedDate, setSelectedDate] = useState(defaultDateIso);
  const [openSlots, setOpenSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [use24Hour, setUse24Hour] = useState(false);
  const [startsAt, setStartsAt] = useState('');
  const [studentName, setStudentName] = useState(prefillStudent?.name ?? '');
  const [studentEmail, setStudentEmail] = useState(prefillStudent?.email ?? '');
  const [note, setNote] = useState('');
  const [magicUrl, setMagicUrl] = useState<string | null>(null);
  const [confirmedSlotIso, setConfirmedSlotIso] = useState<string>('');
  const [bookingRef, setBookingRef] = useState<string>('SL-PASS');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tz, setTz] = useState('Local time');
  const [reloadNonce, setReloadNonce] = useState(0);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const usingExistingCredit = Boolean(
    prefillStudent && prefillStudent.hoursRemaining > 0 && selectedService?.packageHrs === 1
  );
  const groupedSlots = useMemo(() => groupSlotsByTimeOfDay(openSlots), [openSlots]);

  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {}
  }, []);

  useEffect(() => {
    let active = true;
    async function loadSlots() {
      setLoadingSlots(true);
      setStartsAt('');
      try {
        const dur = selectedService?.durationMin ?? 60;
        const res = await fetch(
          `/api/availability?slug=${encodeURIComponent(proSlug)}&date=${selectedDate}&durationMin=${dur}`
        );
        const data = await res.json();
        if (active && Array.isArray(data.openSlots)) {
          setOpenSlots(data.openSlots);
          if (data.openSlots[0]) setStartsAt(data.openSlots[0]);
        }
      } catch {
        if (active) setOpenSlots([]);
      } finally {
        if (active) setLoadingSlots(false);
      }
    }
    loadSlots();
    return () => {
      active = false;
    };
  }, [proSlug, selectedDate, selectedService?.durationMin, reloadNonce]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startsAt) {
      setError('Please select an available time slot.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proSlug,
          serviceId: selectedServiceId,
          startsAt,
          studentName,
          studentEmail,
          note,
          useExistingCredit: usingExistingCredit,
          ...(prefillStudent?.magicToken ? { magicToken: prefillStudent.magicToken } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message =
          typeof data.error === 'string'
            ? data.error
            : 'Please check your booking details and try again.';
        throw new Error(message);
      }
      setConfirmedSlotIso(startsAt);
      const tokenStr = typeof data.magicToken === 'string' ? data.magicToken : '';
      setBookingRef(`SL-${tokenStr.slice(-4).toUpperCase() || '2026'}`);
      setMagicUrl(`${window.location.origin}/p/${tokenStr}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  function resetBookingForm() {
    setMagicUrl(null);
    setConfirmedSlotIso('');
    setNote('');
    setError(null);
    setReloadNonce((n) => n + 1);
  }

  if (magicUrl) {
    return (
      <div className="rounded-2xl border border-[#DCD6C8] bg-[#F6F4EE] p-4 sm:p-6">
        <div className="surface-card overflow-hidden rounded-2xl">
          {/* Top Green Verified Pass Header */}
          <div className="bg-[#F0FDF4] border-b border-[#BBF7D0] px-6 py-5 sm:px-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-3 py-1 font-mono text-[11px] font-semibold text-[#15803D]">
                <CalendarCheck2 className="h-3.5 w-3.5" />
                BOOKING CONFIRMED
              </div>
              <span className="rounded-md border border-[#BBF7D0] bg-white px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#14532D]">
                PASS #{bookingRef}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-3xl text-[#141413]">You&apos;re booked!</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#425245]">
                Your private zero-login student portal is ready. Bookmark it anytime to track pack
                hours, join Google Meet, or reschedule.
              </p>
            </div>
          </div>

          {/* Middle Session Details Grid */}
          <div className="bg-white px-6 py-5 sm:px-8 divide-y divide-[#EFECE4] text-xs">
            <div className="flex items-center justify-between py-3 first:pt-0">
              <span className="font-mono uppercase text-[#6E685C]">Session</span>
              <span className="font-semibold text-[#141413]">
                {selectedService?.name ?? 'Lesson'} ({selectedService?.durationMin ?? 60} min)
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="font-mono uppercase text-[#6E685C]">Date &amp; Time</span>
              <span className="font-mono font-semibold text-[#141413]">
                {confirmedSlotIso
                  ? new Date(confirmedSlotIso).toLocaleString([], {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: !use24Hour,
                    })
                  : 'Confirmed'}{' '}
                · {tz}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 last:pb-0">
              <span className="font-mono uppercase text-[#6E685C]">Student</span>
              <span className="font-medium text-[#141413]">
                {studentName} ({studentEmail})
              </span>
            </div>
          </div>

          {/* Perforated Boarding-Pass Divider & Actions */}
          <div className="ticket-perforated bg-white px-6 py-5 sm:px-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={magicUrl}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
              >
                Open Student Portal →
              </a>
              <button
                type="button"
                onClick={() =>
                  downloadSessionIcs({
                    title: `${selectedService?.name ?? 'Tutoring Session'} (${proSlug})`,
                    description: `Booked with ${studentName}. Magic Portal: ${magicUrl}`,
                    startsAtIso: confirmedSlotIso,
                    durationMin: selectedService?.durationMin ?? 60,
                    filename: `slotlink-${bookingRef.toLowerCase()}.ics`,
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
              >
                <CalendarPlus className="h-3.5 w-3.5 text-[#D94E28]" />
                Add to Calendar (.ics)
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(magicUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
              >
                <Copy className="h-3.5 w-3.5 text-[#575248]" />
                {copied ? 'Copied Link ✓' : 'Copy Magic Link'}
              </button>
              <button
                type="button"
                onClick={resetBookingForm}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#425245] hover:text-[#141413] transition"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Book Another Session
              </button>
            </div>

            {/* Swiss Barcode & Serial Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFECE4] pt-4">
              <svg
                viewBox="0 0 180 26"
                role="img"
                aria-label="Booking Pass Barcode"
                className="h-6 w-40"
              >
                {[
                  [0, 3], [5, 1.5], [9, 4], [15, 2], [19, 1.5], [23, 3.5], [29, 2], [33, 4],
                  [40, 1.5], [44, 3], [49, 2], [53, 1.5], [57, 4], [63, 2], [68, 3], [73, 1.5],
                  [77, 3.5], [83, 2], [87, 4], [93, 1.5], [97, 2.5], [102, 3.5], [108, 1.5],
                  [112, 3], [117, 2], [122, 4], [128, 1.5], [132, 3], [137, 2.5], [142, 1.5],
                  [146, 3.5], [152, 2], [156, 4], [162, 1.5], [166, 3], [172, 2], [176, 3],
                ].map(([x, w]) => (
                  <rect key={x} x={x} y={1} width={w} height={24} fill="#141413" />
                ))}
              </svg>
              <span className="font-mono text-[10px] tracking-widest text-[#6E685C]">
                SLOTLINK PASS // {bookingRef} // 128-BIT MAGIC LINK
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedSlotPreview = startsAt
    ? new Date(startsAt).toLocaleString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: !use24Hour,
      })
    : 'Pick an open time slot';

  const step1Done = Boolean(selectedServiceId);
  const step2Done = Boolean(startsAt);
  const step3Done = Boolean(studentName.trim() && studentEmail.trim());

  const steps = [
    { num: '01', label: 'Session', done: step1Done, active: true },
    { num: '02', label: 'Date & Slot', done: step2Done, active: step1Done },
    { num: '03', label: 'Student Details', done: step3Done, active: step2Done },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Interactive 3-Step Progress Bar */}
      <div className="grid grid-cols-3 gap-2 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-1.5 font-mono text-[11px]">
        {steps.map((step) => (
          <div
            key={step.num}
            className={`flex items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold transition ${
              step.done
                ? 'bg-white text-[#141413] shadow-sm border border-[#DCD6C8]'
                : step.active
                  ? 'text-[#D94E28]'
                  : 'text-[#6E685C]'
            }`}
          >
            <span
              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] ${
                step.done
                  ? 'bg-[#15803D] text-white'
                  : 'border border-[#CEC7B6] bg-white text-[#575248]'
              }`}
            >
              {step.done ? <Check className="h-2.5 w-2.5" /> : step.num}
            </span>
            <span className="truncate">{step.label}</span>
          </div>
        ))}
      </div>

      {prefillStudent && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-xs">
          <span className="text-[#14532D]">
            Booking with your{' '}
            <span className="font-mono font-semibold">{prefillStudent.hoursRemaining}</span> prepaid
            pack hrs
          </span>
          <a
            href={`/p/${prefillStudent.magicToken}`}
            className="font-mono text-[11px] font-semibold text-[#15803D] underline hover:text-[#14532D]"
          >
            Back to Portal →
          </a>
        </div>
      )}

      {/* Step 01: Session */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
            01 / Select Session or Pack
          </span>
          <span className="font-mono text-[11px] text-[#6E685C]">No account required</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {services.map((svc) => {
            const active = selectedServiceId === svc.id;
            const perHr =
              svc.packageHrs > 1 && svc.priceCents > 0
                ? Math.round(svc.priceCents / 100 / svc.packageHrs)
                : null;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => setSelectedServiceId(svc.id)}
                className={`rounded-xl p-4 text-left transition-all flex flex-col justify-between gap-3 ${
                  active
                    ? 'border-2 border-[#141413] bg-[#EFECE4]/65 shadow-sm'
                    : 'border border-[#DCD6C8] bg-white hover:border-[#9E9687]'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm font-semibold text-[#141413]">{svc.name}</span>
                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        active
                          ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                          : 'border-[#CEC7B6] bg-white'
                      }`}
                    >
                      {active && <Check className="h-2.5 w-2.5" />}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span
                      className={`font-mono text-sm font-semibold ${
                        svc.priceCents === 0 ? 'text-[#15803D]' : 'text-[#141413]'
                      }`}
                    >
                      {svc.priceCents === 0 ? 'FREE' : `$${(svc.priceCents / 100).toFixed(0)}`}
                    </span>
                    {perHr !== null && (
                      <span className="rounded bg-[#D94E28] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white">
                        BEST VALUE · ${perHr}/hr
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-[#575248] line-clamp-2">{svc.description}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-[#6E685C]">
                  <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-1.5 py-0.5">
                    {svc.durationMin} min
                  </span>
                  {svc.packageHrs > 0 && (
                    <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-1.5 py-0.5">
                      {svc.packageHrs} hr{svc.packageHrs > 1 ? 's' : ''} pack
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {selectedService && selectedService.packageHrs > 1 && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-2.5 text-xs text-[#14532D]">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 shrink-0 text-[#15803D]" />
              <strong>{selectedService.packageHrs}-Hour Pack Selected:</strong> Remaining hours
              auto-track inside your zero-login Student Passbook with 24h free reschedule protection.
            </span>
            <span className="font-mono text-[11px] font-semibold text-[#15803D]">
              ${Math.round(selectedService.priceCents / 100 / selectedService.packageHrs)}/hr effective
            </span>
          </div>
        )}
      </div>

      {/* Step 02: Quick 7-Day Strip + Grouped Slots + 12H/24H Toggle */}
      <div className="space-y-4 border-t border-[#EFECE4] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
            02 / Choose Date &amp; Time Slot
          </span>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[#6E685C]">{tz}</span>
            <div className="inline-flex items-center rounded-lg border border-[#DCD6C8] bg-[#EFECE4] p-0.5 font-mono text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => setUse24Hour(false)}
                className={`rounded-md px-2 py-0.5 transition ${
                  !use24Hour ? 'bg-[#141413] text-[#F6F4EE]' : 'text-[#575248]'
                }`}
              >
                12H
              </button>
              <button
                type="button"
                onClick={() => setUse24Hour(true)}
                className={`rounded-md px-2 py-0.5 transition ${
                  use24Hour ? 'bg-[#141413] text-[#F6F4EE]' : 'text-[#575248]'
                }`}
              >
                24H
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {upcomingDays.map((d) => {
            const active = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDate(d.iso)}
                className={`shrink-0 rounded-xl border px-3.5 py-2 text-center transition ${
                  active
                    ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                    : 'border-[#DCD6C8] bg-[#F6F4EE]/70 text-[#141413] hover:border-[#9E9687]'
                }`}
              >
                <div
                  className={`text-[10px] font-medium uppercase ${
                    active ? 'text-[#C8C2B6]' : 'text-[#6E685C]'
                  }`}
                >
                  {d.dayName}
                </div>
                <div className="font-mono text-xs font-semibold">{d.dayNum}</div>
              </button>
            );
          })}
          <input
            id="booking-date"
            aria-label="Choose custom date"
            type="date"
            min={todayIso}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="surface-input shrink-0 rounded-xl px-3 py-2 font-mono text-xs"
          />
        </div>

        {loadingSlots ? (
          <div className="py-3 font-mono text-xs text-[#6E685C]">Checking live calendar...</div>
        ) : openSlots.length === 0 ? (
          <div className="rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-2.5 text-xs text-[#575248]">
            No open slots on this date — pick another day above.
          </div>
        ) : (
          <div className="space-y-4">
            {groupedSlots.map((group) => (
              <div key={group.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248]">
                    <Clock className="h-3 w-3 text-[#D94E28]" />
                    {group.label}
                  </span>
                  <span className="rounded-full border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5 font-mono text-[10px] text-[#6E685C]">
                    {group.slots.length} slot{group.slots.length > 1 ? 's' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {group.slots.map((iso) => {
                    const label = new Date(iso).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: !use24Hour,
                    });
                    const active = startsAt === iso;
                    return (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setStartsAt(iso)}
                        className={`rounded-lg border px-3 py-2.5 font-mono text-xs font-medium transition ${
                          active
                            ? 'border-[#141413] bg-[#141413] text-[#F6F4EE] font-semibold'
                            : 'border-[#DCD6C8] bg-white text-[#141413] hover:bg-[#EFECE4]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 03: Details */}
      <div className="space-y-3.5 border-t border-[#EFECE4] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
            03 / Your Details
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="student-name" className="mb-1 block text-xs font-medium text-[#575248]">
              Full Name
            </label>
            <input
              id="student-name"
              type="text"
              required
              placeholder="Alex Rivera"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="surface-input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
          <div>
            <label htmlFor="student-email" className="mb-1 block text-xs font-medium text-[#575248]">
              Email for Magic Link
            </label>
            <input
              id="student-email"
              type="email"
              required
              placeholder="alex@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              className="surface-input w-full rounded-lg px-3 py-2.5 text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="booking-note" className="mb-1 block text-xs font-medium text-[#575248]">
            Session Goal or Topic (Optional)
          </label>
          <input
            id="booking-note"
            type="text"
            placeholder="What would you like to cover?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="surface-input w-full rounded-lg px-3 py-2.5 text-sm"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs font-medium text-[#B91C1C]">
          {error}
        </p>
      )}

      {/* Tactile Booking Summary Bar + Submit */}
      <div className="surface-elevated rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <div className="font-semibold text-[#141413]">
              {selectedService?.name ?? 'Session'}
            </div>
            <div className="font-mono text-[#575248] mt-0.5">{formattedSlotPreview}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E685C]">
              Total Due
            </div>
            <div className="font-mono text-sm font-semibold text-[#141413]">
              {usingExistingCredit
                ? '1 Pack Hour'
                : selectedService?.priceCents
                  ? `$${(selectedService.priceCents / 100).toFixed(0)}`
                  : 'Free'}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !startsAt}
          className="w-full rounded-xl bg-[#141413] px-4 py-3 text-sm font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] disabled:opacity-40 transition"
        >
          {submitting
            ? 'Confirming...'
            : usingExistingCredit
              ? `Confirm ${selectedService?.name ?? 'Session'} · Use 1 Pack Hr`
              : `Confirm ${selectedService?.name ?? 'Session'}${
                  selectedService?.priceCents ? ` · $${(selectedService.priceCents / 100).toFixed(0)}` : ''
                }`}
        </button>
      </div>
    </form>
  );
}
