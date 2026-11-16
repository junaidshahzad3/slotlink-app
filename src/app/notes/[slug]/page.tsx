import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { AppTopBar } from '@/components/AppTopBar';
import { StudySheetClient } from '@/components/StudySheetClient';
import { getStudySheet } from '@/lib/notes';

export default async function StudySheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sheet = getStudySheet(slug);

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-grid-pattern text-[#141413]">
      <AppTopBar
        badge="STUDY SHEET"
        rightSlot={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/p/sl_demo_alex_94a2k"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Student Passbook
            </Link>
            <Link
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-[#141413] px-3 py-1.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
            >
              Pro Studio
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        }
      />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
        <header className="surface-ink rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#F3B09A]">
              {sheet.courseTag}
            </span>
            <span className="font-mono text-[11px] text-[#A8A295]">
              Prepared by {sheet.tutorName} · {sheet.updatedAt}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F6F4EE]">{sheet.title}</h1>
          <p className="text-xs font-mono text-[#A8A295]">{sheet.subtitle}</p>
          <p className="max-w-3xl pt-1 text-sm leading-relaxed text-[#D8D3C8]">{sheet.summary}</p>
        </header>

        <StudySheetClient sheet={sheet} />
      </main>
    </div>
  );
}
