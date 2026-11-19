'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * Mouse-tracking radial spotlight card inspired by Magic UI MagicCard & Aceternity CardSpotlight.
 */
export function MagicSpotlightCard({
  children,
  className = '',
  tone = 'light',
  spotlightColor,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: 'light' | 'ink';
  spotlightColor?: string;
}) {
  const [spot, setSpot] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpot({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  }

  const resolvedSpotColor =
    spotlightColor ??
    (tone === 'ink' ? 'rgba(74, 222, 128, 0.14)' : 'rgba(217, 78, 40, 0.09)');

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setSpot((prev) => ({ ...prev, active: false }))}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(380px circle at ${spot.x}px ${spot.y}px, ${resolvedSpotColor}, transparent 72%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

/**
 * Animated perimeter luminescent border beam inspired by Magic UI BorderBeam.
 * Parent container must have `relative overflow-hidden`.
 */
export function BorderBeam({
  className = '',
  tone = 'warm',
  durationSec,
}: {
  className?: string;
  tone?: 'warm' | 'emerald' | 'ink';
  durationSec?: number;
}) {
  const gradient =
    tone === 'emerald'
      ? 'conic-gradient(from 0deg, transparent 0deg 260deg, #4ADE80 305deg, #D94E28 340deg, transparent 360deg)'
      : tone === 'ink'
        ? 'conic-gradient(from 0deg, transparent 0deg 260deg, #141413 305deg, #D94E28 340deg, transparent 360deg)'
        : 'conic-gradient(from 0deg, transparent 0deg 260deg, #D94E28 305deg, #F3B09A 340deg, transparent 360deg)';

  return (
    <span
      aria-hidden="true"
      className={`border-beam-ring pointer-events-none absolute inset-0 rounded-[inherit] p-[1.5px] ${className}`}
    >
      <span
        className="border-beam-spinner block h-[220%] w-[220%] -translate-x-1/4 -translate-y-1/4"
        style={{
          background: gradient,
          ...(durationSec ? { animationDuration: `${durationSec}s` } : {}),
        }}
      />
    </span>
  );
}

/**
 * Smooth cubic-eased numerical counter inspired by Magic UI NumberTicker.
 * Starts cleanly at `value` during SSR to guarantee zero hydration mismatch.
 */
export function NumberTicker({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState<number>(value);
  const prevRef = useRef<number>(value);

  useEffect(() => {
    const startVal = prevRef.current;
    const endVal = value;
    if (startVal === endVal) {
      setDisplayValue(endVal);
      return;
    }

    const durationMs = 460;
    const startTime = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = startVal + (endVal - startVal) * eased;
      setDisplayValue(next);
      if (t < 1) {
        rafId = window.requestAnimationFrame(step);
      } else {
        prevRef.current = endVal;
        setDisplayValue(endVal);
      }
    };

    rafId = window.requestAnimationFrame(step);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      prevRef.current = endVal;
    };
  }, [value]);

  const rounded =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('en-US');

  return (
    <span className={`tabular-nums ${className}`} suppressHydrationWarning>
      {prefix}
      {rounded}
      {suffix}
    </span>
  );
}

/**
 * Viewport-aware reveal wrapper inspired by Magic UI BlurFade.
 * Keeps content visible by default for SSR/crawlers while animating smoothly as scrolled into view.
 */
export function BlurFade({
  children,
  delayMs = 0,
  className = '',
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const rect = el.getBoundingClientRect();
    if (rect.top > window.innerHeight * 0.92) {
      setRevealed(false);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        revealed ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-3 blur-[2px]'
      } ${className}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}

/**
 * Editorial dark-ink or terracotta link with continuous diagonal shimmer sweep inspired by Magic UI ShimmerButton.
 */
export function ShimmerLink({
  href,
  children,
  variant = 'ink',
  shimmerColor,
  className = '',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'ink' | 'terracotta' | 'ivory';
  shimmerColor?: string;
  className?: string;
}) {
  const toneClasses =
    variant === 'terracotta'
      ? 'bg-[#D94E28] text-white hover:bg-[#B83E1D]'
      : variant === 'ivory'
        ? 'bg-[#F6F4EE] text-[#141413] hover:bg-white'
        : 'bg-[#141413] text-[#F6F4EE] hover:bg-[#2A2A27]';

  return (
    <Link
      href={href}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden transition ${toneClasses} ${className}`}
    >
      <span
        aria-hidden="true"
        className="shimmer-btn-sheen pointer-events-none absolute inset-0"
        style={
          shimmerColor
            ? {
                backgroundImage: `linear-gradient(110deg, transparent 22%, ${shimmerColor} 50%, transparent 78%)`,
              }
            : undefined
        }
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </Link>
  );
}

/**
 * Editorial button with diagonal light sheen inspired by Magic UI ShimmerButton.
 */
export function ShimmerButton({
  children,
  variant = 'ink',
  shimmerColor,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'ink' | 'terracotta';
  shimmerColor?: string;
}) {
  const toneClasses =
    variant === 'terracotta'
      ? 'bg-[#D94E28] text-white hover:bg-[#B83E1D]'
      : 'bg-[#141413] text-[#F6F4EE] hover:bg-[#2A2A27]';

  return (
    <button
      {...props}
      className={`relative inline-flex items-center justify-center gap-2 overflow-hidden transition cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${toneClasses} ${className}`}
    >
      <span
        aria-hidden="true"
        className="shimmer-btn-sheen pointer-events-none absolute inset-0"
        style={
          shimmerColor
            ? {
                backgroundImage: `linear-gradient(110deg, transparent 22%, ${shimmerColor} 50%, transparent 78%)`,
              }
            : undefined
        }
      />
      <span className="relative z-10 inline-flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}

/**
 * Editorial serif highlight phrase with animated brush underline inspired by Aceternity UI HeroHighlight.
 */
export function HeroHighlightWord({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`relative inline-block font-serif italic font-normal text-[#D94E28] ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="hero-highlight-underline absolute left-0 right-0 bottom-[0.06em] h-[0.14em] rounded-full bg-[#D94E28]/25"
      />
    </span>
  );
}
