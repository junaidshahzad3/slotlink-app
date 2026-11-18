'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  Check,
  Clock,
  FileText,
  Layers,
  Orbit,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';

type LandingVersionId = 'v1' | 'v2' | 'v3';

const VERSION_OPTIONS: {
  id: LandingVersionId;
  badge: string;
  label: string;
  inspiration: string;
}[] = [
  {
    id: 'v1',
    badge: 'V1',
    label: 'Swiss Editorial 3D',
    inspiration: 'Cal.com + Stripe Press',
  },
  {
    id: 'v2',
    badge: 'V2',
    label: 'Obsidian Linear Beams',
    inspiration: 'Linear + Magic UI Dark 3D',
  },
  {
    id: 'v3',
    badge: 'V3',
    label: 'Spatial 3D Turntable',
    inspiration: 'Godly.website Isometric Stage',
  },
];

function sanitizeSlugInput(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'your-studio'
  );
}

/**
 * Animated SVG beam schematic inspired by Magic UI & Linear dark-mode architecture diagrams.
 */
function ObsidianBeamNetworkSvg({ activeNode }: { activeNode: number }) {
  const intakeNodes = [
    { y: 42, label: 'WhatsApp Bio' },
    { y: 102, label: 'Instagram Link' },
    { y: 162, label: 'Mobile QR Scan' },
    { y: 222, label: 'Email Signature' },
  ];
  const outputNodes = [
    { y: 62, label: '2-Way GCal FreeBusy', accent: '#4ADE80' },
    { y: 132, label: '128-Bit Magic Passbook', accent: '#F3B09A' },
    { y: 202, label: 'Atomic Ledger + Study Vault', accent: '#4ADE80' },
  ];

  return (
    <div className="rounded-2xl border border-white/15 bg-[#121216] p-5 sm:p-7 shadow-2xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#F3B09A]">
          REAL-TIME VECTOR BEAM TOPOLOGY // STAGE 0{activeNode + 1} ACTIVE
        </span>
        <span className="font-mono text-[10px] text-[#4ADE80]">0-LATENCY SLOT ENGINE</span>
      </div>

      <svg
        viewBox="0 0 960 264"
        role="img"
        aria-label="Obsidian Animated Beam Topology"
        className="w-full h-auto mt-3"
      >
        <defs>
          <linearGradient id="beamWarm" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D94E28" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#D94E28" stopOpacity="1" />
            <stop offset="100%" stopColor="#F3B09A" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="beamMint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F3B09A" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#4ADE80" stopOpacity="1" />
            <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.3" />
          </linearGradient>
          {intakeNodes.map((n, idx) => (
            <path
              key={`in-def-${idx}`}
              id={`beamInPath-${idx}`}
              d={`M 170 ${n.y} C 300 ${n.y}, 340 132, 435 132`}
            />
          ))}
          {outputNodes.map((n, idx) => (
            <path
              key={`out-def-${idx}`}
              id={`beamOutPath-${idx}`}
              d={`M 525 132 C 620 132, 660 ${n.y}, 770 ${n.y}`}
            />
          ))}
        </defs>

        {/* Left Intake Beams */}
        {intakeNodes.map((n, idx) => (
          <g key={`in-${idx}`}>
            <rect
              x="16"
              y={n.y - 16}
              width="154"
              height="32"
              rx="8"
              fill="#191920"
              stroke="rgba(255,255,255,0.16)"
            />
            <text
              x="93"
              y={n.y + 4}
              textAnchor="middle"
              fontSize="11"
              fontFamily="monospace"
              fill="#E5E0D4"
            >
              {n.label}
            </text>
            <use href={`#beamInPath-${idx}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
            <use
              href={`#beamInPath-${idx}`}
              fill="none"
              stroke="url(#beamWarm)"
              strokeWidth="2"
              className="animate-vector-dash"
            />
            <circle r="3.5" fill="#F3B09A">
              <animateMotion dur={`${3.2 + idx * 0.45}s`} repeatCount="indefinite">
                <mpath href={`#beamInPath-${idx}`} />
              </animateMotion>
            </circle>
          </g>
        ))}

        {/* Center Core Hub */}
        <g>
          <circle
            cx="480"
            cy="132"
            r="56"
            fill="rgba(217, 78, 40, 0.12)"
            stroke="#D94E28"
            strokeWidth="1.5"
            strokeDasharray="5 4"
          />
          <rect
            x="435"
            y="96"
            width="90"
            height="72"
            rx="16"
            fill="#141418"
            stroke="#D94E28"
            strokeWidth="2"
          />
          <text
            x="480"
            y="128"
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fontFamily="monospace"
            fill="#F6F4EE"
          >
            SLOTLINK
          </text>
          <text
            x="480"
            y="146"
            textAnchor="middle"
            fontSize="9.5"
            fontFamily="monospace"
            fill="#4ADE80"
          >
            CORE PRISM
          </text>
        </g>

        {/* Right Output Beams */}
        {outputNodes.map((n, idx) => (
          <g key={`out-${idx}`}>
            <use href={`#beamOutPath-${idx}`} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2.5" />
            <use
              href={`#beamOutPath-${idx}`}
              fill="none"
              stroke="url(#beamMint)"
              strokeWidth="2"
              className="animate-vector-dash"
            />
            <circle r="3.5" fill={n.accent}>
              <animateMotion dur={`${2.8 + idx * 0.5}s`} begin="0.6s" repeatCount="indefinite">
                <mpath href={`#beamOutPath-${idx}`} />
              </animateMotion>
            </circle>
            <rect
              x="770"
              y={n.y - 18}
              width="174"
              height="36"
              rx="8"
              fill="#191920"
              stroke={idx === Math.min(2, activeNode) ? n.accent : 'rgba(255,255,255,0.18)'}
              strokeWidth={idx === Math.min(2, activeNode) ? '1.8' : '1'}
            />
            <text
              x="857"
              y={n.y + 4}
              textAnchor="middle"
              fontSize="10.5"
              fontFamily="monospace"
              fill={n.accent}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Version 2: Linear / Raycast / Magic UI Dark Obsidian 3D Beam Scrollytelling Experience.
 */
function ObsidianLinearExperience() {
  const router = useRouter();
  const [slugInput, setSlugInput] = useState('');
  const [scrollDepth, setScrollDepth] = useState(0);
  const [gcalBlocked, setGcalBlocked] = useState(true);
  const [lessonDone, setLessonDone] = useState(false);

  useEffect(() => {
    let rafId = 0;
    const onFrame = () => {
      rafId = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setScrollDepth(Math.min(1, Math.max(0, window.scrollY / maxScroll)));
    };
    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(onFrame);
    };
    onFrame();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const stageTiltX = (0.5 - scrollDepth) * 10;
  const stageTiltY = (scrollDepth - 0.5) * 14;
  const activeStageNode = Math.min(2, Math.floor(scrollDepth * 3));

  function handleDarkClaim(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/login?mode=signup&slug=${encodeURIComponent(sanitizeSlugInput(slugInput))}`);
  }

  return (
    <div className="relative bg-[#0A0A0C] text-[#F6F4EE] overflow-hidden">
      {/* Subtle Dark Architectural Vector Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(45% 45% at 80% 15%, rgba(217, 78, 40, 0.22), transparent 70%), radial-gradient(40% 45% at 15% 85%, rgba(74, 222, 128, 0.12), transparent 70%)',
        }}
      />

      {/* Full-Viewport Obsidian Hero */}
      <section className="relative z-10 border-b border-white/10 min-h-[calc(100dvh-7.5rem)] flex items-center">
        <div className="viewport-container py-[clamp(3rem,7vh,6rem)] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#4ADE80]">
              <span className="live-dot h-2 w-2 rounded-full bg-[#4ADE80]" />
              V2 // OBSIDIAN 3D BEAM ARCHITECTURE
            </div>

            <h1 className="text-fluid-display font-semibold tracking-tight text-[#F6F4EE]">
              Zero-latency scheduling,{' '}
              <span className="font-serif italic font-normal text-[#F3B09A]">
                live hour beams,
              </span>{' '}
              and encrypted portals.
            </h1>

            <p className="max-w-2xl text-fluid-body text-[#B6B0A4]">
              A dark-room spatial command interface for independent educators. Route WhatsApp and
              bio traffic straight into prepaid 5-hour packs with live FreeBusy conflict guards.
            </p>

            <form
              onSubmit={handleDarkClaim}
              className="flex flex-col sm:flex-row gap-2 rounded-xl border border-white/15 bg-[#121216] p-1.5 max-w-xl focus-within:border-[#D94E28] transition"
            >
              <div className="flex flex-1 items-center px-3 py-2 font-mono text-xs">
                <span className="text-[#8C867A]">slotlink.app/</span>
                <input
                  type="text"
                  aria-label="Claim SlotLink handle"
                  placeholder="your-studio"
                  value={slugInput}
                  onChange={(e) => setSlugInput(e.target.value)}
                  className="w-full bg-transparent font-semibold text-[#4ADE80] placeholder-[#575248] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#D94E28] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#B83E1D] transition cursor-pointer"
              >
                Launch Obsidian Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 scene-3d-stage">
            <div
              className="preserve-3d rounded-2xl border border-white/15 bg-[#141418]/90 p-6 sm:p-8 shadow-2xl space-y-5 transition-transform duration-150"
              style={{
                transform: `rotateX(${stageTiltX.toFixed(2)}deg) rotateY(${stageTiltY.toFixed(
                  2
                )}deg)`,
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs">
                <span className="text-[#F3B09A]">SCROLL-LINKED 3D VIEWPORT METRIC</span>
                <span className="text-[#4ADE80]">{Math.round(scrollDepth * 100)}% SCRUBBED</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                  <div className="font-mono text-[10px] text-[#A8A295]">01 // PACK BALANCE</div>
                  <div className="font-mono text-2xl font-semibold text-[#4ADE80]">
                    {lessonDone ? '3 / 5 hrs' : '4 / 5 hrs'}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {[0, 1, 2, 3, 4].map((b) => (
                      <span
                        key={b}
                        className={`h-1.5 rounded-sm ${
                          b < (lessonDone ? 3 : 4) ? 'bg-[#4ADE80]' : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 space-y-2">
                  <div className="font-mono text-[10px] text-[#A8A295]">02 // GCAL FREEBUSY</div>
                  <div className="font-mono text-sm font-semibold text-[#F6F4EE]">
                    {gcalBlocked ? '2:00 PM Protected ✓' : '2:00 PM Available'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGcalBlocked((v) => !v)}
                    className="rounded border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] text-[#F3B09A] hover:bg-white/15 transition cursor-pointer"
                  >
                    Toggle Calendar Conflict
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-semibold text-[#F6F4EE]">Alex Rivera · SAT Module 2</div>
                  <div className="font-mono text-[11px] text-[#8C867A]">
                    {lessonDone
                      ? 'Deducted -1 hr · Notes pushed to /p/sl_demo_alex_94a2k'
                      : 'Confirmed · Meet URL ready'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setLessonDone((d) => !d)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#4ADE80] px-3 py-2 font-mono text-[11px] font-semibold text-[#0A0A0C] hover:bg-[#22C55E] transition cursor-pointer"
                >
                  {lessonDone ? <RotateCcw className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                  {lessonDone ? 'Reset Ledger' : 'Complete (-1 hr)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-Viewport Vector Beam Topology + Pricing */}
      <section className="relative z-10 viewport-section border-b border-white/10">
        <div className="viewport-container space-y-10">
          <div className="max-w-3xl">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#F3B09A]">
              END-TO-END SIGNAL FLOW
            </div>
            <h2 className="mt-2 text-fluid-h2 font-semibold text-[#F6F4EE]">
              Every client signal converges cleanly into{' '}
              <span className="font-serif italic font-normal text-[#4ADE80]">
                one source of truth.
              </span>
            </h2>
          </div>

          <ObsidianBeamNetworkSvg activeNode={activeStageNode} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/15 bg-[#121216] p-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-[#A8A295]">SOLO STUDIO</span>
                <div className="mt-2 font-serif text-5xl text-[#F6F4EE]">
                  $12<span className="font-mono text-sm text-[#8C867A]">/mo</span>
                </div>
                <p className="mt-2 text-xs text-[#B6B0A4]">
                  1-link booking studio, 2-way GCal conflict checks, zero-login client portals, and
                  0% commissions.
                </p>
              </div>
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-[#F6F4EE] hover:bg-white/10 transition"
              >
                Start 14-Day Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl border border-[#D94E28]/60 bg-gradient-to-br from-[#1C1414] to-[#121216] p-7 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs text-[#F3B09A]">PRO EDUCATOR</span>
                <div className="mt-2 font-serif text-5xl text-[#F6F4EE]">
                  $19<span className="font-mono text-sm text-[#8C867A]">/mo</span>
                </div>
                <p className="mt-2 text-xs text-[#E5E0D4]">
                  Adds custom domains, automated SMS alerts, and study sheet archive publishing.
                </p>
              </div>
              <Link
                href="/sarah-math"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D94E28] px-4 py-3 text-xs font-semibold text-white hover:bg-[#B83E1D] transition"
              >
                Explore Live Sample Portal
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Version 3: Godly.website Inspired Spatial 3D Isometric Turntable & Kinetic Vector Blueprint Workbench.
 */
function SpatialTurntableExperience() {
  const [orbitDeg, setOrbitDeg] = useState(-16);
  const [explodePct, setExplodePct] = useState(55);
  const [pitchDeg, setPitchDeg] = useState(14);

  useEffect(() => {
    let rafId = 0;
    const onFrame = () => {
      rafId = 0;
      const progress = Math.min(
        1,
        Math.max(0, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight))
      );
      setPitchDeg(14 - progress * 10);
    };
    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(onFrame);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const zStep = (explodePct / 100) * 44;

  return (
    <div className="relative bg-[#EFECE4] bg-grid-pattern text-[#141413]">
      {/* Architectural Protractor & Turntable Viewport Hero */}
      <section className="relative border-b border-[#DCD6C8] min-h-[calc(100dvh-7.5rem)] flex items-center">
        <div className="viewport-container py-[clamp(2.5rem,6vh,5rem)] grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Turntable Controls + Pitch */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#141413] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
              <Orbit className="h-3.5 w-3.5" />
              V3 // SPATIAL 3D BLUEPRINT WORKBENCH
            </div>

            <h1 className="text-fluid-display font-semibold tracking-tight text-[#141413]">
              Inspect every layer of the{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                1-link engine
              </span>{' '}
              in 3D space.
            </h1>

            <p className="text-fluid-body text-[#575248]">
              Drag the 3D orbit angle or Z-axis layer explosion sliders below to inspect how SlotLink
              unifies PostgreSQL ACID locking, Google FreeBusy, and cryptographic student passbooks.
            </p>

            {/* Tactile 3D Turntable Scrubbers */}
            <div className="surface-card rounded-2xl p-5 space-y-4">
              <div>
                <div className="flex justify-between font-mono text-[11px] font-semibold mb-1.5">
                  <span>3D ORBIT ANGLE</span>
                  <span className="text-[#D94E28]">{orbitDeg}°</span>
                </div>
                <input
                  type="range"
                  aria-label="3D Orbit Angle"
                  min={-42}
                  max={42}
                  value={orbitDeg}
                  onChange={(e) => setOrbitDeg(Number(e.target.value))}
                  className="w-full accent-[#141413] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[11px] font-semibold mb-1.5">
                  <span>Z-AXIS LAYER EXPLOSION</span>
                  <span className="text-[#15803D]">{explodePct}%</span>
                </div>
                <input
                  type="range"
                  aria-label="Z-Axis Layer Explosion"
                  min={0}
                  max={100}
                  value={explodePct}
                  onChange={(e) => setExplodePct(Number(e.target.value))}
                  className="w-full accent-[#D94E28] cursor-pointer"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#141413] px-5 py-3 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
              >
                Create Your Studio Free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/p/sl_demo_alex_94a2k"
                className="inline-flex items-center gap-2 rounded-xl border border-[#141413] bg-white px-5 py-3 text-xs font-semibold text-[#141413] hover:bg-[#F6F4EE] transition"
              >
                Open Live Passbook
                <ArrowUpRight className="h-4 w-4 text-[#D94E28]" />
              </Link>
            </div>
          </div>

          {/* Right 4-Layer 3D Isometric Hardware Workbench */}
          <div className="lg:col-span-7 scene-3d-stage min-h-[460px] flex items-center justify-center rounded-2xl border border-[#DCD6C8] bg-white/85 p-6 sm:p-10 shadow-xl overflow-hidden">
            <div
              className="relative preserve-3d w-full max-w-[490px] h-[320px] transition-transform duration-150 ease-out"
              style={{
                transform: `rotateX(${pitchDeg.toFixed(1)}deg) rotateY(${orbitDeg}deg)`,
              }}
            >
              {/* Layer 1: PostgreSQL ACID Engine */}
              <div
                className="absolute inset-0 rounded-2xl border-2 border-[#CEC7B6] bg-[#F6F4EE] p-4 shadow-md flex flex-col justify-between"
                style={{ transform: 'translateZ(0px)' }}
              >
                <div className="flex justify-between font-mono text-[10px] font-semibold text-[#575248]">
                  <span>PLANE 01 // POSTGRESQL TRANSACTION ENGINE</span>
                  <span className="text-[#15803D]">READ COMMITTED</span>
                </div>
                <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                  <div className="rounded border border-[#BBF7D0] bg-[#DCFCE7] p-2 text-[#15803D]">
                    09:00 OPEN
                  </div>
                  <div className="rounded border border-[#E5C6BE] bg-[#FDF2EF] p-2 text-[#9F2D12]">
                    14:00 BUSY
                  </div>
                  <div className="rounded border border-[#141413] bg-white p-2 text-[#141413]">
                    15:00 TX LOCK
                  </div>
                </div>
              </div>

              {/* Layer 2: 2-Way Google FreeBusy + Meet Layer */}
              <div
                className="absolute inset-x-3 top-4 bottom-4 rounded-2xl border border-[#15803D] bg-white/95 p-4 shadow-lg flex flex-col justify-between"
                style={{ transform: `translateZ(${(zStep * 1.1).toFixed(1)}px)` }}
              >
                <div className="flex items-center justify-between font-mono text-[10px] font-semibold">
                  <span className="inline-flex items-center gap-1.5 text-[#15803D]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    PLANE 02 // 2-WAY FREEBUSY GUARD + JITSI/MEET
                  </span>
                  <CalendarCheck2 className="h-3.5 w-3.5 text-[#141413]" />
                </div>
                <div className="rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-2 font-mono text-[11px] flex justify-between">
                  <span>meet.jit.si/slotlink-sarah-9f4a</span>
                  <Video className="h-3.5 w-3.5 text-[#15803D]" />
                </div>
              </div>

              {/* Layer 3: Client Magic Passbook */}
              <div
                className="surface-ink absolute inset-x-6 top-8 bottom-8 rounded-2xl p-4 shadow-2xl flex flex-col justify-between"
                style={{ transform: `translateZ(${(zStep * 2.2).toFixed(1)}px)` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#4ADE80]">
                      PLANE 03 // CRYPTOGRAPHIC PASSBOOK
                    </div>
                    <div className="font-serif text-xl text-[#F6F4EE]">
                      slotlink.app/p/sl_demo_alex
                    </div>
                  </div>
                  <Clock className="h-4 w-4 text-[#F3B09A]" />
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <span
                      key={idx}
                      className={`h-2 rounded-sm ${idx < 3 ? 'bg-[#4ADE80]' : 'bg-white/20'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Layer 4: Educator Studio & Notes Vault */}
              <div
                className="absolute inset-x-10 top-12 bottom-12 rounded-2xl border-2 border-[#D94E28] bg-white/95 p-4 shadow-2xl flex flex-col justify-between"
                style={{ transform: `translateZ(${(zStep * 3.3).toFixed(1)}px)` }}
              >
                <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-[#D94E28]">
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    PLANE 04 // STUDIO NOTES &amp; 1-TAP LEDGER
                  </span>
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#141413]">
                  <span>SAT Module 2 Parabola Sheet</span>
                  <span className="inline-flex items-center gap-1 text-[#15803D] font-mono text-[11px]">
                    <Check className="h-3.5 w-3.5" />
                    Atomic Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kinetic Vector Storyboard Grid */}
      <section className="viewport-section bg-white border-b border-[#DCD6C8]">
        <div className="viewport-container space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                VECTOR STORYBOARD // FULL WORKFLOW COVERAGE
              </div>
              <h2 className="mt-2 text-fluid-h2 font-semibold text-[#141413]">
                Four coordinated views,{' '}
                <span className="font-serif italic font-normal text-[#D94E28]">
                  zero bloat.
                </span>
              </h2>
            </div>
            <Link
              href="/sarah-math"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
            >
              Launch Live Sample Studio
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: '01',
                title: '1-Link Public Studio',
                detail: 'Responsive slug /sarah-math with instant package & time selection.',
                href: '/sarah-math',
              },
              {
                num: '02',
                title: 'Google Calendar Guard',
                detail: 'Automatic FreeBusy collision checks and video room provisioning.',
                href: '/login?mode=signup',
              },
              {
                num: '03',
                title: 'Magic Client Passbook',
                detail: 'Zero-password ledger for prepaid hours, .ics, and 24h rescheduling.',
                href: '/p/sl_demo_alex_94a2k',
              },
              {
                num: '04',
                title: 'Interactive Study Vault',
                detail: 'Vector math diagrams and practice drills attached straight to lessons.',
                href: '/notes/sat-module-2-drill',
              },
            ].map((card) => (
              <Link
                key={card.num}
                href={card.href}
                className="surface-card surface-card-interactive rounded-2xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <span className="font-mono text-[10px] font-semibold text-[#D94E28]">
                    STATION {card.num}
                  </span>
                  <h3 className="font-serif text-2xl text-[#141413]">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-[#575248]">{card.detail}</p>
                </div>
                <span className="font-mono text-[11px] font-semibold text-[#141413]">
                  Inspect Station →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Multi-version landing page switcher wrapping V1 (Swiss Editorial 3D), V2 (Obsidian Linear Beams), and V3 (Spatial 3D Turntable).
 */
export function LandingVersionShowcase({ children }: { children: React.ReactNode }) {
  const [version, setVersion] = useState<LandingVersionId>('v1');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('version');
    if (v === 'v1' || v === 'v2' || v === 'v3') {
      setVersion(v);
    }
  }, []);

  function switchVersion(next: LandingVersionId) {
    setVersion(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <>
      {/* Top Inline Version Switcher Strip */}
      <div
        className={`border-b transition-colors ${
          version === 'v2'
            ? 'border-white/10 bg-[#0A0A0C] text-[#F6F4EE]'
            : 'border-[#DCD6C8] bg-[#EFECE4]/90 text-[#141413]'
        }`}
      >
        <div className="viewport-container py-2 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="font-semibold uppercase tracking-wider text-[#D94E28]">
            DESIGN EXPLORATION // COMPARE 3 LANDING DIRECTIONS LIVE
          </span>
          <div className="inline-flex flex-wrap gap-1.5">
            {VERSION_OPTIONS.map((opt) => {
              const active = version === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => switchVersion(opt.id)}
                  className={`rounded-md px-2.5 py-1 font-semibold transition cursor-pointer ${
                    active
                      ? 'bg-[#D94E28] text-white shadow-sm'
                      : version === 'v2'
                        ? 'bg-white/10 text-[#E5E0D4] hover:bg-white/20'
                        : 'bg-white text-[#141413] border border-[#CEC7B6] hover:bg-[#F6F4EE]'
                  }`}
                >
                  {opt.badge}: {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {version === 'v1' && children}
      {version === 'v2' && <ObsidianLinearExperience />}
      {version === 'v3' && <SpatialTurntableExperience />}

      {/* Floating Bottom Glass Switcher Dock */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[min(94vw,620px)] rounded-2xl border border-[#CEC7B6] bg-[#F6F4EE]/92 px-2.5 py-2 shadow-2xl backdrop-blur-md">
        <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] sm:text-[11px]">
          {VERSION_OPTIONS.map((opt) => {
            const active = version === opt.id;
            return (
              <button
                key={`dock-${opt.id}`}
                type="button"
                onClick={() => switchVersion(opt.id)}
                className={`rounded-xl px-2 py-2 text-center transition cursor-pointer ${
                  active
                    ? 'bg-[#141413] text-[#F6F4EE] font-semibold shadow'
                    : 'text-[#575248] hover:bg-white hover:text-[#141413]'
                }`}
              >
                <div className="truncate font-semibold">
                  {opt.badge} · {opt.label}
                </div>
                <div className="hidden sm:block truncate text-[9px] opacity-75">
                  {opt.inspiration}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
