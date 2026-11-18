import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { StudySheetClient } from '@/components/StudySheetClient';
import { getStudySheet } from '@/lib/notes';

export default async function StudySheetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sheet = getStudySheet(slug);
  if (!sheet) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F6F4EE] bg-grid-pattern text-[#141413]">
      {/* White-Label Study Resource Header */}
      <header className="sticky top-0 z-40 border-b border-[#DCD6C8] bg-[#F6F4EE]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#D94E28]">
              Study Packet
            </div>
            <div className="truncate text-sm font-semibold text-[#141413]">
              {sheet.courseTag} · Interactive Resource
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#CEC7B6] bg-white px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#EFECE4] transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to SlotLink
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 space-y-6">
        <header className="surface-ink rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#F3B09A]">
              {sheet.courseTag}
            </span>
            <span className="font-mono text-[11px] text-[#A8A295]">
              Updated {sheet.updatedAt}
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
