'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  CheckCircle2,
  KeyRound,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { AppTopBar } from '@/components/AppTopBar';
import {
  BlurFade,
  HeroHighlightWord,
  MagicSpotlightCard,
  ShimmerButton,
} from '@/components/MotionPrimitives';
import { Interactive3DCard } from '@/components/StudioVectorScene';

const SAMPLE_EDUCATOR_EMAIL = 'sarah@slotlink.app';

const NICHE_PRESETS = [
  { label: 'Piano & Music', tagline: 'Piano & Music Instructor' },
  { label: 'Language & IELTS', tagline: 'Spanish & IELTS Coach' },
  { label: 'Personal Fitness', tagline: 'Personal Fitness Coach' },
  { label: 'STEM & Test Prep', tagline: 'STEM & Test Prep Tutor' },
];

function slugifyHandle(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

export function LoginClient({
  notice,
  initialMode = 'signin',
  initialSlug,
}: {
  notice?: string;
  initialMode?: 'signin' | 'signup';
  initialSlug?: string;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Create Studio state
  const sanitizedInitialSlug = initialSlug ? slugifyHandle(initialSlug) : '';
  const [name, setName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [tagline, setTagline] = useState('');
  const [slug, setSlug] = useState(sanitizedInitialSlug);
  const [slugTouched, setSlugTouched] = useState(Boolean(sanitizedInitialSlug));
  const [singlePriceDollars, setSinglePriceDollars] = useState('60');
  const [packPriceDollars, setPackPriceDollars] = useState('275');
  const [timezone, setTimezone] = useState('America/New_York');
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupLoading, setSignupLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (initialSlug) {
      const clean = slugifyHandle(initialSlug);
      if (clean) {
        setSlug(clean);
        setSlugTouched(true);
      }
    }
  }, [initialSlug]);

  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (detected) setTimezone(detected);
    } catch {}
  }, []);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugifyHandle(value));
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Sign in failed');
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setSignupError(null);
    setSignupLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: signupEmail,
          slug: slugifyHandle(slug),
          tagline,
          timezone,
          singlePriceDollars: Number(singlePriceDollars) || 60,
          packPriceDollars: Number(packPriceDollars) || 275,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          typeof data.error === 'string' ? data.error : 'Could not create your studio'
        );
      }
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : 'Could not create your studio');
    } finally {
      setSignupLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#F6F4EE] bg-editorial-mesh text-[#141413]">
      <AppTopBar
        badge="TEACHER LOGIN"
        rightSlot={
          <Link
            href="/sarah-math"
            className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-[#DCD6C8] bg-white px-3 py-1.5 text-xs font-medium text-[#141413] hover:bg-[#EFECE4] transition"
          >
            See Live Example
            <ArrowUpRight className="h-3.5 w-3.5 text-[#D94E28]" />
          </Link>
        }
      />

      <main className="relative z-10 viewport-container min-h-[calc(100dvh-4.5rem)] flex flex-col justify-center py-[clamp(2rem,5vh,4.5rem)]">
        <div className="mb-8 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5CFC0] bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#575248]">
            {mode === 'signup' ? (
              <UserPlus className="h-3.5 w-3.5 text-[#D94E28]" />
            ) : (
              <KeyRound className="h-3.5 w-3.5 text-[#D94E28]" />
            )}
            For Teachers, Tutors &amp; Coaches
          </div>
          <h1 className="mt-4 font-serif text-fluid-h1 tracking-tight text-[#141413]">
            {mode === 'signup' ? (
              <>
                Create your free{' '}
                <HeroHighlightWord>booking page.</HeroHighlightWord>
              </>
            ) : (
              <>
                Sign in to your{' '}
                <HeroHighlightWord>teacher dashboard.</HeroHighlightWord>
              </>
            )}
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[#575248]">
            {mode === 'signup'
              ? 'Claim your personal booking link, set single lesson and 5-pack prices, and start sharing private no-login pages with your students.'
              : 'Manage upcoming lessons, mark sessions complete to deduct prepaid hours, and share study notes with students.'}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* Left: Auth Card */}
          <BlurFade>
          <MagicSpotlightCard className="surface-card rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Mode Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EFECE4] pb-4">
              <div
                role="tablist"
                aria-label="Studio authentication mode"
                className="inline-flex rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 text-xs font-semibold"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signin'}
                  onClick={() => setMode('signin')}
                  className={`rounded-lg px-3.5 py-1.5 transition ${
                    mode === 'signin'
                      ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                      : 'text-[#575248] hover:text-[#141413]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'signup'}
                  onClick={() => setMode('signup')}
                  className={`rounded-lg px-3.5 py-1.5 transition ${
                    mode === 'signup'
                      ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                      : 'text-[#575248] hover:text-[#141413]'
                  }`}
                >
                  Create Your Studio
                </button>
              </div>
              <span className="rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#15803D]">
                14-Day Free Trial
              </span>
            </div>

            {notice === 'google_unconfigured' && (
              <div className="rounded-xl border border-[#FDE68A] bg-[#FEF3C7] p-3.5 text-xs text-[#92400E] leading-relaxed">
                Google Calendar OAuth credentials are not configured in{' '}
                <code className="font-mono font-semibold">.env</code> yet. You can create a new
                studio in the <strong>Create Your Studio</strong> tab or sign in with your studio
                email below.
              </div>
            )}

            {mode === 'signup' ? (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="mb-1.5 block text-xs font-medium text-[#575248]"
                    >
                      Your Full Name
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      placeholder="David Miller"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="surface-input w-full rounded-lg px-3.5 py-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signup-email"
                      className="mb-1.5 block text-xs font-medium text-[#575248]"
                    >
                      Work Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      required
                      placeholder="david@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="surface-input w-full rounded-lg px-3.5 py-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                    <label
                      htmlFor="signup-tagline"
                      className="text-xs font-medium text-[#575248]"
                    >
                      What Do You Teach or Coach?
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {NICHE_PRESETS.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setTagline(preset.tagline)}
                          className="rounded-md border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5 font-mono text-[10px] font-medium text-[#575248] hover:border-[#141413] hover:text-[#141413] transition"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    id="signup-tagline"
                    type="text"
                    required
                    placeholder="Conservatory Piano Instructor"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="surface-input w-full rounded-lg px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="signup-slug"
                    className="mb-1.5 block text-xs font-medium text-[#575248]"
                  >
                    Your Public 1-Link Handle
                  </label>
                  <div className="flex items-center overflow-hidden rounded-lg border border-[#CEC7B6] bg-[#EFECE4]/50 focus-within:border-[#141413] focus-within:bg-white transition">
                    <span className="border-r border-[#DCD6C8] bg-[#EFECE4] px-3 py-2.5 font-mono text-xs text-[#6E685C]">
                      slotlink.app/
                    </span>
                    <input
                      id="signup-slug"
                      type="text"
                      required
                      pattern="[a-z0-9-]+"
                      placeholder="david-piano"
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true);
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                      }}
                      className="w-full bg-transparent px-3 py-2.5 font-mono text-sm text-[#141413] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="signup-single-price"
                      className="mb-1.5 block text-xs font-medium text-[#575248]"
                    >
                      1-on-1 Session ($ / 60m)
                    </label>
                    <input
                      id="signup-single-price"
                      type="number"
                      min="5"
                      max="1000"
                      required
                      value={singlePriceDollars}
                      onChange={(e) => setSinglePriceDollars(e.target.value)}
                      className="surface-input w-full rounded-lg px-3.5 py-2.5 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="signup-pack-price"
                      className="mb-1.5 block text-xs font-medium text-[#575248]"
                    >
                      5-Session Pack ($)
                    </label>
                    <input
                      id="signup-pack-price"
                      type="number"
                      min="20"
                      max="5000"
                      required
                      value={packPriceDollars}
                      onChange={(e) => setPackPriceDollars(e.target.value)}
                      className="surface-input w-full rounded-lg px-3.5 py-2.5 font-mono text-sm"
                    />
                  </div>
                </div>

                {signupError && (
                  <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
                    {signupError}
                  </p>
                )}

                <ShimmerButton
                  type="submit"
                  disabled={signupLoading}
                  className="w-full rounded-xl bg-[#141413] px-4 py-3 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] disabled:opacity-50"
                >
                  {signupLoading ? 'Creating Your Studio...' : 'Launch Studio & Open Dashboard'}
                  <ArrowRight className="h-4 w-4" />
                </ShimmerButton>
              </form>
            ) : (
              <div className="space-y-5">
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
                    or email sign in
                  </span>
                  <div className="flex-grow border-t border-[#DCD6C8]" />
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                      <label htmlFor="login-email" className="text-xs font-medium text-[#575248]">
                        Studio Email
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginEmail(SAMPLE_EDUCATOR_EMAIL);
                          setLoginError(null);
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-[#D5CFC0] bg-[#EFECE4] px-2.5 py-0.5 font-mono text-[10px] font-medium text-[#141413] hover:border-[#D94E28] hover:text-[#D94E28] transition"
                      >
                        <Sparkles className="h-3 w-3 text-[#D94E28]" />
                        Try demo account ({SAMPLE_EDUCATOR_EMAIL})
                      </button>
                    </div>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="surface-input w-full rounded-lg px-3.5 py-2.5 text-sm"
                    />
                  </div>

                  {loginError && (
                    <p className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
                      {loginError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full rounded-xl border border-[#141413] bg-white px-4 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] disabled:opacity-50 transition"
                  >
                    {loginLoading ? 'Signing in...' : 'Sign In to Dashboard'}
                  </button>
                </form>

                <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3.5 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[#575248]">New to SlotLink?</span>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className="font-mono text-[11px] font-semibold text-[#D94E28] hover:underline"
                  >
                    Create your own studio →
                  </button>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] px-4 py-3 text-xs leading-relaxed text-[#575248]">
              <strong className="font-semibold text-[#141413]">Are you a student or parent?</strong>{' '}
              You do not need an account — just open the booking link or private student page your
              teacher sent you.
            </div>

            <p className="border-t border-[#EFECE4] pt-4 text-[11px] leading-relaxed text-[#6E685C]">
              By continuing, you agree to our{' '}
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
          </MagicSpotlightCard>
          </BlurFade>

          {/* Right: Live Preview of Public Booking Page */}
          <aside className="space-y-4 scene-3d-stage">
            <BlurFade delayMs={80}>
            <Interactive3DCard>
            <MagicSpotlightCard
              spotlightColor="rgba(21, 128, 61, 0.14)"
              className="surface-card surface-card-interactive preserve-3d rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-start justify-between gap-2 border-b border-[#EFECE4] pb-3">
                <div>
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Preview of Your Public Booking Page
                  </span>
                  <p className="mt-0.5 text-[11px] text-[#6E685C]">
                    This is what students see when they open your link.
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5 font-mono text-[10px] text-[#575248]">
                  /{slug || 'your-name'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
                  {(name.trim() || 'Your Studio')
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((n) => n[0]?.toUpperCase() ?? '')
                    .join('') || 'SL'}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-serif text-2xl leading-tight text-[#141413]">
                    {name.trim() || 'David Miller'}
                  </div>
                  <div className="truncate text-xs text-[#6E685C]">
                    {tagline.trim() || 'Private 1-on-1 Tutor & Coach'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-3">
                  <div className="font-mono text-[10px] uppercase text-[#6E685C]">
                    1-on-1 Session
                  </div>
                  <div className="mt-1 font-mono text-base font-semibold text-[#141413]">
                    ${Math.max(5, Number(singlePriceDollars) || 60)}
                  </div>
                  <div className="text-[11px] text-[#575248]">60 min · Single hr</div>
                </div>
                <div className="rounded-xl border-2 border-[#141413] bg-[#EFECE4]/70 p-3">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[10px] uppercase text-[#D94E28] font-semibold">
                      5-Pack
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[#15803D]">
                      ${Math.round((Math.max(20, Number(packPriceDollars) || 275)) / 5)}/hr
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-base font-semibold text-[#141413]">
                    ${Math.max(20, Number(packPriceDollars) || 275)}
                  </div>
                  <div className="text-[11px] text-[#15803D] font-medium">
                    Saves $
                    {Math.max(
                      0,
                      Math.max(5, Number(singlePriceDollars) || 60) * 5 -
                        Math.max(20, Number(packPriceDollars) || 275)
                    )}{' '}
                    vs singles
                  </div>
                </div>
              </div>
            </MagicSpotlightCard>
            </Interactive3DCard>
            </BlurFade>

            <MagicSpotlightCard
              spotlightColor="rgba(74, 222, 128, 0.16)"
              className="surface-ink rounded-2xl p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F3B09A]">
                  Included On Every Studio
                </span>
                <span className="rounded-full border border-[#3B3934] bg-[#23221F] px-2.5 py-0.5 font-mono text-[10px] text-[#4ADE80]">
                  0% Commission
                </span>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#F6F4EE]">
                  Everything built for independent teachers
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-[#B6B0A4]">
                  Works equally well for private tutoring, music lessons, language coaching, and
                  1-on-1 consulting.
                </p>
              </div>

              <ul className="space-y-3 text-xs text-[#E8E3D9]">
                {[
                  'Branded booking page at slotlink.app/you with live timezone detection',
                  'Prepaid 5-session & custom hour packages tracked automatically',
                  'Zero-login client magic links for hours balance, Meet links & notes',
                  '2-way Google Calendar conflict checks & 24h reschedule protection',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#4ADE80]" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </MagicSpotlightCard>

            <MagicSpotlightCard className="surface-card rounded-2xl p-5 flex items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#6E685C]">
                  Live Example Studio
                </div>
                <p className="mt-0.5 text-xs font-medium text-[#141413]">
                  Inspect a working public booking page at /sarah-math
                </p>
              </div>
              <Link
                href="/sarah-math"
                className="shrink-0 rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] px-3 py-1.5 font-mono text-[11px] font-medium text-[#141413] hover:bg-[#EFECE4] transition"
              >
                View →
              </Link>
            </MagicSpotlightCard>
          </aside>
        </div>
      </main>
    </div>
  );
}
