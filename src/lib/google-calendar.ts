type BusyInterval = { start: string; end: string };

async function getGoogleAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.access_token ?? null;
}

export async function getGoogleBusyIntervals(
  refreshToken: string | null,
  timeMinIso: string,
  timeMaxIso: string
): Promise<BusyInterval[]> {
  if (!refreshToken) return [];
  const token = await getGoogleAccessToken(refreshToken);
  if (!token) return [];

  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin: timeMinIso,
      timeMax: timeMaxIso,
      items: [{ id: 'primary' }],
    }),
  });

  if (!res.ok) return [];
  const data = await res.json();
  return data?.calendars?.primary?.busy ?? [];
}

export async function createGoogleCalendarEvent(opts: {
  refreshToken: string | null;
  summary: string;
  description: string;
  startsAtIso: string;
  endsAtIso: string;
  attendeeEmail: string;
}): Promise<{ eventId: string; meetingUrl: string } | null> {
  if (!opts.refreshToken) return null;
  const token = await getGoogleAccessToken(opts.refreshToken);
  if (!token) return null;

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: opts.summary,
        description: opts.description,
        start: { dateTime: opts.startsAtIso },
        end: { dateTime: opts.endsAtIso },
        attendees: [{ email: opts.attendeeEmail }],
        conferenceData: {
          createRequest: {
            requestId: 'sl-' + Date.now(),
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      }),
    }
  );

  if (!res.ok) return null;
  const created = await res.json();
  return {
    eventId: created.id ?? '',
    meetingUrl: created.hangoutLink ?? created.htmlLink ?? '',
  };
}

export async function deleteGoogleCalendarEvent(
  refreshToken: string | null,
  eventId: string | null
): Promise<boolean> {
  if (!refreshToken || !eventId) return false;
  const token = await getGoogleAccessToken(refreshToken);
  if (!token) return false;

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.ok || res.status === 404;
}
