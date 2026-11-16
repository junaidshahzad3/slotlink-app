'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center text-[#141413]">
      <div className="surface-card rounded-2xl p-8 space-y-4">
        <span className="inline-block rounded-full border border-[#FECACA] bg-[#FEF2F2] px-3 py-0.5 font-mono text-[11px] font-semibold text-[#B91C1C]">
          ERROR
        </span>
        <h1 className="font-serif text-3xl text-[#141413]">Something went wrong</h1>
        <p className="text-xs text-[#575248]">{error.message || 'Unexpected application error.'}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-[#141413] px-4 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-[#CEC7B6] bg-white px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
