import { LegalShell } from '@/components/LegalShell';

const PRIVACY_SECTIONS = [
  {
    number: 'SECTION 01',
    heading: 'Minimal Collection',
    body: 'We collect only the account, calendar availability, and booking details required to operate your SlotLink portal and send session confirmations.',
  },
  {
    number: 'SECTION 02',
    heading: 'Google Calendar Access',
    body: 'Google Calendar permissions are used strictly to check your calendar availability and add or update booked lessons.',
  },
  {
    number: 'SECTION 03',
    heading: 'Zero Data Brokerage',
    body: 'We never sell, rent, or monetize personal student or educator data with third-party advertisers or data brokers.',
  },
];

export default function PrivacyPage() {
  return (
    <LegalShell
      activeTab="privacy"
      eyebrow="Legal · Privacy"
      title="Privacy Policy"
      summary="How SlotLink safeguards educator accounts, student magic-link passbooks, and Google Calendar authorization tokens."
      sections={PRIVACY_SECTIONS}
    />
  );
}
