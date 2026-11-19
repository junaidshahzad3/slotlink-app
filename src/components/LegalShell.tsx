import Link from 'next/link';
import { AppTopBar } from '@/components/AppTopBar';
import {
  HeroHighlightWord,
  MagicSpotlightCard,
} from '@/components/MotionPrimitives';

export type LegalTab = 'terms' | 'privacy' | 'refund';

export interface LegalSection {
  number: string;
  heading: string;
  body: string;
}

const LEGAL_NAV: { id: LegalTab; label: string; href: string }[] = [
  { id: 'terms', label: 'Terms of Service', href: '/terms' },
  { id: 'privacy', label: 'Privacy Policy', href: '/privacy' },
  { id: 'refund', label: 'Refund Policy', href: '/refund-policy' },
];

/**
 * Shared layout shell for legal policy routes with full-viewport editorial chrome,
 * sticky section index, and spotlight policy ledger.
 */
export function LegalShell({
  activeTab,
  eyebrow,
  title,
  summary,
  sections,
}: {
  activeTab: LegalTab;
  eyebrow: string;
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <div className="relative min-h-screen bg-[#F6F4EE] bg-grid-pattern text-[#141413]">
      <AppTopBar
        badge="LEGAL"
        rightSlot={
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center rounded-lg border border-[#DCD6C8] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] hover:bg-[#EFECE4] transition"
          >
            Teacher Sign In
          </Link>
        }
      />

      <main className="relative z-10 viewport-container min-h-[calc(100dvh-4.5rem)] py-[clamp(2rem,5vh,4rem)] space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DCD6C8] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28] shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D94E28]" />
              {eyebrow}
            </div>
            <h1 className="font-serif text-fluid-h1 tracking-tight text-[#141413]">
              <HeroHighlightWord>{title}</HeroHighlightWord>
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-[#575248]">{summary}</p>
          </div>

          <nav
            aria-label="Legal documents"
            className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1"
          >
            {LEGAL_NAV.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={
                    isActive
                      ? 'rounded-lg bg-[#141413] px-3.5 py-1.5 text-xs font-semibold text-[#F6F4EE] shadow-xs'
                      : 'rounded-lg px-3.5 py-1.5 text-xs font-medium text-[#575248] hover:bg-white/70 hover:text-[#141413] transition'
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Sticky Desktop Section Contents Rail */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-24">
            <MagicSpotlightCard className="surface-card rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EFECE4] pb-3">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6E685C]">
                  Section Contents
                </span>
                <span className="font-mono text-[10px] font-semibold text-[#15803D]">
                  {sections.length} Clauses
                </span>
              </div>

              <ol className="space-y-1.5">
                {sections.map((section) => (
                  <li key={section.number}>
                    <a
                      href={`#clause-${section.number}`}
                      className="flex items-baseline gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-[#575248] hover:bg-[#F6F4EE] hover:text-[#141413] transition"
                    >
                      <span className="font-mono text-[10px] font-semibold text-[#D94E28]">
                        {section.number}
                      </span>
                      <span className="font-medium leading-snug">{section.heading}</span>
                    </a>
                  </li>
                ))}
              </ol>

              <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 font-mono text-[11px] leading-relaxed text-[#575248]">
                Clear, plain-English policies built for independent teachers and students — zero
                hidden terms.
              </div>
            </MagicSpotlightCard>
          </aside>

          {/* Main Policy Ledger Article */}
          <div className="lg:col-span-8">
            <MagicSpotlightCard className="surface-card rounded-2xl p-6 sm:p-10 space-y-8">
              <div className="relative pl-5 sm:pl-7 space-y-7 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-[#DCD6C8]">
                {sections.map((section) => (
                  <section
                    key={section.number}
                    id={`clause-${section.number}`}
                    className="relative scroll-mt-24 space-y-2 border-b border-[#EFECE4] pb-6 last:border-b-0 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute -left-[22px] sm:-left-[30px] top-1.5 h-3 w-3 rounded-full border-2 border-[#D94E28] bg-[#F6F4EE]"
                    />
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <span className="rounded bg-[#EFECE4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        § {section.number}
                      </span>
                      <h2 className="font-serif text-xl sm:text-2xl text-[#141413]">
                        {section.heading}
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-[#575248]">{section.body}</p>
                  </section>
                ))}
              </div>

              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFECE4] pt-5 text-xs text-[#6E685C]">
                <span className="font-mono text-[11px]">SlotLink · For Tutors &amp; Coaches</span>
                <Link
                  href="/sarah-math"
                  className="font-mono font-semibold text-[#D94E28] hover:underline"
                >
                  Explore Live Example →
                </Link>
              </footer>
            </MagicSpotlightCard>
          </div>
        </div>
      </main>
    </div>
  );
}
