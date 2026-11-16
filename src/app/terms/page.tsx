import { LegalShell } from '@/components/LegalShell';

const TERMS_SECTIONS = [
  {
    number: 'SECTION 01',
    heading: 'Service Scope',
    body: 'SlotLink provides scheduling, package-hour tracking, and client portal software on a monthly or annual subscription basis for independent educators and coaches.',
  },
  {
    number: 'SECTION 02',
    heading: 'Data Ownership',
    body: 'You retain full ownership of your student records, session notes, homework links, and booking data stored in your SlotLink workspace.',
  },
  {
    number: 'SECTION 03',
    heading: 'Billing & Renewal',
    body: 'Subscriptions renew automatically unless cancelled before the next billing date via your Paddle billing portal.',
  },
];

export default function TermsPage() {
  return (
    <LegalShell
      activeTab="terms"
      eyebrow="Legal · Terms"
      title="Terms of Service"
      summary="Clear operating terms for solo tutors, coaches, and studios running bookings and prepaid hour packs on SlotLink."
      sections={TERMS_SECTIONS}
    />
  );
}
