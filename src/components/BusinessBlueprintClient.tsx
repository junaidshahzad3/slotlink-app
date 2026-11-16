'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  Layers,
  Rocket,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

type TierKey = 'solo' | 'growth' | 'academy';
type TabKey = 'thesis' | 'moat' | 'gtm' | 'roadmap';

const TIER_CONFIG: Record<
  TierKey,
  { label: string; price: number; tag: string; blurb: string }
> = {
  solo: {
    label: 'Solo Studio',
    price: 15,
    tag: 'STARTER',
    blurb: '1-Link + 60s Diagnostic + up to 10 active packs',
  },
  growth: {
    label: 'Growth Autopilot',
    price: 29,
    tag: 'FLAGSHIP',
    blurb: 'Unlimited packs + Parent ROI Dossier + Renewal Autopilot',
  },
  academy: {
    label: 'Boutique Academy',
    price: 59,
    tag: 'SCALE',
    blurb: 'White-label study sheets + priority SMS + multi-track analytics',
  },
};

const COMPARISON_V1_V2 = [
  {
    dimension: 'Core Market Positioning',
    v1: 'Calendar link & manual hour-pack utility ($12–$19/mo)',
    v2: 'Autonomous Diagnostic Lead-Gen, Parent-ROI & Renewal Engine',
  },
  {
    dimension: 'Payer ≠ User Reality',
    v1: 'Tracks remaining hours only — no proof for paying parents',
    v2: 'Live Score Trajectory Dossier (580 → 710 → 760) + 1-Tap Renewal',
  },
  {
    dimension: 'Top-of-Funnel Conversion',
    v1: 'Static booking calendar (cold visitors bounce)',
    v2: 'Interactive 60s SAT Diagnostic attaches target gaps directly to 5-Pack',
  },
  {
    dimension: 'Monetization Engine',
    v1: 'Single flat SaaS tier (~$14 blended ARPU)',
    v2: '3-Stream Hybrid ($29 SaaS + 1.5% Pack Autopilot + Viral Notes Loop = ~$68+ ARPU)',
  },
  {
    dimension: 'Path to $10,000 / Month',
    v1: 'Requires ~833 paying tutors (slow volume grind)',
    v2: 'Only ~150 active tutors ($10,200/mo · $122.4k ARR)',
  },
  {
    dimension: 'AI / Claude Disintermediation Guard',
    v1: 'Thin scheduling UI easy to replicate',
    v2: 'Public lead capture + multi-party parent checkout + PostgreSQL hour ledger',
  },
];

const OUTREACH_SCRIPTS = [
  {
    id: 'wyzant',
    channel: 'WYZANT / SUPERPROF MIGRATION DM',
    title: 'Recovering the 20% Marketplace Cut on Repeat Packs',
    target: 'Solo SAT / AP Math & Science Tutors charging $60–$120/hr',
    script: `Hey [Name] — saw your AP Calc & SAT reviews on Wyzant. Quick question: how much are platform fees costing you on repeat 5-hour student packs this semester? Built SlotLink Studio specifically for solo prep tutors: parents get a zero-login Score Trajectory Dossier showing their teen's score lift and can renew a 5-hour pack in 1 tap (with 0% lesson commissions). Happy to set up your free slug at slotlink.app/[yourname] + 60s diagnostic widget if you want to test it with one family this week.`,
  },
  {
    id: 'reddit',
    channel: 'REDDIT (r/tutor · r/SAT)',
    title: '60-Second Diagnostic Lead Magnet Workflow Post',
    target: 'Private test-prep educators struggling to close intro calls',
    script: `I stopped sending cold "book a consult call" Calendly links to SAT parents. Instead, I send one link with an interactive 3-question mini diagnostic that projects their baseline -> target score (+120 pts) and pre-selects a 5-Hour Pack with priority weak topics attached. Parents love the Parent ROI scorecard inside the zero-login passbook so renewals happen at hour 1 without awkward billing texts.`,
  },
  {
    id: 'parent-loop',
    channel: 'WHATSAPP / SMS PARENT ROI DIGEST',
    title: 'Automated Low-Balance Renewal Touchpoint',
    target: 'Sent automatically from SlotLink Studio Dashboard at <= 2 hrs remaining',
    script: `Hi [Parent Name] — quick milestone update for [Student]: we moved from 580 Baseline to 710 Current (+130 pts) with 92% accuracy on Quadratics & Systems. [Student] has 1 prepaid hour remaining before finals review. You can inspect this week's annotated study sheet and renew another 5-Hour Pack in one tap (no login needed): https://slotlink.app/p/[magicToken]`,
  },
];

