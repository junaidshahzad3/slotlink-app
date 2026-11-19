'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const TOP_NAV_LINKS = [
  { href: '/#how-it-works', label: 'How It Works', mobileLabel: 'How It Works' },
  { href: '/#calculator', label: 'Savings', mobileLabel: 'Savings' },
  { href: '/#pricing', label: 'Pricing', mobileLabel: 'Pricing' },
  { href: '/#faq', label: 'FAQ', mobileLabel: null },
  { href: '/sarah-math', label: 'Live Example', mobileLabel: 'Live Example' },
];

/**
 * Sticky editorial top bar with passive document scroll progress bar and mobile jump links.
 */
export function AppTopBar({
  badge = 'FOR TUTORS & COACHES',
  rightSlot,
}: {
  badge?: string;
  rightSlot?: React.ReactNode;
}) {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        setScrollPct(0);
        return;
      }
      const next = Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)));
      setScrollPct(next);
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 surface-glass border-b border-[#DCD6C8]">
      <div className="viewport-container flex flex-wrap items-center justify-between gap-3 py-3">
        {/* Brand + Contextual Badge */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#141413] font-mono text-xs font-semibold tracking-tight text-[#F6F4EE] transition group-hover:bg-[#D94E28]">
              SL
            </span>
            <span className="text-base font-semibold tracking-tight text-[#141413]">
              SlotLink
            </span>
          </Link>
          <span className="hidden border-l border-[#DCD6C8] pl-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28] sm:inline">
            {badge}
          </span>
        </div>

        {/* Public Navigation */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-5 text-xs font-semibold text-[#575248]"
        >
          {TOP_NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[#141413] transition">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {rightSlot ?? (
            <>
              <Link
                href="/login"
                className="rounded-lg border border-[#DCD6C8] bg-white px-3.5 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
              >
                Sign In
              </Link>
              <Link
                href="/login?mode=signup"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
              >
                Get Started Free
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Compact Mobile Scroll-Journey Strip */}
      {!rightSlot && (
        <nav
          aria-label="Mobile Quick Jump"
          className="flex md:hidden items-center gap-1.5 overflow-x-auto border-t border-[#DCD6C8]/80 bg-[#F6F4EE]/95 px-4 py-2 font-mono text-[11px] font-semibold text-[#575248]"
        >
          {TOP_NAV_LINKS.filter((item) => item.mobileLabel).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md border border-[#DCD6C8] bg-white px-2.5 py-1 hover:border-[#141413] hover:text-[#141413] transition"
            >
              {item.mobileLabel}
            </Link>
          ))}
        </nav>
      )}

      {/* Document Scroll Progress Rail */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-[#E6E0D2]"
      >
        <div
          className="h-full bg-[#D94E28] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPct}%` }}
        />
      </div>
    </header>
  );
}
