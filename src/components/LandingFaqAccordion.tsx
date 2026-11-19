'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MagicSpotlightCard } from '@/components/MotionPrimitives';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'private-pages',
    question: 'How do students view their lessons without a password?',
    answer:
      'When a student or parent books their first lesson, SlotLink creates a private personal page link just for them. They can bookmark that link on their phone or computer to check remaining pack hours, join video calls, download calendar invites, and read lesson notes—without creating a username or remembering a password.',
  },
  {
    id: 'calendar-sync',
    question: 'Does SlotLink prevent double-bookings with my Google Calendar?',
    answer:
      'Yes. Your booking page checks your Google Calendar in real time before showing open slots, keeping your personal appointments completely private. As soon as a student books, SlotLink adds the lesson to your calendar and attaches a dedicated video call link automatically.',
  },
  {
    id: 'pack-tracking',
    question: 'How are prepaid lesson packages tracked and deducted?',
    answer:
      'When a student chooses a 5-Lesson Pack or 10-Lesson Pack on your booking page, those hours are added to their private page automatically. Each time you finish a lesson and click Mark Lesson Complete in your dashboard, SlotLink subtracts 1 hour and shares your notes directly with the student.',
  },
  {
    id: 'homework-notes',
    question: 'Can I share homework, worksheets, and study notes?',
    answer:
      'Yes. When marking any lesson complete, you can write a quick lesson summary and attach either a worksheet link or one of SlotLink’s built-in interactive study sheets with visual diagrams, key formulas, and self-check practice questions.',
  },
  {
    id: 'reschedule-policy',
    question: 'What happens if a student needs to reschedule or cancel?',
    answer:
      'Students can open their private page anytime to pick a new open slot or cancel a booking. SlotLink enforces your 24-hour notice window automatically so you never get last-minute surprises, and updates your Google Calendar right away.',
  },
];

export function LandingFaqAccordion() {
  const [openId, setOpenId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <div className="space-y-2.5">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = item.id === openId;
        return (
          <MagicSpotlightCard
            key={item.id}
            className={`surface-card rounded-xl transition ${isOpen ? 'border-[#141413]' : ''}`}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenId(isOpen ? '' : item.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#F6F4EE]/60 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] font-semibold text-[#D94E28]">
                  0{idx + 1}
                </span>
                <span className="text-sm font-semibold text-[#141413]">{item.question}</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-[#575248] transition-transform duration-300 ${
                  isOpen ? 'rotate-180 text-[#D94E28]' : ''
                }`}
              />
            </button>
            <div className="accordion-grid" data-open={isOpen ? 'true' : 'false'}>
              <div className="accordion-grid-inner">
                <div className="border-t border-[#EFECE4] bg-[#F6F4EE]/55 px-5 py-4 pl-12 text-sm leading-relaxed text-[#575248]">
                  {item.answer}
                </div>
              </div>
            </div>
          </MagicSpotlightCard>
        );
      })}
    </div>
  );
}
