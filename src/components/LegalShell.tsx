import Link from 'next/link';
import { AppTopBar } from '@/components/AppTopBar';

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
 * Shared layout shell for legal policy routes with synchronized top navigation and document switcher.
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
    <div className="min-h-screen bg-[#F6F4EE] bg-grid-pattern text-[#141413]">
      <AppTopBar
        badge="LEGAL"
        rightSlot={
          <Link
            href="/login"
            className="hidden sm:inline-flex items-center rounded-lg border border-[#DCD6C8] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] hover:bg-[#EFECE4] transition"
          >
            Pro Sign In
          </Link>
        }
      />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 space-y-6">
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

        <article className="surface-card rounded-2xl p-6 sm:p-10 space-y-8">
          <header className="border-b border-[#EFECE4] pb-6 space-y-3">
            <div className="font-mono text-[11px] uppercase tracking-widest text-[#D94E28]">
              {eyebrow}
            </div>
            <h1 className="font-serif text-4xl tracking-tight text-[#141413] sm:text-5xl">
              {title}
            </h1>
            <p className="text-sm leading-relaxed text-[#575248]">{summary}</p>
          </header>

          <div className="divide-y divide-[#EFECE4]">
            {sections.map((section) => (
              <section
                key={section.number}
                className="py-5 first:pt-0 last:pb-0 grid gap-2 sm:grid-cols-[180px_1fr] sm:gap-6"
              >
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    {section.number}
                  </span>
                  <h2 className="text-sm font-semibold text-[#141413]">{section.heading}</h2>
                </div>
                <p className="text-sm leading-relaxed text-[#575248]">{section.body}</p>
              </section>
            ))}
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EFECE4] pt-5 text-xs text-[#6E685C]">
            <span className="font-mono text-[11px]">SlotLink · Solo Educator OS</span>
            <Link
              href="/sarah-math"
              className="font-medium text-[#D94E28] hover:underline"
            >
              Explore Live Tutor Demo →
            </Link>
          </footer>
        </article>
      </main>
    </div>
  );
}
