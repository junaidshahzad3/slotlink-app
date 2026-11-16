'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Command,
  Copy,
  Search,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  micro?: string;
  match: (p: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Overview', href: '/', match: (p: string) => p === '/' },
  {
    label: '1-Link Booking',
    href: '/sarah-math',
    micro: '1-Link',
    match: (p: string) =>
      p !== '/' &&
      !p.startsWith('/p/') &&
      !p.startsWith('/notes/') &&
      !p.startsWith('/blueprint') &&
      !p.startsWith('/dashboard') &&
      !p.startsWith('/login') &&
      !p.startsWith('/terms') &&
      !p.startsWith('/privacy') &&
      !p.startsWith('/refund-policy'),
  },
  {
    label: 'Student Portal',
    href: '/p/sl_demo_alex_94a2k',
    micro: '3h',
    match: (p: string) => p.startsWith('/p/'),
  },
  {
    label: 'Pro Dashboard',
    href: '/dashboard',
    micro: 'Studio',
    match: (p: string) => p.startsWith('/dashboard'),
  },
  {
    label: 'Business Plan 2.0',
    href: '/blueprint',
    micro: 'Strategy',
    match: (p: string) => p.startsWith('/blueprint'),
  },
  { label: 'Sign In', href: '/login', match: (p: string) => p.startsWith('/login') },
];

const DEMO_PERSONAS = [
  {
    id: 'alex',
    label: 'Alex Rivera · 3 hrs left',
    sublabel: 'Active 5-pack passbook & study notes',
    href: '/p/sl_demo_alex_94a2k',
    pillClass: 'text-[#15803D] bg-[#DCFCE7] border-[#BBF7D0]',
    badge: '3h left',
  },
  {
    id: 'maya',
    label: 'Maya Lin · 1 hr low balance',
    sublabel: 'Low-hour renewal alert & 1-tap pack top-up',
    href: '/p/sl_demo_maya_77b1x',
    pillClass: 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]',
    badge: '1h low',
  },
  {
    id: 'redeem',
    label: 'Redeem Credit on 1-Link',
    sublabel: 'Book with Alex prepaid pack credit',
    href: '/sarah-math?token=sl_demo_alex_94a2k',
    pillClass: 'text-[#D94E28] bg-[#FDF2EF] border-[#E5C6BE]',
    badge: 'Prefilled',
  },
  {
    id: 'study',
    label: 'Interactive Study Packet',
    sublabel: 'Annotated whiteboard & SAT drill',
    href: '/notes/sat-module-2-drill',
    pillClass: 'text-[#141413] bg-[#EFECE4] border-[#D5CFC0]',
    badge: 'Whiteboard',
  },
  {
    id: 'blueprint',
    label: 'Business Plan 2.0 Studio',
    sublabel: '3-stream MRR simulator, GTM & 90-day roadmap',
    href: '/blueprint',
    pillClass: 'text-[#D94E28] bg-[#FDF2EF] border-[#E5C6BE]',
    badge: 'v2.0',
  },
];

interface CommandEntry {
  id: string;
  section: 'Live Surfaces' | 'Quick Actions';
  title: string;
  subtitle: string;
  href?: string;
  copyPath?: string;
  tag: string;
}

