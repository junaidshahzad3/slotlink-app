import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';

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

const SignupSchema = z.object({
  name: z.string().trim().min(2, 'Full name is required').max(100),
  email: z.string().trim().email('Valid email is required'),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .min(2, 'Handle must be at least 2 characters')
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Handle must use lowercase letters, numbers, or hyphens'),
  tagline: z.string().trim().min(2, 'Specialty tagline is required').max(140),
  timezone: z.string().trim().min(2).max(80).default('America/New_York'),
  singlePriceDollars: z.number().min(5).max(1000).default(60),
  packPriceDollars: z.number().min(20).max(5000).default(275),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = SignupSchema.safeParse(body);

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0]?.message ?? 'Invalid signup details';
    return NextResponse.json(
      { error: firstIssue, details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const normalizedEmail = data.email.toLowerCase();

  if (RESERVED_SLUGS.has(data.slug)) {
    return NextResponse.json(
      { error: `The handle "${data.slug}" is reserved. Please choose another.` },
      { status: 400 }
    );
  }

  const [existingEmail, existingSlug] = await Promise.all([
    prisma.user.findUnique({ where: { email: normalizedEmail } }),
    prisma.user.findUnique({ where: { slug: data.slug } }),
  ]);

  if (existingEmail) {
    return NextResponse.json(
      { error: 'An account with this email already exists. Sign in instead.' },
      { status: 409 }
    );
  }

  if (existingSlug) {
    return NextResponse.json(
      { error: `The handle "${data.slug}" is already taken. Try another slug.` },
      { status: 409 }
    );
  }

  const user = await prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        name: data.name,
        email: normalizedEmail,
        slug: data.slug,
        tagline: data.tagline,
        timezone: data.timezone,
        subscriptionTier: 'TRIAL',
        workStartHour: 13,
        workEndHour: 20,
      },
    });

    await tx.service.createMany({
      data: [
        {
          userId: createdUser.id,
          name: '15m Intro Call',
          description: 'Free goal & level check',
          durationMin: 15,
          priceCents: 0,
          packageHrs: 0,
        },
        {
          userId: createdUser.id,
          name: '1-on-1 Session',
          description: '60-minute private session',
          durationMin: 60,
          priceCents: Math.round(data.singlePriceDollars * 100),
          packageHrs: 1,
        },
        {
          userId: createdUser.id,
          name: '5-Session Pack',
          description: '5 prepaid hours · Auto-tracked in client passbook',
          durationMin: 60,
          priceCents: Math.round(data.packPriceDollars * 100),
          packageHrs: 5,
        },
      ],
    });

    return createdUser;
  });

  await setSessionCookie(user.id);
  return NextResponse.json(
    { user: { id: user.id, email: user.email, slug: user.slug } },
    { status: 201 }
  );
}
