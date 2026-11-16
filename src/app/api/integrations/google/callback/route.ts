import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { setSessionCookie, verifySignedValue } from '@/lib/auth';

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

  const tokens = await tokenRes.json();
  const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const profile = await profileRes.json();
  if (!profile?.email) {
    return NextResponse.redirect(`${appUrl}/dashboard?error=no_email`);
  }

  const baseSlug = String(profile.email.split('@')[0])
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

  const user = await prisma.user.upsert({
    where: { email: profile.email.toLowerCase() },
    update: {
      ...(tokens.refresh_token ? { googleRefreshToken: tokens.refresh_token } : {}),
    },
    create: {
      email: profile.email.toLowerCase(),
      name: profile.name ?? 'Tutor',
      slug: `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`,
      googleRefreshToken: tokens.refresh_token ?? null,
    },
  });

  await setSessionCookie(user.id);
  return NextResponse.redirect(`${appUrl}/dashboard?connected=google`);
}
