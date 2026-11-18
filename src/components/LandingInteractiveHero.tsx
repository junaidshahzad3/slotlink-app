'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  Check,
  FileText,
  RotateCcw,
  Sparkles,
  Video,
} from 'lucide-react';

type StageTab = 'booking' | 'portal' | 'deduct';

interface HeroService {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  priceColor: string;
  rateLabel: string;
  popular?: boolean;
}

const HERO_SERVICES: HeroService[] = [
  {
    id: 'intro',
    name: '15m Intro Call',
    subtitle: 'Quick goal check',
    priceLabel: 'FREE',
    priceColor: 'text-[#15803D]',
    rateLabel: 'Complimentary consult',
  },
  {
    id: 'single',
    name: '1-on-1 Lesson',
    subtitle: '60m focused session',
    priceLabel: '$55',
    priceColor: 'text-[#141413]',
    rateLabel: '$55 / hr standard rate',
  },
  {
    id: 'pack5',
    name: '5-Lesson Pack',
    subtitle: '5 prepaid hours · saves $25',
    priceLabel: '$250',
    priceColor: 'text-[#141413]',
    rateLabel: '$50 / hr pack rate',
    popular: true,
  },
];

const HERO_DAYS = [
  { id: 'mon', d: 'Mon', n: '16' },
  { id: 'tue', d: 'Tue', n: '17' },
  { id: 'wed', d: 'Wed', n: '18' },
  { id: 'thu', d: 'Thu', n: '19' },
  { id: 'fri', d: 'Fri', n: '20' },
];

const HERO_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'];

const PORTAL_PERSONAS = {
  alex: {
    name: 'Alex Rivera',
    hoursLeft: 3,
    totalHours: 5,
    href: '/p/sl_demo_alex_94a2k',
    statusLabel: 'Active 5-Pack',
    statusTone: 'text-[#4ADE80]',
    nextSession: 'Tue 3:00 PM · SAT Practice Test #4',
    homeworkTitle: 'Quadratics & Parabola Vertex Drill (14 Qs)',
    takeaway: 'Mastered vertex form conversions; focus on discriminant word problems next.',
  },
  maya: {
    name: 'Maya Lin',
    hoursLeft: 1,
    totalHours: 5,
    href: '/p/sl_demo_maya_77b1x',
    statusLabel: 'Low Balance · Renew Soon',
    statusTone: 'text-[#FBBF24]',
    nextSession: 'Thu 4:30 PM · AP Calc Derivatives Review',
    homeworkTitle: 'Chain Rule & Implicit Differentiation Set',
    takeaway: 'Clean chain-rule execution; 1 prepaid hour remaining before Friday review.',
  },
} as const;

/**
 * Interactive studio URL handle claimer for the landing page hero.
 */
