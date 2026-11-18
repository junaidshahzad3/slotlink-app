import { escapeHtml, isSafeHttpUrl } from './security';

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? 'SlotLink <onboarding@resend.dev>';
  if (!apiKey) return false;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });

  return res.ok;
}

export function buildBookingConfirmationEmail(opts: {
  studentName: string;
  proName: string;
  serviceName: string;
  startsAtIso: string;
  magicUrl: string;
  meetingUrl?: string;
}) {
  const safeProName = escapeHtml(opts.proName);
  const safeStudentName = escapeHtml(opts.studentName);
  const safeServiceName = escapeHtml(opts.serviceName);
  const safeStartsAt = escapeHtml(opts.startsAtIso);
  const safeMeetingUrl =
    opts.meetingUrl && isSafeHttpUrl(opts.meetingUrl) ? escapeHtml(opts.meetingUrl) : '';
  const safeMagicUrl = isSafeHttpUrl(opts.magicUrl) ? escapeHtml(opts.magicUrl) : '#';

  return `
    <div style="font-family: Inter, sans-serif; color: #111; max-width: 520px; margin: 0 auto;">
      <h2>Booking Confirmed with ${safeProName}</h2>
      <p>Hi ${safeStudentName},</p>
      <p>Your <strong>${safeServiceName}</strong> session is confirmed for <strong>${safeStartsAt}</strong>.</p>
      ${safeMeetingUrl ? `<p>Join Link: <a href="${safeMeetingUrl}">${safeMeetingUrl}</a></p>` : ''}
      <p>View your remaining package hours, reschedule, or check homework notes anytime (no password needed):</p>
      <p><a href="${safeMagicUrl}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Open Student Portal</a></p>
    </div>
  `;
}

export function buildCancellationEmail(opts: {
  studentName: string;
  proName: string;
  serviceName: string;
  startsAtIso: string;
  rebookUrl: string;
}) {
  const safeProName = escapeHtml(opts.proName);
  const safeStudentName = escapeHtml(opts.studentName);
  const safeServiceName = escapeHtml(opts.serviceName);
  const safeStartsAt = escapeHtml(opts.startsAtIso);
  const safeRebookUrl = isSafeHttpUrl(opts.rebookUrl) ? escapeHtml(opts.rebookUrl) : '#';

  return `
    <div style="font-family: Inter, sans-serif; color: #111; max-width: 520px; margin: 0 auto;">
      <h2>Session Cancelled</h2>
      <p>Hi ${safeStudentName},</p>
      <p>Your <strong>${safeServiceName}</strong> session with ${safeProName} on <strong>${safeStartsAt}</strong> has been cancelled.</p>
      <p><a href="${safeRebookUrl}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:8px;">Book a New Time</a></p>
    </div>
  `;
}