const COMMAND_ENTRIES: CommandEntry[] = [
  {
    id: 'surf-home',
    section: 'Live Surfaces',
    title: 'Overview & Studio Landing',
    subtitle: 'Interactive product stage, savings calculator, and pricing',
    href: '/',
    tag: '/',
  },
  {
    id: 'surf-booking',
    section: 'Live Surfaces',
    title: 'Sarah Chen 1-Link Booking',
    subtitle: 'Public booking page with grouped time slots and boarding pass',
    href: '/sarah-math',
    tag: '/sarah-math',
  },
  {
    id: 'surf-redeem',
    section: 'Live Surfaces',
    title: 'Redeem Credit Flow (Alex Prefilled)',
    subtitle: 'Book a slot deducting from Alex Rivera prepaid pack hours',
    href: '/sarah-math?token=sl_demo_alex_94a2k',
    tag: '?token=...',
  },
  {
    id: 'surf-alex',
    section: 'Live Surfaces',
    title: 'Alex Rivera Passbook (3 hrs)',
    subtitle: 'Zero-login student portal with Meet link, reschedule & study vault',
    href: '/p/sl_demo_alex_94a2k',
    tag: '3h pack',
  },
  {
    id: 'surf-maya',
    section: 'Live Surfaces',
    title: 'Maya Lin Passbook (1 hr)',
    subtitle: 'Low-balance renewal state inside zero-login student portal',
    href: '/p/sl_demo_maya_77b1x',
    tag: '1h low',
  },
  {
    id: 'surf-notes',
    section: 'Live Surfaces',
    title: 'Interactive Study Sheet & Drill',
    subtitle: 'Annotated whiteboard SVG diagram, formulas & self-check drill',
    href: '/notes/sat-module-2-drill',
    tag: '/notes/...',
  },
  {
    id: 'surf-blueprint',
    section: 'Live Surfaces',
    title: 'Business Plan 2.0 Studio',
    subtitle: 'Interactive 3-stream MRR simulator, GTM playbook & tax checklist',
    href: '/blueprint',
    tag: '/blueprint',
  },
  {
    id: 'surf-dashboard',
    section: 'Live Surfaces',
    title: 'Pro Studio Dashboard',
    subtitle: '7-day grid, sessions queue, student top-ups & portal settings',
    href: '/dashboard',
    tag: 'PRO OS',
  },
  {
    id: 'surf-login',
    section: 'Live Surfaces',
    title: 'Pro Sign In & Walkthrough',
    subtitle: 'Google Calendar OAuth or 1-click demo educator sign in',
    href: '/login',
    tag: '/login',
  },
  {
    id: 'surf-legal',
    section: 'Live Surfaces',
    title: 'Legal Suite (Terms, Privacy, Refund)',
    subtitle: 'Structured policy documents for Stripe / Paddle readiness',
    href: '/terms',
    tag: '/terms',
  },
  {
    id: 'act-copy-booking',
    section: 'Quick Actions',
    title: 'Copy Public 1-Link URL',
    subtitle: 'Copies full https://.../sarah-math link to clipboard',
    copyPath: '/sarah-math',
    tag: 'Copy Link',
  },
  {
    id: 'act-copy-portal',
    section: 'Quick Actions',
    title: 'Copy Demo Portal URL',
    subtitle: 'Copies full /p/sl_demo_alex_94a2k student magic link',
    copyPath: '/p/sl_demo_alex_94a2k',
    tag: 'Copy Magic',
  },
];

