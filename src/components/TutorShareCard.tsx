'use client';

import { useEffect, useState } from 'react';
import { BookOpen, Check, Copy, MessageCircle, QrCode } from 'lucide-react';

interface CurriculumTrack {
  id: string;
  label: string;
  milestones: { step: string; detail: string }[];
}

const CURRICULUM_TRACKS: CurriculumTrack[] = [
  {
    id: 'sat',
    label: 'SAT 800 Track',
    milestones: [
      { step: '01 · Baseline Audit', detail: 'Pinpoint Module 1 & Module 2 pacing traps' },
      { step: '02 · Core Systems', detail: 'Vertex shifts, ratios & word-problem templates' },
      { step: '03 · Timed Drills', detail: '2 full adaptive simulations with error logs' },
    ],
  },
  {
    id: 'calc',
    label: 'AP Calc BC',
    milestones: [
      { step: '01 · Limits & Rates', detail: 'Chain rule fluency & related-rates sketches' },
      { step: '02 · FTC Mastery', detail: 'Accumulation integrals & inflection justifications' },
      { step: '03 · Series & FRQs', detail: 'Taylor error bounds & AP scoring phrasing' },
    ],
  },
  {
    id: 'diag',
    label: 'Intro Diagnostic',
    milestones: [
      { step: '01 · 15m Level Check', detail: 'Review recent test score or class syllabus' },
      { step: '02 · Study Blueprint', detail: 'Select 1-on-1 cadence or 5-hour pack roadmap' },
      { step: '03 · Magic Passbook', detail: 'Receive private link for homework & Meet calls' },
    ],
  },
];

// Deterministic 15x15 editorial QR grid pattern with 3 finder squares
const QR_MATRIX: number[][] = [
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0],
  [1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0],
  [1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1],
];

export function TutorShareCard({ slug, name }: { slug: string; name: string }) {
  const [activeTrackId, setActiveTrackId] = useState<string>('sat');
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://slotlink.app');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const activeTrack =
    CURRICULUM_TRACKS.find((t) => t.id === activeTrackId) ?? CURRICULUM_TRACKS[0];
  const shareUrl = `${origin}/${slug}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `Book a tutoring session with ${name} via SlotLink: ${shareUrl}`
  )}`;

  function handleCopyLink() {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="space-y-4">
      {/* Curriculum & Syllabus Explorer */}
      <div className="rounded-xl border border-[#DCD6C8] bg-white/90 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
            <BookOpen className="h-3 w-3" />
            Curriculum Syllabus
          </span>
          <span className="font-mono text-[10px] text-[#6E685C]">3 tracks</span>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#DCD6C8] bg-[#EFECE4] p-0.5 font-mono text-[10px] font-semibold">
          {CURRICULUM_TRACKS.map((track) => (
            <button
              key={track.id}
              type="button"
              onClick={() => setActiveTrackId(track.id)}
              className={`rounded-md px-1.5 py-1 truncate transition ${
                track.id === activeTrackId
                  ? 'bg-[#141413] text-[#F6F4EE]'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              {track.label}
            </button>
          ))}
        </div>

        <ul className="space-y-2 text-xs">
          {activeTrack.milestones.map((m) => (
            <li
              key={m.step}
              className="rounded-lg border border-[#EFECE4] bg-[#F6F4EE]/75 px-3 py-2"
            >
              <div className="font-mono text-[10px] font-semibold text-[#141413]">{m.step}</div>
              <div className="mt-0.5 text-[11px] text-[#575248]">{m.detail}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* Share & QR Calling Card */}
      <div className="rounded-xl border border-[#DCD6C8] bg-white/90 p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#575248]">
            Share Studio Link
          </span>
          <button
            type="button"
            onClick={() => setShowQr((v) => !v)}
            className="inline-flex items-center gap-1 rounded-md border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#141413] hover:border-[#141413] transition"
          >
            <QrCode className="h-3 w-3 text-[#D94E28]" />
            {showQr ? 'Hide QR' : 'QR Pass'}
          </button>
        </div>

        {showQr && (
          <div className="flex items-center gap-3 rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] p-3">
            <svg
              viewBox="0 0 15 15"
              role="img"
              aria-label={`QR Code for ${slug}`}
              className="h-20 w-20 shrink-0 rounded-md border border-[#DCD6C8] bg-white p-1.5"
              shapeRendering="crispEdges"
            >
              {QR_MATRIX.map((row, r) =>
                row.map((cell, c) =>
                  cell === 1 ? (
                    <rect
                      key={`${r}-${c}`}
                      x={c}
                      y={r}
                      width={1}
                      height={1}
                      fill="#141413"
                    />
                  ) : null
                )
              )}
            </svg>
            <div className="min-w-0 space-y-1">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#D94E28]">
                Scan to Book
              </div>
              <div className="truncate font-mono text-[11px] font-semibold text-[#141413]">
                slotlink.app/{slug}
              </div>
              <p className="text-[11px] leading-snug text-[#575248]">
                Print on parent welcome sheets or share via screen cast.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-2 font-mono text-[11px] font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-[#15803D]" />
                Copied ✓
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-[#575248]" />
                Copy Link
              </>
            )}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-2.5 py-2 font-mono text-[11px] font-semibold text-[#15803D] hover:bg-[#DCFCE7] transition"
          >
            <MessageCircle className="h-3 w-3" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
