import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedPro } from '@/lib/auth';

const RESERVED_SLUGS = new Set([
  'dashboard',
  'login',
  'signup',
  'notes',
  'privacy',
  'terms',
  'refund-policy',
  'api',
  'p',
]);

const SettingsSchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1).max(100),
  tagline: z.string().max(140),
  bio: z.string().max(500).optional(),
  timezone: z.string().max(80).optional(),
  slug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  workStartHour: z.number().int().min(0).max(23),
  workEndHour: z.number().int().min(1).max(24),
  smsEnabled: z.boolean(),
  upfrontPay: z.boolean(),
});

export async function PATCH(req: NextRequest) {
  const authed = await getAuthenticatedPro();
  if (!authed && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = SettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Invalid settings. Slug must use lowercase letters, numbers, or hyphens.',
        details: parsed.error.flatten(),
      },
      { status: 400 }
    );
  }

  const { userId, ...data } = parsed.data;
  if (authed && authed.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (RESERVED_SLUGS.has(data.slug)) {
    return NextResponse.json({ error: 'This slug is reserved' }, { status: 400 });
  }

  if (data.workEndHour <= data.workStartHour) {
    return NextResponse.json({ error: 'Work end hour must be after start hour' }, { status: 400 });
  }

  const slugOwner = await prisma.user.findUnique({ where: { slug: data.slug } });
  if (slugOwner && slugOwner.id !== userId) {
    return NextResponse.json({ error: 'Slug is already taken' }, { status: 409 });
  }

  const user = await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ user });
}
