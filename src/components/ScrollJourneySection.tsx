'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CalendarPlus,
  Check,
  Clock,
  FileText,
  QrCode,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Video,
  X,
} from 'lucide-react';

interface JourneyChapter {
  index: number;
  pillLabel: string;
  telemetry: string;
  metricBadge: string;
  headline: string;
  headlineItalic: string;
  problemEliminated: string;
  outcome: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  browserUrl: string;
  stageTag: string;
}

const CHAPTERS: JourneyChapter[] = [
  {
    index: 0,
    pillLabel: '01 · Share 1-Link',
    telemetry: 'CHAPTER 01 // ZERO-FRICTION INTAKE',
    metricBadge: '< 20s booking',
    headline: 'Drop one clean link. Replace',
    headlineItalic: 'back-and-forth DMs.',
    problemEliminated: 'Eliminates 8-message scheduling threads & account creation drop-offs.',
    outcome: 'Clients choose single lessons or discounted 5-packs and lock a slot in three taps.',
    bullets: [
      'Custom public handle (slotlink.app/you) works in WhatsApp, Instagram, and email signatures',
      'Bundled 1-on-1 & multi-hour pack options side by side with clear per-hour savings',
      'Built-in mobile QR studio card for in-person whiteboard or hallway scans',
    ],
    ctaLabel: 'Open Live Studio Page →',
    ctaHref: '/sarah-math',
    browserUrl: 'slotlink.app/sarah-math',
    stageTag: 'LIVE BOOKING STUDIO',
  },
  {
    index: 1,
    pillLabel: '02 · 2-Way GCal Guard',
    telemetry: 'CHAPTER 02 // REAL-TIME CONFLICT SHIELD',
    metricBadge: '0 double bookings',
    headline: 'Live FreeBusy queries guard',
    headlineItalic: 'every personal hour.',
    problemEliminated: 'Eliminates accidental double-bookings & stale screenshots of calendars.',
    outcome: 'Personal Google Calendar events automatically block matching booking slots in real time.',
    bullets: [
      'Reads live Google FreeBusy windows across your configured teaching hours',
      'Generates instant Google Meet or private fallback video rooms on confirmation',
      'Detects overlapping lessons transactionally so two students can never book the same slot',
    ],
    ctaLabel: 'Claim & Sync Calendar →',
    ctaHref: '/login?mode=signup',
    browserUrl: 'gcal.sync/sarah-math',
    stageTag: 'CONFLICT GUARD ACTIVE',
  },
  {
    index: 2,
    pillLabel: '03 · Magic Passbook',
    telemetry: 'CHAPTER 03 // ZERO-PASSWORD CLIENT PORTAL',
    metricBadge: '128-bit link',
    headline: 'Every client gets a living',
    headlineItalic: 'prepaid passbook.',
    problemEliminated: 'Eliminates "how many hours do I have left?" & forgotten Meet URL texts.',
    outcome: 'One private magic link tracks pack balance, video rooms, .ics downloads & 24h reschedules.',
    bullets: [
      'Zero passwords for busy parents and working professionals—bookmarkable on mobile',
      '24-hour protected reschedule & cancel policy enforces cutoff windows automatically',
      'Instant .ics calendar export and one-click Join Video Call button per session',
    ],
    ctaLabel: 'Inspect Demo Passbook →',
    ctaHref: '/p/sl_demo_alex_94a2k',
    browserUrl: 'slotlink.app/p/sl_demo_alex_94a2k',
    stageTag: 'CLIENT MAGIC PASSBOOK',
  },
  {
    index: 3,
    pillLabel: '04 · 1-Tap Deduct & Notes',
    telemetry: 'CHAPTER 04 // ATOMIC LEDGER & STUDY VAULT',
    metricBadge: '40ms portal sync',
    headline: 'End a session in one tap.',
    headlineItalic: 'Publish takeaways live.',
    problemEliminated: 'Eliminates manual Excel tracking & buried email attachments after lessons.',
    outcome: 'Marking a lesson complete deducts 1 pack hour atomically and publishes study sheets.',
    bullets: [
      'One click decrements package balance safely inside a transactional ledger update',
      'Attaches interactive in-app study sheets or external PDFs directly to the session card',
      'Triggers low-balance alerts cleanly so returning clients top up before running dry',
    ],
    ctaLabel: 'Launch Your Tutor Studio →',
    ctaHref: '/login?mode=signup',
    browserUrl: 'slotlink.app/dashboard',
    stageTag: 'STUDIO LEDGER SYNC',
  },
];

