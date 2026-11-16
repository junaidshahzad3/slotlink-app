import { LegalShell } from '@/components/LegalShell';

const REFUND_SECTIONS = [
  {
    number: 'SECTION 01',
    heading: '14-Day Free Trial',
    body: 'All SlotLink plans include a 14-day free trial before billing begins, allowing you to test live bookings and student portals risk-free.',
  },
  {
    number: 'SECTION 02',
    heading: '14-Day Refund Guarantee',
    body: 'If you are charged and request a refund within 14 days of your initial subscription payment, we will issue a full refund via Paddle.',
  },
  {
    number: 'SECTION 03',
    heading: 'Anytime Cancellation',
    body: 'You may cancel your subscription at any time to prevent future renewals while keeping access through the end of your current billing period.',
  },
];

export default function RefundPolicyPage() {
  return (
    <LegalShell
      activeTab="refund"
      eyebrow="Legal · Billing"
      title="Refund Policy"
      summary="Transparent trial, refund eligibility, and subscription cancellation rules handled via Paddle."
      sections={REFUND_SECTIONS}
    />
  );
}
