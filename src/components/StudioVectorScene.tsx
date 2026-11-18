'use client';

import { useEffect, useState } from 'react';
import { CalendarCheck2, ShieldCheck, Sparkles, Video } from 'lucide-react';

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
