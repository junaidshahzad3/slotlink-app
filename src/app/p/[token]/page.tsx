import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AlertTriangle, ArrowLeft, ArrowUpRight, Plus } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { AppTopBar } from '@/components/AppTopBar';
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

  const isLowBalance = student.hoursRemaining <= 1;

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413]">
      <AppTopBar
        badge="MAGIC PORTAL"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <div className="hidden sm:inline-flex items-center rounded-lg border border-[#DCD6C8] bg-[#EFECE4] p-0.5 font-mono text-[11px] font-semibold">
              <Link
                href="/p/sl_demo_alex_94a2k"
                className={`rounded-md px-2.5 py-1 transition ${
                  token === 'sl_demo_alex_94a2k'
                    ? 'bg-[#141413] text-[#F6F4EE]'
                    : 'text-[#575248] hover:text-[#141413]'
                }`}
              >
                Alex (3 hrs)
              </Link>
              <Link
                href="/p/sl_demo_maya_77b1x"
                className={`rounded-md px-2.5 py-1 transition ${
                  token === 'sl_demo_maya_77b1x'
                    ? 'bg-[#141413] text-[#F6F4EE]'
                    : 'text-[#575248] hover:text-[#141413]'
                }`}
              >
                Maya (1 hr)
              </Link>
            </div>

            <Link
              href={`/${student.user.slug}?token=${encodeURIComponent(student.magicToken)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {student.user.name}&apos;s Booking Page
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
        {/* Carbon Ink Student Passbook Header */}
        <section className="surface-ink rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 font-mono text-sm font-semibold text-[#F6F4EE]">
                {studentInitials || 'ST'}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest text-[#4ADE80]">
                  <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                  Zero-Login Student Passbook
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
                href={`/${student.user.slug}?token=${encodeURIComponent(student.magicToken)}`}
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
                  <strong className="font-semibold">Low pack balance ({student.hoursRemaining} hr remaining).</strong>{' '}
                  Grab a discounted 5-Lesson Pack to lock in weekly times before finals.
                </span>
              </div>
              <Link
                href={`/${student.user.slug}?token=${encodeURIComponent(student.magicToken)}`}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-[#FBBF24] px-3 py-1.5 font-mono text-[11px] font-semibold text-[#141413] hover:bg-[#FDE68A] transition"
              >
                Top Up Pack Hours
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* 3-Stat Mini Strip */}
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
          studentName={student.name}
          initialHoursRemaining={student.hoursRemaining}
          initialTotalPaidCents={student.totalPaidCents}
          initialBookings={serialized}
        />
      </main>
    </div>
  );
}
