'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Clean public marketing header used strictly on SlotLink marketing, auth, and legal pages.
 * Client-facing tutor booking (/[slug]) and student passbook (/p/[token]) routes use dedicated white-label headers.
 */
export function AppTopBar({
  badge = 'SOLO EDUCATOR OS',
  rightSlot,
}: {
  badge?: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
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
          className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#575248]"
        >
          <Link href="/#features" className="hover:text-[#141413] transition">
            How It Works
          </Link>
          <Link href="/#pricing" className="hover:text-[#141413] transition">
            Pricing
          </Link>
          <Link href="/sarah-math" className="hover:text-[#141413] transition">
            Sample Studio
          </Link>
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
                Create Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