const JOURNEY_PACKAGES = [
  { id: 'intro', name: '15m Intro Call', price: 'FREE', tag: 'Intake', dur: '15 min' },
  { id: 'single', name: '1-on-1 Session', price: '$55', tag: 'Single', dur: '60 min' },
  { id: 'pack5', name: '5-Hour Pack', price: '$250', tag: 'Best · $50/hr', dur: '5 hrs' },
];

const OLD_STACK_STEPS = [
  { step: '01', tool: 'WhatsApp / iMessage', friction: '6+ replies to compare timezones (~5m)' },
  { step: '02', tool: 'Google Calendar', friction: 'Manual event creation & copy-paste invites (~2m)' },
  { step: '03', tool: 'Venmo / Stripe Links', friction: 'Chasing prepaid balances manually (~3m)' },
  { step: '04', tool: 'Google Sheets', friction: 'Remembering to subtract hours post-call (~2m)' },
  { step: '05', tool: 'Gmail Threads', friction: 'Resending lost homework PDFs & Zoom URLs (~2m)' },
];

const SLOTLINK_STEPS = [
  { step: '01', surface: 'Public /[slug] Studio', gain: 'Client picks pack & live open slot in <20s' },
  { step: '02', surface: '2-Way FreeBusy Shield', gain: 'Zero overlaps + automatic video room URL' },
  { step: '03', surface: 'Magic /p/[token]', gain: 'Client self-serves reschedules, .ics & hours' },
  { step: '04', surface: '1-Tap Studio Complete', gain: 'Atomic -1 hr ledger + instant study sheet sync' },
];

/**
 * Scroll-driven 4-chapter product journey with sticky morphing simulator stage.
 */