export function AppTopBar({
  badge = 'SOLO EDUCATOR OS',
  rightSlot,
}: {
  badge?: string;
  rightSlot?: React.ReactNode;
}) {
  const pathname = usePathname() ?? '/';
  const router = useRouter();
  const [personaOpen, setPersonaOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPersonaOpen(false);
        setPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setPersonaOpen(false);
        setPaletteOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setPersonaOpen(false);
      }
    }
    if (personaOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [personaOpen]);

  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMAND_ENTRIES;
    return COMMAND_ENTRIES.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
    );
  }, [query]);

  function handleSelectCommand(entry: CommandEntry) {
    if (entry.copyPath) {
      const fullUrl = `${window.location.origin}${entry.copyPath}`;
      navigator.clipboard?.writeText(fullUrl);
      setCopiedId(entry.id);
      setTimeout(() => {
        setCopiedId(null);
        setPaletteOpen(false);
      }, 900);
      return;
    }
    if (entry.href) {
      setPaletteOpen(false);
      setQuery('');
      router.push(entry.href);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6 lg:px-8">
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

          {/* Center Interactive View Switcher Pill Strip */}
          <nav
            aria-label="Workspace Views"
            className="order-3 flex w-full items-center gap-1 overflow-x-auto rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 text-xs font-semibold lg:order-2 lg:w-auto"
          >
            {NAV_ITEMS.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition ${
                    active
                      ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                      : 'text-[#575248] hover:text-[#141413]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.micro && (
                    <span
                      className={`hidden xl:inline rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                        active
                          ? 'bg-white/15 text-[#F6F4EE]'
                          : 'border border-[#D5CFC0] bg-white/80 text-[#6E685C]'
                      }`}
                    >
                      {item.micro}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Slot: Persona Switcher + Command Palette + Page Action */}
          <div className="order-2 flex flex-wrap items-center gap-2 lg:order-3">
            {/* Demo Persona Switcher */}
            <div ref={personaRef} className="relative">
              <button
                type="button"
                onClick={() => setPersonaOpen((v) => !v)}
                aria-expanded={personaOpen}
                aria-label="Switch demo persona"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCD6C8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#141413] hover:bg-[#EFECE4] transition"
              >
                <UserCheck className="h-3.5 w-3.5 text-[#D94E28]" />
                <span className="hidden sm:inline">Demo View</span>
                <ChevronDown className="h-3 w-3 text-[#6E685C]" />
              </button>

              {personaOpen && (
                <div className="surface-card absolute right-0 mt-2 w-72 rounded-xl p-1.5 z-50">
                  <div className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#6E685C]">
                    Switch Demo State
                  </div>
                  <div className="space-y-1">
                    {DEMO_PERSONAS.map((persona) => (
                      <Link
                        key={persona.id}
                        href={persona.href}
                        onClick={() => setPersonaOpen(false)}
                        className="flex items-start justify-between gap-2 rounded-lg px-2.5 py-2 hover:bg-[#F6F4EE] transition"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[#141413] truncate">
                            {persona.label}
                          </div>
                          <div className="text-[11px] text-[#6E685C] truncate">
                            {persona.sublabel}
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold ${persona.pillClass}`}
                        >
                          {persona.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Command Palette Trigger */}
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open Studio Command Palette"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#DCD6C8] bg-white px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#141413] hover:border-[#141413] hover:bg-[#EFECE4] transition"
            >
              <Command className="h-3 w-3 text-[#D94E28]" />
              <span>K</span>
            </button>

            {rightSlot ?? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
              >
                Open Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Studio Command Palette Modal */}
      {paletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Studio Command Palette"
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#141413]/45 px-4 pt-16 sm:pt-24 backdrop-blur-sm"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="surface-card w-full max-w-xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 border-b border-[#EFECE4] px-4 py-3">
              <Search className="h-4 w-4 shrink-0 text-[#D94E28]" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a booking link, student passbook, dashboard, or action..."
                className="w-full bg-transparent text-sm text-[#141413] placeholder-[#8C867A] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="rounded-md border border-[#DCD6C8] bg-[#F6F4EE] p-1 text-[#575248] hover:text-[#141413]"
                aria-label="Close palette"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2 space-y-3">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-[#6E685C]">
                  No studio pages or actions match &ldquo;{query}&rdquo;.
                </div>
              ) : (
                (['Live Surfaces', 'Quick Actions'] as const).map((section) => {
                  const items = filteredCommands.filter((c) => c.section === section);
                  if (items.length === 0) return null;
                  return (
                    <div key={section} className="space-y-1">
                      <div className="px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6E685C]">
                        {section}
                      </div>
                      {items.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectCommand(item)}
                          className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[#EFECE4]/70 transition"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            {item.copyPath ? (
                              copiedId === item.id ? (
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#15803D]" />
                              ) : (
                                <Copy className="mt-0.5 h-4 w-4 shrink-0 text-[#D94E28]" />
                              )
                            ) : (
                              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#575248]" />
                            )}
                            <div className="min-w-0">
                              <div className="text-xs font-semibold text-[#141413]">
                                {copiedId === item.id ? 'Copied to clipboard!' : item.title}
                              </div>
                              <div className="text-[11px] text-[#6E685C] truncate">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5 font-mono text-[10px] font-medium text-[#575248]">
                            {item.tag}
                            {!item.copyPath && <ArrowUpRight className="h-3 w-3" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between border-t border-[#EFECE4] bg-[#F6F4EE] px-4 py-2 font-mono text-[10px] text-[#6E685C]">
              <span>SlotLink Studio Navigator</span>
              <span>ESC to close · ⌘K toggle</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
