'use client';

import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { MagicSpotlightCard } from '@/components/MotionPrimitives';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-[100dvh] bg-[#F6F4EE] bg-editorial-mesh text-[#141413] flex items-center justify-center">
      <div className="viewport-container py-12 flex justify-center">
        <MagicSpotlightCard
          spotlightColor="rgba(185, 28, 28, 0.14)"
          className="surface-card w-full max-w-xl rounded-2xl p-8 sm:p-10 text-center space-y-5"
        >
          <div className="space-y-2">
            <span className="inline-block rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-0.5 font-mono text-[11px] font-semibold text-[#B91C1C]">
              Error
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141413]">
              Something went wrong
            </h1>
            <p className="mx-auto max-w-md text-xs sm:text-sm leading-relaxed text-[#575248]">
              {error.message || 'An unexpected error occurred while loading this page.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#141413] px-5 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center rounded-xl border border-[#CEC7B6] bg-white px-5 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
            >
              Back to Home
            </Link>
          </div>
        </MagicSpotlightCard>
      </div>
    </main>
  );
}