export function ScrollJourneySection() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [selectedPkg, setSelectedPkg] = useState('pack5');
  const [selectedSlot, setSelectedSlot] = useState('3:00 PM');
  const [dentistBlocked, setDentistBlocked] = useState(true);
  const [simCompleted, setSimCompleted] = useState(false);

  const chapterRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-chapter-index'));
            if (!Number.isNaN(idx)) {
              setActiveChapter(idx);
            }
          }
        }
      },
      { threshold: 0.45, rootMargin: '-12% 0px -35% 0px' }
    );

    for (const el of chapterRefs.current) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  function jumpToChapter(idx: number) {
    setActiveChapter(idx);
    chapterRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const currentChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0];
  const progressPct = Math.round(((activeChapter + 1) / CHAPTERS.length) * 100);

  return (
    <section id="journey" className="border-b border-[#DCD6C8] bg-[#F6F4EE]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
              01 // Interactive Scroll Journey
            </div>
            <h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-[#141413]">
              Follow one lesson from{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                first click to study notes.
              </span>
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#575248]">
              Scroll through the four chapters below—or click any pill to scrub directly through the
              tutor and client experience live.
            </p>
          </div>

          <div className="surface-card rounded-xl px-4 py-2.5 font-mono text-xs flex items-center gap-3">
            <span className="text-[#6E685C]">JOURNEY PROGRESS</span>
            <span className="font-semibold text-[#141413]">{progressPct}%</span>
            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#EFECE4]">
              <div
                className="h-full bg-[#D94E28] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sticky Chapter Scrubber Bar */}
        <div className="sticky top-[62px] z-30 rounded-xl border border-[#DCD6C8] bg-white/95 p-1.5 shadow-sm backdrop-blur-md">
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 font-mono text-[11px] font-semibold">
            {CHAPTERS.map((ch) => {
              const isActive = ch.index === activeChapter;
              return (
                <button
                  key={ch.index}
                  type="button"
                  onClick={() => jumpToChapter(ch.index)}
                  className={`rounded-lg px-3 py-2 text-left sm:text-center transition cursor-pointer ${
                    isActive
                      ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                      : 'text-[#575248] hover:bg-[#EFECE4] hover:text-[#141413]'
                  }`}
                >
                  {ch.pillLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Split Sticky Scroll Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Scroll Narrative Chapters */}
          <div className="lg:col-span-5 space-y-6">
            {CHAPTERS.map((ch) => {
              const isActive = ch.index === activeChapter;
              return (
                <div
                  key={ch.index}
                  id={`journey-chapter-${ch.index}`}
                  data-chapter-index={ch.index}
                  ref={(el) => {
                    chapterRefs.current[ch.index] = el;
                  }}
                  onClick={() => setActiveChapter(ch.index)}
                  className={`surface-card rounded-2xl p-6 min-h-[320px] flex flex-col justify-between transition-all cursor-pointer ${
                    isActive
                      ? 'chapter-card-active bg-white'
                      : 'opacity-80 hover:opacity-100 bg-white/85'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        {ch.telemetry}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                          isActive
                            ? 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]'
                            : 'border-[#DCD6C8] bg-[#F6F4EE] text-[#575248]'
                        }`}
                      >
                        {ch.metricBadge}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl leading-tight text-[#141413]">
                      {ch.headline}{' '}
                      <span className="italic text-[#D94E28]">{ch.headlineItalic}</span>
                    </h3>

                    <div className="rounded-xl border border-[#EFECE4] bg-[#F6F4EE]/80 p-3 space-y-1 text-xs">
                      <div className="text-[#9F2D12] font-medium">{ch.problemEliminated}</div>
                      <div className="text-[#14532D] font-semibold">{ch.outcome}</div>
                    </div>

                    <ul className="space-y-2 text-xs text-[#575248]">
                      {ch.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#15803D]" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#EFECE4] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        jumpToChapter(ch.index);
                      }}
                      className="font-mono text-[11px] font-semibold text-[#6E685C] hover:text-[#141413]"
                    >
                      Focus Stage
                    </button>
                    <Link
                      href={ch.ctaHref}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#D94E28] hover:underline"
                    >
                      {ch.ctaLabel}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Sticky Morphing Hardware Stage */}
          <div className="lg:col-span-7 lg:sticky lg:top-[124px]">
            <div className="surface-card rounded-2xl overflow-hidden border-[#141413]/20 shadow-xl">
              {/* Dynamic Browser Chrome */}
              <div className="border-b border-[#DCD6C8] bg-[#EFECE4] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
                </div>
                <div className="rounded-md border border-[#D5CFC0] bg-white px-3 py-1 font-mono text-[11px] text-[#141413] font-medium">
                  {currentChapter.browserUrl}
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#15803D]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#15803D]" />
                  {currentChapter.stageTag}
                </span>
              </div>

              {/* Morphing Chapter 0: 1-Link Studio */}
              {activeChapter === 0 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
                        SC
                      </div>
                      <div>
                        <div className="font-serif text-2xl leading-none text-[#141413]">
                          Sarah Chen
                        </div>
                        <div className="mt-1 text-xs text-[#6E685C]">
                          SAT &amp; AP Calculus · 1-Link Booking Studio
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-1.5 font-mono text-[11px] text-[#141413]">
                      <QrCode className="h-3.5 w-3.5 text-[#D94E28]" />
                      Mobile QR Ready
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {JOURNEY_PACKAGES.map((pkg) => {
                      const active = selectedPkg === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedPkg(pkg.id)}
                          className={`rounded-xl p-3.5 text-left transition cursor-pointer space-y-1.5 ${
                            active
                              ? 'border-2 border-[#141413] bg-[#EFECE4]/70'
                              : 'border border-[#DCD6C8] bg-white hover:border-[#9E9687]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-semibold uppercase text-[#D94E28]">
                              {pkg.tag}
                            </span>
                            <span className="font-mono text-xs font-semibold text-[#141413]">
                              {pkg.price}
                            </span>
                          </div>
                          <div className="text-sm font-semibold text-[#141413]">{pkg.name}</div>
                          <div className="font-mono text-[11px] text-[#6E685C]">{pkg.dur}</div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="space-y-2">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
                      Instant UTC / Local Time Slot Picker
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {['1:00 PM', '3:00 PM', '4:30 PM', '6:00 PM'].map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`rounded-lg border py-2 font-mono text-xs font-semibold transition cursor-pointer ${
                            selectedSlot === slot
                              ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                              : 'border-[#DCD6C8] bg-[#F6F4EE] text-[#141413] hover:bg-[#EFECE4]'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-xs">
                    <span className="font-medium text-[#14532D]">
                      Selected:{' '}
                      <strong>
                        {JOURNEY_PACKAGES.find((p) => p.id === selectedPkg)?.name} · {selectedSlot}
                      </strong>{' '}
                      (Zero signup required)
                    </span>
                    <Link
                      href="/sarah-math"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#141413] px-3 py-1.5 font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
                    >
                      Try Full Flow
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Morphing Chapter 1: Interactive 2-Way Google Calendar Conflict Simulator */}
              {activeChapter === 1 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        Interactive Conflict Guard Simulator
                      </div>
                      <h4 className="mt-1 font-serif text-2xl text-[#141413]">
                        2-Way FreeBusy Calendar Shield
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDentistBlocked((prev) => !prev)}
                      className={`rounded-lg border px-3 py-2 font-mono text-[11px] font-semibold transition cursor-pointer ${
                        dentistBlocked
                          ? 'border-[#E5C6BE] bg-[#FDF2EF] text-[#9F2D12] hover:bg-[#FCE7E1]'
                          : 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D] hover:bg-[#DCFCE7]'
                      }`}
                    >
                      {dentistBlocked
                        ? 'Toggle: Clear 2:00 PM Dentist Event'
                        : 'Simulate Personal Dentist Event at 2:00 PM'}
                    </button>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[#14532D]">
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-[#15803D]" />
                        <span>1:00 PM – 2:00 PM</span>
                      </div>
                      <span className="rounded bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#BBF7D0]">
                        OPEN · GCal Free ✓
                      </span>
                    </div>

                    <div
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                        dentistBlocked
                          ? 'border-[#E5C6BE] bg-[#FDF2EF] text-[#9F2D12]'
                          : 'border-[#BBF7D0] bg-[#F0FDF4] text-[#14532D]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4" />
                        <span>
                          2:00 PM – 3:00 PM{' '}
                          {dentistBlocked ? '(Personal Calendar: Dentist Appt)' : '(Calendar Open)'}
                        </span>
                      </div>
                      <span className="rounded bg-white px-2.5 py-0.5 text-[11px] font-semibold border border-current/20">
                        {dentistBlocked ? 'BLOCKED AUTOMATICALLY' : 'OPEN ✓'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[#14532D]">
                      <div className="flex items-center gap-2.5">
                        <Video className="h-4 w-4 text-[#15803D]" />
                        <span>3:00 PM – 4:00 PM · Auto Video Room Attached</span>
                      </div>
                      <span className="rounded bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#BBF7D0]">
                        TRANSACTION LOCKED
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-4 py-3 text-xs text-[#575248] flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#15803D]" />
                    <span>
                      PostgreSQL `$transaction` conflict checks + Google Calendar FreeBusy prevent
                      race conditions even if two students click book at the same millisecond.
                    </span>
                  </div>
                </div>
              )}

              {/* Morphing Chapter 2: Zero-Login Client Magic Passbook */}
              {activeChapter === 2 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="surface-ink rounded-2xl p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#4ADE80]">
                          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                          ZERO-LOGIN MAGIC PASSBOOK
                        </div>
                        <h4 className="mt-2 font-serif text-3xl text-[#F6F4EE]">Alex Rivera</h4>
                        <p className="font-mono text-xs text-[#A8A295]">
                          SAT &amp; AP Calculus · 5-Session Pack
                        </p>
                      </div>
                      <Link
                        href="/p/sl_demo_alex_94a2k"
                        className="inline-flex items-center gap-1 rounded-lg bg-[#F6F4EE] px-3 py-2 text-xs font-semibold text-[#141413] hover:bg-white transition"
                      >
                        Open Live Portal
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3.5 space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[#C8C2B6]">Prepaid Pack LED Meter</span>
                        <span className="font-semibold text-[#4ADE80]">3 of 5 hrs remaining</span>
                      </div>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[0, 1, 2, 3, 4].map((block) => (
                          <span
                            key={block}
                            className={`h-2 rounded-sm ${
                              block < 3 ? 'bg-[#4ADE80]' : 'bg-white/15'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 space-y-1">
                      <Video className="h-4 w-4 text-[#15803D]" />
                      <div className="font-semibold text-[#141413]">One-Tap Join Call</div>
                      <p className="text-[#575248]">Direct Google Meet / Jitsi room inside card.</p>
                    </div>
                    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 space-y-1">
                      <CalendarPlus className="h-4 w-4 text-[#D94E28]" />
                      <div className="font-semibold text-[#141413]">Universal .ics Export</div>
                      <p className="text-[#575248]">Apple, Outlook &amp; Google Calendar compatible.</p>
                    </div>
                    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 space-y-1">
                      <CalendarCheck2 className="h-4 w-4 text-[#141413]" />
                      <div className="font-semibold text-[#141413]">24h Guardrail</div>
                      <p className="text-[#575248]">Self-serve reschedule with policy protection.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Morphing Chapter 3: 1-Tap Deduct & Study Vault Sync */}
              {activeChapter === 3 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        Interactive Tutor Studio Drawer
                      </div>
                      <h4 className="mt-1 font-serif text-2xl text-[#141413]">
                        Complete Session &amp; Publish Homework
                      </h4>
                    </div>
                    {!simCompleted ? (
                      <button
                        type="button"
                        onClick={() => setSimCompleted(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Complete &amp; Deduct 1 Hr
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSimCompleted(false)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset Drawer
                      </button>
                    )}
                  </div>

                  <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-4 space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#141413]">Alex Rivera</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                            simCompleted
                              ? 'border-[#D5CFC0] bg-[#EFECE4] text-[#141413]'
                              : 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]'
                          }`}
                        >
                          {simCompleted ? 'COMPLETED' : 'CONFIRMED'}
                        </span>
                      </div>
                      <span className="font-mono font-semibold text-[#15803D]">
                        {simCompleted ? '4 hrs → 3 hrs left (-1 hr atomic)' : '4 of 5 hrs remaining'}
                      </span>
                    </div>

                    <div className="rounded-lg border border-[#DCD6C8] bg-white p-3 space-y-1.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E685C]">
                        Attached Interactive Study Sheet
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#D94E28]">
                          <FileText className="h-3.5 w-3.5" />
                          sat-module-2-drill
                        </span>
                        <span className="font-mono text-[11px] text-[#15803D]">
                          {simCompleted ? 'Synced to Client Passbook in 40ms ✓' : 'Ready to publish'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      href="/notes/sat-module-2-drill"
                      className="font-mono text-xs font-semibold text-[#D94E28] hover:underline"
                    >
                      Inspect Interactive Study Sheet →
                    </Link>
                    <Link
                      href="/login?mode=signup"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-4 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
                    >
                      Create Free Tutor Account
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Interactive workflow toggle comparing fragmented 5-tool admin stacks vs SlotLink 1-Link flow.
 */
export function WorkflowComparisonScrubber() {
  const [mode, setMode] = useState<'slotlink' | 'legacy'>('slotlink');

  return (
    <section id="workflow-compare" className="border-b border-[#DCD6C8] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
              02 // Old Stack vs. 1-Link Architecture
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
              See the admin difference in{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                every single lesson.
              </span>
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Compare teaching workflow"
            className="inline-flex rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 font-mono text-xs font-semibold"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'legacy'}
              onClick={() => setMode('legacy')}
              className={`rounded-lg px-3.5 py-2 transition cursor-pointer ${
                mode === 'legacy'
                  ? 'bg-[#9F2D12] text-white shadow-sm'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              Old 5-Tool Stack (~14m/lesson)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'slotlink'}
              onClick={() => setMode('slotlink')}
              className={`rounded-lg px-3.5 py-2 transition cursor-pointer ${
                mode === 'slotlink'
                  ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              SlotLink Flow (~15s/lesson)
            </button>
          </div>
        </div>

        {mode === 'legacy' ? (
          <div className="rounded-2xl border border-[#E5C6BE] bg-[#FDF2EF]/75 p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#9F2D12]">
                <X className="h-4 w-4" />
                THE 5-TOOL DUCT-TAPE STACK
              </div>
              <span className="rounded-full border border-[#E5C6BE] bg-white px-3 py-1 font-mono text-xs font-semibold text-[#9F2D12]">
                ~14 mins wasted admin per session
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {OLD_STACK_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-[#E5C6BE] bg-white p-4 space-y-2"
                >
                  <div className="font-mono text-[10px] font-semibold text-[#9F2D12]">
                    STEP {item.step} · {item.tool}
                  </div>
                  <p className="text-xs leading-relaxed text-[#575248]">{item.friction}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="surface-ink rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#4ADE80]">
                <Check className="h-4 w-4" />
                THE SLOTLINK 1-LINK JOURNEY
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-semibold text-[#4ADE80]">
                ~15 secs total admin · Zero passwords
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {SLOTLINK_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-white/15 bg-white/[0.06] p-4 space-y-2"
                >
                  <div className="font-mono text-[10px] font-semibold text-[#4ADE80]">
                    STEP {item.step} · {item.surface}
                  </div>
                  <p className="text-xs leading-relaxed text-[#E5E0D4]">{item.gain}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
