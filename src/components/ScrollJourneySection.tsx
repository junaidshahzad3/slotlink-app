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
} from 'lucide-react';
import { VectorWorkflowConduitSvg } from '@/components/StudioVectorScene';
import { BorderBeam, MagicSpotlightCard } from '@/components/MotionPrimitives';

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
    pillLabel: '1. Share Your Link',
    telemetry: 'STEP 1 OF 4',
    metricBadge: 'Books in under 20s',
    headline: 'Drop one clean link. Replace',
    headlineItalic: 'back-and-forth texts.',
    problemEliminated: 'Replaces long scheduling messages and confusing sign-up forms.',
    outcome: 'Students pick a single lesson or discounted 5-pack and book a time in three clicks.',
    bullets: [
      'Your personal booking link (slotlink.app/your-name) fits in email signatures and texts',
      'Show single sessions and prepaid lesson packs side by side with clear hourly savings',
      'Built-in mobile QR card so in-person students can scan and rebook in seconds',
    ],
    ctaLabel: 'Open Live Booking Page →',
    ctaHref: '/sarah-math',
    browserUrl: 'slotlink.app/sarah-math',
    stageTag: 'BOOKING PAGE',
  },
  {
    index: 1,
    pillLabel: '2. Calendar Sync',
    telemetry: 'STEP 2 OF 4',
    metricBadge: 'No double bookings',
    headline: 'Live Google Calendar checks guard',
    headlineItalic: 'every personal hour.',
    problemEliminated: 'Replaces manual calendar checks and accidental overlapping bookings.',
    outcome: 'Personal Google Calendar appointments automatically hide conflicting booking times.',
    bullets: [
      'Checks your real Google Calendar availability across the teaching hours you choose',
      'Adds a Google Meet or private video room automatically on every booking',
      'Locks each confirmed time slot immediately so two students can never book the same hour',
    ],
    ctaLabel: 'Connect Google Calendar →',
    ctaHref: '/login?mode=signup',
    browserUrl: 'calendar.google.com/sync',
    stageTag: 'CALENDAR SYNC',
  },
  {
    index: 2,
    pillLabel: '3. Student Page',
    telemetry: 'STEP 3 OF 4',
    metricBadge: 'No password needed',
    headline: 'Every student gets a private',
    headlineItalic: 'all-in-one lesson page.',
    problemEliminated: 'Replaces "how many hours do I have left?" and "what is the Zoom link?" texts.',
    outcome: 'One private bookmarked page shows remaining hours, video links, and rescheduling.',
    bullets: [
      'No passwords for busy parents or adult learners — just open their private link',
      'Automatic 24-hour notice protection when students reschedule or cancel online',
      'One-click calendar downloads (.ics) and Join Video Call button for every lesson',
    ],
    ctaLabel: 'See Sample Student Page →',
    ctaHref: '/p/sl_demo_alex_94a2k',
    browserUrl: 'slotlink.app/p/alex-rivera',
    stageTag: 'STUDENT PAGE',
  },
  {
    index: 3,
    pillLabel: '4. Complete & Notes',
    telemetry: 'STEP 4 OF 4',
    metricBadge: 'Instant note sharing',
    headline: 'Finish a lesson in one click.',
    headlineItalic: 'Share homework live.',
    problemEliminated: 'Replaces spreadsheets for counting hours and digging through old emails for PDFs.',
    outcome: 'Marking a lesson complete subtracts 1 pack hour and shares notes to the student page.',
    bullets: [
      'One click updates the student’s prepaid hour balance without manual math',
      'Attach lesson summaries, homework PDFs, or interactive study sheets per lesson',
      'Highlights low balances automatically so students know when to book a fresh pack',
    ],
    ctaLabel: 'Create Your Free Account →',
    ctaHref: '/login?mode=signup',
    browserUrl: 'slotlink.app/dashboard',
    stageTag: 'TEACHER WRAP-UP',
  },
];

const JOURNEY_PACKAGES = [
  { id: 'intro', name: '15m Intro Call', price: 'FREE', tag: 'Intake', dur: '15 min' },
  { id: 'single', name: '1-on-1 Lesson', price: '$55', tag: 'Single', dur: '60 min' },
  { id: 'pack5', name: '5-Lesson Pack', price: '$250', tag: 'Best · $50/hr', dur: '5 hrs' },
];

