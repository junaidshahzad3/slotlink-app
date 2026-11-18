import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { BookingClient } from '@/components/BookingClient';
import { TutorShareCard } from '@/components/TutorShareCard';
import type { PrefillStudentDTO } from '@/types/domain';

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
    include: { services: { orderBy: { priceCents: 'asc' } } },
  });

  if (!pro) notFound();

  let prefillStudent: PrefillStudentDTO | null = null;
  const invalidTokenSupplied = Boolean(token && token.trim().length > 0);
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

  const highlights = [
    `${pro.services.length} session option${pro.services.length === 1 ? '' : 's'} available`,
    '1-on-1 Live Video + 24h free reschedule',
    'Zero-login client passbook & hour ledger',
  ];

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-[#141413] flex flex-col justify-between">
      {/* White-Label Educator Booking Header (Zero SaaS Admin Navigation) */}
      <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
              {initials || 'SL'}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-[#141413]">{pro.name}</div>
              <div className="truncate text-xs text-[#6E685C]">{pro.tagline}</div>
            </div>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-1 font-mono text-[11px] font-semibold text-[#15803D]">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#15803D]" />
            Booking Portal Live
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="surface-card overflow-hidden rounded-2xl grid grid-cols-1 lg:grid-cols-12">
          {/* Left Educator Profile Sidebar */}
          <aside className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#DCD6C8] bg-[#EFECE4]/70 p-6 sm:p-8 flex flex-col justify-between gap-6">
            <div className="space-y-5">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141413] font-mono text-sm font-semibold text-[#F6F4EE]">
                  {initials || 'SL'}
                </div>
                <div className="min-w-0">
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Instructor Studio
                  </div>
                  <h1 className="truncate font-serif text-3xl leading-tight text-[#141413]">
                    {pro.name}
                  </h1>
                </div>
              </div>

              <div className="text-sm font-semibold text-[#141413]">{pro.tagline}</div>

              {pro.bio && <p className="text-sm leading-relaxed text-[#575248]">{pro.bio}</p>}

              {/* Universal Studio Highlights */}
              <div className="rounded-xl border border-[#DCD6C8] bg-white/85 p-4 space-y-2.5">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                  What&rsquo;s Included
                </div>
                <ul className="space-y-2 text-xs text-[#141413]">
                  {highlights.map((item) => (
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
                    Studio Link
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
                    Availability
                  </span>
                  <span className="font-mono font-medium text-[#141413]">{workHoursLabel}</span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    Format
                  </span>
                  <span className="font-mono font-medium text-[#141413]">
                    Video Call (Google Meet / Web)
                  </span>
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

              {/* Client Passbook Guidance & Token Lookup */}
              <div className="surface-ink rounded-xl p-4 space-y-3">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#A8A295]">
                  Have a Prepaid Passbook?
                </div>
                <p className="text-xs leading-relaxed text-[#D8D3C8]">
                  Returning clients receive a private magic link after their first booking to redeem
                  remaining hours or reschedule in two taps.
                </p>
                {prefillStudent ? (
                  <Link
                    href={`/p/${encodeURIComponent(prefillStudent.magicToken)}`}
                    className="inline-flex items-center gap-1 rounded-lg bg-[#F6F4EE] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-white transition"
                  >
                    Back to Your Passbook
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <div className="space-y-2">
                    {invalidTokenSupplied && (
                      <div
                        role="alert"
                        className="rounded-lg border border-[#FCA5A5]/40 bg-[#7F1D1D]/40 px-2.5 py-1.5 text-[11px] text-[#FECACA]"
                      >
                        Passbook token not recognized for this instructor. Please check your link.
                      </div>
                    )}
                    <form method="GET" action={`/${pro.slug}`} className="flex gap-1.5">
                      <input
                        type="text"
                        name="token"
                        required
                        defaultValue={invalidTokenSupplied ? token : ''}
                        aria-label="Enter passbook token"
                        placeholder="Paste token (sl_...)"
                        className="min-w-0 flex-1 rounded-lg border border-white/20 bg-white/10 px-2.5 py-1.5 font-mono text-[11px] text-[#F6F4EE] placeholder-[#A8A295] focus:border-[#4ADE80] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-lg bg-[#F6F4EE] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-[#141413] hover:bg-white transition"
                      >
                        Apply
                      </button>
                    </form>
                  </div>
                )}
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

      <footer className="border-t border-[#DCD6C8] bg-white/80 py-4 text-center text-xs text-[#6E685C]">
        Powered by{' '}
        <Link href="/" className="font-mono font-semibold text-[#141413] hover:text-[#D94E28]">
          SlotLink
        </Link>{' '}
        ·{' '}
        <Link href="/login?mode=signup" className="underline hover:text-[#141413]">
          Create your own booking link
        </Link>
      </footer>
    </div>
  );
}
