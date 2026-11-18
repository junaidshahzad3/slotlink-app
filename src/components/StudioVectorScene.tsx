'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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

/**
 * Scroll-driven ambient 3D geometric objects & architectural vectors positioned in vw/vh viewport coordinates.
 */
export function ScrollAmbient3DObjects() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const update = () => {
      setScrollY(window.scrollY || 0);
      rafId = 0;
    };
    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const cubeRotX = 24 + scrollY * 0.08;
  const cubeRotY = -28 + scrollY * 0.18;
  const cubeY = Math.sin(scrollY * 0.004) * 18;
  const gyroRotZ = scrollY * 0.14;
  const splineShift = Math.min(120, scrollY * 0.09);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* Top-Right 3D Wireframe Cube rotating on scroll */}
      <div
        className="hidden lg:flex items-center justify-center fixed scene-3d-stage"
        style={{
          top: '14vh',
          right: '4vw',
          width: 'clamp(74px, 7vw, 112px)',
          height: 'clamp(74px, 7vw, 112px)',
          transform: `translate3d(0, ${cubeY.toFixed(1)}px, 0)`,
          opacity: 0.42,
        }}
      >
        <div
          className="relative preserve-3d w-16 h-16"
          style={{
            transform: `rotateX(${cubeRotX.toFixed(1)}deg) rotateY(${cubeRotY.toFixed(1)}deg)`,
            transition: 'transform 60ms linear',
          }}
        >
          {[
            'translateZ(32px)',
            'rotateY(180deg) translateZ(32px)',
            'rotateY(90deg) translateZ(32px)',
            'rotateY(-90deg) translateZ(32px)',
            'rotateX(90deg) translateZ(32px)',
            'rotateX(-90deg) translateZ(32px)',
          ].map((tf, idx) => (
            <div
              key={idx}
              className="absolute inset-0 rounded-md border border-[#D94E28]/55 bg-[#D94E28]/[0.03]"
              style={{ transform: tf }}
            />
          ))}
        </div>
      </div>

      {/* Bottom-Left 3D Orbital Vector Gyroscope Ring rotating on scroll */}
      <div
        className="hidden md:flex items-center justify-center fixed scene-3d-stage"
        style={{
          bottom: '10vh',
          left: '3vw',
          width: 'clamp(110px, 11vw, 170px)',
          height: 'clamp(110px, 11vw, 170px)',
          opacity: 0.36,
        }}
      >
        <div
          className="relative preserve-3d w-full h-full flex items-center justify-center"
          style={{
            transform: `rotateX(62deg) rotateZ(${gyroRotZ.toFixed(1)}deg)`,
            transition: 'transform 60ms linear',
          }}
        >
          <svg viewBox="0 0 140 140" className="w-full h-full overflow-visible">
            <circle
              cx="70"
              cy="70"
              r="58"
              fill="none"
              stroke="#141413"
              strokeWidth="1.2"
              strokeDasharray="6 5"
            />
            <circle cx="70" cy="70" r="42" fill="none" stroke="#15803D" strokeWidth="1.2" />
            <circle cx="70" cy="12" r="4.5" fill="#D94E28" />
            <circle cx="70" cy="112" r="3.5" fill="#15803D" />
          </svg>
        </div>
      </div>

      {/* Viewport Architectural Vector Crosshairs & Bezier Spline */}
      <svg
        viewBox="0 0 1440 900"
        className="w-full h-full opacity-[0.22]"
        preserveAspectRatio="none"
        style={{
          transform: `translate3d(0, ${(-splineShift * 0.4).toFixed(1)}px, 0)`,
        }}
      >
        <path
          d="M -60 220 C 320 90, 620 420, 1040 190 C 1220 90, 1360 210, 1520 140"
          fill="none"
          stroke="#D94E28"
          strokeWidth="1.25"
          className="animate-vector-dash"
        />
        <path
          d="M -40 720 C 280 580, 740 820, 1120 620 C 1300 520, 1400 640, 1520 580"
          fill="none"
          stroke="#15803D"
          strokeWidth="1"
          className="animate-vector-dash"
        />
        {/* Crisp Vector Registration Marks */}
        <g stroke="#141413" strokeWidth="1" opacity="0.55">
          <path d="M 88 120 h 16 M 96 112 v 16" />
          <path d="M 1340 760 h 16 M 1348 752 v 16" />
        </g>
      </svg>
    </div>
  );
}

