import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const pro = await prisma.user.upsert({
    where: { slug: 'sarah-math' },
    update: {},
    create: {
      email: 'sarah@slotlink.app',
      name: 'Sarah Chen',
      tagline: 'SAT & AP Calculus Tutor',
      bio: '8+ years helping high school students boost SAT Math scores by 120+ points.',
      slug: 'sarah-math',
      timezone: 'America/New_York',
      workStartHour: 14,
      workEndHour: 20,
      subscriptionTier: 'PRO_19',
      smsEnabled: true,
      upfrontPay: true,
    },
  });

  const existingServices = await prisma.service.count({ where: { userId: pro.id } });
  if (existingServices === 0) {
    await prisma.service.createMany({
      data: [
        {
          userId: pro.id,
          name: '15m Intro Call',
          description: 'Quick goal & level check',
          durationMin: 15,
          priceCents: 0,
          packageHrs: 0,
        },
        {
          userId: pro.id,
          name: '1-on-1 Lesson',
          description: '60m focused session',
          durationMin: 60,
          priceCents: 5500,
          packageHrs: 1,
        },
        {
          userId: pro.id,
          name: '5-Lesson Pack',
          description: 'Save $25 • Auto-tracked',
          durationMin: 60,
          priceCents: 25000,
          packageHrs: 5,
        },
      ],
    });
  }

  const services = await prisma.service.findMany({ where: { userId: pro.id } });
  const packService = services.find((s) => s.packageHrs === 5) ?? services[0];
  const singleService = services.find((s) => s.packageHrs === 1) ?? packService;

  const alex = await prisma.student.upsert({
    where: { userId_email: { userId: pro.id, email: 'alex.r@example.com' } },
    update: {
      magicToken: 'sl_demo_alex_94a2k',
      hoursRemaining: 3,
      totalPaidCents: 25000,
    },
    create: {
      userId: pro.id,
      name: 'Alex Rivera',
      email: 'alex.r@example.com',
      magicToken: 'sl_demo_alex_94a2k',
      hoursRemaining: 3,
      totalPaidCents: 25000,
    },
  });

  const maya = await prisma.student.upsert({
    where: { userId_email: { userId: pro.id, email: 'maya.lin@example.com' } },
    update: {
      magicToken: 'sl_demo_maya_77b1x',
      hoursRemaining: 1,
      totalPaidCents: 5500,
    },
    create: {
      userId: pro.id,
      name: 'Maya Lin',
      email: 'maya.lin@example.com',
      magicToken: 'sl_demo_maya_77b1x',
      hoursRemaining: 1,
      totalPaidCents: 5500,
    },
  });

  if (packService && singleService) {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60_000);
    tomorrow.setUTCHours(15, 0, 0, 0);

    const existingConfirmedAlex = await prisma.booking.findFirst({
      where: { userId: pro.id, studentId: alex.id, status: 'CONFIRMED' },
    });

    if (existingConfirmedAlex) {
      await prisma.booking.update({
        where: { id: existingConfirmedAlex.id },
        data: {
          note: 'Practice Test #4 — Quadratics & Systems',
          meetingUrl: 'https://meet.google.com/abc-defg-hij',
        },
      });
    } else {
      await prisma.booking.create({
        data: {
          userId: pro.id,
          studentId: alex.id,
          serviceId: packService.id,
          startsAt: tomorrow,
          endsAt: new Date(tomorrow.getTime() + 60 * 60_000),
          status: 'CONFIRMED',
          note: 'Practice Test #4 — Quadratics & Systems',
          meetingUrl: 'https://meet.google.com/abc-defg-hij',
        },
      });
    }

    const alexCompletedCount = await prisma.booking.count({
      where: { userId: pro.id, studentId: alex.id, status: 'COMPLETED' },
    });

    if (alexCompletedCount === 0) {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60_000);
      sevenDaysAgo.setUTCHours(16, 0, 0, 0);

      const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60_000);
      fourteenDaysAgo.setUTCHours(16, 0, 0, 0);

      await prisma.booking.createMany({
        data: [
          {
            userId: pro.id,
            studentId: alex.id,
            serviceId: packService.id,
            startsAt: sevenDaysAgo,
            endsAt: new Date(sevenDaysAgo.getTime() + 60 * 60_000),
            status: 'COMPLETED',
            note: 'SAT Math Module 2 Timing Drill',
            sessionSummary:
              'Mastered quadratic factoring and vertex form conversions. Timed drills dropped errors by 40%.',
            homeworkUrl: 'https://slotlink.app/files/sat-module-2-drill.pdf',
          },
          {
            userId: pro.id,
            studentId: alex.id,
            serviceId: packService.id,
            startsAt: fourteenDaysAgo,
            endsAt: new Date(fourteenDaysAgo.getTime() + 60 * 60_000),
            status: 'COMPLETED',
            note: 'Diagnostic Baseline & Goal Plan',
            sessionSummary:
              'Diagnostic review: strong geometry base; focused next on linear systems and word problems.',
            homeworkUrl: 'https://slotlink.app/files/algebra-foundations.pdf',
          },
        ],
      });
    }

    const mayaBookingCount = await prisma.booking.count({
      where: { userId: pro.id, studentId: maya.id },
    });

    if (mayaBookingCount === 0) {
      const twoDaysLater = new Date(Date.now() + 2 * 24 * 60 * 60_000);
      twoDaysLater.setUTCHours(17, 0, 0, 0);

      await prisma.booking.create({
        data: {
          userId: pro.id,
          studentId: maya.id,
          serviceId: singleService.id,
          startsAt: twoDaysLater,
          endsAt: new Date(twoDaysLater.getTime() + 60 * 60_000),
          status: 'CONFIRMED',
          note: 'AP Calculus BC — Integration by Parts',
          meetingUrl: 'https://meet.google.com/xyz-uvwx-rst',
        },
      });
    }
  }

  console.log('Seed complete for pro:', pro.slug);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
