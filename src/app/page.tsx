import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, FileText, Minus, X } from 'lucide-react';
import { AppTopBar } from '@/components/AppTopBar';
import {
  CommissionSavingsCalculator,
  HeroInteractiveStage,
} from '@/components/LandingInteractiveHero';
import { LandingFaqAccordion } from '@/components/LandingFaqAccordion';

const COMPARISON_ROWS = [
  {
    feature: 'Public 1-Link Booking UX',
    slotlink: '3-tap editorial flow + live slots',
    calendly: 'Generic slot picker only',
    crm: 'Slow multi-page intake forms',
  },
  {
    feature: 'Prepaid Hour Pack Ledger',
    slotlink: 'Auto-tracks & 1-tap deduction',
    calendly: 'Manual spreadsheet tracking',
    crm: 'Hidden inside billing menus',
  },
  {
    feature: 'Student Access Friction',
    slotlink: 'Zero-login 128-bit magic passbook',
    calendly: 'Static confirmation email only',
    crm: 'Username + password required',
  },
  {
    feature: 'Calendar Conflict Guard',
    slotlink: '2-way Google FreeBusy + Meet',
    calendly: 'Basic calendar sync',
    crm: 'Add-on integration tier',
  },
  {
    feature: 'Homework & Study Notes',
    slotlink: 'Built-in study vault per session',
    calendly: 'Not included',
    crm: 'Buried in client Portal tabs',
  },
  {
    feature: 'Commission on Lessons',
    slotlink: '0% (Keep 100% revenue)',
    calendly: '0% + missing tutoring flow',
    crm: '15%–25% marketplace cuts',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413]">
      <AppTopBar badge="SOLO EDUCATOR OS" />

      {/* Editorial Split Hero */}
      <section className="relative border-b border-[#DCD6C8] bg-grid-pattern">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 border border-[#DCD6C8] bg-white px-3 py-1 rounded-md shadow-sm">
                <span className="live-dot h-2 w-2 rounded-full bg-[#15803D]" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#141413]">
                  01 // Zero-Bloat Scheduling &amp; Pack Ledger
                </span>
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-[#141413] sm:text-5xl lg:text-[56px] leading-[1.06]">
                One link for bookings,{' '}
                <span className="font-serif italic font-normal text-[#D94E28]">
                  prepaid packs,
                </span>{' '}
                and client portals.
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-[#575248]">
                Replace heavy CRM suites with a crisp booking studio. Students and parents book in
                three taps and track remaining package hours, Meet links, and homework notes on a
                private zero-login link.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/login?mode=signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#141413] px-5 py-3 text-sm font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
                >
                  Create Your Studio Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sarah-math"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#CEC7B6] bg-white px-5 py-3 text-sm font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                >
                  View Sample Booking Page
                  <ArrowUpRight className="h-4 w-4 text-[#D94E28]" />
                </Link>
              </div>

              {/* Architectural Proof Strip */}
              <div className="grid grid-cols-3 divide-x divide-[#DCD6C8] border border-[#DCD6C8] bg-white rounded-xl pt-0.5 shadow-sm">
                <div className="p-3.5 sm:p-4">
                  <div className="font-mono text-base sm:text-lg font-semibold text-[#141413]">
                    0 Passwords
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6E685C]">
                    128-bit student magic links
                  </div>
                </div>
                <div className="p-3.5 sm:p-4">
                  <div className="font-mono text-base sm:text-lg font-semibold text-[#141413]">
                    2-Way FreeBusy
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6E685C]">
                    Live Google Calendar guard
                  </div>
                </div>
                <div className="p-3.5 sm:p-4">
                  <div className="font-mono text-base sm:text-lg font-semibold text-[#141413]">
                    Auto Pack Ledger
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6E685C]">
                    1-tap hour deduction
                  </div>
                </div>
              </div>
            </div>

            {/* Right Multi-Layer Interactive Product Stage */}
            <div className="lg:col-span-6">
              <HeroInteractiveStage />
            </div>
          </div>
        </div>
      </section>

      {/* Architectural 3-Step Workflow Ledger */}
      <section id="features" className="border-b border-[#DCD6C8] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Step 01 */}
            <div className="surface-card surface-card-interactive rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Step 01 / Share One Slug
                  </span>
                  <Link
                    href="/sarah-math"
                    className="font-mono text-[11px] font-semibold text-[#141413] hover:text-[#D94E28]"
                  >
                    Try Step Live →
                  </Link>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-[#141413]">
                  Your public booking studio in one clean URL
                </h2>
                <p className="text-sm leading-relaxed text-[#575248]">
                  Drop a single link in your WhatsApp bio or email signature. Students pick a single
                  lesson or prepaid pack without ever creating an account.
                </p>
              </div>
              <div className="surface-elevated rounded-xl p-3.5 space-y-2.5">
                <div className="rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 font-mono text-xs text-[#141413]">
                  slotlink.app/<span className="font-semibold text-[#D94E28]">sarah-math</span>
                </div>
                <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                  <span className="rounded-md border border-[#CEC7B6] bg-white px-2 py-0.5 text-[#141413]">
                    15m Intro
                  </span>
                  <span className="rounded-md border border-[#CEC7B6] bg-white px-2 py-0.5 text-[#141413]">
                    1h Session
                  </span>
                  <span className="rounded-md bg-[#141413] px-2 py-0.5 text-[#F6F4EE]">
                    5-Pack
                  </span>
                </div>
              </div>
            </div>

            {/* Step 02 */}
            <div className="surface-card surface-card-interactive rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Step 02 / Conflict Guard
                  </span>
                  <Link
                    href="/dashboard"
                    className="font-mono text-[11px] font-semibold text-[#141413] hover:text-[#D94E28]"
                  >
                    Try Step Live →
                  </Link>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-[#141413]">
                  Real-time 2-way Google Calendar sync
                </h2>
                <p className="text-sm leading-relaxed text-[#575248]">
                  FreeBusy queries block personal appointments automatically and attach unique Google
                  Meet links the moment a slot is confirmed.
                </p>
              </div>
              <div className="surface-elevated rounded-xl p-3.5 space-y-2 font-mono text-[11px]">
                <div className="flex items-center justify-between rounded-lg border border-[#E5C6BE] bg-[#FDF2EF] px-3 py-2 text-[#9F2D12]">
                  <span>2:00 PM — Personal Busy</span>
                  <span className="font-semibold">BLOCKED</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-2 text-[#15803D]">
                  <span>3:00 PM — Available Slot</span>
                  <span className="font-semibold">OPEN ✓</span>
                </div>
              </div>
            </div>

            {/* Step 03 */}
            <div className="surface-card surface-card-interactive rounded-2xl p-6 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Step 03 / Magic Passbook
                  </span>
                  <Link
                    href="/p/sl_demo_alex_94a2k"
                    className="font-mono text-[11px] font-semibold text-[#141413] hover:text-[#D94E28]"
                  >
                    Try Step Live →
                  </Link>
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-[#141413]">
                  Automated pack hours &amp; homework ledger
                </h2>
                <p className="text-sm leading-relaxed text-[#575248]">
                  Mark a lesson complete on your dashboard to deduct one hour, log takeaways, and
                  publish homework files straight to the student&apos;s magic link.
                </p>
              </div>
              <div className="surface-elevated rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-[#CEC7B6] bg-white px-3 py-2 font-mono text-[11px] text-[#141413]">
                  <span>5-Pack Ledger</span>
                  <span className="font-semibold text-[#15803D]">4 hrs → 3 hrs left</span>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-md border border-[#CEC7B6] bg-white px-2.5 py-1 font-mono text-[11px] text-[#575248]">
                  <FileText className="h-3 w-3 text-[#D94E28]" />
                  Practice_Test_4_Notes.pdf
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Economics Calculator */}
      <CommissionSavingsCalculator />

      {/* Architectural Comparison Matrix */}
      <section className="border-b border-[#DCD6C8] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                Architectural Comparison
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
                Why educators leave{' '}
                <span className="font-serif italic font-normal">
                  calendars and heavy CRMs behind.
                </span>
              </h2>
            </div>
            <span className="font-mono text-xs text-[#6E685C]">Built strictly for 1-on-1 workflows</span>
          </div>

          <div className="surface-card overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCD6C8] bg-[#EFECE4] font-mono text-[11px] uppercase tracking-wider text-[#575248]">
                    <th className="px-5 py-3.5">Capability</th>
                    <th className="px-5 py-3.5 bg-[#141413] text-[#F6F4EE]">SlotLink Studio</th>
                    <th className="px-5 py-3.5">Generic Calendar Links</th>
                    <th className="px-5 py-3.5">Legacy Tutoring CRMs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4]">
                  {COMPARISON_ROWS.map((row) => (
                    <tr key={row.feature} className="hover:bg-[#F6F4EE]/55 transition">
                      <td className="px-5 py-3.5 font-semibold text-[#141413]">{row.feature}</td>
                      <td className="px-5 py-3.5 bg-[#F0FDF4]/60 font-medium text-[#14532D]">
                        <span className="inline-flex items-center gap-1.5">
                          <Check className="h-3.5 w-3.5 shrink-0 text-[#15803D]" />
                          {row.slotlink}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#575248]">
                        <span className="inline-flex items-center gap-1.5">
                          <Minus className="h-3.5 w-3.5 shrink-0 text-[#8C867A]" />
                          {row.calendly}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#575248]">
                        <span className="inline-flex items-center gap-1.5">
                          <X className="h-3.5 w-3.5 shrink-0 text-[#B91C1C]" />
                          {row.crm}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Pricing Ledger */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        <div>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                02 // Transparent Studio Pricing
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#141413]">
                Start free for 14 days.{' '}
                <span className="font-serif italic font-normal">
                  Keep 100% of lesson revenue.
                </span>
              </h2>
            </div>
            <p className="font-mono text-xs text-[#6E685C]">
              Flat monthly plans · Zero per-booking commissions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Solo Tier */}
            <div className="surface-card surface-card-interactive rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#6E685C]">
                    Solo
                  </span>
                  <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-0.5 font-mono text-[11px] text-[#575248]">
                    INDEPENDENT TUTORS
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-serif text-5xl text-[#141413]">$12</span>
                  <span className="font-mono text-sm text-[#6E685C]">/mo</span>
                </div>
                <p className="mt-2 text-sm text-[#575248]">
                  Everything needed to replace back-and-forth scheduling and spreadsheet hour
                  tracking.
                </p>

                <ul className="mt-6 space-y-3 border-t border-[#EFECE4] pt-6 text-sm text-[#141413]">
                  {[
                    '1-Link public booking page (slotlink.app/you)',
                    '2-way Google Calendar & Meet link sync',
                    'Zero-login student magic portal & hour packs',
                    'Automated email confirmations & 24h reminders',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/api/integrations/google/connect"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#141413] bg-white px-4 py-3 text-sm font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
              >
                Start Solo Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="surface-ink rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#A8A295]">
                    Pro
                  </span>
                  <span className="rounded bg-[#D94E28] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                    Most Popular
                  </span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="font-serif text-5xl text-[#F6F4EE]">$19</span>
                  <span className="font-mono text-sm text-[#A8A295]">/mo</span>
                </div>
                <p className="mt-2 text-sm text-[#C8C2B6]">
                  For full-time educators running multi-student cohorts, custom branding, and SMS
                  alerts.
                </p>

                <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-[#F6F4EE]">
                  {[
                    'Everything in Solo',
                    'Custom domain support (book.yourdomain.com)',
                    'Automated SMS reminder preferences',
                    'Homework link & session summary publishing',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Link
                  href="/api/integrations/google/connect"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#F6F4EE] px-4 py-3 text-sm font-semibold text-[#141413] hover:bg-white transition"
                >
                  Start Pro Trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-[#F6F4EE] hover:bg-white/10 transition"
                >
                  Test Pro Dashboard
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Educator Studio Blueprints */}
        <div className="space-y-6 pt-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                03 // Educator Studio Blueprints
              </div>
              <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
                How solo specialists{' '}
                <span className="font-serif italic font-normal">structure packs &amp; notes.</span>
              </h2>
            </div>
            <Link
              href="/notes/sat-module-2-drill"
              className="font-mono text-xs font-semibold text-[#D94E28] hover:underline"
            >
              Inspect Interactive Study Sheet →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                tag: 'STEM · SAT & AP CALCULUS',
                studio: 'SAT & AP Math Studio',
                metric: '5-Hour Pack · $250 ($50/hr)',
                volume: '$6,800 / mo take-home',
                summary:
                  'Combines 15-min diagnostic calls with prepaid 5-hour packs and annotated parabola/calculus study sheets.',
                href: '/sarah-math',
                cta: 'View Tutor Portal →',
              },
              {
                tag: 'MUSIC · VIOLIN & PIANO',
                studio: 'Conservatory Music Coach',
                metric: '4-Lesson Audition Pack · $320',
                volume: '$4,200 / mo take-home',
                summary:
                  'Replaces text-message rescheduling with automatic Google Calendar conflict blocks and practice drill links.',
                href: '/notes/diagnostic-roadmap',
                cta: 'Open Sample Blueprint →',
              },
              {
                tag: 'GRAD PREP · GMAT & LANGUAGE',
                studio: 'Executive GMAT & Fluency Tutor',
                metric: '10-Hour Cohort Pack · $950',
                volume: '$9,500 / mo take-home',
                summary:
                  'Gives busy professionals zero-login magic portals with one-click .ics invites and takeaway archives.',
                href: '/p/sl_demo_alex_94a2k',
                cta: 'Open Magic Portal →',
              },
            ].map((bp) => (
              <div
                key={bp.studio}
                className="surface-card surface-card-interactive rounded-2xl p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    {bp.tag}
                  </div>
                  <h3 className="font-serif text-2xl text-[#141413]">{bp.studio}</h3>
                  <div className="space-y-1 rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3 font-mono text-[11px]">
                    <div className="font-semibold text-[#141413]">{bp.metric}</div>
                    <div className="text-[#15803D]">{bp.volume}</div>
                  </div>
                  <p className="text-xs leading-relaxed text-[#575248]">{bp.summary}</p>
                </div>

                <Link
                  href={bp.href}
                  className="font-mono text-xs font-semibold text-[#141413] hover:text-[#D94E28] transition"
                >
                  {bp.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Architectural FAQ Accordion */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 pt-4">
          <div className="lg:col-span-4 space-y-2">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
              04 // Architecture &amp; FAQ
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#141413]">
              Common questions from{' '}
              <span className="font-serif italic font-normal">independent educators.</span>
            </h2>
            <p className="text-sm leading-relaxed text-[#575248]">
              Everything needed to launch your public 1-link studio and student passbooks cleanly.
            </p>
          </div>
          <div className="lg:col-span-8">
            <LandingFaqAccordion />
          </div>
        </div>

        {/* Carbon-Ink Pre-Footer CTA Banner */}
        <div className="surface-ink rounded-2xl p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#F3B09A]">
              Ready In Under 3 Minutes
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#F6F4EE]">
              Ship your own booking studio &amp; student passbook today.
            </h2>
            <p className="text-sm text-[#C8C2B6]">
              Claim your handle, connect your Google Calendar, and send your first client a private
              magic passbook in under two minutes.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#D94E28] px-5 py-3 text-sm font-semibold text-white hover:bg-[#B83E1D] transition"
            >
              Create Your Studio Free
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sarah-math"
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-[#F6F4EE] hover:bg-white/10 transition"
            >
              View Sample Studio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#DCD6C8] bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-xs text-[#6E685C] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-[#141413]">SlotLink</span>
            <span>· © {new Date().getFullYear()} · Built for independent educators</span>
          </div>
          <div className="flex items-center gap-5 font-medium">
            <Link href="/terms" className="hover:text-[#141413] transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-[#141413] transition">
              Privacy
            </Link>
            <Link href="/refund-policy" className="hover:text-[#141413] transition">
              Refund Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
