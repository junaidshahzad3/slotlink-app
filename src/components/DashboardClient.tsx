'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Copy,
  FileText,
  List,
  Plus,
  Search,
  Sparkles,
  Video,
  X,
} from 'lucide-react';
import { resolveHomeworkHref } from '@/lib/notes';
import type { BookingDTO, ServiceDTO, StudentDTO } from '@/types/domain';

const TIMEZONE_OPTIONS = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Berlin',
  'Australia/Sydney',
  'Asia/Karachi',
  'UTC',
];

const TAKEAWAY_PRESETS = [
  {
    label: 'Milestone Reached',
    summary:
      'Solid progress on core fundamentals today. Ready to advance to the next module in our upcoming session.',
  },
  {
    label: 'Practice Assigned',
    summary:
      'Completed guided review; please finish 20 minutes of targeted practice before our next meeting.',
  },
  {
    label: 'Next Session Focus',
    summary:
      'Identified key areas to strengthen next time and logged a focused warm-up plan in your portal.',
  },
];

function extractError(data: unknown, fallback: string): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const err = (data as { error?: unknown }).error;
    if (typeof err === 'string' && err.trim()) return err;
  }
  return fallback;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

function formatSessionDate(iso: string): string {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const timePart = d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${datePart} · ${timePart}`;
}

function getStatusBadgeClass(status: string): string {
  if (status === 'CONFIRMED') {
    return 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]';
  }
  if (status === 'CANCELLED') {
    return 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]';
  }
  return 'border-[#D5CFC0] bg-[#EFECE4] text-[#141413]';
}

export function DashboardClient({
  userId,
  initialBookings,
  initialStudents,
  initialServices,
  initialSettings,
}: {
  userId: string;
  initialBookings: BookingDTO[];
  initialStudents: StudentDTO[];
  initialServices: ServiceDTO[];
  initialSettings: {
    name: string;
    tagline: string;
    bio: string;
    timezone: string;
    slug: string;
    workStartHour: number;
    workEndHour: number;
    smsEnabled: boolean;
    upfrontPay: boolean;
  };
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'schedule' | 'clients' | 'settings'>('schedule');
  const [queueView, setQueueView] = useState<'list' | 'grid'>('list');
  const [gridAnchorMs, setGridAnchorMs] = useState<number | null>(null);
  const [bookings, setBookings] = useState(initialBookings);
  const [students, setStudents] = useState(initialStudents);
  const [services, setServices] = useState(initialServices);
  const [settings, setSettings] = useState(initialSettings);
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [summaryNote, setSummaryNote] = useState('');
  const [homeworkUrl, setHomeworkUrl] = useState('');
  const [newSvcName, setNewSvcName] = useState('');
  const [newSvcDesc, setNewSvcDesc] = useState('');
  const [newSvcPrice, setNewSvcPrice] = useState('55');
  const [newSvcHrs, setNewSvcHrs] = useState('1');
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  const [qbStudentSelect, setQbStudentSelect] = useState<string>('new');
  const [qbName, setQbName] = useState('');
  const [qbEmail, setQbEmail] = useState('');
  const [qbServiceId, setQbServiceId] = useState(initialServices[0]?.id ?? '');
  const [qbDate, setQbDate] = useState('');
  const [qbTime, setQbTime] = useState('15:00');
  const [qbNote, setQbNote] = useState('');
  const [qbUseCredit, setQbUseCredit] = useState(true);
  const [qbSubmitting, setQbSubmitting] = useState(false);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const now = Date.now();
    setGridAnchorMs(now);
    const tmrw = new Date(now + 86_400_000).toISOString().slice(0, 10);
    setQbDate(tmrw);
  }, []);

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETED');
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED');

  const query = searchQuery.trim().toLowerCase();
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filter === 'ALL' || b.status === filter;
    if (!matchesStatus) return false;
    if (!query) return true;
    return (
      b.studentName.toLowerCase().includes(query) ||
      b.serviceName.toLowerCase().includes(query) ||
      b.note.toLowerCase().includes(query)
    );
  });

  const nextBooking = confirmedBookings[0] ?? null;
  const totalHours = students.reduce((acc, s) => acc + s.hoursRemaining, 0);
  const lowBalanceCount = students.filter((s) => s.hoursRemaining <= 1).length;
  const totalRevenueCents = students.reduce((acc, s) => acc + s.totalPaidCents, 0);
  const totalPoolHours = completedBookings.length + totalHours;
  const fulfillmentPct =
    totalPoolHours > 0 ? Math.round((completedBookings.length / totalPoolHours) * 100) : 0;

  const sevenDayColumns = (() => {
    if (gridAnchorMs === null) return [];
    const cols: { iso: string; dayShort: string; dateNum: string; sessions: BookingDTO[] }[] = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(gridAnchorMs + i * 86_400_000);
      const iso = dt.toISOString().slice(0, 10);
      cols.push({
        iso,
        dayShort:
          i === 0 ? 'TODAY' : dt.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        dateNum: dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: filteredBookings.filter((b) => b.startsAtIso.slice(0, 10) === iso),
      });
    }
    return cols;
  })();

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast((curr) => (curr === msg ? null : curr)), 2800);
  }

  function openCompleteDrawer(bookingId: string) {
    setActiveTab('schedule');
    setQueueView('list');
    setFilter('ALL');
    setSearchQuery('');
    setCompletingId(bookingId);
    const queueEl = document.getElementById('sessions-queue');
    queueEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function handleQuickSelectStudent(val: string) {
    setQbStudentSelect(val);
    if (val === 'new') {
      setQbName('');
      setQbEmail('');
      return;
    }
    const found = students.find((s) => s.id === val);
    if (found) {
      setQbName(found.name);
      setQbEmail(found.email);
      setQbUseCredit(found.hoursRemaining > 0);
    }
  }

  async function handleQuickBookSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!qbDate || !qbTime || !qbServiceId) return;
    const startsAtIso = new Date(`${qbDate}T${qbTime}:00`).toISOString();
    const matchedStudent = students.find(
      (s) => s.email.toLowerCase() === qbEmail.trim().toLowerCase()
    );
    const useCredit = Boolean(
      qbUseCredit && matchedStudent && matchedStudent.hoursRemaining > 0
    );

    setQbSubmitting(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proSlug: settings.slug,
          serviceId: qbServiceId,
          startsAt: startsAtIso,
          studentName: qbName,
          studentEmail: qbEmail,
          note: qbNote,
          useExistingCredit: useCredit,
          ...(useCredit && matchedStudent ? { magicToken: matchedStudent.magicToken } : {}),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        return notify(extractError(data, 'Could not create quick booking'));
      }

      const svc = services.find((s) => s.id === qbServiceId);
      const created: BookingDTO = {
        id: data.booking.id,
        studentId: data.booking.studentId,
        studentName: qbName,
        serviceName: svc?.name ?? 'Lesson',
        startsAtIso: data.booking.startsAt ?? startsAtIso,
        status: data.booking.status ?? 'CONFIRMED',
        note: qbNote,
        sessionSummary: '',
        homeworkUrl: '',
        meetingUrl: data.booking.meetingUrl ?? '',
      };

      setBookings((prev) =>
        [...prev, created].sort(
          (a, b) => new Date(a.startsAtIso).getTime() - new Date(b.startsAtIso).getTime()
        )
      );

      if (!matchedStudent && svc) {
        setStudents((prev) => [
          {
            id: data.booking.studentId,
            name: qbName,
            email: qbEmail.toLowerCase(),
            hoursRemaining: svc.packageHrs,
            totalPaidCents: svc.priceCents,
            magicToken: data.magicToken,
          },
          ...prev,
        ]);
      } else if (matchedStudent && !useCredit && svc) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === matchedStudent.id
              ? {
                  ...s,
                  hoursRemaining: s.hoursRemaining + svc.packageHrs,
                  totalPaidCents: s.totalPaidCents + svc.priceCents,
                }
              : s
          )
        );
      }

      setQuickBookOpen(false);
      setQbNote('');
      notify(`Booked ${qbName} (${svc?.name ?? 'Session'})`);
      router.refresh();
    } finally {
      setQbSubmitting(false);
    }
  }

  async function updateBooking(id: string, status: 'COMPLETED' | 'CANCELLED') {
    const targetBooking = bookings.find((b) => b.id === id);
    const res = await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        ...(status === 'COMPLETED' ? { sessionSummary: summaryNote, homeworkUrl } : {}),
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return notify(extractError(data, 'Failed to update booking'));

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status,
              ...(status === 'COMPLETED'
                ? { sessionSummary: summaryNote, homeworkUrl }
                : {}),
            }
          : b
      )
    );

    if (status === 'COMPLETED' && targetBooking?.status === 'CONFIRMED') {
      setStudents((prev) =>
        prev.map((s) =>
          s.id === targetBooking.studentId
            ? { ...s, hoursRemaining: Math.max(0, s.hoursRemaining - 1) }
            : s
        )
      );
    }

    setCompletingId(null);
    setSummaryNote('');
    setHomeworkUrl('');
    notify(`Session marked ${status.toLowerCase()}`);
  }

  async function topUpStudent(id: string, hours = 1) {
    const res = await fetch(`/api/students/${id}/topup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return notify(extractError(data, 'Failed to add hours'));
    const addedCents = hours === 5 ? 25000 : hours * 5500;
    setStudents((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              hoursRemaining:
                typeof data?.student?.hoursRemaining === 'number'
                  ? data.student.hoursRemaining
                  : s.hoursRemaining + hours,
              totalPaidCents:
                typeof data?.student?.totalPaidCents === 'number'
                  ? data.student.totalPaidCents
                  : s.totalPaidCents + addedCents,
            }
          : s
      )
    );
    notify(`Added +${hours} hr${hours > 1 ? 's' : ''} (+$${(addedCents / 100).toFixed(0)})`);
  }

  async function addService(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        name: newSvcName,
        description: newSvcDesc,
        durationMin: 60,
        priceCents: Math.round(Number(newSvcPrice) * 100),
        packageHrs: Number(newSvcHrs),
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) return notify(extractError(data, 'Could not create service'));
    setServices((prev) => [...prev, data.service]);
    setNewSvcName('');
    setNewSvcDesc('');
    setNewSvcPrice('55');
    setNewSvcHrs('1');
    notify('Service added');
  }

  async function deleteService(id: string) {
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    const data = await res.json().catch(() => null);
    if (!res.ok) return notify(extractError(data, 'Could not delete service'));
    setServices((prev) => prev.filter((s) => s.id !== id));
    notify('Service removed');
  }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/pro/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        ...settings,
        workStartHour: Number(settings.workStartHour),
        workEndHour: Number(settings.workEndHour),
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return notify(extractError(data, 'Failed to save settings'));
    }
    notify('Portal settings saved');
    router.refresh();
  }

  const timezoneChoices = TIMEZONE_OPTIONS.includes(settings.timezone)
    ? TIMEZONE_OPTIONS
    : [settings.timezone, ...TIMEZONE_OPTIONS];

  return (
    <div className="space-y-6">
      {/* 3-Tab Focused Workspace Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#DCD6C8] pb-4">
        <div
          role="tablist"
          aria-label="Studio Workspace Sections"
          className="inline-flex flex-wrap gap-1 rounded-xl border border-[#DCD6C8] bg-[#EFECE4] p-1 text-xs font-semibold"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'schedule'}
            onClick={() => setActiveTab('schedule')}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeTab === 'schedule'
                ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                : 'text-[#575248] hover:text-[#141413]'
            }`}
          >
            Schedule &amp; Queue ({confirmedBookings.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'clients'}
            onClick={() => setActiveTab('clients')}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeTab === 'clients'
                ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                : 'text-[#575248] hover:text-[#141413]'
            }`}
          >
            Clients &amp; Pack Balances ({students.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'settings'}
            onClick={() => setActiveTab('settings')}
            className={`rounded-lg px-3.5 py-1.5 transition ${
              activeTab === 'settings'
                ? 'bg-[#141413] text-[#F6F4EE] shadow-sm'
                : 'text-[#575248] hover:text-[#141413]'
            }`}
          >
            Services &amp; Settings ({services.length})
          </button>
        </div>

        {toast && (
          <span className="rounded-lg border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-1.5 font-mono text-xs font-semibold text-[#15803D]">
            {toast}
          </span>
        )}
      </div>

      {activeTab === 'schedule' ? (
        <>
          {/* Studio Quick-Start Launch Bar for New or Empty Studios */}
          {(bookings.length === 0 || students.length === 0) && (
            <div className="surface-card rounded-2xl border border-[#E5C6BE] bg-[#FDF2EF]/70 p-4 sm:p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    Studio Quick-Start Checklist
                  </div>
                  <p className="text-xs text-[#575248] mt-0.5">
                    Complete these 3 steps to accept your first paid session or pack booking.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(`${window.location.origin}/${settings.slug}`);
                    notify(`Copied ${window.location.origin}/${settings.slug}`);
                  }}
                  className="flex items-center justify-between rounded-xl border border-[#DCD6C8] bg-white px-3.5 py-2.5 text-left text-xs font-semibold text-[#141413] hover:border-[#141413] transition"
                >
                  <span>1. Copy Your Public 1-Link</span>
                  <Copy className="h-3.5 w-3.5 text-[#D94E28]" />
                </button>
                <button
                  type="button"
                  onClick={() => setQuickBookOpen(true)}
                  className="flex items-center justify-between rounded-xl border border-[#DCD6C8] bg-white px-3.5 py-2.5 text-left text-xs font-semibold text-[#141413] hover:border-[#141413] transition"
                >
                  <span>2. + Quick-Book First Client</span>
                  <Plus className="h-3.5 w-3.5 text-[#15803D]" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="flex items-center justify-between rounded-xl border border-[#DCD6C8] bg-white px-3.5 py-2.5 text-left text-xs font-semibold text-[#141413] hover:border-[#141413] transition"
                >
                  <span>3. Customize Packages &amp; Hours</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-[#575248]" />
                </button>
              </div>
            </div>
          )}

          {/* 4-Card Executive Bento Row */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            {/* Carbon Ink Next Up Priority Card */}
            <div className="surface-ink lg:col-span-5 rounded-2xl p-6 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#4ADE80]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
                  Next Up Priority
                </span>
                <span className="font-mono text-xs text-[#A8A295]">
                  {confirmedBookings.length} upcoming
                </span>
              </div>

              {nextBooking ? (
                <div className="space-y-3">
                  <div>
                    <div className="font-serif text-2xl text-[#F6F4EE]">
                      {nextBooking.studentName}
                    </div>
                    <div className="text-xs text-[#C8C2B6] mt-0.5">
                      {nextBooking.serviceName} ·{' '}
                      <span className="font-mono">
                        {formatSessionDate(nextBooking.startsAtIso)}
                      </span>
                    </div>
                    {nextBooking.note && (
                      <div className="mt-1.5 text-xs text-[#D8D3C8]">
                        <span className="font-mono text-[#A8A295]">Topic: </span>
                        {nextBooking.note}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {nextBooking.meetingUrl && (
                      <a
                        href={nextBooking.meetingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-white/20 transition"
                      >
                        <Video className="h-3.5 w-3.5 text-[#4ADE80]" />
                        Join Meet
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => openCompleteDrawer(nextBooking.id)}
                      className="rounded-lg bg-[#F6F4EE] px-3.5 py-2 text-xs font-semibold text-[#141413] hover:bg-white transition"
                    >
                      Complete &amp; Log Notes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-[#A8A295]">No upcoming sessions in queue.</div>
              )}
            </div>

            {/* Active Students Card */}
            <div className="surface-card lg:col-span-2 rounded-2xl p-5 flex flex-col justify-between">
              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
                Active Students
              </span>
              <div className="mt-3 flex flex-wrap items-baseline justify-between gap-1.5">
                <span className="font-serif text-4xl leading-none text-[#141413]">
                  {students.length}
                </span>
                {lowBalanceCount > 0 && (
                  <span className="rounded-full border border-[#FDE68A] bg-[#FEF3C7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#B45309]">
                    {lowBalanceCount} low hrs
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] text-[#6E685C]">Magic links active</p>
            </div>

            {/* Prepaid Pack Hours Card with Fulfillment Meter */}
            <div className="surface-card lg:col-span-2 rounded-2xl p-5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
                  Prepaid Pack Hrs
                </span>
                <span className="font-mono text-[10px] font-semibold text-[#15803D]">
                  {fulfillmentPct}% used
                </span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-serif text-4xl leading-none text-[#15803D]">
                  {totalHours}
                </span>
                <span className="font-mono text-xs font-semibold text-[#15803D]">hrs</span>
              </div>
              <div className="space-y-1">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EFECE4]">
                  <div
                    className="h-full rounded-full bg-[#15803D] transition-all"
                    style={{ width: `${fulfillmentPct}%` }}
                  />
                </div>
                <p className="text-[10px] font-mono text-[#6E685C]">
                  {completedBookings.length} done · {totalHours}h owed
                </p>
              </div>
            </div>

            {/* Collected Revenue Card */}
            <div className="surface-card lg:col-span-3 rounded-2xl p-5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
                  Collected Revenue
                </span>
                <span className="rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#15803D]">
                  0% fee
                </span>
              </div>
              <div className="font-serif text-4xl leading-none text-[#141413]">
                ${(totalRevenueCents / 100).toLocaleString()}
              </div>
              <p className="text-[11px] text-[#6E685C]">
                {completedBookings.length} completed lessons · {confirmedBookings.length} upcoming
              </p>
            </div>
          </div>

          {/* Sessions Queue */}
          <div id="sessions-queue" className="surface-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#141413]">Sessions Queue</h2>
                <p className="text-xs text-[#6E685C]">
                  Complete a session to deduct 1 hour and publish notes to the student&apos;s portal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuickBookOpen((v) => !v)}
                  className="inline-flex items-center gap-1 rounded-lg bg-[#D94E28] px-3 py-1.5 font-mono text-[11px] font-semibold text-white hover:bg-[#B83E1D] transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Quick-Book
                </button>

                {/* List Ledger vs 7-Day Studio Grid Switcher */}
                <div className="inline-flex rounded-lg border border-[#DCD6C8] bg-[#EFECE4] p-0.5 font-mono text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setQueueView('list')}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
                      queueView === 'list'
                        ? 'bg-[#141413] text-[#F6F4EE]'
                        : 'text-[#575248] hover:text-[#141413]'
                    }`}
                  >
                    <List className="h-3 w-3" />
                    List Ledger
                  </button>
                  <button
                    type="button"
                    onClick={() => setQueueView('grid')}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 transition ${
                      queueView === 'grid'
                        ? 'bg-[#141413] text-[#F6F4EE]'
                        : 'text-[#575248] hover:text-[#141413]'
                    }`}
                  >
                    <CalendarDays className="h-3 w-3" />
                    7-Day Grid
                  </button>
                </div>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6E685C]" />
                  <input
                    type="search"
                    aria-label="Search sessions"
                    placeholder="Search student or topic..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="surface-input w-48 sm:w-52 rounded-lg pl-8 pr-3 py-1.5 text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-1 rounded-lg border border-[#DCD6C8] bg-[#F6F4EE] p-1 text-[11px] font-mono">
                  {(
                    [
                      { key: 'ALL', count: bookings.length },
                      { key: 'CONFIRMED', count: confirmedBookings.length },
                      { key: 'COMPLETED', count: completedBookings.length },
                      { key: 'CANCELLED', count: cancelledBookings.length },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setFilter(tab.key)}
                      className={`rounded-md px-2.5 py-1 font-medium transition ${
                        filter === tab.key
                          ? 'bg-[#141413] text-[#F6F4EE]'
                          : 'text-[#575248] hover:text-[#141413]'
                      }`}
                    >
                      {tab.key} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {quickBookOpen && (
              <form
                onSubmit={handleQuickBookSubmit}
                className="surface-elevated rounded-xl p-4 sm:p-5 space-y-3.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                    + Quick-Book Session
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuickBookOpen(false)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#575248] hover:text-[#141413]"
                  >
                    <X className="h-3.5 w-3.5" />
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="qb-student-select"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Existing Student
                    </label>
                    <select
                      id="qb-student-select"
                      value={qbStudentSelect}
                      onChange={(e) => handleQuickSelectStudent(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    >
                      <option value="new">+ New Student</option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.hoursRemaining} hrs)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="qb-name"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Student Name
                    </label>
                    <input
                      id="qb-name"
                      type="text"
                      required
                      placeholder="Jordan Lee"
                      value={qbName}
                      onChange={(e) => setQbName(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qb-email"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Student Email
                    </label>
                    <input
                      id="qb-email"
                      type="email"
                      required
                      placeholder="jordan@example.com"
                      value={qbEmail}
                      onChange={(e) => setQbEmail(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-end">
                  <div>
                    <label
                      htmlFor="qb-service"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Service / Pack
                    </label>
                    <select
                      id="qb-service"
                      value={qbServiceId}
                      onChange={(e) => setQbServiceId(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    >
                      {services.map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.name} (${(svc.priceCents / 100).toFixed(0)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="qb-date"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Date
                    </label>
                    <input
                      id="qb-date"
                      type="date"
                      required
                      value={qbDate}
                      onChange={(e) => setQbDate(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qb-time"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Time
                    </label>
                    <input
                      id="qb-time"
                      type="time"
                      required
                      value={qbTime}
                      onChange={(e) => setQbTime(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="qb-note"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Topic Note
                    </label>
                    <input
                      id="qb-note"
                      type="text"
                      placeholder="Optional lesson topic"
                      value={qbNote}
                      onChange={(e) => setQbNote(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <label className="inline-flex items-center gap-2 text-xs text-[#141413] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={qbUseCredit}
                      onChange={(e) => setQbUseCredit(e.target.checked)}
                      className="h-4 w-4 rounded border-[#CEC7B6] accent-[#141413]"
                    />
                    Deduct from student&apos;s prepaid pack hours if available
                  </label>
                  <button
                    type="submit"
                    disabled={qbSubmitting}
                    className="rounded-lg bg-[#141413] px-4 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] disabled:opacity-50 transition"
                  >
                    {qbSubmitting ? 'Booking...' : 'Create Session Booking'}
                  </button>
                </div>
              </form>
            )}

            {queueView === 'grid' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-7">
                  {sevenDayColumns.map((col) => (
                    <div
                      key={col.iso}
                      className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/70 p-3 flex flex-col gap-2 min-h-[155px]"
                    >
                      <div className="flex items-center justify-between border-b border-[#DCD6C8] pb-2">
                        <div>
                          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#D94E28]">
                            {col.dayShort}
                          </div>
                          <div className="text-xs font-semibold text-[#141413]">{col.dateNum}</div>
                        </div>
                        <span className="rounded-full border border-[#DCD6C8] bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#575248]">
                          {col.sessions.length}
                        </span>
                      </div>

                      {col.sessions.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center font-mono text-[10px] text-[#8C867A]">
                          Open day
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {col.sessions.map((s) => (
                            <button
                              key={`grid-${s.id}`}
                              type="button"
                              onClick={() => openCompleteDrawer(s.id)}
                              className="w-full rounded-lg border border-[#DCD6C8] bg-white p-2 text-left hover:border-[#141413] transition space-y-1"
                            >
                              <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                                <span className="font-semibold text-[#141413]">
                                  {new Date(s.startsAtIso).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    s.status === 'CONFIRMED'
                                      ? 'bg-[#15803D]'
                                      : s.status === 'CANCELLED'
                                        ? 'bg-[#B91C1C]'
                                        : 'bg-[#6E685C]'
                                  }`}
                                />
                              </div>
                              <div className="truncate text-[11px] font-semibold text-[#141413]">
                                {s.studentName}
                              </div>
                              <div className="truncate text-[10px] text-[#6E685C]">
                                {s.serviceName}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="font-mono text-[11px] text-[#6E685C]">
                  Click any session block on the 7-day calendar to log notes or deduct pack hours.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
              {filteredBookings.length === 0 ? (
                <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-6 text-center text-xs text-[#6E685C]">
                  No {filter === 'ALL' ? '' : `${filter.toLowerCase()} `}sessions match your filter.
                </div>
              ) : (
                filteredBookings.map((b) => {
                  const studentRecord = students.find((st) => st.id === b.studentId);
                  return (
                    <div
                      key={b.id}
                      className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/55 p-4 text-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-semibold text-[#141413]">
                              {b.studentName}
                            </span>
                            <span className="text-[#575248]">· {b.serviceName}</span>
                            <span
                              className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${getStatusBadgeClass(
                                b.status
                              )}`}
                            >
                              {b.status}
                            </span>
                            {studentRecord && (
                              <span
                                className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold ${
                                  studentRecord.hoursRemaining <= 1
                                    ? 'border-[#FDE68A] bg-[#FEF3C7] text-[#B45309]'
                                    : 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]'
                                }`}
                              >
                                {studentRecord.hoursRemaining} hrs left
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2.5 font-mono text-[#6E685C]">
                            <span>{formatSessionDate(b.startsAtIso)}</span>
                            {studentRecord && (
                              <Link
                                href={`/p/${studentRecord.magicToken}`}
                                className="inline-flex items-center gap-0.5 font-semibold text-[#D94E28] hover:underline"
                              >
                                Passbook
                                <ArrowUpRight className="h-3 w-3" />
                              </Link>
                            )}
                          </div>
                          {b.note && (
                            <div className="text-[#141413]">
                              <span className="font-mono text-[#6E685C]">Topic: </span>
                              {b.note}
                            </div>
                          )}
                          {(b.sessionSummary || b.homeworkUrl) && (
                            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[#141413]">
                              {b.sessionSummary && (
                                <span>
                                  <span className="font-mono text-[#6E685C]">Summary: </span>
                                  {b.sessionSummary}
                                </span>
                              )}
                              {b.homeworkUrl && (() => {
                                const resolved = resolveHomeworkHref(b.homeworkUrl);
                                if (!resolved.href) return null;
                                return resolved.isInternal ? (
                                  <Link
                                    href={resolved.href}
                                    className="inline-flex items-center gap-1 rounded border border-[#CEC7B6] bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#D94E28] hover:border-[#141413] transition"
                                  >
                                    <FileText className="h-3 w-3" />
                                    Open Study Sheet
                                  </Link>
                                ) : (
                                  <a
                                    href={resolved.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 rounded border border-[#CEC7B6] bg-white px-2 py-0.5 font-mono text-[11px] font-semibold text-[#D94E28] hover:bg-[#EFECE4]"
                                  >
                                    <FileText className="h-3 w-3" />
                                    Homework Link
                                  </a>
                                );
                              })()}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {b.meetingUrl && b.status === 'CONFIRMED' && (
                            <a
                              href={b.meetingUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                            >
                              <Video className="h-3.5 w-3.5 text-[#15803D]" />
                              Join Call
                            </a>
                          )}
                          {b.status === 'CONFIRMED' && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setCompletingId(completingId === b.id ? null : b.id)
                                }
                                className="rounded-lg bg-[#141413] px-3 py-1.5 font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
                              >
                                Mark Done
                              </button>
                              <button
                                type="button"
                                onClick={() => updateBooking(b.id, 'CANCELLED')}
                                className="rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 font-semibold text-[#B91C1C] hover:bg-[#FEE2E2] transition"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {completingId === b.id && (
                        <div className="surface-elevated rounded-xl p-4 space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#575248] mr-1">
                                Templates:
                              </span>
                              {TAKEAWAY_PRESETS.map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => {
                                    setSummaryNote(preset.summary);
                                  }}
                                  className="inline-flex items-center gap-1 rounded-md border border-[#CEC7B6] bg-white px-2.5 py-1 font-mono text-[11px] text-[#141413] hover:border-[#D94E28] hover:text-[#D94E28] transition"
                                >
                                  <Sparkles className="h-3 w-3 text-[#D94E28]" />
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => setCompletingId(null)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-[#575248] hover:text-[#141413]"
                            >
                              <X className="h-3.5 w-3.5" />
                              Cancel
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 items-end">
                            <div>
                              <label
                                htmlFor={`summary-${b.id}`}
                                className="block text-[11px] font-medium text-[#575248] mb-1"
                              >
                                Session Takeaways
                              </label>
                              <input
                                id={`summary-${b.id}`}
                                type="text"
                                placeholder="What you covered (optional)"
                                value={summaryNote}
                                onChange={(e) => setSummaryNote(e.target.value)}
                                className="surface-input w-full rounded-lg px-3 py-2 text-xs"
                              />
                            </div>
                            <div>
                              <label
                                htmlFor={`hw-${b.id}`}
                                className="block text-[11px] font-medium text-[#575248] mb-1"
                              >
                                Homework / PDF URL
                              </label>
                              <input
                                id={`hw-${b.id}`}
                                type="url"
                                placeholder="https://... (optional)"
                                value={homeworkUrl}
                                onChange={(e) => setHomeworkUrl(e.target.value)}
                                className="surface-input w-full rounded-lg px-3 py-2 text-xs"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => updateBooking(b.id, 'COMPLETED')}
                              className="rounded-lg bg-[#15803D] px-3 py-2 font-semibold text-white hover:bg-[#166534] transition"
                            >
                              Confirm &amp; Deduct 1 hr
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
              </div>
            )}
          </div>
        </>
      ) : activeTab === 'clients' ? (
          <div className="surface-card rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#141413]">
                  Clients &amp; Package Balances
                </h2>
                <p className="text-xs text-[#6E685C]">
                  Manage active prepaid packs, copy private magic portals, or inspect client history.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('schedule');
                  setQuickBookOpen(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-[#D94E28] px-3 py-1.5 font-mono text-[11px] font-semibold text-white hover:bg-[#B83E1D] transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add / Quick-Book Client
              </button>
            </div>

            {students.length === 0 ? (
              <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] p-8 text-center space-y-3">
                <p className="text-sm font-medium text-[#141413]">No clients in your ledger yet.</p>
                <p className="text-xs text-[#6E685C]">
                  Share your booking link or add your first client directly to start tracking pack
                  hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('schedule');
                    setQuickBookOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-4 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#D94E28] transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Quick-Book First Client
                </button>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCD6C8] font-mono text-[11px] uppercase tracking-wider text-[#6E685C]">
                    <th className="py-2.5 pr-4">Student</th>
                    <th className="py-2.5 pr-4">Magic Portal</th>
                    <th className="py-2.5 pr-4">Total Paid</th>
                    <th className="py-2.5 pr-4">Remaining Balance</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4]">
                  {students.map((s) => {
                    const barPct = Math.min(100, Math.round((s.hoursRemaining / 5) * 100));
                    const studentHistory = bookings.filter((b) => b.studentId === s.id);
                    const isExpanded = expandedStudentId === s.id;
                    return (
                      <Fragment key={s.id}>
                        <tr className="hover:bg-[#F6F4EE]/60 transition">
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#DCD6C8] bg-[#EFECE4] font-mono text-[11px] font-semibold text-[#141413]">
                                {getInitials(s.name) || 'ST'}
                              </span>
                              <div>
                                <div className="font-semibold text-[#141413]">{s.name}</div>
                                <div className="text-[#6E685C]">{s.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 font-mono">
                            <Link
                              href={`/p/${s.magicToken}`}
                              className="inline-flex items-center gap-1 font-semibold text-[#D94E28] hover:underline"
                            >
                              Open Portal
                              <ArrowUpRight className="h-3 w-3" />
                            </Link>
                          </td>
                          <td className="py-3.5 pr-4 font-mono font-semibold text-[#141413]">
                            ${(s.totalPaidCents / 100).toFixed(0)}
                          </td>
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-2.5">
                              <span
                                className={`inline-block rounded-full border px-2.5 py-0.5 font-mono font-semibold ${
                                  s.hoursRemaining <= 1
                                    ? 'border-[#FDE68A] bg-[#FEF3C7] text-[#B45309]'
                                    : 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]'
                                }`}
                              >
                                {s.hoursRemaining} hrs
                              </span>
                              <div className="hidden sm:block h-1.5 w-16 overflow-hidden rounded-full bg-[#EFECE4]">
                                <div
                                  className={`h-full rounded-full ${
                                    s.hoursRemaining <= 1 ? 'bg-[#D97706]' : 'bg-[#15803D]'
                                  }`}
                                  style={{ width: `${barPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedStudentId(isExpanded ? null : s.id)
                              }
                              className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 font-semibold text-[#575248] hover:text-[#141413] transition"
                            >
                              History ({studentHistory.length})
                              {isExpanded ? (
                                <ChevronUp className="h-3 w-3" />
                              ) : (
                                <ChevronDown className="h-3 w-3" />
                              )}
                            </button>
                            <Link
                              href={`/${settings.slug}?token=${encodeURIComponent(s.magicToken)}`}
                              className="inline-block rounded-lg border border-[#CEC7B6] bg-[#F6F4EE] px-2.5 py-1.5 font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                            >
                              Book Slot
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(
                                  `${window.location.origin}/p/${s.magicToken}`
                                );
                                notify(`Copied link for ${s.name}`);
                              }}
                              className="rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
                            >
                              Copy Link
                            </button>
                            <button
                              type="button"
                              onClick={() => topUpStudent(s.id, 1)}
                              className="rounded-lg bg-[#141413] px-2.5 py-1.5 font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
                            >
                              +1 hr
                            </button>
                            <button
                              type="button"
                              onClick={() => topUpStudent(s.id, 5)}
                              className="rounded-lg bg-[#D94E28] px-2.5 py-1.5 font-semibold text-white hover:bg-[#B83E1D] transition"
                            >
                              +5 hr Pack
                            </button>
                          </td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-[#F6F4EE]/80">
                            <td colSpan={5} className="px-4 py-4">
                              <div className="space-y-3">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#575248]">
                                    Session Ledger for {s.name}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const portalUrl = `${window.location.origin}/p/${s.magicToken}`;
                                      navigator.clipboard?.writeText(
                                        `Hi ${s.name} — quick heads-up that you have ${s.hoursRemaining} hr${s.hoursRemaining === 1 ? '' : 's'} left in your package. You can check your session notes or book your next pack anytime here: ${portalUrl}`
                                      );
                                      notify(`Copied renewal note for ${s.name}`);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#141413] hover:border-[#D94E28] hover:text-[#D94E28] transition"
                                  >
                                    <Copy className="h-3 w-3 text-[#D94E28]" />
                                    Copy Renewal Note
                                  </button>
                                </div>

                                {studentHistory.length === 0 ? (
                                  <p className="text-xs text-[#6E685C]">
                                    No bookings logged yet for this student.
                                  </p>
                                ) : (
                                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {studentHistory.map((item) => (
                                      <div
                                        key={`hist-${item.id}`}
                                        className="rounded-xl border border-[#DCD6C8] bg-white p-3 space-y-1 text-[11px]"
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="font-semibold text-[#141413] truncate">
                                            {item.serviceName}
                                          </span>
                                          <span
                                            className={`rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold ${getStatusBadgeClass(
                                              item.status
                                            )}`}
                                          >
                                            {item.status}
                                          </span>
                                        </div>
                                        <div className="font-mono text-[#6E685C]">
                                          {new Date(item.startsAtIso).toLocaleDateString()}
                                        </div>
                                        {(item.note || item.sessionSummary) && (
                                          <p className="text-[#575248] line-clamp-2">
                                            {item.sessionSummary || item.note}
                                          </p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            )}
          </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Services & Packs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="surface-card rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-semibold text-[#141413]">Services &amp; Packs</h2>
              <div className="space-y-2.5">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/60 p-3.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-[#141413]">
                        {svc.name}{' '}
                        <span className="font-mono text-[#6E685C]">({svc.packageHrs}h)</span>
                      </div>
                      {svc.description && (
                        <div className="text-[#575248] mt-0.5">{svc.description}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-semibold text-[#141413]">
                        ${(svc.priceCents / 100).toFixed(0)}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteService(svc.id)}
                        className="font-semibold text-[#B91C1C] hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addService} className="space-y-3 border-t border-[#EFECE4] pt-4">
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="svc-name"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Service Name
                    </label>
                    <input
                      id="svc-name"
                      type="text"
                      required
                      placeholder="e.g. 10-Lesson Pack"
                      value={newSvcName}
                      onChange={(e) => setNewSvcName(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="svc-desc"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Description
                    </label>
                    <input
                      id="svc-desc"
                      type="text"
                      placeholder="Short subtitle (optional)"
                      value={newSvcDesc}
                      onChange={(e) => setNewSvcDesc(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2.5 items-end">
                  <div>
                    <label
                      htmlFor="svc-price"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Price ($)
                    </label>
                    <input
                      id="svc-price"
                      type="number"
                      min="0"
                      required
                      value={newSvcPrice}
                      onChange={(e) => setNewSvcPrice(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="svc-hrs"
                      className="block text-[11px] font-medium text-[#575248] mb-1"
                    >
                      Pack Hours
                    </label>
                    <input
                      id="svc-hrs"
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={newSvcHrs}
                      onChange={(e) => setNewSvcHrs(e.target.value)}
                      className="surface-input w-full rounded-lg px-2.5 py-2 font-mono text-xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#141413] px-3 py-2 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
                  >
                    + Add
                  </button>
                </div>
              </form>
            </div>

            {/* Live Public Card Preview */}
            <div className="surface-elevated rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
                  Live Public Card Preview
                </span>
                <span className="font-mono text-[11px] text-[#575248]">
                  slotlink.app/{settings.slug || 'slug'}
                </span>
              </div>
              <div className="surface-card rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#141413] font-mono text-xs font-semibold text-[#F6F4EE]">
                    {getInitials(settings.name) || 'SL'}
                  </div>
                  <div>
                    <div className="font-serif text-xl text-[#141413]">
                      {settings.name || 'Your Name'}
                    </div>
                    <div className="text-xs text-[#575248]">
                      {settings.tagline || 'Specialty Tagline'}
                    </div>
                  </div>
                </div>
                {settings.bio && <p className="text-xs text-[#575248]">{settings.bio}</p>}
                <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-[#6E685C]">
                  <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5">
                    {String(settings.workStartHour).padStart(2, '0')}:00–
                    {String(settings.workEndHour).padStart(2, '0')}:00 UTC
                  </span>
                  <span className="rounded border border-[#DCD6C8] bg-[#F6F4EE] px-2 py-0.5">
                    {settings.timezone}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Portal Settings */}
          <form onSubmit={saveSettings} className="lg:col-span-7 surface-card rounded-2xl p-6 space-y-4">
            <h2 className="text-base font-semibold text-[#141413]">Portal Settings</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="set-name" className="block text-[11px] font-medium text-[#575248] mb-1">
                    Display Name
                  </label>
                  <input
                    id="set-name"
                    type="text"
                    required
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="surface-input w-full rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="set-slug" className="block text-[11px] font-medium text-[#575248] mb-1">
                    Portal Slug
                  </label>
                  <input
                    id="set-slug"
                    type="text"
                    required
                    value={settings.slug}
                    onChange={(e) => setSettings({ ...settings, slug: e.target.value })}
                    className="surface-input w-full rounded-lg px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="set-tagline" className="block text-[11px] font-medium text-[#575248] mb-1">
                  Specialty Tagline
                </label>
                <input
                  id="set-tagline"
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="surface-input w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label htmlFor="set-bio" className="block text-[11px] font-medium text-[#575248] mb-1">
                  Public Bio
                </label>
                <textarea
                  id="set-bio"
                  rows={3}
                  maxLength={500}
                  value={settings.bio}
                  onChange={(e) => setSettings({ ...settings, bio: e.target.value })}
                  placeholder="Share your teaching experience, results, and what students can expect..."
                  className="surface-input w-full rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label htmlFor="set-tz" className="block text-[11px] font-medium text-[#575248] mb-1">
                    Timezone
                  </label>
                  <select
                    id="set-tz"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                    className="surface-input w-full rounded-lg px-3 py-2 font-mono text-xs"
                  >
                    {timezoneChoices.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="set-start" className="block text-[11px] font-medium text-[#575248] mb-1">
                    Work Start (UTC hr)
                  </label>
                  <input
                    id="set-start"
                    type="number"
                    min="0"
                    max="23"
                    required
                    value={settings.workStartHour}
                    onChange={(e) =>
                      setSettings({ ...settings, workStartHour: Number(e.target.value) })
                    }
                    className="surface-input w-full rounded-lg px-3 py-2 font-mono text-xs"
                  />
                </div>
                <div>
                  <label htmlFor="set-end" className="block text-[11px] font-medium text-[#575248] mb-1">
                    Work End (UTC hr)
                  </label>
                  <input
                    id="set-end"
                    type="number"
                    min="1"
                    max="24"
                    required
                    value={settings.workEndHour}
                    onChange={(e) =>
                      setSettings({ ...settings, workEndHour: Number(e.target.value) })
                    }
                    className="surface-input w-full rounded-lg px-3 py-2 font-mono text-xs"
                  />
                </div>
              </div>

              {/* 24-Hour Visual Working-Hours Timeline Bar */}
              <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/80 p-3.5 space-y-2">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#575248]">
                  <span className="uppercase tracking-wider font-semibold">
                    24h Availability Window (UTC)
                  </span>
                  <span className="font-semibold text-[#D94E28]">
                    {String(settings.workStartHour).padStart(2, '0')}:00 –{' '}
                    {String(settings.workEndHour).padStart(2, '0')}:00 UTC (
                    {Math.max(0, settings.workEndHour - settings.workStartHour)}h open)
                  </span>
                </div>
                <div className="grid grid-cols-12 sm:grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
                  {Array.from({ length: 24 }, (_, hour) => {
                    const isOpen =
                      hour >= settings.workStartHour && hour < settings.workEndHour;
                    return (
                      <div key={hour} className="space-y-1 text-center">
                        <div
                          title={`${String(hour).padStart(2, '0')}:00 UTC`}
                          className={`h-3.5 rounded-sm transition ${
                            isOpen
                              ? 'bg-[#D94E28] border border-[#B83E1D]'
                              : 'bg-[#E5E0D4] border border-[#D5CFC0]'
                          }`}
                        />
                        {hour % 6 === 0 && (
                          <div className="font-mono text-[9px] text-[#6E685C]">
                            {String(hour).padStart(2, '0')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap gap-5 pt-1 text-xs font-medium text-[#141413]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.smsEnabled}
                    onChange={(e) => setSettings({ ...settings, smsEnabled: e.target.checked })}
                    className="h-4 w-4 rounded border-[#CEC7B6] accent-[#141413]"
                  />
                  SMS reminders enabled
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.upfrontPay}
                    onChange={(e) => setSettings({ ...settings, upfrontPay: e.target.checked })}
                    className="h-4 w-4 rounded border-[#CEC7B6] accent-[#141413]"
                  />
                  Require upfront pack payment
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#141413] px-4 py-2.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
            >
              Save Settings
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