export function BusinessBlueprintClient() {
  const [tutors, setTutors] = useState(150);
  const [packVolume, setPackVolume] = useState(3000);
  const [autopilotPct, setAutopilotPct] = useState(1.5);
  const [tier, setTier] = useState<TierKey>('growth');
  const [activeTab, setActiveTab] = useState<TabKey>('thesis');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);

  const tierPrice = TIER_CONFIG[tier].price;
  const saasMrr = tutors * tierPrice;
  const autopilotYield = Math.round(tutors * packVolume * (autopilotPct / 100));
  const grossMonthly = saasMrr + autopilotYield;
  const grossArr = grossMonthly * 12;
  const blendedArpu = tutors > 0 ? Math.round(grossMonthly / tutors) : 0;

  // Paddle MoR estimate (~5% + $0.50 per SaaS charge) + 0.25% Pakistan PSEB Section 154A export tax
  const paddleFees = Math.round(grossMonthly * 0.05 + tutors * 0.5);
  const psebExportTax = Math.round((grossMonthly - paddleFees) * 0.0025);
  const infraEstimate = tutors <= 50 ? 20 : tutors <= 200 ? 85 : 190;
  const netTakeHome = Math.max(0, grossMonthly - paddleFees - psebExportTax - infraEstimate);

  function copyScript(id: string, text: string) {
    navigator.clipboard?.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId((curr) => (curr === id ? null : curr)), 2000);
  }

  return (
    <div className="space-y-8">
      {/* Interactive Founder MRR & Unit Economics Simulator */}
      <section className="surface-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#EFECE4] pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
              <Sliders className="h-3.5 w-3.5" />
              Founder Unit Economics &amp; Revenue Simulator
            </div>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#141413]">
              3-Stream Hybrid Model:{' '}
              <span className="font-serif italic font-normal text-[#D94E28]">
                Why 150 tutors hit $10k+/mo
              </span>
            </h2>
          </div>

          <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 font-mono text-xs font-semibold">
            {(['solo', 'growth', 'academy'] as TierKey[]).map((key) => {
              const cfg = TIER_CONFIG[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTier(key)}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    tier === key
                      ? 'bg-[#141413] text-[#F6F4EE]'
                      : 'text-[#575248] hover:text-[#141413]'
                  }`}
                >
                  {cfg.label} (${cfg.price}/mo)
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders Row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="sim-tutors"
                className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248]"
              >
                Active Paying Tutors
              </label>
              <span className="font-mono text-sm font-semibold text-[#141413]">
                {tutors} tutors
              </span>
            </div>
            <input
              id="sim-tutors"
              type="range"
              min={10}
              max={500}
              step={10}
              value={tutors}
              onChange={(e) => setTutors(Number(e.target.value))}
              className="w-full accent-[#D94E28] cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-[#6E685C]">
              <span>10 beta</span>
              <span>150 ($10k target)</span>
              <span>500 scale</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="sim-pack-vol"
                className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248]"
              >
                Pack Renewals / Tutor / Mo
              </label>
              <span className="font-mono text-sm font-semibold text-[#141413]">
                ${packVolume.toLocaleString()}
              </span>
            </div>
            <input
              id="sim-pack-vol"
              type="range"
              min={1000}
              max={8000}
              step={250}
              value={packVolume}
              onChange={(e) => setPackVolume(Number(e.target.value))}
              className="w-full accent-[#D94E28] cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-[#6E685C]">
              <span>$1k part-time</span>
              <span>$3k avg</span>
              <span>$8k full-time</span>
            </div>
          </div>

          <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/80 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="sim-fee"
                className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248]"
              >
                Autopilot Checkout Fee
              </label>
              <span className="font-mono text-sm font-semibold text-[#D94E28]">
                {autopilotPct.toFixed(1)}%
              </span>
            </div>
            <input
              id="sim-fee"
              type="range"
              min={0}
              max={2.5}
              step={0.5}
              value={autopilotPct}
              onChange={(e) => setAutopilotPct(Number(e.target.value))}
              className="w-full accent-[#D94E28] cursor-pointer"
            />
            <div className="flex justify-between font-mono text-[10px] text-[#6E685C]">
              <span>0% SaaS-only</span>
              <span>1.5% optimal</span>
              <span>2.5%</span>
            </div>
          </div>
        </div>

        {/* Live Calculated Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-xl border border-[#DCD6C8] bg-white p-4 space-y-1">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
              Monthly SaaS MRR
            </div>
            <div className="font-serif text-3xl text-[#141413]">
              ${saasMrr.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#575248]">
              {tutors} × ${tierPrice}/mo ({TIER_CONFIG[tier].label})
            </div>
          </div>

          <div className="rounded-xl border border-[#DCD6C8] bg-white p-4 space-y-1">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#D94E28]">
              {autopilotPct.toFixed(1)}% Autopilot Yield
            </div>
            <div className="font-serif text-3xl text-[#141413]">
              +${autopilotYield.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#575248]">
              On ${((tutors * packVolume) / 1000).toFixed(0)}k portal renewals
            </div>
          </div>

          <div className="surface-ink rounded-xl p-4 space-y-1">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#4ADE80]">
              Total Monthly / ARR
            </div>
            <div className="font-serif text-3xl text-[#F6F4EE]">
              ${grossMonthly.toLocaleString()}
            </div>
            <div className="font-mono text-[11px] text-[#C8C2B6]">
              ${grossArr.toLocaleString()} / yr ARR
            </div>
          </div>

          <div className="rounded-xl border border-[#DCD6C8] bg-white p-4 space-y-1">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
              Blended ARPU / Tutor
            </div>
            <div className="font-serif text-3xl text-[#15803D]">${blendedArpu}/mo</div>
            <div className="text-[11px] text-[#575248]">vs $14/mo in v1.0</div>
          </div>

          <div className="rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] p-4 space-y-1">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#15803D]">
              Net Take-Home (0.25% Tax)
            </div>
            <div className="font-serif text-3xl text-[#14532D]">
              ${netTakeHome.toLocaleString()}
            </div>
            <div className="text-[11px] text-[#166534]">
              After Paddle MoR &amp; PSEB 0.25%
            </div>
          </div>
        </div>
      </section>

      {/* 4-Tab Strategic Blueprint Explorer */}
      <section className="space-y-4">
        <div
          role="tablist"
          aria-label="Business Plan 2.0 Strategic Sections"
          className="inline-flex flex-wrap gap-1 rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 font-mono text-xs font-semibold"
        >
          {(
            [
              { id: 'thesis', label: '01 · Thesis Rethink (v1 vs v2)' },
              { id: 'moat', label: '02 · 3-Pillar Product Moat' },
              { id: 'gtm', label: '03 · Viral GTM & Outreach Scripts' },
              { id: 'roadmap', label: '04 · 90-Day Roadmap & Pakistan Tax/Legal' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={activeTab === t.id}
              onClick={() => setActiveTab(t.id)}
              className={`rounded-lg px-3.5 py-2 transition ${
                activeTab === t.id
                  ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                  : 'text-[#575248] hover:text-[#141413]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 01: Thesis Rethink */}
        {activeTab === 'thesis' && (
          <div className="surface-card overflow-hidden rounded-2xl">
            <div className="border-b border-[#DCD6C8] bg-[#EFECE4]/60 px-6 py-4">
              <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                Why Rethink v1.0
              </div>
              <h3 className="mt-1 text-lg font-semibold text-[#141413]">
                From commodity booking tool to indispensable revenue &amp; retention infrastructure
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCD6C8] bg-[#F6F4EE] font-mono text-[11px] uppercase tracking-wider text-[#575248]">
                    <th className="px-5 py-3.5">Dimension</th>
                    <th className="px-5 py-3.5">SlotLink v1.0 (Old Model)</th>
                    <th className="px-5 py-3.5 bg-[#141413] text-[#F6F4EE]">
                      SlotLink 2.0 (Upgraded Engine)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4]">
                  {COMPARISON_V1_V2.map((row) => (
                    <tr key={row.dimension} className="hover:bg-[#F6F4EE]/60 transition">
                      <td className="px-5 py-3.5 font-semibold text-[#141413]">
                        {row.dimension}
                      </td>
                      <td className="px-5 py-3.5 text-[#6E685C]">{row.v1}</td>
                      <td className="px-5 py-3.5 bg-[#F0FDF4]/60 font-medium text-[#14532D]">
                        <span className="inline-flex items-start gap-1.5">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#15803D]" />
                          <span>{row.v2}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 02: 3-Pillar Product Moat */}
        {activeTab === 'moat' && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                pillar: 'PILLAR 01 · LEAD CAPTURE',
                title: 'Interactive 60s Diagnostic & Score Predictor',
                desc: 'Cold links convert poorly. Visitors test 3 SAT/AP questions right on the tutor booking page, receive a +130 pt score trajectory projection, and attach it directly to a 5-Lesson Pack.',
                href: '/sarah-math',
                cta: 'Test Live Diagnostic on /sarah-math',
              },
              {
                pillar: 'PILLAR 02 · PARENT ROI & 1-TAP RENEWAL',
                title: 'Score Trajectory Dossier & Instant Pack Top-Up',
                desc: 'Solves the Payer ≠ User gap: parents inspect verified baseline-to-target gains (580 -> 710 -> 760), drill accuracy, and renew +5 hours ($250) in one tap without password friction.',
                href: '/p/sl_demo_maya_77b1x',
                cta: 'Test Low-Balance Renewal on /p/maya',
              },
              {
                pillar: 'PILLAR 03 · RETENTION AUTOPILOT',
                title: 'Autonomous Renewal Triggers & Parent ROI Digest',
                desc: 'Automatically highlights <= 2 hr balances in the tutor studio dashboard and generates 1-click Parent ROI Digest summaries ready for WhatsApp or SMS.',
                href: '/dashboard',
                cta: 'Inspect Autopilot in /dashboard',
              },
              {
                pillar: 'PILLAR 04 · ZERO-CAC VIRAL LOOP',
                title: 'Interactive Whiteboard Study Sheets',
                desc: 'Shareable study packets with coordinate SVGs and interactive drills bring peer students and parents back into SlotLink with subtle educator branding.',
                href: '/notes/sat-module-2-drill',
                cta: 'Open Study Sheet /notes/sat-module-2-drill',
              },
            ].map((card) => (
              <div
                key={card.pillar}
                className="surface-card surface-card-interactive rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    <Layers className="h-3.5 w-3.5" />
                    {card.pillar}
                  </div>
                  <h3 className="font-serif text-2xl text-[#141413]">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-[#575248]">{card.desc}</p>
                </div>
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#141413] hover:text-[#D94E28] transition"
                >
                  {card.cta}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Tab 03: Viral GTM & Outreach Scripts */}
        {activeTab === 'gtm' && (
          <div className="space-y-4">
            {OUTREACH_SCRIPTS.map((item) => {
              const isCopied = copiedScriptId === item.id;
              return (
                <div key={item.id} className="surface-card rounded-2xl p-5 sm:p-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                        {item.channel}
                      </div>
                      <h3 className="mt-0.5 text-base font-semibold text-[#141413]">{item.title}</h3>
                      <p className="text-xs text-[#6E685C]">Target: {item.target}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyScript(item.id, item.script)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-2 font-mono text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#4ADE80]" />
                          Copied Script ✓
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy Outreach Script
                        </>
                      )}
                    </button>
                  </div>
                  <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-4 font-mono text-xs leading-relaxed text-[#141413]">
                    {item.script}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 04: 90-Day Roadmap & Pakistan Tax/Legal */}
        {activeTab === 'roadmap' && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-7 surface-card rounded-2xl p-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                <Rocket className="h-3.5 w-3.5" />
                First 90 Days Execution Playbook
              </div>
              <div className="space-y-3">
                {[
                  {
                    step: 'DAYS 1–14 · PRODUCTION & PADDLE VERIFICATION',
                    detail:
                      'Deploy SlotLink 2.0 on Vercel + managed Postgres, configure Resend transactional email + Google OAuth verification, and submit /terms, /privacy, /refund-policy for Paddle Merchant of Record approval (~$35 total cash outlay).',
                  },
                  {
                    step: 'DAYS 15–45 · 15 DESIGN-PARTNER TUTORS (ZERO AD SPEND)',
                    detail:
                      'Record 45-second Loom demos using sarah-math & Maya passbook renewal links. Send 100 targeted DMs to solo SAT, AP Calculus, and piano tutors transitioning off 20% marketplace fees.',
                  },
                  {
                    step: 'DAYS 46–90 · DIAGNOSTIC FUNNEL & PLG COMPOUNDING',
                    detail:
                      'Turn on 1.5% Portal Renewal Autopilot across active tutors (~$3k/mo pack volume each), ship custom domains for Growth ($29/mo) subscribers, and let shared /notes/[slug] sheets drive organic referrals.',
                  },
                ].map((m) => (
                  <div
                    key={m.step}
                    className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/75 p-4 space-y-1"
                  >
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#15803D]">
                      {m.step}
                    </div>
                    <p className="text-xs leading-relaxed text-[#575248]">{m.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 surface-ink rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#4ADE80]">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Global Billing &amp; Pakistan Export Tax Edge
                </div>
                <h3 className="font-serif text-2xl text-[#F6F4EE]">
                  0.25% IT Export Tax + Zero US LLC on Day 1
                </h3>
                <ul className="space-y-2.5 text-xs text-[#D8D3C8]">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
                    <span>
                      <strong>Paddle MoR Billing:</strong> Accepts US/UK/EU/AU cards and remits
                      local VAT/GST automatically (5% + $0.50 flat per charge).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
                    <span>
                      <strong>FBR NTN + PSEB Registration:</strong> Sole proprietorship with PSEB
                      Freelancer Registration (PKR 1,000) qualifies software export receipts for{' '}
                      <strong>0.25% final tax</strong> under Section 154A (through Tax Year 2029).
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#4ADE80]" />
                    <span>
                      <strong>Bank Purpose Code 9186:</strong> Route payouts via official banking
                      channels with proper IT/SaaS export classification. Verify exact filings with
                      a local tax or legal advisor.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/15 bg-white/5 p-3.5 flex items-center justify-between gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 font-mono text-[#F6F4EE]">
                  <Sparkles className="h-3.5 w-3.5 text-[#4ADE80]" />
                  Upfront Launch Cash Needed
                </span>
                <span className="inline-flex items-center gap-1 font-mono font-semibold text-[#4ADE80]">
                  <TrendingUp className="h-3.5 w-3.5" />
                  ~$35–$55
                </span>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