/**
 * Scroll-driven 4-chapter product walkthrough with sticky interactive stage.
 */
export function ScrollJourneySection() {
  const [activeChapter, setActiveChapter] = useState(0);
  const [journeyProgress, setJourneyProgress] = useState(0);
  const [hoverTilt, setHoverTilt] = useState({ rx: 0, ry: 0 });
  const [selectedPkg, setSelectedPkg] = useState('pack5');
  const [selectedSlot, setSelectedSlot] = useState('3:00 PM');
  const [dentistBlocked, setDentistBlocked] = useState(true);
  const [simCompleted, setSimCompleted] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
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

    let rafId = 0;
    const measureScroll = () => {
      rafId = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight * 0.6);
      const raw = (-rect.top + window.innerHeight * 0.15) / total;
      setJourneyProgress(Math.max(0, Math.min(1, raw)));
    };
    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(measureScroll);
    };
    measureScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  function jumpToChapter(idx: number) {
    setActiveChapter(idx);
    chapterRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function handleStagePointerMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setHoverTilt({ rx: Number((-ny * 5).toFixed(2)), ry: Number((nx * 6).toFixed(2)) });
  }

  function resetStagePointer() {
    setHoverTilt({ rx: 0, ry: 0 });
  }

  const currentChapter = CHAPTERS[activeChapter] ?? CHAPTERS[0];
  const progressPct = Math.round(((activeChapter + 1) / CHAPTERS.length) * 100);
  const scrollTiltX = (journeyProgress - 0.5) * -3.5 + hoverTilt.rx;
  const scrollTiltY = (journeyProgress - 0.5) * 4.5 + hoverTilt.ry;

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative z-10 border-b border-[#DCD6C8] bg-[#F6F4EE]/95"
    >
      <div className="viewport-container py-[clamp(3rem,7vh,6rem)] space-y-8">
        {/* Section Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
              How SlotLink Works
            </div>
            <h2 className="mt-2 text-fluid-h2 font-semibold tracking-tight text-[#141413]">
              Follow one student from{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                first booking to finished lesson.
              </span>
            </h2>
            <p className="mt-2 text-fluid-body text-[#575248]">
              Everything a private teacher needs in four simple steps — no messy texts,
              spreadsheets, or forgotten video links.
            </p>
          </div>

          <div className="surface-card rounded-xl px-4 py-2.5 font-mono text-xs flex items-center gap-3">
            <span className="text-[#6E685C]">WALKTHROUGH</span>
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

        {/* 4-Step Visual Workflow Bar */}
        <VectorWorkflowConduitSvg activeStep={activeChapter} onSelectStep={jumpToChapter} />

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
                >
                  <MagicSpotlightCard
                    spotlightColor={
                      isActive ? 'rgba(217, 78, 40, 0.14)' : 'rgba(21, 128, 61, 0.1)'
                    }
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
                        Show This Step
                      </button>
                      <Link
                        href={ch.ctaHref}
                        className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#D94E28] hover:underline"
                      >
                        {ch.ctaLabel}
                      </Link>
                    </div>
                  </MagicSpotlightCard>
                </div>
              );
            })}
          </div>

          {/* Right Sticky Morphing Stage */}
          <div
            onMouseMove={handleStagePointerMove}
            onMouseLeave={resetStagePointer}
            className="lg:col-span-7 lg:sticky lg:top-[116px] scene-3d-stage"
          >
            <div
              className="surface-card preserve-3d relative rounded-2xl overflow-hidden border-[#141413]/20 shadow-xl transition-transform duration-150 ease-out"
              style={{
                transform: `rotateX(${scrollTiltX.toFixed(2)}deg) rotateY(${scrollTiltY.toFixed(
                  2
                )}deg)`,
              }}
            >
              <BorderBeam tone="warm" />
              {/* Browser Chrome */}
              <div className="border-b border-[#DCD6C8] bg-[#EFECE4] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
                </div>
                <div className="rounded-md border border-[#D5CFC0] bg-white px-3 py-1 font-mono text-[11px] text-[#141413] font-medium">
                  {currentChapter.browserUrl}
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#15803D]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#15803D]" />
                  {currentChapter.stageTag}
                </span>
              </div>

              {/* Step 1: 1-Link Booking Page */}
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
                          SAT &amp; AP Calculus · Online Booking Page
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
                      Available Times (Shown in Student&apos;s Local Timezone)
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
                      (No student signup required)
                    </span>
                    <Link
                      href="/sarah-math"
                      className="inline-flex items-center gap-1 rounded-lg bg-[#141413] px-3 py-1.5 font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
                    >
                      Try Live Page
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Step 2: Interactive 2-Way Google Calendar Conflict Shield */}
              {activeChapter === 1 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        Try Adding a Personal Appointment
                      </div>
                      <h4 className="mt-1 font-serif text-2xl text-[#141413]">
                        2-Way Google Calendar Sync
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
                        ? 'Remove 2:00 PM Dentist Event'
                        : 'Add 2:00 PM Dentist Event'}
                    </button>
                  </div>

                  <div className="space-y-2.5 font-mono text-xs">
                    <div className="flex items-center justify-between rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[#14532D]">
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4 w-4 text-[#15803D]" />
                        <span>1:00 PM – 2:00 PM</span>
                      </div>
                      <span className="rounded bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#BBF7D0]">
                        AVAILABLE ✓
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
                        {dentistBlocked ? 'BLOCKED AUTOMATICALLY' : 'AVAILABLE ✓'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[#14532D]">
                      <div className="flex items-center gap-2.5">
                        <Video className="h-4 w-4 text-[#15803D]" />
                        <span>3:00 PM – 4:00 PM · Auto Video Room Attached</span>
                      </div>
                      <span className="rounded bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#15803D] border border-[#BBF7D0]">
                        VIDEO LINK READY
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-4 py-3 text-xs text-[#575248] flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-[#15803D]" />
                    <span>
                      SlotLink checks your Google Calendar automatically so personal appointments
                      stay private and two students can never book the same hour.
                    </span>
                  </div>
                </div>
              )}

              {/* Step 3: Private Student Page */}
              {activeChapter === 2 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="surface-ink rounded-2xl p-5 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-[#4ADE80]">
                          <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                          PRIVATE STUDENT PAGE · NO PASSWORD
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
                        Open Live Student Page
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/[0.06] p-3.5 space-y-2">
                      <div className="flex items-center justify-between font-mono text-xs">
                        <span className="text-[#C8C2B6]">Prepaid Lesson Balance</span>
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
                      <p className="text-[#575248]">Direct Google Meet / video link on card.</p>
                    </div>
                    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 space-y-1">
                      <CalendarPlus className="h-4 w-4 text-[#D94E28]" />
                      <div className="font-semibold text-[#141413]">Calendar Invite (.ics)</div>
                      <p className="text-[#575248]">Apple, Outlook &amp; Google Calendar ready.</p>
                    </div>
                    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 space-y-1">
                      <CalendarCheck2 className="h-4 w-4 text-[#141413]" />
                      <div className="font-semibold text-[#141413]">24h Notice Rule</div>
                      <p className="text-[#575248]">Students can reschedule ahead of cutoff.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Teacher Lesson Wrap-Up */}
              {activeChapter === 3 && (
                <div className="bg-white p-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        Teacher Lesson Wrap-Up
                      </div>
                      <h4 className="mt-1 font-serif text-2xl text-[#141413]">
                        Complete Lesson &amp; Share Notes
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
                        Reset Preview
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
                        {simCompleted ? '4 hrs → 3 hrs left (-1 hr)' : '4 of 5 hrs remaining'}
                      </span>
                    </div>

                    <div className="rounded-lg border border-[#DCD6C8] bg-white p-3 space-y-1.5">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E685C]">
                        Attached Interactive Study Sheet
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#D94E28]">
                          <FileText className="h-3.5 w-3.5" />
                          SAT Module 2 Quadratic Drill
                        </span>
                        <span className="font-mono text-[11px] text-[#15803D]">
                          {simCompleted ? 'Shared to student page instantly ✓' : 'Ready to share'}
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
                      Create Free Teacher Account
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
