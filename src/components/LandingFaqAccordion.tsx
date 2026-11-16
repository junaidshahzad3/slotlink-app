'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'magic-links',
    question: 'How do zero-login student magic links work?',
    answer:
      'When a student or parent books for the first time, SlotLink generates a private 128-bit secret URL (like /p/sl_demo_alex_94a2k). Bookmarking that single link lets them view prepaid hour balances, join Google Meet calls, download `.ics` invites, and study annotated session notes—without creating or forgetting another password.',
  },
  {
    id: 'calendar-guard',
    question: 'Does SlotLink prevent double-bookings with my personal Google Calendar?',
    answer:
      'Yes. Availability queries run against both your SlotLink booking ledger and live Google Calendar FreeBusy conflicts in real time. The instant a slot is confirmed, SlotLink writes the calendar event and attaches a dedicated Google Meet link automatically.',
  },
  {
    id: 'pack-deduction',
    question: 'How are prepaid package hours tracked and deducted?',
    answer:
      'When someone purchases a 5-Lesson or 10-Lesson Pack on your public 1-link page, hours are credited immediately to their passbook. Whenever you click Mark Done in the Pro Dashboard, SlotLink deducts 1 hour transactionally and publishes your takeaways and homework sheet straight to their portal.',
  },
  {
    id: 'homework-ics',
    question: 'Can students open interactive study notes and export calendar invites?',
    answer:
      'Yes. Confirmation boarding passes and student portal cards include one-click RFC 5545 `.ics` downloads for Apple, Google, or Outlook Calendars, alongside interactive Study Sheets (`/notes/...`) featuring SVG whiteboard diagrams, formula ledgers, and self-check practice problems.',
  },
  {
    id: 'reschedule-policy',
    question: 'What happens if a student needs to reschedule or cancel?',
    answer:
      'Students can open their magic passbook anytime to pick a different live slot or cancel. SlotLink enforces your reschedule cutoff guard cleanly, updates Google Calendar events automatically, and logs the change on your 7-Day Studio Grid.',
  },
];

export function LandingFaqAccordion() {
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <div className="space-y-2.5">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = item.id === openId;
        return (
          <div
            key={item.id}
            className={`surface-card rounded-xl overflow-hidden transition ${
              isOpen ? 'border-[#141413]' : ''
            }`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? '' : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F6F4EE]/60 transition"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold text-[#D94E28]">
                  0{idx + 1}
                </span>
                <span className="text-sm font-semibold text-[#141413]">{item.question}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#575248] transition-transform ${
                  isOpen ? 'rotate-180 text-[#D94E28]' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-[#EFECE4] bg-[#F6F4EE]/55 px-5 py-4 pl-12 text-sm leading-relaxed text-[#575248]">
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
