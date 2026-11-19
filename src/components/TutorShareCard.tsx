'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, MessageCircle, QrCode } from 'lucide-react';
import { MagicSpotlightCard } from '@/components/MotionPrimitives';

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
  const [showQr, setShowQr] = useState(false);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState('https://slotlink.app');

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = `${origin}/${slug}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(
    `Book a session with ${name}: ${shareUrl}`
  )}`;

  function handleCopyLink() {
    navigator.clipboard?.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <MagicSpotlightCard className="rounded-xl border border-[#DCD6C8] bg-white/90 p-4 space-y-3">
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
              Scan with your phone camera to book or bookmark on mobile.
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
    </MagicSpotlightCard>
  );
}
