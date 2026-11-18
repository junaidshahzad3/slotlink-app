import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      integrations: {
        googleCalendar: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
        resendEmail: Boolean(process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_...')),
        paddleBilling: Boolean(
          process.env.PADDLE_WEBHOOK_SECRET &&
            !process.env.PADDLE_WEBHOOK_SECRET.startsWith('pdl_ntfset_...')
        ),
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: 'Service unavailable',
      },
      { status: 503 }
    );
  }
}