export function HeroHandleClaimer() {
  const router = useRouter();
  const [handle, setHandle] = useState('');

  const cleanSlug =
    handle
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'your-studio';

  function onClaim(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/login?mode=signup&slug=${encodeURIComponent(cleanSlug)}`);
  }

  return (
    <form
      onSubmit={onClaim}
      className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-[#CEC7B6] bg-white p-1.5 shadow-sm focus-within:border-[#141413] transition"
    >
      <div className="flex flex-1 items-center min-w-0 px-2.5 py-1.5">
        <span className="shrink-0 font-mono text-xs font-medium text-[#6E685C]">
          slotlink.app/
        </span>
        <input
          type="text"
          aria-label="Claim your SlotLink handle"
          placeholder="sarah-math"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="w-full min-w-0 bg-transparent font-mono text-xs font-semibold text-[#D94E28] placeholder-[#A8A295] focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#D94E28] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#B83E1D] transition cursor-pointer"
      >
        Claim Studio Link
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}

/**
 * Interactive multi-mode product preview for the landing page hero column.
 */
export function HeroInteractiveStage() {
  const [tab, setTab] = useState<StageTab>('booking');
  const [serviceId, setServiceId] = useState<string>('pack5');
  const [dayId, setDayId] = useState<string>('tue');
  const [slot, setSlot] = useState<string>('10:30 AM');
  const [personaKey, setPersonaKey] = useState<'alex' | 'maya'>('alex');
  const [showHomeworkPreview, setShowHomeworkPreview] = useState<boolean>(true);
  const [deducted, setDeducted] = useState<boolean>(false);
  const [heroTilt, setHeroTilt] = useState({ rx: 0, ry: 0 });

  const selectedService = HERO_SERVICES.find((s) => s.id === serviceId) ?? HERO_SERVICES[2];
  const selectedDay = HERO_DAYS.find((d) => d.id === dayId) ?? HERO_DAYS[1];
  const persona = PORTAL_PERSONAS[personaKey];

  function handleHeroMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setHeroTilt({ rx: Number((-ny * 6).toFixed(2)), ry: Number((nx * 7).toFixed(2)) });
  }

  return (
    <div
      onMouseMove={handleHeroMove}
      onMouseLeave={() => setHeroTilt({ rx: 0, ry: 0 })}
      className="relative pb-10 sm:pb-14 scene-3d-stage"
    >
      {/* Floating 3D Parallax Metric Pill */}
      <div
        className="hidden sm:inline-flex animate-float-subtle items-center gap-2 rounded-full border border-[#141413] bg-white px-3 py-1 font-mono text-[10px] font-semibold text-[#141413] shadow-md mb-3"
        style={{ transform: 'translateZ(35px)' }}
      >
        <span className="h-2 w-2 rounded-full bg-[#D94E28]" />
        INTERACTIVE 3D STUDIO STAGE · TRY CLICKING
      </div>

      <div
        className="surface-card preserve-3d rounded-2xl overflow-hidden transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${heroTilt.rx}deg) rotateY(${heroTilt.ry}deg)`,
        }}
      >
        {/* Browser Chrome + Live Mode Tabs */}
        <div className="border-b border-[#DCD6C8] bg-[#EFECE4] px-4 py-2.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#CEC7B6]" />
            </div>
            <div className="rounded-md border border-[#D5CFC0] bg-white px-3 py-0.5 font-mono text-[11px] text-[#575248]">
              {tab === 'booking'
                ? 'slotlink.app/sarah-math'
                : tab === 'portal'
                  ? `slotlink.app/p/sl_demo_${personaKey}...`
                  : 'slotlink.app/dashboard'}
            </div>
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold text-[#15803D]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#15803D]" />
              LIVE
            </span>
          </div>

          {/* Mode Tabs */}
          <div
            role="tablist"
            aria-label="Interactive Product Stage Views"
            className="grid grid-cols-3 gap-1 rounded-lg border border-[#D5CFC0] bg-[#E6E1D5] p-1 font-mono text-[10px] font-semibold"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'booking'}
              onClick={() => setTab('booking')}
              className={`rounded-md px-2 py-1.5 text-center transition ${
                tab === 'booking'
                  ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              01 · 1-Link Studio
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'portal'}
              onClick={() => setTab('portal')}
              className={`rounded-md px-2 py-1.5 text-center transition ${
                tab === 'portal'
                  ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              02 · Magic Passbook
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={tab === 'deduct'}
              onClick={() => setTab('deduct')}
              className={`rounded-md px-2 py-1.5 text-center transition ${
                tab === 'deduct'
                  ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              03 · 1-Tap Deduct
            </button>
          </div>
        </div>

        {/* Interactive Stage Body */}
        {tab === 'booking' && (
          <div className="p-5 sm:p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between border-b border-[#EFECE4] pb-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
                  SC
                </div>
                <div>
                  <div className="font-serif text-xl leading-none text-[#141413]">Sarah Chen</div>
                  <div className="mt-1 text-xs text-[#6E685C]">SAT &amp; AP Calculus Tutor</div>
                </div>
              </div>
              <Link
                href="/sarah-math"
                className="rounded-md border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-1 font-mono text-[11px] font-medium text-[#141413] hover:bg-[#EFECE4]"
              >
                Open Live →
              </Link>
            </div>

            {/* Interactive Selectable Services */}
            <div className="space-y-2">
              {HERO_SERVICES.map((svc) => {
                const active = svc.id === serviceId;
                return (
                  <button
                    key={svc.id}
                    type="button"
                    onClick={() => setServiceId(svc.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-left text-xs transition ${
                      active
                        ? 'border-2 border-[#141413] bg-[#EFECE4]/70'
                        : 'border border-[#DCD6C8] bg-[#F6F4EE]/55 hover:border-[#9E9687]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                            : 'border-[#CEC7B6] bg-white'
                        }`}
                      >
                        {active && <Check className="h-2.5 w-2.5" />}
                      </span>
                      <span className="font-semibold text-[#141413]">{svc.name}</span>
                      {svc.popular ? (
                        <span className="rounded bg-[#D94E28] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-white">
                          POPULAR
                        </span>
                      ) : (
                        <span className="hidden sm:inline text-[#6E685C]">{svc.subtitle}</span>
                      )}
                    </div>
                    <span className={`font-mono font-semibold ${svc.priceColor}`}>
                      {svc.priceLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clickable 5-Day Strip */}
            <div className="grid grid-cols-5 gap-1.5">
              {HERO_DAYS.map((day) => {
                const active = day.id === dayId;
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setDayId(day.id)}
                    className={`rounded-lg border py-1.5 text-center transition ${
                      active
                        ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                        : 'border-[#DCD6C8] bg-[#F6F4EE]/70 text-[#575248] hover:border-[#9E9687]'
                    }`}
                  >
                    <div className="text-[10px] uppercase">{day.d}</div>
                    <div className="font-mono text-xs font-semibold">{day.n}</div>
                  </button>
                );
              })}
            </div>

            {/* Clickable 6-Slot Time Grid */}
            <div className="grid grid-cols-3 gap-2">
              {HERO_SLOTS.map((s) => {
                const active = s === slot;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`rounded-lg border px-2 py-1.5 text-center font-mono text-[11px] font-medium transition ${
                      active
                        ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                        : 'border-[#DCD6C8] bg-white text-[#141413] hover:bg-[#EFECE4]'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Live Selection Summary */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-3.5 py-2.5 text-[11px]">
              <div>
                <div className="font-semibold text-[#141413]">
                  {selectedService.name} · {selectedDay.d} {selectedDay.n}, {slot}
                </div>
                <div className="font-mono text-[#6E685C]">{selectedService.rateLabel}</div>
              </div>
              <Link
                href="/sarah-math"
                className="inline-flex items-center gap-1 rounded-lg bg-[#141413] px-3 py-1.5 font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
              >
                Book Live
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}

        {tab === 'portal' && (
          <div className="p-5 sm:p-6 space-y-4 bg-white">
            {/* Persona Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE4] pb-3.5">
              <div className="inline-flex rounded-lg border border-[#DCD6C8] bg-[#EFECE4] p-0.5 font-mono text-[11px]">
                <button
                  type="button"
                  onClick={() => setPersonaKey('alex')}
                  className={`rounded-md px-2.5 py-1 font-semibold transition ${
                    personaKey === 'alex'
                      ? 'bg-[#141413] text-[#F6F4EE]'
                      : 'text-[#575248] hover:text-[#141413]'
                  }`}
                >
                  Alex (3/5 hrs)
                </button>
                <button
                  type="button"
                  onClick={() => setPersonaKey('maya')}
                  className={`rounded-md px-2.5 py-1 font-semibold transition ${
                    personaKey === 'maya'
                      ? 'bg-[#141413] text-[#F6F4EE]'
                      : 'text-[#575248] hover:text-[#141413]'
                  }`}
                >
                  Maya (1/5 hrs · Low)
                </button>
              </div>
              <Link
                href={persona.href}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#D94E28] hover:underline"
              >
                Open Live Portal
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Passbook Balance Meter */}
            <div className="surface-ink rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#A8A295]">
                    {persona.statusLabel}
                  </div>
                  <div className="font-serif text-2xl text-[#F6F4EE]">{persona.name}</div>
                </div>
                <span className={`font-mono text-base font-semibold ${persona.statusTone}`}>
                  {persona.hoursLeft} of {persona.totalHours} hrs left
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <span
                    key={idx}
                    className={`h-2 rounded-sm transition-all ${
                      idx < persona.hoursLeft
                        ? persona.hoursLeft <= 1
                          ? 'bg-[#FBBF24]'
                          : 'bg-[#4ADE80]'
                        : 'bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Upcoming Session + Interactive Homework Toggle */}
            <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/70 p-3.5 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[#141413]">{persona.nextSession}</span>
                <span className="inline-flex items-center gap-1 rounded bg-[#DCFCE7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#15803D]">
                  <Video className="h-3 w-3" />
                  Meet Ready
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-[#DCD6C8] pt-2.5">
                <span className="font-mono text-[11px] text-[#575248]">
                  Session Takeaways &amp; PDF
                </span>
                <button
                  type="button"
                  onClick={() => setShowHomeworkPreview((v) => !v)}
                  className="font-mono text-[11px] font-semibold text-[#D94E28] hover:underline"
                >
                  {showHomeworkPreview ? 'Hide Note' : 'Inspect Note'}
                </button>
              </div>
              {showHomeworkPreview && (
                <div className="rounded-lg border border-[#D5CFC0] bg-white p-3 space-y-1.5">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#D94E28]">
                    <BookOpenCheck className="h-3.5 w-3.5" />
                    {persona.homeworkTitle}
                  </div>
                  <p className="text-xs leading-relaxed text-[#575248]">{persona.takeaway}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'deduct' && (
          <div className="p-5 sm:p-6 space-y-4 bg-white">
            <div className="flex items-center justify-between border-b border-[#EFECE4] pb-3.5">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#D94E28]">
                  Live Ledger Simulation
                </div>
                <div className="text-sm font-semibold text-[#141413]">
                  One tap deducts 1 hour &amp; publishes notes
                </div>
              </div>
              <Link
                href="/login?mode=signup"
                className="rounded-md border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-1 font-mono text-[11px] font-medium text-[#141413] hover:bg-[#EFECE4]"
              >
                Launch Studio →
              </Link>
            </div>

            {/* Simulated Session Row */}
            <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/70 p-4 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#141413]">Alex Rivera</span>
                    <span
                      className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        deducted
                          ? 'border-[#D5CFC0] bg-[#EFECE4] text-[#141413]'
                          : 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]'
                      }`}
                    >
                      {deducted ? 'COMPLETED' : 'CONFIRMED'}
                    </span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-[#6E685C]">
                    1-on-1 SAT Math · 60 min · Practice Test #4
                  </div>
                </div>

                {!deducted ? (
                  <button
                    type="button"
                    onClick={() => setDeducted(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#15803D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Simulate Mark Complete (-1 hr)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeducted(false)}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-3 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset Simulation
                  </button>
                )}
              </div>

              {/* Balance Change Indicator */}
              <div className="flex items-center justify-between rounded-lg border border-[#D5CFC0] bg-white px-3.5 py-2.5 font-mono text-xs">
                <span className="text-[#575248]">Alex Pack Balance</span>
                <span className="font-semibold text-[#15803D]">
                  {deducted ? '4 hrs → 3 hrs left (-1 hr)' : '4 of 5 hrs remaining'}
                </span>
              </div>

              {/* Instant Published Portal Artifact */}
              {deducted && (
                <div className="rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#15803D]">
                      Synced to Student Magic Portal
                    </span>
                    <span className="inline-flex items-center gap-1 rounded border border-[#BBF7D0] bg-white px-2 py-0.5 font-mono text-[10px] font-semibold text-[#D94E28]">
                      <FileText className="h-3 w-3" />
                      Practice_Test_4_Notes.pdf
                    </span>
                  </div>
                  <p className="text-xs text-[#14532D]">
                    Reviewed quadratic factoring shortcuts and parabola vertex shifts; drill #4
                    attached.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlapping Carbon Passbook Card */}
      <div className="surface-ink mt-4 sm:mt-0 sm:absolute sm:-bottom-4 sm:-right-4 sm:w-[345px] rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-[#A8A295]">
              Student Magic Portal
            </div>
            <div className="text-sm font-semibold text-[#F6F4EE]">{persona.name}</div>
          </div>
          <Link
            href={persona.href}
            className="rounded border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] text-[#F6F4EE] hover:bg-white/20"
          >
            Open Passbook ↗
          </Link>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-[#C8C2B6]">Pack Balance</span>
            <span className={`font-semibold ${persona.statusTone}`}>
              {tab === 'deduct' ? (deducted ? '3 of 5 hrs left' : '4 of 5 hrs left') : `${persona.hoursLeft} of 5 hrs left`}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {[0, 1, 2, 3, 4].map((idx) => {
              const activeCount =
                tab === 'deduct' ? (deducted ? 3 : 4) : persona.hoursLeft;
              return (
                <span
                  key={idx}
                  className={`h-1.5 rounded-sm ${
                    idx < activeCount
                      ? activeCount <= 1
                        ? 'bg-[#FBBF24]'
                        : 'bg-[#4ADE80]'
                      : 'bg-white/15'
                  }`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-[11px]">
          <span className="truncate text-[#F6F4EE]">{persona.nextSession}</span>
          <span className="ml-2 inline-flex shrink-0 items-center gap-1 rounded bg-[#DCFCE7] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#15803D]">
            <Video className="h-2.5 w-2.5" />
            Meet
          </span>
        </div>
      </div>
    </div>
  );
}

const VOLUME_PRESETS = [2000, 4500, 8000, 12000];

/**
 * Interactive educator take-home calculator comparing marketplaces & CRM stacks vs SlotLink.
 */
export function CommissionSavingsCalculator() {
  const [monthlyRev, setMonthlyRev] = useState<number>(4500);
  const [tier, setTier] = useState<'solo' | 'pro'>('solo');

  const slotlinkMonthlyCost = tier === 'solo' ? 12 : 19;
  const slotlinkAnnualCost = slotlinkMonthlyCost * 12;
  const marketplaceAnnualCut = Math.round(monthlyRev * 0.2 * 12);
  const ductTapeAnnualCost = 65 * 12;
  const annualGross = monthlyRev * 12;
  const netSavedVsMarketplace = Math.max(0, marketplaceAnnualCut - slotlinkAnnualCost);
  const slotlinkKeepPct = Math.max(
    0,
    Math.min(100, Math.round(((annualGross - slotlinkAnnualCost) / annualGross) * 1000) / 10)
  );

  return (
    <section
      id="calculator"
      className="relative z-10 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 bg-dot-matrix viewport-section min-h-[82dvh]"
    >
      <div className="viewport-container">
        <div className="surface-card rounded-2xl p-6 sm:p-8 lg:p-10 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                Studio Economics Calculator
              </div>
              <h2 className="mt-2 text-fluid-h2 font-semibold tracking-tight text-[#141413]">
                Keep 100% of every{' '}
                <span className="font-serif italic font-normal text-[#D94E28]">
                  prepaid lesson hour.
                </span>
              </h2>
              <p className="mt-1.5 text-fluid-body text-[#575248]">
                See how much annual tutoring income stays in your pocket compared to 20% marketplace
                cuts and multi-tool CRM subscriptions.
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 font-mono text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTier('solo')}
                className={`rounded-lg px-3 py-1.5 transition ${
                  tier === 'solo'
                    ? 'bg-[#141413] text-[#F6F4EE]'
                    : 'text-[#575248] hover:text-[#141413]'
                }`}
              >
                Solo ($12/mo)
              </button>
              <button
                type="button"
                onClick={() => setTier('pro')}
                className={`rounded-lg px-3 py-1.5 transition ${
                  tier === 'pro'
                    ? 'bg-[#141413] text-[#F6F4EE]'
                    : 'text-[#575248] hover:text-[#141413]'
                }`}
              >
                Pro ($19/mo)
              </button>
            </div>
          </div>

          {/* Volume Presets + Slider */}
          <div className="surface-elevated rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <label
                  htmlFor="monthly-revenue-slider"
                  className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#575248]"
                >
                  Monthly Lesson Volume
                </label>
                <div className="font-serif text-3xl text-[#141413]">
                  ${monthlyRev.toLocaleString()}
                  <span className="font-mono text-xs text-[#6E685C]"> / month</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {VOLUME_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setMonthlyRev(preset)}
                    className={`rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold transition ${
                      monthlyRev === preset
                        ? 'border-[#141413] bg-[#141413] text-[#F6F4EE]'
                        : 'border-[#CEC7B6] bg-white text-[#141413] hover:bg-[#F6F4EE]'
                    }`}
                  >
                    ${(preset / 1000).toFixed(preset % 1000 === 0 ? 0 : 1)}k/mo
                  </button>
                ))}
              </div>
            </div>

            <input
              id="monthly-revenue-slider"
              type="range"
              min={1000}
              max={15000}
              step={250}
              value={monthlyRev}
              onChange={(e) => setMonthlyRev(Number(e.target.value))}
              className="w-full accent-[#D94E28] cursor-pointer"
            />
          </div>

          {/* 3-Column Annual Comparison */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#E5C6BE] bg-[#FDF2EF] p-5 space-y-2">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#9F2D12]">
                Marketplaces (20% Cut)
              </div>
              <div className="font-serif text-3xl text-[#9F2D12]">
                -${marketplaceAnnualCut.toLocaleString()}
                <span className="font-mono text-xs">/yr</span>
              </div>
              <p className="text-xs leading-relaxed text-[#7C2D12]">
                ${Math.round(monthlyRev * 0.2).toLocaleString()}/mo lost to platform booking
                commissions.
              </p>
            </div>

            <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-5 space-y-2">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248]">
                Duct-Tape CRM Stack (~$65/mo)
              </div>
              <div className="font-serif text-3xl text-[#141413]">
                -${ductTapeAnnualCost.toLocaleString()}
                <span className="font-mono text-xs">/yr</span>
              </div>
              <p className="text-xs leading-relaxed text-[#575248]">
                Calendar tool + bloated CRM + ~6 hrs/mo manual spreadsheet hour tracking.
              </p>
            </div>

            <div className="surface-ink rounded-xl p-5 space-y-2">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#4ADE80]">
                Saved With SlotLink ({tier === 'solo' ? '$12/mo' : '$19/mo'})
              </div>
              <div className="font-serif text-4xl leading-none text-[#F6F4EE]">
                +${netSavedVsMarketplace.toLocaleString()}
                <span className="font-mono text-xs text-[#A8A295]">/yr</span>
              </div>
              <p className="text-xs leading-relaxed text-[#C8C2B6]">
                0% commission, ${slotlinkAnnualCost}/yr flat studio software, zero client passwords.
              </p>
            </div>
          </div>

          {/* Vector Take-Home Gauge Comparing Marketplace Cut vs SlotLink Net */}
          <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-4 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
              <span className="font-semibold text-[#141413]">
                ANNUAL TAKE-HOME RATIO (ON ${annualGross.toLocaleString()} GROSS)
              </span>
              <span className="font-semibold text-[#15803D]">
                SlotLink keeps {slotlinkKeepPct}% vs. 80.0% on marketplaces
              </span>
            </div>
            <svg viewBox="0 0 800 44" className="w-full h-9">
              <text x="0" y="13" fontSize="9.5" fontFamily="monospace" fill="#9F2D12">
                MARKETPLACE NET (80%)
              </text>
              <rect x="170" y="3" width="620" height="12" rx="4" fill="#E5C6BE" />
              <rect x="170" y="3" width={Math.round(620 * 0.8)} height="12" rx="4" fill="#9F2D12" />

              <text x="0" y="35" fontSize="9.5" fontFamily="monospace" fill="#15803D">
                SLOTLINK NET ({slotlinkKeepPct}%)
              </text>
              <rect x="170" y="25" width="620" height="12" rx="4" fill="#DCFCE7" />
              <rect
                x="170"
                y="25"
                width={Math.round(620 * (slotlinkKeepPct / 100))}
                height="12"
                rx="4"
                fill="#15803D"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
