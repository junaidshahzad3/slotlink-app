import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { MagicSpotlightCard } from '@/components/MotionPrimitives';

export default function NotFoundPage() {
  return (
    <main className="min-h-[100dvh] bg-[#F6F4EE] bg-editorial-mesh text-[#141413] flex items-center justify-center">
      <div className="viewport-container py-12 flex justify-center">
        <MagicSpotlightCard className="surface-card w-full max-w-xl rounded-2xl p-8 sm:p-10 text-center space-y-5">
          <div className="space-y-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#D94E28]">
              404 · Not Found
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141413]">Page not found</h1>
            <p className="mx-auto max-w-md text-xs sm:text-sm leading-relaxed text-[#575248]">
              Double-check the booking link or ask your teacher to resend your private student page
              link.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#141413] px-5 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to SlotLink
            </Link>
            <Link
              href="/sarah-math"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#CEC7B6] bg-white px-5 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
            >
              See Live Example
              <ArrowUpRight className="h-3.5 w-3.5 text-[#D94E28]" />
            </Link>
          </div>
        </MagicSpotlightCard>
      </div>
    </main>
  );
}
