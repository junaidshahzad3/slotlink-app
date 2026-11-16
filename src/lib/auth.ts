import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const COOKIE_NAME = 'slotlink_session';

function getSecret(): string {
  return process.env.AUTH_SECRET ?? 'dev-insecure-secret-change-in-prod';
}

export function signValue(payload: string): string {
  const sig = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySignedValue(token: string | undefined): string | null {
  if (!token) return null;
  const idx = token.lastIndexOf('.');
  if (idx <= 0) return null;
  const payload = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = createHmac('sha256', getSecret()).update(payload).digest('hex');
  try {
    return timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) ? payload : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, signValue(userId), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAuthenticatedPro() {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;
  const userId = verifySignedValue(raw);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
