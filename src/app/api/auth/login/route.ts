import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setSessionCookie } from '@/lib/auth';

const LoginSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user) {
    return NextResponse.json({ error: 'Account not found. Connect with Google first.' }, { status: 404 });
  }

  await setSessionCookie(user.id);
  return NextResponse.json({ user: { id: user.id, email: user.email, slug: user.slug } });
}
