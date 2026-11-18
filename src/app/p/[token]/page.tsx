import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowUpRight, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { PortalClient } from '@/components/PortalClient';

export default async function ClientMagicPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const student = await prisma.student.findUnique({
    where: { magicToken: token },
    include: {
      user: true,
      bookings: { include: { service: true }, orderBy: { startsAt: 'desc' } },
    },
  });

  if (!student) notFound();

  const serialized = student.bookings.map((b) => ({
    id: b.id,
    serviceName: b.service.name,
    durationMin: b.service.durationMin,
    startsAtIso: b.startsAt.toISOString(),
    status: b.status,
    note: b.note,
    sessionSummary: b.sessionSummary,
    homeworkUrl: b.homeworkUrl,
    meetingUrl: b.meetingUrl,
  }));

  const filledBlocks = Math.min(5, Math.max(0, student.hoursRemaining));
  const upcomingCount = serialized.filter((b) => b.status === 'CONFIRMED').length;
  const completedCount = serialized.filter((b) => b.status === 'COMPLETED').length;
  const studentInitials = student.name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');

  const proInitials = student.user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');

  const isLowBalance = student.hoursRemaining <= 1;
  const bookHref = `/${student.user.slug}?token=${encodeURIComponent(student.magicToken)}`;

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413] flex flex-col justify-between">
      {/* White-Label Client Passbook Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
              {proInitials || 'SL'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[#141413]">
                {student.user.name}
              </div>
              <div className="truncate text-xs text-[#6E685C]">{student.user.tagline}</div>
            </div>
          </div>

          <Link
            href={bookHref}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Book Session
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
        {/* Carbon Ink Student Passbook Header */}
        <section className="surface-ink rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 font-mono text-sm font-semibold text-[#F6F4EE]">
                {studentInitials || 'CL'}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#4ADE80]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                  Private Client Passbook
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl text-[#F6F4EE]">{student.name}</h1>
                <p className="font-mono text-xs text-[#A8A295]">{student.email}</p>
                <p className="pt-0.5 text-xs text-[#D8D3C8]">
                  With <span className="font-semibold text-[#F6F4EE]">{student.user.name}</span> ·{' '}
                  {student.user.tagline}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 min-w-[185px]">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#A8A295]">
                    Pack Balance
                  </span>
                  <span
                    className={`font-mono text-lg font-semibold ${
                      isLowBalance ? 'text-[#FBBF24]' : 'text-[#4ADE80]'
                    }`}
                  >
                    {student.hoursRemaining} hrs left
                  </span>
                </div>
                <div className="mt-2.5 grid grid-cols-5 gap-1.5">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <span
                      key={idx}
                      className={`h-2 rounded-sm ${
                        idx < filledBlocks
                          ? isLowBalance
                            ? 'bg-[#FBBF24]'
                            : 'bg-[#4ADE80]'
                          : 'bg-white/15'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <Link
                href={bookHref}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#F6F4EE] px-4 py-3 text-xs font-semibold text-[#141413] hover:bg-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Book Next Session
              </Link>
            </div>
          </div>

          {isLowBalance && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#FBBF24]/40 bg-[#FBBF24]/10 px-4 py-3 text-xs">
              <div className="flex items-center gap-2.5 text-[#FEF3C7]">
                <AlertTriangle className="h-4 w-4 shrink-0 text-[#FBBF24]" />
                <span>
                  <strong className="font-semibold">
                    Low pack balance ({student.hoursRemaining} hr remaining).
                  </strong>{' '}
                  Book a new multi-session pack on {student.user.name}&rsquo;s studio page to keep
                  your recurring time slot.
                </span>
              </div>
              <Link
                href={bookHref}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#FBBF24] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#141413] hover:bg-[#FDE68A] transition"
              >
                Book / Renew Pack
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Pack Session Journey Checkpoint Strip & Anchor Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="inline-flex items-center gap-1.5 text-[#4ADE80]">
                <span className="h-2 w-2 rounded-full bg-[#4ADE80]" />
                {completedCount} Done
              </span>
              <span className="text-white/25">→</span>
              <span className="inline-flex items-center gap-1.5 text-[#F6F4EE] font-semibold">
                <span className="live-dot h-2 w-2 rounded-full bg-[#D94E28]" />
                {upcomingCount} Upcoming
              </span>
              <span className="text-white/25">→</span>
              <span className={isLowBalance ? 'text-[#FBBF24]' : 'text-[#A8A295]'}>
                {student.hoursRemaining} Pack Credits Left
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
              {upcomingCount > 0 && (
                <a
                  href="#next-session-spotlight"
                  className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[#F6F4EE] hover:bg-white/20 transition"
                >
                  Next Session ↓
                </a>
              )}
              {serialized.some((b) => b.homeworkUrl || b.sessionSummary) && (
                <a
                  href="#study-vault"
                  className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[#F6F4EE] hover:bg-white/20 transition"
                >
                  Study Vault ↓
                </a>
              )}
            </div>
          </div>

          {/* 3-Stat Mini Strip (100% Database-Backed) */}
          <div className="grid grid-cols-3 divide-x divide-white/10 rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#A8A295]">
                Upcoming Sessions
              </div>
              <div className="mt-1 font-mono text-lg font-semibold text-[#F6F4EE]">
                {upcomingCount}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#A8A295]">
                Completed Lessons
              </div>
              <div className="mt-1 font-mono text-lg font-semibold text-[#F6F4EE]">
                {completedCount}
              </div>
            </div>
            <div className="px-4 py-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#A8A295]">
                Total Invested
              </div>
              <div className="mt-1 font-mono text-lg font-semibold text-[#4ADE80]">
                ${(student.totalPaidCents / 100).toFixed(0)}
              </div>
            </div>
          </div>
        </section>

        {/* Session Ledger */}
        <PortalClient
          token={token}
          proSlug={student.user.slug}
          proName={student.user.name}
          initialBookings={serialized}
        />
      </main>

      <footer className="border-t border-[#DCD6C8] bg-white/80 py-4 text-center text-xs text-[#6E685C]">
        Private client portal ·{' '}
        <Link href={bookHref} className="font-semibold text-[#141413] hover:text-[#D94E28]">
          {student.user.name}
        </Link>{' '}
        · Powered by{' '}
        <Link href="/" className="font-mono underline hover:text-[#141413]">
          SlotLink
        </Link>
      </footer>
    </div>
  );
}
