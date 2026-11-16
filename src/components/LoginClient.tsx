'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarCheck2,
  CheckCircle2,
  KeyRound,
  LayoutDashboard,
  Link2,
  Sparkles,
} from 'lucide-react';
import { AppTopBar } from '@/components/AppTopBar';

const DEMO_TUTOR_EMAIL = 'sarah@slotlink.app';

export function LoginClient({ notice }: { notice?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_TUTOR_EMAIL);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Sign in failed');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  function handleQuickFillDemo() {
    setEmail(DEMO_TUTOR_EMAIL);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-grid-pattern text-[#141413]">
      <AppTopBar
        badge="PRO AUTH"
        rightSlot={
          <Link
            href="/sarah-math"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#DCD6C8] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] hover:bg-[#EFECE4] transition"
          >
            View Live Booking Page
            <ArrowUpRight className="h-3.5 w-3.5 text-[#D94E28]" />
          </Link>
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        <div className="mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5CFC0] bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#575248]">
            <KeyRound className="h-3.5 w-3.5 text-[#D94E28]" />
            Educator Access &amp; Sandbox
          </div>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-[#141413] sm:text-5xl">
            Step into Sarah Chen&rsquo;s <span className="italic text-[#D94E28]">Pro Studio.</span>
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#575248]">
            Sign in with Google Calendar to sync real FreeBusy slots, or launch an instant email
            session with the pre-seeded tutor workspace.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          {/* Left: Auth Card */}
          <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFECE4] pb-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#6E685C]">
                  Session Credentials
                </div>
                <h2 className="mt-0.5 text-lg font-semibold text-[#141413]">Pro Sign In</h2>
              </div>
              <span className="rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#15803D]">
                14-Day Trial Ready
              </span>
            </div>

            {notice === 'google_unconfigured' && (
              <div className="rounded-xl border border-[#FDE68A] bg-[#FEF3C7] p-3.5 text-xs text-[#92400E] leading-relaxed">
                Google Calendar OAuth credentials are not configured in{' '}
                <code className="font-mono font-semibold">.env</code> yet. Use the quick-fill demo
                account (<code className="font-mono font-semibold">{DEMO_TUTOR_EMAIL}</code>) below to
                inspect the full Pro Dashboard immediately.
              </div>
            )}

            <a
              href="/api/integrations/google/connect"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#141413] px-4 py-3 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
            >
              <CalendarCheck2 className="h-4 w-4 text-[#F3B09A]" />
              Continue with Google Calendar
            </a>

            <div className="relative flex items-center py-0.5">
              <div className="flex-grow border-t border-[#DCD6C8]" />
              <span className="mx-3 shrink-0 font-mono text-[10px] uppercase tracking-widest text-[#6E685C]">
                or email session
              </span>
              <div className="flex-grow border-t border-[#DCD6C8]" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <label htmlFor="login-email" className="text-xs font-medium text-[#575248]">
                    Tutor Email
                  </label>
                  <button
                    type="button"
                    onClick={handleQuickFillDemo}
                    className="inline-flex items-center gap-1 rounded-full border border-[#D5CFC0] bg-[#EFECE4] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#141413] hover:border-[#D94E28] hover:text-[#D94E28] transition"
                  >
                    <Sparkles className="h-3 w-3 text-[#D94E28]" />
                    Quick-fill {DEMO_TUTOR_EMAIL}
                  </button>
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="surface-input w-full rounded-lg px-3.5 py-2.5 text-sm"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl border border-[#141413] bg-white px-4 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] disabled:opacity-50 transition"
              >
                {loading ? 'Signing in...' : 'Sign In to Dashboard'}
              </button>
            </form>

            <p className="border-t border-[#EFECE4] pt-4 text-[11px] leading-relaxed text-[#6E685C]">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-[#141413]">
                Terms
              </Link>
              ,{' '}
              <Link href="/privacy" className="underline hover:text-[#141413]">
                Privacy Policy
              </Link>
              , and{' '}
              <Link href="/refund-policy" className="underline hover:text-[#141413]">
                Refund Policy
              </Link>
              .
            </p>
          </section>

          {/* Right: What You Can Test Inside */}
          <aside className="space-y-4">
            <div className="surface-ink rounded-2xl p-6 sm:p-7 space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F3B09A]">
                  Interactive Walkthrough
                </span>
                <span className="rounded-full border border-[#3B3934] bg-[#23221F] px-2.5 py-0.5 font-mono text-[10px] text-[#C8C2B6]">
                  Pre-seeded Data
                </span>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#F6F4EE]">What You Can Test Inside</h2>
                <p className="mt-1 text-xs leading-relaxed text-[#B6B0A4]">
                  Jump across all three surfaces of SlotLink with live PostgreSQL data already
                  loaded for Sarah Chen&rsquo;s SAT Math studio.
                </p>
              </div>

              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="group block rounded-xl border border-[#2F2D29] bg-[#1D1C1A] p-4 hover:border-[#D94E28]/60 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="h-4 w-4 shrink-0 text-[#F3B09A]" />
                      <span className="text-xs font-semibold text-[#F6F4EE]">
                        1. Pro Studio Dashboard
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#9B9589] group-hover:text-[#F3B09A] transition" />
                  </div>
                  <p className="mt-1.5 pl-6.5 text-[11px] leading-relaxed text-[#B6B0A4]">
                    Filter sessions, mark lessons complete with homework URLs, audit student hour
                    balances, and preview live card changes.
                  </p>
                </Link>

                <Link
                  href="/sarah-math"
                  className="group block rounded-xl border border-[#2F2D29] bg-[#1D1C1A] p-4 hover:border-[#D94E28]/60 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Link2 className="h-4 w-4 shrink-0 text-[#F3B09A]" />
                      <span className="text-xs font-semibold text-[#F6F4EE]">
                        2. Public 1-Link Booking
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#9B9589] group-hover:text-[#F3B09A] transition" />
                  </div>
                  <p className="mt-1.5 pl-6.5 text-[11px] leading-relaxed text-[#B6B0A4]">
                    Book a 60-min Trial or 5-Hour SAT Pack, inspect real time-slot availability, or
                    redeem an existing student credit.
                  </p>
                </Link>

                <Link
                  href="/p/sl_demo_alex_94a2k"
                  className="group block rounded-xl border border-[#2F2D29] bg-[#1D1C1A] p-4 hover:border-[#D94E28]/60 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#86EFAC]" />
                      <span className="text-xs font-semibold text-[#F6F4EE]">
                        3. Zero-Login Student Portal
                      </span>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-[#9B9589] group-hover:text-[#86EFAC] transition" />
                  </div>
                  <p className="mt-1.5 pl-6.5 text-[11px] leading-relaxed text-[#B6B0A4]">
                    Open Alex Rivera&rsquo;s passbook (<code className="font-mono">3 hrs left</code>
                    ) to test live rescheduling, Meet join links, and archived study notes.
                  </p>
                </Link>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E685C]">
                  Low-Balance State
                </div>
                <p className="mt-0.5 text-xs font-medium text-[#141413]">
                  Inspect Maya Lin&rsquo;s 1-hour passbook alert
                </p>
              </div>
              <Link
                href="/p/sl_demo_maya_77b1x"
                className="shrink-0 rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-1.5 font-mono text-[11px] font-medium text-[#141413] hover:bg-[#EFECE4] transition"
              >
                Open →
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
