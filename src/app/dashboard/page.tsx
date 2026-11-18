import Link from 'next/link';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';
import { DashboardClient } from '@/components/DashboardClient';
import { UpgradeButton } from '@/components/UpgradeButton';
import { CopyLinkButton } from '@/components/CopyLinkButton';
import { SignOutButton } from '@/components/SignOutButton';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const authed = await getAuthenticatedPro();
  const pro = authed
    ? await prisma.user.findUnique({
        where: { id: authed.id },
        include: {
          services: true,
          students: { orderBy: { createdAt: 'desc' } },
          bookings: { include: { student: true, service: true }, orderBy: { startsAt: 'asc' } },
        },
      })
    : await prisma.user.findFirst({
        include: {
          services: true,
          students: { orderBy: { createdAt: 'desc' } },
          bookings: { include: { student: true, service: true }, orderBy: { startsAt: 'asc' } },
        },
      });

  if (!pro) {
    return (
      <div className="min-h-screen bg-[#F6F4EE] text-[#141413]">
        <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
                SL
              </span>
              <span className="text-base font-semibold tracking-tight text-[#141413]">
                SlotLink Studio
              </span>
            </Link>
            <Link
              href="/login?mode=signup"
              className="rounded-lg bg-[#141413] px-3.5 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
            >
              Create Studio
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-16">
          <div className="surface-card rounded-2xl p-8 space-y-4">
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#D94E28]">
              Studio Setup
            </span>
            <h1 className="font-serif text-3xl text-[#141413]">Welcome to SlotLink Studio</h1>
            <p className="text-sm text-[#575248]">
              Create your studio profile in 60 seconds or connect Google Calendar to start
              accepting bookings.
            </p>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/login?mode=signup"
                className="inline-block rounded-lg bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
              >
                Create Your Studio
              </Link>
              <a
                href="/api/integrations/google/connect"
                className="inline-block rounded-lg border border-[#CEC7B6] bg-white px-4 py-2.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
              >
                Connect Google Calendar
              </a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413]">
      {/* Dedicated Educator Studio Workspace Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#141413] font-mono text-xs font-semibold tracking-tight text-[#F6F4EE] transition group-hover:bg-[#D94E28]">
                SL
              </span>
              <span className="text-base font-semibold tracking-tight text-[#141413]">
                SlotLink Studio
              </span>
            </Link>
            <Link
              href={`/${pro.slug}`}
              className="hidden sm:inline-flex items-center gap-1 border-l border-[#DCD6C8] pl-3 font-mono text-[11px] font-semibold text-[#D94E28] hover:underline"
            >
              View Public Page
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <CopyLinkButton path={`/${pro.slug}`} label={`Copy /${pro.slug}`} />
            <a
              href="/api/integrations/google/connect"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
            >
              <Calendar className="h-3.5 w-3.5 text-[#15803D]" />
              <span className="hidden sm:inline">
                {pro.googleRefreshToken ? 'GCal Connected' : 'Connect Google Calendar'}
              </span>
              <span className="sm:hidden">GCal</span>
            </a>
            <UpgradeButton
              userId={pro.id}
              priceId={process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO ?? 'pri_pro_19'}
              label="Upgrade ($19/mo)"
            />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        {/* Studio Profile Strip */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-serif text-3xl sm:text-4xl leading-none text-[#141413]">
                {pro.name}
              </h1>
              <span className="rounded border border-[#D5CFC0] bg-[#EFECE4] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248]">
                {pro.subscriptionTier}
              </span>
            </div>
            <p className="mt-1.5 text-xs sm:text-sm text-[#575248]">
              {pro.tagline} ·{' '}
              <Link
                href={`/${pro.slug}`}
                className="inline-flex items-center gap-0.5 font-mono font-semibold text-[#D94E28] hover:underline"
              >
                slotlink.app/{pro.slug}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
        </div>

        <DashboardClient
          userId={pro.id}
          initialBookings={pro.bookings.map((b) => ({
            id: b.id,
            studentId: b.studentId,
            studentName: b.student.name,
            serviceName: b.service.name,
            startsAtIso: b.startsAt.toISOString(),
            status: b.status,
            note: b.note,
            sessionSummary: b.sessionSummary,
            homeworkUrl: b.homeworkUrl,
            meetingUrl: b.meetingUrl,
          }))}
          initialStudents={pro.students.map((s) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            hoursRemaining: s.hoursRemaining,
            totalPaidCents: s.totalPaidCents,
            magicToken: s.magicToken,
          }))}
          initialServices={pro.services}
          initialSettings={{
            name: pro.name,
            tagline: pro.tagline,
            bio: pro.bio,
            timezone: pro.timezone,
            slug: pro.slug,
            workStartHour: pro.workStartHour,
            workEndHour: pro.workEndHour,
            smsEnabled: pro.smsEnabled,
            upfrontPay: pro.upfrontPay,
          }}
        />
      </main>
    </div>
  );
}
