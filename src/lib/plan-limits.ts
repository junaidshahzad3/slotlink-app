import type { SubscriptionTier } from '@prisma/client';

export function isTrialExpired(createdAt: Date, tier: SubscriptionTier): boolean {
  if (tier !== 'TRIAL') return false;
  const days = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  return days > 14;
}

export function canUseSmsReminders(tier: SubscriptionTier): boolean {
  return tier === 'PRO_19' || tier === 'TRIAL';
}

export function canUseCustomDomain(tier: SubscriptionTier): boolean {
  return tier === 'PRO_19';
}
