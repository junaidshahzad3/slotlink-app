import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AppTopBar } from '@/components/AppTopBar';
import { BusinessBlueprintClient } from '@/components/BusinessBlueprintClient';

export default function BlueprintPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413]">
      <AppTopBar
        badge="BUSINESS PLAN 2.0"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/sarah-math"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
            >
              Test Live Lead Magnet
              <ArrowUpRight className="h-3.5 w-3.5 text-[#D94E28]" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
            >
              Open Pro Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 space-y-8">
        {/* Editorial Strategic Header */}
        <section className="surface-card rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 bg-grid-pattern">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-[#DCD6C8] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
              SlotLink 2.0 · Founder Strategy &amp; Monetization Architecture
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#141413] leading-[1.08]">
              From a $12 calendar utility to an{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                Autonomous Tutor Revenue Engine.
              </span>
            </h1>
            <p className="text-sm sm:text-base leading-relaxed text-[#575248]">
              Simulate the upgraded 3-stream business model ($15–$59 SaaS tiers + 1.5% 1-tap Parent
              Portal pack renewals + viral study-sheet attribution), compare v1.0 vs. v2.0 unit
              economics, and test every live feature built into this workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 shrink-0 font-mono">
            <div className="rounded-xl border border-[#DCD6C8] bg-white px-4 py-3">
              <div className="text-[10px] uppercase tracking-wider text-[#6E685C]">Target Scale</div>
              <div className="mt-1 font-serif text-2xl text-[#141413]">150 Tutors</div>
              <div className="text-[11px] text-[#15803D] font-semibold">= $10,200 / mo</div>
            </div>
            <div className="rounded-xl border border-[#DCD6C8] bg-white px-4 py-3">
              <div className="text-[10px] uppercase tracking-wider text-[#6E685C]">Launch Outlay</div>
              <div className="mt-1 font-serif text-2xl text-[#141413]">~$35–$55</div>
              <div className="text-[11px] text-[#D94E28] font-semibold">0.25% PSEB Tax</div>
            </div>
          </div>
        </section>

        <BusinessBlueprintClient />
      </main>
    </div>
  );
}
