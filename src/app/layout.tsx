import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
});
const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'SlotLink — Online Booking, Lesson Packs & Student Portals for Tutors',
  description:
    'One simple link for private tutors, music teachers, and 1-on-1 coaches to take bookings, track prepaid lesson packs, and share private student portals with no passwords.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen bg-[#F6F4EE] text-[#141413] font-sans antialiased selection:bg-[#141413] selection:text-[#F6F4EE]"
      >
        {children}
      </body>
    </html>
  );
}
