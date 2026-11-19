import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Minus, X } from 'lucide-react';
import { AppTopBar } from '@/components/AppTopBar';
import {
  BlurFade,
  BorderBeam,
  HeroHighlightWord,
  MagicSpotlightCard,
  ShimmerLink,
} from '@/components/MotionPrimitives';
import {
  CommissionSavingsCalculator,
  HeroHandleClaimer,
  HeroInteractiveStage,
} from '@/components/LandingInteractiveHero';
import { LandingFaqAccordion } from '@/components/LandingFaqAccordion';
import { ScrollJourneySection } from '@/components/ScrollJourneySection';
import {
  Interactive3DCard,
  StudioLiveTickerMarquee,
} from '@/components/StudioVectorScene';

const COMPARISON_ROWS = [
  {
    feature: 'Public Booking Page',
    slotlink: 'Book lessons & 5-packs in 3 clicks',
    calendly: 'Time-slot picker only',
    crm: 'Slow multi-page intake forms',
  },
  {
    feature: 'Prepaid Lesson Packs',
    slotlink: 'Tracks remaining hours & deducts in 1 click',
    calendly: 'Manual spreadsheet tracking',
    crm: 'Buried inside billing menus',
  },
  {
    feature: 'Student Experience',
    slotlink: 'Private bookmarked page (no password needed)',
    calendly: 'Plain confirmation email only',
    crm: 'Students must create a password',
  },
  {
    feature: 'Double-Booking Protection',
    slotlink: '2-way Google Calendar sync + video links',
    calendly: 'Basic calendar sync',
    crm: 'Extra add-on feature',
  },
  {
    feature: 'Homework & Study Notes',
    slotlink: 'Attached directly to each lesson card',
    calendly: 'Not included',
    crm: 'Separate email threads',
  },
  {
    feature: 'Platform Fee on Lessons',
    slotlink: '0% (Keep 100% of lesson income)',
    calendly: '0% (Missing hour packs & notes)',
    crm: '15%–25% marketplace cut',
  },
];

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#F6F4EE] text-[#141413]">
      <AppTopBar badge="FOR TUTORS & COACHES" />

      {/* Section 1: Self-Describing Hero */}
      <section className="relative z-10 border-b border-[#DCD6C8] bg-editorial-mesh/95 min-h-[calc(100dvh-4.5rem)] flex items-center">
        <div className="viewport-container py-[clamp(2.5rem,6vh,5rem)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 border border-[#DCD6C8] bg-white px-3 py-1 rounded-md shadow-sm">
                <span className="live-dot h-2 w-2 rounded-full bg-[#15803D]" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#141413]">
                  For Private Tutors, Music Teachers &amp; 1-on-1 Coaches
                </span>
              </div>

              <h1 className="text-fluid-display font-semibold tracking-tight text-[#141413]">
                Booking,{' '}
                <HeroHighlightWord>
                  prepaid lesson packs,
                </HeroHighlightWord>{' '}
                and student pages — in one link.
              </h1>

              <p className="max-w-2xl text-fluid-body text-[#575248]">
                Give students one simple link to book lessons, buy multi-session packs, and open
                their own password-free portal for remaining hours, video calls, and homework
                notes.
              </p>

              <HeroHandleClaimer />

              <div className="flex flex-wrap items-center gap-3">
                <ShimmerLink
                  href="/login?mode=signup"
                  className="rounded-lg px-5 py-3 text-sm font-semibold"
                >
                  Create Your Free Page
                  <ArrowRight className="h-4 w-4" />
                </ShimmerLink>
                <Link
                  href="/sarah-math"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#CEC7B6] bg-white px-5 py-3 text-sm font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                >
                  See a Live Example
                  <ArrowUpRight className="h-4 w-4 text-[#D94E28]" />
                </Link>
              </div>

              {/* Clear 3-Pillar Product Summary */}
              <MagicSpotlightCard className="grid grid-cols-3 divide-x divide-[#DCD6C8] border border-[#DCD6C8] bg-white rounded-xl pt-0.5 shadow-sm">
                <div className="p-3.5 sm:p-4">
                  <div className="font-mono text-sm sm:text-base font-semibold text-[#141413]">
                    1. One Booking Link
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6E685C]">
                    Syncs with Google Calendar
                  </div>
                </div>
                <div className="p-3.5 sm:p-4">
                  <div className="font-mono text-sm sm:text-base font-semibold text-[#141413]">
                    2. Prepaid Hour Packs
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6E685C]">
                    Auto-tracks hours per click
                  </div>
                </div>
                <div className="p-3.5 sm:p-4">
                  <div className="font-mono text-sm sm:text-base font-semibold text-[#141413]">
                    3. No-Login Student Page
                  </div>
                  <div className="mt-0.5 text-[11px] text-[#6E685C]">
                    Video calls &amp; study notes
                  </div>
                </div>
              </MagicSpotlightCard>
            </div>

            {/* Right Interactive Product Stage */}
            <div className="lg:col-span-6">
              <HeroInteractiveStage />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Teaching Disciplines Strip */}
      <StudioLiveTickerMarquee />

      {/* Section 3: How SlotLink Works (4-Step Interactive Walkthrough) */}
      <ScrollJourneySection />

      {/* Section 4: Zero-Commission Savings Calculator */}
      <CommissionSavingsCalculator />

      {/* Section 5: Plain-English Comparison Matrix */}
      <section className="relative z-10 border-b border-[#DCD6C8] bg-white/95 viewport-section min-h-[72dvh]">
        <div className="viewport-container space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                Why Teachers Switch
              </div>
              <h2 className="mt-2 text-fluid-h2 font-semibold tracking-tight text-[#141413]">
                Simpler than{' '}
                <span className="font-serif italic font-normal">
                  calendars, spreadsheets, and heavy CRMs.
                </span>
              </h2>
            </div>
            <span className="font-mono text-xs text-[#6E685C]">
              Built specifically for 1-on-1 teaching
            </span>
          </div>

          <BlurFade>
            <MagicSpotlightCard className="surface-card overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#DCD6C8] bg-[#EFECE4] font-mono text-[11px] uppercase tracking-wider text-[#575248]">
                      <th className="px-5 py-3.5">What You Need</th>
                      <th className="px-5 py-3.5 bg-[#141413] text-[#F6F4EE]">SlotLink</th>
                      <th className="px-5 py-3.5">Basic Calendar Links</th>
                      <th className="px-5 py-3.5">Tutoring Marketplaces</th>
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
            </MagicSpotlightCard>
          </BlurFade>
        </div>
      </section>

      {/* Pricing + FAQ + CTA */}
      <section
        id="pricing"
        className="relative z-10 viewport-container py-[clamp(3.5rem,7vh,6rem)] space-y-16"
      >
        <div>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
                Simple Flat Pricing
              </div>
              <h2 className="mt-2 text-fluid-h2 font-semibold tracking-tight text-[#141413]">
                Try free for 14 days.{' '}
                <span className="font-serif italic font-normal">
                  Keep 100% of lesson revenue.
                </span>
              </h2>
            </div>
            <p className="font-mono text-xs text-[#6E685C]">
              Flat monthly pricing · Zero per-booking commissions
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Solo Tier */}
            <BlurFade delayMs={40}>
              <Interactive3DCard maxTilt={4}>
                <MagicSpotlightCard className="surface-card surface-card-interactive h-full rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold uppercase tracking-widest text-[#6E685C]">
                        Solo
                      </span>
                      <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-2.5 py-0.5 font-mono text-[11px] text-[#575248]">
                        PART-TIME TUTORS
                      </span>
                    </div>
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="font-serif text-5xl text-[#141413]">$12</span>
                      <span className="font-mono text-sm text-[#6E685C]">/mo</span>
                    </div>
                    <p className="mt-2 text-sm text-[#575248]">
                      Everything needed to replace scheduling texts and spreadsheet hour tracking.
                    </p>

                    <ul className="mt-6 space-y-3 border-t border-[#EFECE4] pt-6 text-sm text-[#141413]">
                      {[
                        'Your public booking link (slotlink.app/you)',
                        '2-way Google Calendar & Google Meet sync',
                        'Password-free student pages & prepaid hour packs',
                        'Automatic email confirmations & lesson reminders',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href="/login?mode=signup"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#141413] bg-white px-4 py-3 text-sm font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                  >
                    Start Solo Free Trial
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </MagicSpotlightCard>
              </Interactive3DCard>
            </BlurFade>

            {/* Pro Tier */}
            <BlurFade delayMs={120}>
              <Interactive3DCard maxTilt={4}>
                <MagicSpotlightCard
                  spotlightColor="rgba(217, 78, 40, 0.22)"
                  className="surface-ink h-full rounded-2xl p-7 sm:p-8 flex flex-col justify-between space-y-6"
                >
                  <BorderBeam tone="warm" />
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
                      For full-time teachers who want SMS reminders, custom branding, and unlimited
                      study sheets.
                    </p>

                    <ul className="mt-6 space-y-3 border-t border-white/10 pt-6 text-sm text-[#F6F4EE]">
                      {[
                        'Everything included in Solo',
                        'Custom domain support (book.yourdomain.com)',
                        'SMS lesson reminder options',
                        'Homework PDF & interactive study sheet sharing',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2.5">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <ShimmerLink
                      href="/login?mode=signup"
                      variant="ivory"
                      shimmerColor="rgba(217, 78, 40, 0.24)"
                      className="rounded-xl px-4 py-3 text-sm font-semibold"
                    >
                      Start Pro Free Trial
                      <ArrowRight className="h-4 w-4" />
                    </ShimmerLink>
                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-[#F6F4EE] hover:bg-white/10 transition"
                    >
                      Teacher Sign In
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </MagicSpotlightCard>
              </Interactive3DCard>
            </BlurFade>
          </div>
        </div>

        {/* Section 6: Frequently Asked Questions */}
        <div id="faq" className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start scroll-mt-24">
          <div className="lg:col-span-4 space-y-3">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
              Common Questions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#141413]">
              Everything teachers &amp; parents ask first.
            </h2>
            <p className="text-sm leading-relaxed text-[#575248]">
              How student pages work, how your calendar stays protected, and how lesson hours stay
              up to date automatically.
            </p>
          </div>
          <div className="lg:col-span-8">
            <LandingFaqAccordion />
          </div>
        </div>

        {/* Clean Pre-Footer CTA */}
        <BlurFade>
          <MagicSpotlightCard
            spotlightColor="rgba(74, 222, 128, 0.16)"
            className="surface-ink rounded-2xl p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
          >
            <div className="max-w-xl space-y-2">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#F3B09A]">
                Ready In Under 2 Minutes
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#F6F4EE]">
                Set up your booking page &amp; student portals today.
              </h2>
              <p className="text-sm text-[#C8C2B6]">
                Claim your custom link, connect Google Calendar, and accept your first lesson or
                prepaid pack right away.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <ShimmerLink
                href="/login?mode=signup"
                variant="terracotta"
                className="rounded-xl px-5 py-3 text-sm font-semibold"
              >
                Create Your Free Page
                <ArrowUpRight className="h-4 w-4" />
              </ShimmerLink>
              <Link
                href="/sarah-math"
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-[#F6F4EE] hover:bg-white/10 transition"
              >
                See Live Example
              </Link>
            </div>
          </MagicSpotlightCard>
        </BlurFade>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#DCD6C8] bg-white">
        <div className="viewport-container flex flex-wrap items-center justify-between gap-4 py-6 text-xs text-[#6E685C]">
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-[#141413]">SlotLink</span>
            <span>· © {new Date().getFullYear()} · Built for independent teachers &amp; coaches</span>
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
