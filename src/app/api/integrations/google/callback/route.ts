import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro, setSessionCookie, verifySignedValue } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const store = await cookies();
  const expectedState = verifySignedValue(store.get('google_oauth_state')?.value);
  store.delete('google_oauth_state');

  if (!code || !state || state !== expectedState) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=oauth_state`);
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      redirect_uri: `${appUrl}/api/integrations/google/callback`,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=token_exchange`);
  }

  const tokens = await tokenRes.json().catch(() => null);
  if (!tokens?.access_token) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=token_exchange`);
  }

  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!profileRes.ok) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=profile_fetch`);
  }

  const profile = await profileRes.json().catch(() => null);
  if (!profile?.email || profile.verified_email !== true) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=unverified_email`);
  }

  const authed = await getAuthenticatedPro();
  if (authed) {
    if (tokens.refresh_token) {
      await prisma.user.update({
        where: { id: authed.id },
        data: { googleRefreshToken: tokens.refresh_token },
      });
    }
    return NextResponse.redirect(`${appUrl}/dashboard?connected=google`);
  }

  const normalizedEmail = String(profile.email).trim().toLowerCase();
  const baseSlug =
    normalizedEmail
      .split('@')[0]
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'tutor';

  let user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (user) {
    if (tokens.refresh_token) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleRefreshToken: tokens.refresh_token },
      });
    }
  } else {
    user = await prisma.$transaction(async (tx) => {
      const candidateSlug = `${baseSlug}-${randomBytes(3).toString('hex')}`;
      const created = await tx.user.create({
        data: {
          email: normalizedEmail,
          name: profile.name ? String(profile.name).slice(0, 100) : 'Tutor',
          slug: candidateSlug,
          googleRefreshToken: tokens.refresh_token ?? null,
          subscriptionTier: 'TRIAL',
          workStartHour: 13,
          workEndHour: 20,
        },
      });

      await tx.service.createMany({
        data: [
          {
            userId: created.id,
            name: '15m Intro Call',
            description: 'Free goal & level check',
            durationMin: 15,
            priceCents: 0,
            packageHrs: 0,
          },
          {
            userId: created.id,
            name: '1-on-1 Session',
            description: '60-minute private session',
            durationMin: 60,
            priceCents: 6000,
            packageHrs: 1,
          },
          {
            userId: created.id,
            name: '5-Session Pack',
            description: '5 prepaid hours · Auto-tracked in client passbook',
            durationMin: 60,
            priceCents: 27500,
            packageHrs: 5,
          },
        ],
      });

      return created;
    });
  }

  await setSessionCookie(user.id);
  return NextResponse.redirect(`${appUrl}/dashboard?connected=google`);
}
