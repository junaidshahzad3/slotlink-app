import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, CheckCircle2, Sparkles, Star } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { AppTopBar } from '@/components/AppTopBar';
import { BookingClient } from '@/components/BookingClient';
import { TutorShareCard } from '@/components/TutorShareCard';
import type { PrefillStudentDTO } from '@/types/domain';

const SESSION_DELIVERABLES = [
  'Annotated Whiteboard PDF',
  'Custom Practice Drill Set',
  'Google Meet HD + Screen Share',
  'Instant Passbook Ledger Update',
];

export default async function PublicPortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { slug } = await params;
  const { token } = await searchParams;
  const pro = await prisma.user.findUnique({
    where: { slug },
    include: { services: true },
  });

  if (!pro) notFound();

  let prefillStudent: PrefillStudentDTO | null = null;
  if (token) {
    const matched = await prisma.student.findUnique({
      where: { magicToken: token },
      select: {
        userId: true,
        name: true,
        email: true,
        hoursRemaining: true,
        magicToken: true,
      },
    });
    if (matched && matched.userId === pro.id) {
      prefillStudent = {
        name: matched.name,
        email: matched.email,
        hoursRemaining: matched.hoursRemaining,
        magicToken: matched.magicToken,
      };
    }
  }

  const initials = pro.name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');

  const workHoursLabel = `${String(pro.workStartHour).padStart(2, '0')}:00–${String(
    pro.workEndHour
  ).padStart(2, '0')}:00 UTC`;

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413]">
      <AppTopBar
        badge="PUBLIC 1-LINK"
        rightSlot={
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-1 font-mono text-[11px] font-semibold text-[#15803D]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#15803D]" />
            Booking Portal Live
          </span>
        }
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="surface-card overflow-hidden rounded-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Dossier Column */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#DCD6C8] bg-[#EFECE4]/70 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141413] font-mono text-sm font-semibold text-[#F6F4EE]">
                  {initials || 'SL'}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Tutor Dossier
                  </div>
                  <h1 className="truncate font-serif text-3xl leading-tight text-[#141413]">
                    {pro.name}
                  </h1>
                </div>
              </div>

              <div className="text-sm font-semibold text-[#141413]">{pro.tagline}</div>

              {pro.bio && (
                <p className="text-sm leading-relaxed text-[#575248]">{pro.bio}</p>
              )}

              {/* Trust & Outcomes Strip */}
              <div className="grid grid-cols-3 divide-x divide-[#DCD6C8] rounded-xl border border-[#DCD6C8] bg-white text-center shadow-sm">
                <div className="px-2 py-2.5">
                  <div className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#141413]">
                    <Star className="h-3 w-3 fill-[#D94E28] text-[#D94E28]" />
                    5.0
                  </div>
                  <div className="mt-0.5 text-[10px] text-[#6E685C]">Rating</div>
                </div>
                <div className="px-2 py-2.5">
                  <div className="font-mono text-xs font-semibold text-[#141413]">120+ pt</div>
                  <div className="mt-0.5 text-[10px] text-[#6E685C]">Avg SAT gain</div>
                </div>
                <div className="px-2 py-2.5">
                  <div className="font-mono text-xs font-semibold text-[#141413]">&lt; 2h</div>
                  <div className="mt-0.5 text-[10px] text-[#6E685C]">Response</div>
                </div>
              </div>

              {/* Every Session Includes */}
              <div className="rounded-xl border border-[#DCD6C8] bg-white/80 p-4 space-y-2.5">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                  Every Session Includes
                </div>
                <ul className="space-y-2 text-xs text-[#141413]">
                  {SESSION_DELIVERABLES.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#15803D]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <TutorShareCard slug={pro.slug} name={pro.name} />
            </div>

            <div className="space-y-5">
              <div className="divide-y divide-[#DCD6C8] border-t border-[#DCD6C8] text-xs">
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    Public Slug
                  </span>
                  <span className="font-mono font-medium text-[#141413]">/{pro.slug}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    Timezone
                  </span>
                  <span className="font-mono font-medium text-[#141413]">{pro.timezone}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    Work Hours
                  </span>
                  <span className="font-mono font-medium text-[#141413]">{workHoursLabel}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    Format
                  </span>
                  <span className="font-mono font-medium text-[#141413]">Google Meet</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    Reminders
                  </span>
                  <span className="font-mono font-medium text-[#15803D]">
                    {pro.smsEnabled ? 'Email + SMS' : 'Email'}
                  </span>
                </div>
              </div>

              {/* Already a Student Passbook Card */}
              <div className="surface-ink rounded-xl p-4 space-y-3">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#A8A295]">
                  Already a Student?
                </div>
                <p className="text-xs leading-relaxed text-[#D8D3C8]">
                  Check your remaining pack hours, reschedule 24h+ ahead, or test 1-tap prepaid
                  credit redemption.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/p/sl_demo_alex_94a2k"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#F6F4EE] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-white transition"
                  >
                    Open Passbook
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/${pro.slug}?token=sl_demo_alex_94a2k`}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-[#F6F4EE] hover:bg-white/20 transition"
                  >
                    <Sparkles className="h-3 w-3 text-[#4ADE80]" />
                    Test Credit Redeem
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Booking Column */}
          <div className="lg:col-span-8 bg-white p-6 sm:p-8">
            <BookingClient
              proSlug={pro.slug}
              services={pro.services}
              prefillStudent={prefillStudent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