const CONDUIT_STATIONS = [
  { id: 0, x: 110, y: 110, code: '01', title: 'PUBLIC /[SLUG] LINK', sub: '3-Tap Booking' },
  { id: 1, x: 355, y: 78, code: '02', title: '2-WAY GCAL FREEBUSY', sub: 'Zero Collisions' },
  { id: 2, x: 605, y: 142, code: '03', title: '128-BIT /P/[TOKEN]', sub: 'Zero-Login Passbook' },
  { id: 3, x: 850, y: 108, code: '04', title: 'ATOMIC LEDGER & VAULT', sub: '1-Tap Complete' },
];

/**
 * Interactive SVG vector workflow schematic showing live animated data conduits across the 4 product chapters.
 */
export function VectorWorkflowConduitSvg({
  activeStep,
  onSelectStep,
}: {
  activeStep: number;
  onSelectStep?: (stepIndex: number) => void;
}) {
  return (
    <div className="surface-card rounded-2xl p-4 sm:p-5 bg-white/95 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EFECE4]">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
          LIVE VECTOR SYSTEM TOPOLOGY // CLICK ANY NODE
        </span>
        <span className="font-mono text-[10px] text-[#575248]">
          ACTIVE NODE: {CONDUIT_STATIONS[activeStep]?.title ?? CONDUIT_STATIONS[0].title}
        </span>
      </div>

      <svg
        viewBox="0 0 960 220"
        role="img"
        aria-label="SlotLink Vector Workflow Conduit Schematic"
        className="w-full h-auto mt-2"
      >
        <defs>
          <path
            id="slotlink-conduit-path"
            d="M 110 110 C 210 110, 255 78, 355 78 C 460 78, 500 142, 605 142 C 705 142, 750 108, 850 108"
          />
          <linearGradient id="conduitGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D94E28" />
            <stop offset="50%" stopColor="#141413" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
        </defs>

        {/* Subtle Architectural Under-Grid */}
        <line x1="30" y1="110" x2="930" y2="110" stroke="#EFECE4" strokeWidth="1" />

        {/* Base Path */}
        <use
          href="#slotlink-conduit-path"
          fill="none"
          stroke="#DCD6C8"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Animated Flowing Vector Dash Path */}
        <use
          href="#slotlink-conduit-path"
          fill="none"
          stroke="url(#conduitGrad)"
          strokeWidth="2.5"
          className="animate-vector-dash"
        />

        {/* Moving Data Signal Packets */}
        <circle r="5" fill="#D94E28" stroke="#FFFFFF" strokeWidth="1.5">
          <animateMotion dur="5.5s" repeatCount="indefinite">
            <mpath href="#slotlink-conduit-path" />
          </animateMotion>
        </circle>
        <circle r="4" fill="#15803D" stroke="#FFFFFF" strokeWidth="1.5">
          <animateMotion dur="5.5s" begin="2.75s" repeatCount="indefinite">
            <mpath href="#slotlink-conduit-path" />
          </animateMotion>
        </circle>

        {/* 4 Interactive Isometric Stations */}
        {CONDUIT_STATIONS.map((station) => {
          const isActive = station.id === activeStep;
          const isDone = station.id < activeStep;
          return (
            <g
              key={station.id}
              className="cursor-pointer"
              onClick={() => onSelectStep?.(station.id)}
            >
              {isActive && (
                <circle
                  cx={station.x}
                  cy={station.y}
                  r="28"
                  fill="rgba(217, 78, 40, 0.12)"
                  stroke="#D94E28"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              )}
              <rect
                x={station.x - 18}
                y={station.y - 18}
                width="36"
                height="36"
                rx="9"
                fill={isActive ? '#141413' : isDone ? '#DCFCE7' : '#FFFFFF'}
                stroke={isActive ? '#D94E28' : isDone ? '#15803D' : '#141413'}
                strokeWidth={isActive ? '2.2' : '1.4'}
              />
              <text
                x={station.x}
                y={station.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="monospace"
                fill={isActive ? '#F6F4EE' : isDone ? '#15803D' : '#141413'}
              >
                {station.code}
              </text>
              <text
                x={station.x}
                y={station.y + 38}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fontFamily="monospace"
                fill={isActive ? '#D94E28' : '#141413'}
              >
                {station.title}
              </text>
              <text
                x={station.x}
                y={station.y + 52}
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="sans-serif"
                fill="#575248"
              >
                {station.sub}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * Interactive 3D multi-plane exploded passbook hardware stack reacting to scroll progress and mouse tilt.
 */
export function Exploded3DPassbookPrism({ progress = 0.45 }: { progress?: number }) {
  const [tilt, setTilt] = useState({ rx: 8, ry: -10 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 14).toFixed(2)),
      ry: Number((nx * 16).toFixed(2)),
    });
  }

  function resetTilt() {
    setTilt({ rx: 8, ry: -10 });
  }

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const plane2Z = 28 + clampedProgress * 26;
  const plane3Z = 56 + clampedProgress * 52;

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      className="scene-3d-stage rounded-2xl border border-[#DCD6C8] bg-[#F6F4EE]/90 bg-dot-matrix p-6 sm:p-8 min-h-[380px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div
        className="relative preserve-3d w-full max-w-[440px] h-[270px] transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        {/* Plane 1: Base PostgreSQL Transactional Ledger Grid + Vector Circuit Traces */}
        <div
          className="absolute inset-0 rounded-2xl border border-[#CEC7B6] bg-white/95 p-4 shadow-md flex flex-col justify-between"
          style={{ transform: 'translateZ(0px)' }}
        >
          <div className="flex items-center justify-between font-mono text-[10px] text-[#6E685C]">
            <span>LAYER 01 // POSTGRESQL TRANSACTIONAL LEDGER</span>
            <span className="text-[#15803D] font-semibold">ACID LOCKED</span>
          </div>
          <svg viewBox="0 0 360 90" className="w-full h-16 opacity-65">
            <path
              d="M 10 45 H 120 L 145 20 H 240 L 265 45 H 350"
              fill="none"
              stroke="#141413"
              strokeWidth="1.5"
              className="animate-vector-dash"
            />
            <circle cx="145" cy="20" r="4" fill="#D94E28" />
            <circle cx="240" cy="20" r="4" fill="#15803D" />
          </svg>
          <div className="font-mono text-[10px] text-[#6E685C] flex justify-between">
            <span>row: booking_tx_94a2k</span>
            <span>conflict_guard: active</span>
          </div>
        </div>

        {/* Plane 2: Floating 5-Block LED Hour Meter + 2-Way GCal Shield */}
        <div
          className="absolute inset-x-3 top-6 bottom-6 rounded-2xl border border-[#141413]/25 bg-[#EFECE4]/95 p-4 shadow-xl flex flex-col justify-between backdrop-blur-sm"
          style={{
            transform: `translateZ(${plane2Z.toFixed(1)}px)`,
            transition: 'transform 120ms linear',
          }}
        >
          <div className="flex items-center justify-between font-mono text-[10px] font-semibold">
            <span className="inline-flex items-center gap-1.5 text-[#141413]">
              <CalendarCheck2 className="h-3.5 w-3.5 text-[#D94E28]" />
              LAYER 02 // 2-WAY FREEBUSY SHIELD
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-[#DCFCE7] px-2 py-0.5 text-[#15803D]">
              <ShieldCheck className="h-3 w-3" />
              ZERO OVERLAP
            </span>
          </div>

          <div className="rounded-xl border border-[#DCD6C8] bg-white p-3 space-y-2">
            <div className="flex items-center justify-between font-mono text-[11px]">
              <span className="text-[#575248]">LED Hour Balance</span>
              <span className="font-semibold text-[#15803D]">3 of 5 hrs remaining</span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <span
                  key={idx}
                  className={`h-2 rounded-sm ${idx < 3 ? 'bg-[#15803D]' : 'bg-[#DCD6C8]'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Plane 3: Top Carbon-Ink Perforated Boarding Pass */}
        <div
          className="surface-ink absolute inset-x-7 top-12 bottom-10 rounded-2xl p-4 shadow-2xl flex flex-col justify-between"
          style={{
            transform: `translateZ(${plane3Z.toFixed(1)}px)`,
            transition: 'transform 120ms linear',
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-[#4ADE80]">
                <Sparkles className="h-3 w-3" />
                LAYER 03 // CARBON MAGIC PASSBOOK
              </div>
              <div className="font-serif text-xl text-[#F6F4EE] mt-0.5">Alex Rivera</div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#4ADE80] px-2 py-1 font-mono text-[10px] font-semibold text-[#141413]">
              <Video className="h-3 w-3" />
              Live Video
            </span>
          </div>

          {/* Vector Barcode & Pass Serial */}
          <div className="border-t border-white/15 pt-2.5 flex items-center justify-between gap-2">
            <svg viewBox="0 0 110 18" className="h-4 w-24">
              {[0, 5, 8, 13, 19, 23, 29, 34, 41, 46, 52, 57, 64, 69, 75, 81, 88, 94, 100].map(
                (x, i) => (
                  <rect
                    key={x}
                    x={x}
                    y={1}
                    width={i % 3 === 0 ? 3 : 1.5}
                    height={16}
                    fill="#F6F4EE"
                  />
                )
              )}
            </svg>
            <span className="font-mono text-[9px] tracking-widest text-[#A8A295]">
              128-BIT // /p/sl_demo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const MARQUEE_ITEMS = [
  { tag: 'STEM STUDIO', text: 'SAT & AP Calculus · 5-Pack $250 ($50/hr)', metric: '0% Commission' },
  { tag: 'CONSERVATORY', text: 'Violin & Piano Coach · 4-Pack $320', metric: 'GCal Conflict Guard' },
  { tag: 'EXEC PREP', text: 'GMAT & Fluency · 10-Pack $950', metric: '128-Bit Magic Passbook' },
  { tag: 'LANGUAGE LAB', text: 'Spanish & IELTS · 5-Pack $225', metric: '.ics + Instant Video' },
  { tag: 'PHYSICS COACH', text: 'AP Physics C · 5-Pack $375', metric: '1-Tap Credit Ledger' },
  { tag: 'ARCHITECTURE', text: 'PostgreSQL ACID Locks · 0 Passwords', metric: '< 20s Client Booking' },
];

/**
 * Full-viewport infinite horizontal studio ticker inspired by Magic UI Marquee.
 */
export function StudioLiveTickerMarquee() {
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative z-10 w-full border-b border-[#DCD6C8] bg-[#141413] text-[#F6F4EE] overflow-hidden py-3">
      <div className="animate-marquee-left items-center gap-4">
        {repeated.map((item, idx) => (
          <div
            key={`${item.tag}-${idx}`}
            className="flex shrink-0 items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 font-mono text-[11px]"
          >
            <span className="rounded bg-[#D94E28] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
              {item.tag}
            </span>
            <span className="text-[#F6F4EE] font-medium">{item.text}</span>
            <span className="text-[#4ADE80] font-semibold">· {item.metric}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Reusable 3D perspective mouse-tilt wrapper inspired by Aceternity UI 3D Card Effect.
 */
export function Interactive3DCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * 6).toFixed(2)),
      ry: Number((nx * 7).toFixed(2)),
    });
  }

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0 })}
      className={`scene-3d-stage h-full ${className}`}
    >
      <div
        className="preserve-3d h-full transition-transform duration-150 ease-out"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Multi-node animated SVG beam diagram inspired by Magic UI AnimatedBeam.
 */
export function AnimatedBeamIntegrationHub() {
  const intakeSources = [
    { y: 36, label: 'WhatsApp Bio' },
    { y: 92, label: 'Instagram Link' },
    { y: 148, label: 'Mobile QR Pass' },
    { y: 204, label: 'Email Signature' },
  ];
  const downstreamTargets = [
    { y: 36, label: '2-Way Google FreeBusy', tone: '#15803D' },
    { y: 92, label: 'Auto Meet / Jitsi Video', tone: '#D94E28' },
    { y: 148, label: '128-Bit Client Passbook', tone: '#141413' },
    { y: 204, label: 'Atomic Hour & Notes Vault', tone: '#15803D' },
  ];

  return (
    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/90 p-3.5 sm:p-4 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#DCD6C8]">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
          REAL-TIME VECTOR BEAM TOPOLOGY
        </span>
        <span className="font-mono text-[10px] font-semibold text-[#15803D]">
          4 INTAKES → 1 CORE → ZERO ADMIN
        </span>
      </div>

      <svg
        viewBox="0 0 860 248"
        role="img"
        aria-label="Real-Time Vector Beam Topology Hub"
        className="w-full h-auto mt-2"
      >
        <defs>
          <linearGradient id="hubBeamLeft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D94E28" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#141413" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="hubBeamRight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#141413" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#15803D" stopOpacity="0.9" />
          </linearGradient>
          {intakeSources.map((src, idx) => (
            <path
              key={`left-def-${idx}`}
              id={`hubInPath-${idx}`}
              d={`M 164 ${src.y} C 265 ${src.y}, 305 124, 385 124`}
            />
          ))}
          {downstreamTargets.map((dst, idx) => (
            <path
              key={`right-def-${idx}`}
              id={`hubOutPath-${idx}`}
              d={`M 475 124 C 555 124, 595 ${dst.y}, 680 ${dst.y}`}
            />
          ))}
        </defs>

        {intakeSources.map((src, idx) => (
          <g key={`src-${idx}`}>
            <rect
              x="12"
              y={src.y - 16}
              width="152"
              height="32"
              rx="8"
              fill="#FFFFFF"
              stroke="#CEC7B6"
            />
            <text
              x="88"
              y={src.y + 4}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="600"
              fontFamily="monospace"
              fill="#141413"
            >
              {src.label}
            </text>
            <use href={`#hubInPath-${idx}`} fill="none" stroke="#E2DCCE" strokeWidth="2.5" />
            <use
              href={`#hubInPath-${idx}`}
              fill="none"
              stroke="url(#hubBeamLeft)"
              strokeWidth="2"
              className="animate-vector-dash"
            />
            <circle r="3.5" fill="#D94E28">
              <animateMotion dur={`${3 + idx * 0.4}s`} repeatCount="indefinite">
                <mpath href={`#hubInPath-${idx}`} />
              </animateMotion>
            </circle>
          </g>
        ))}

        {/* Center SlotLink Core Prism */}
        <g>
          <circle
            cx="430"
            cy="124"
            r="52"
            fill="rgba(217, 78, 40, 0.08)"
            stroke="#D94E28"
            strokeWidth="1.2"
            strokeDasharray="4 4"
          />
          <rect
            x="385"
            y="90"
            width="90"
            height="68"
            rx="14"
            fill="#141413"
            stroke="#D94E28"
            strokeWidth="2"
          />
          <text
            x="430"
            y="120"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fontFamily="monospace"
            fill="#F6F4EE"
          >
            SLOTLINK
          </text>
          <text
            x="430"
            y="138"
            textAnchor="middle"
            fontSize="9"
            fontFamily="monospace"
            fill="#4ADE80"
          >
            1-LINK CORE
          </text>
        </g>

        {downstreamTargets.map((dst, idx) => (
          <g key={`dst-${idx}`}>
            <use href={`#hubOutPath-${idx}`} fill="none" stroke="#E2DCCE" strokeWidth="2.5" />
            <use
              href={`#hubOutPath-${idx}`}
              fill="none"
              stroke="url(#hubBeamRight)"
              strokeWidth="2"
              className="animate-vector-dash"
            />
            <circle r="3.5" fill={dst.tone}>
              <animateMotion dur={`${2.7 + idx * 0.35}s`} begin="0.4s" repeatCount="indefinite">
                <mpath href={`#hubOutPath-${idx}`} />
              </animateMotion>
            </circle>
            <rect
              x="680"
              y={dst.y - 16}
              width="168"
              height="32"
              rx="8"
              fill="#FFFFFF"
              stroke={dst.tone}
              strokeWidth="1.4"
            />
            <text
              x="764"
              y={dst.y + 4}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fontFamily="monospace"
              fill={dst.tone}
            >
              {dst.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/**
 * Asymmetric animated Bento Grid combining a 3D Isometric Turntable Workbench, Vector Radar,
 * Interactive 3D Magic Passbook, and Live Animated Beam Hub.
 */
export function AnimatedArchitectureBentoGrid() {
  const [orbitDeg, setOrbitDeg] = useState(-16);
  const [explodePct, setExplodePct] = useState(55);
  const [scrollPitchDeg, setScrollPitchDeg] = useState(14);
  const [radarConflictBlocked, setRadarConflictBlocked] = useState(true);
  const [passbookHours, setPassbookHours] = useState<5 | 3 | 1>(3);

  useEffect(() => {
    let rafId = 0;
    const updatePitch = () => {
      rafId = 0;
      const doc = document.documentElement;
      const ratio = Math.min(
        1,
        Math.max(0, (window.scrollY || 0) / Math.max(1, doc.scrollHeight - window.innerHeight))
      );
      setScrollPitchDeg(14 - ratio * 10);
    };
    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(updatePitch);
    };
    updatePitch();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const zStep = (explodePct / 100) * 42;

  function cyclePassbookHours() {
    setPassbookHours((curr) => (curr === 5 ? 3 : curr === 3 ? 1 : 5));
  }

  return (
    <section
      id="features"
      className="relative z-10 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 viewport-section"
    >
      <div className="viewport-container space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
              02 // Spatial Bento Architecture
            </div>
            <h2 className="mt-2 text-fluid-h2 font-semibold tracking-tight text-[#141413]">
              Every scheduling primitive{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                interactive in 3D space.
              </span>
            </h2>
          </div>
          <Link
            href="/login?mode=signup"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
          >
            Launch Your Studio Free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 12-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Bento Card 1 (col-span-7): Interactive 360° 3D Isometric Turntable */}
          <div className="lg:col-span-7 surface-card rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                  <Orbit className="h-3.5 w-3.5" />
                  3D ISOMETRIC ENGINE WORKBENCH
                </div>
                <h3 className="mt-1 font-serif text-2xl text-[#141413]">
                  Inspect all 4 transactional stack planes
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full sm:w-auto sm:min-w-[290px]">
                <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-2">
                  <div className="flex justify-between font-mono text-[10px] font-semibold mb-1">
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
                <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-2">
                  <div className="flex justify-between font-mono text-[10px] font-semibold mb-1">
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
            </div>

            <div className="scene-3d-stage min-h-[340px] flex items-center justify-center rounded-xl border border-[#DCD6C8] bg-[#EFECE4]/60 bg-grid-pattern p-5 overflow-hidden">
              <div
                className="relative preserve-3d w-full max-w-[460px] h-[250px] transition-transform duration-150 ease-out"
                style={{
                  transform: `rotateX(${scrollPitchDeg.toFixed(1)}deg) rotateY(${orbitDeg}deg)`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl border-2 border-[#CEC7B6] bg-white p-4 shadow-sm flex flex-col justify-between"
                  style={{ transform: 'translateZ(0px)' }}
                >
                  <div className="flex justify-between font-mono text-[10px] font-semibold text-[#575248]">
                    <span>PLANE 01 // POSTGRESQL ACID ENGINE</span>
                    <span className="text-[#15803D]">LOCKED</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[10px]">
                    <span className="rounded border border-[#BBF7D0] bg-[#DCFCE7] px-2 py-1 text-[#15803D]">
                      09:00 OPEN
                    </span>
                    <span className="rounded border border-[#E5C6BE] bg-[#FDF2EF] px-2 py-1 text-[#9F2D12]">
                      14:00 BUSY
                    </span>
                    <span className="rounded border border-[#141413] bg-[#F6F4EE] px-2 py-1 text-[#141413]">
                      15:00 TX SYNC
                    </span>
                  </div>
                </div>

                <div
                  className="absolute inset-x-3 top-4 bottom-4 rounded-2xl border border-[#15803D] bg-white/95 p-4 shadow-md flex flex-col justify-between"
                  style={{ transform: `translateZ(${(zStep * 1.1).toFixed(1)}px)` }}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-[#15803D]">
                    <span className="inline-flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      PLANE 02 // 2-WAY FREEBUSY + VIDEO ROOM
                    </span>
                    <Video className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-1.5 font-mono text-[10px]">
                    meet.jit.si/slotlink-sarah-9f4a
                  </div>
                </div>

                <div
                  className="surface-ink absolute inset-x-6 top-8 bottom-8 rounded-2xl p-4 shadow-xl flex flex-col justify-between"
                  style={{ transform: `translateZ(${(zStep * 2.2).toFixed(1)}px)` }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[#4ADE80]">
                      PLANE 03 // CRYPTOGRAPHIC PASSBOOK
                    </span>
                    <Clock className="h-3.5 w-3.5 text-[#F3B09A]" />
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <span
                        key={idx}
                        className={`h-1.5 rounded-sm ${idx < 3 ? 'bg-[#4ADE80]' : 'bg-white/20'}`}
                      />
                    ))}
                  </div>
                </div>

                <div
                  className="absolute inset-x-10 top-12 bottom-12 rounded-2xl border-2 border-[#D94E28] bg-white/95 p-3.5 shadow-2xl flex flex-col justify-between"
                  style={{ transform: `translateZ(${(zStep * 3.3).toFixed(1)}px)` }}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] font-semibold text-[#D94E28]">
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" />
                      PLANE 04 // STUDIO NOTES &amp; LEDGER
                    </span>
                    <FileText className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-[#141413]">
                    <span>SAT Module 2 Sheet</span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[#15803D]">
                      <Check className="h-3 w-3" />
                      Synced
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2 (col-span-5): Animated Vector Radar & Calendar Conflict Guard */}
          <div className="lg:col-span-5 surface-card rounded-2xl p-6 flex flex-col justify-between space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                  2-WAY CALENDAR RADAR
                </span>
                <h3 className="mt-1 font-serif text-2xl text-[#141413]">
                  Blocks personal conflicts automatically
                </h3>
              </div>

              <svg viewBox="0 0 64 64" className="h-14 w-14 shrink-0">
                <circle cx="32" cy="32" r="28" fill="#F6F4EE" stroke="#DCD6C8" strokeWidth="1.2" />
                <circle cx="32" cy="32" r="18" fill="none" stroke="#15803D" strokeWidth="1" strokeDasharray="3 3" />
                <g className="animate-radar-sweep">
                  <path d="M 32 32 L 32 6 A 26 26 0 0 1 56 26 Z" fill="rgba(21, 128, 61, 0.18)" />
                  <line x1="32" y1="32" x2="32" y2="6" stroke="#15803D" strokeWidth="1.5" />
                </g>
                <circle cx="32" cy="32" r="3" fill="#141413" />
              </svg>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div
                className={`flex items-center justify-between rounded-xl border px-3.5 py-2.5 transition ${
                  radarConflictBlocked
                    ? 'border-[#E5C6BE] bg-[#FDF2EF] text-[#9F2D12]'
                    : 'border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]'
                }`}
              >
                <span>2:00 PM · Dentist Appointment</span>
                <span className="font-semibold">
                  {radarConflictBlocked ? 'BLOCKED' : 'OPEN ✓'}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-3.5 py-2.5 text-[#15803D]">
                <span>3:00 PM · SAT Math Studio</span>
                <span className="font-semibold">OPEN ✓</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EFECE4]">
              <button
                type="button"
                onClick={() => setRadarConflictBlocked((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-[#F6F4EE] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#141413] hover:border-[#141413] transition cursor-pointer"
              >
                <RotateCcw className="h-3 w-3 text-[#D94E28]" />
                {radarConflictBlocked ? 'Clear 2:00 PM Busy Event' : 'Simulate Personal Event'}
              </button>
              <Link
                href="/sarah-math"
                className="font-mono text-[11px] font-semibold text-[#D94E28] hover:underline"
              >
                Check Live Slots →
              </Link>
            </div>
          </div>

          {/* Bento Card 3 (col-span-5): Interactive 3D Magic Passbook Card */}
          <Interactive3DCard className="lg:col-span-5">
            <div className="surface-ink rounded-2xl p-6 h-full flex flex-col justify-between space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#4ADE80]">
                  3D CLIENT PASSBOOK
                </span>
                <button
                  type="button"
                  onClick={cyclePassbookHours}
                  className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold text-[#F6F4EE] hover:bg-white/20 transition cursor-pointer"
                >
                  Tap to Cycle Hours ({passbookHours}/5)
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-3xl text-[#F6F4EE]">
                  Zero-login student hour packs
                </h3>
                <div className="rounded-xl border border-white/15 bg-white/[0.06] p-4 space-y-2.5">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-[#C8C2B6]">Remaining Balance</span>
                    <span
                      className={`font-semibold ${
                        passbookHours <= 1 ? 'text-[#FBBF24]' : 'text-[#4ADE80]'
                      }`}
                    >
                      {passbookHours} of 5 hrs {passbookHours <= 1 ? '· Low Balance' : 'left'}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <span
                        key={idx}
                        className={`h-2 rounded-sm transition-all ${
                          idx < passbookHours
                            ? passbookHours <= 1
                              ? 'bg-[#FBBF24]'
                              : 'bg-[#4ADE80]'
                            : 'bg-white/15'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <span className="text-[#B6B0A4]">Includes 24h reschedule &amp; .ics downloads</span>
                <Link
                  href="/p/sl_demo_alex_94a2k"
                  className="inline-flex items-center gap-1 font-mono font-semibold text-[#4ADE80] hover:underline"
                >
                  Open Portal
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Interactive3DCard>

          {/* Bento Card 4 (col-span-7): Live Multi-Channel Animated Beam Integration Hub */}
          <div className="lg:col-span-7 surface-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                  OMNICHANNEL BOOKING BEAMS
                </span>
                <h3 className="mt-0.5 font-serif text-2xl text-[#141413]">
                  One slug turns DMs &amp; QR scans into booked revenue
                </h3>
              </div>
              <Link
                href="/sarah-math"
                className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-[#F6F4EE] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#141413] hover:border-[#141413] transition"
              >
                Try /sarah-math
                <ArrowUpRight className="h-3.5 w-3.5 text-[#D94E28]" />
              </Link>
            </div>

            <AnimatedBeamIntegrationHub />
          </div>
        </div>
      </div>
    </section>
  );
}
