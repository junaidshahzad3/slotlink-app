'use client';

import { useState } from 'react';

const CONDUIT_STATIONS = [
  { id: 0, x: 110, y: 110, code: '01', title: 'SHARE YOUR LINK', sub: 'Student picks a time' },
  { id: 1, x: 355, y: 78, code: '02', title: 'SYNC GOOGLE CALENDAR', sub: 'Avoid double bookings' },
  { id: 2, x: 605, y: 142, code: '03', title: 'PRIVATE STUDENT PAGE', sub: 'Hours, calls & notes' },
  { id: 3, x: 850, y: 108, code: '04', title: 'MARK LESSON DONE', sub: 'Auto-deduct 1 hour' },
];

/**
 * Interactive 4-step lesson flow SVG schematic showing how a booking flows from link to completion.
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
          4-STEP LESSON FLOW — CLICK ANY STEP
        </span>
        <span className="font-mono text-[10px] text-[#575248]">
          CURRENT STEP: {CONDUIT_STATIONS[activeStep]?.title ?? CONDUIT_STATIONS[0].title}
        </span>
      </div>

      <svg
        viewBox="0 0 960 220"
        role="img"
        aria-label="4-step lesson booking workflow"
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

        <line x1="30" y1="110" x2="930" y2="110" stroke="#EFECE4" strokeWidth="1" />

        <use
          href="#slotlink-conduit-path"
          fill="none"
          stroke="#DCD6C8"
          strokeWidth="4"
          strokeLinecap="round"
        />

        <use
          href="#slotlink-conduit-path"
          fill="none"
          stroke="url(#conduitGrad)"
          strokeWidth="2.5"
          className="animate-vector-dash"
        />

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

const MARQUEE_ITEMS = [
  { tag: 'MATH & SAT TUTORS', text: 'Single & 5-Lesson Packs', metric: '0% Commission' },
  { tag: 'PIANO & VIOLIN TEACHERS', text: 'Automatic Calendar Sync', metric: 'Google Meet Ready' },
  { tag: 'LANGUAGE & IELTS COACHES', text: 'Private Student Pages', metric: 'No Student Passwords' },
  { tag: 'SCIENCE & AP PREP', text: 'Interactive Study Notes', metric: 'Shared Per Lesson' },
  { tag: 'FITNESS & PERSONAL TRAINERS', text: 'Prepaid Session Tracking', metric: '24h Reschedule Guard' },
  { tag: 'EXECUTIVE & CAREER COACHES', text: 'Zero Booking Fees', metric: 'Calendar Export Included' },
];

/**
 * Full-viewport infinite horizontal marquee showing real-world teaching disciplines and features.
 */
export function StudioLiveTickerMarquee() {
  const repeated = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative z-10 w-full border-b border-[#DCD6C8] bg-[#141413] text-[#F6F4EE] overflow-hidden py-3 marquee-mask">
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
 * Reusable 3D perspective mouse-tilt wrapper for interactive cards.
 */
export function Interactive3DCard({
  children,
  className = '',
  maxTilt = 5,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rx: Number((-ny * maxTilt).toFixed(2)),
      ry: Number((nx * (maxTilt + 1)).toFixed(2)),
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
