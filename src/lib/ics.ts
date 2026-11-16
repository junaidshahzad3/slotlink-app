export interface SessionIcsOptions {
  title: string;
  description?: string;
  location?: string;
  startsAtIso: string;
  durationMin: number;
  filename?: string;
}

function toIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r\n|\r|\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

/**
 * Generates an RFC 5545 calendar event and triggers an instant .ics download in the browser.
 */
export function downloadSessionIcs({
  title,
  description = '',
  location = 'Google Meet (via SlotLink)',
  startsAtIso,
  durationMin,
  filename = 'slotlink-session.ics',
}: SessionIcsOptions): void {
  if (typeof window === 'undefined') return;
  const start = new Date(startsAtIso);
  if (Number.isNaN(start.getTime())) return;

  const end = new Date(start.getTime() + Math.max(15, durationMin) * 60_000);
  const now = new Date();
  const uid = `slotlink-${start.getTime()}-${Math.random().toString(36).slice(2, 8)}@slotlink.app`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SlotLink//Solo Educator OS//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    `LOCATION:${escapeIcsText(location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.ics') ? filename : `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
