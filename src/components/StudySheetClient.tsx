'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BookOpenCheck,
  CheckCircle2,
  Printer,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react';
import { STUDY_SHEET_TABS, type StudySheet } from '@/lib/notes';
import {
  MagicSpotlightCard,
  NumberTicker,
} from '@/components/MotionPrimitives';
import { Interactive3DCard } from '@/components/StudioVectorScene';

function WhiteboardDiagram({
  curveType,
}: {
  curveType: StudySheet['whiteboardAnnotation']['curveType'];
}) {
  return (
    <div className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE] bg-grid-pattern p-4">
      <svg
        viewBox="0 0 360 220"
        role="img"
        aria-label="Annotated Mathematical Diagram"
        className="w-full h-auto"
      >
        {/* Coordinate Axes */}
        <line x1="30" y1="180" x2="340" y2="180" stroke="#8C867A" strokeWidth="1.25" />
        <line x1="65" y1="20" x2="65" y2="200" stroke="#8C867A" strokeWidth="1.25" />
        <text x="334" y="194" fontSize="10" fill="#575248" fontFamily="monospace">
          x
        </text>
        <text x="52" y="28" fontSize="10" fill="#575248" fontFamily="monospace">
          y
        </text>

        {curveType === 'parabola' && (
          <>
            {/* Symmetry Axis */}
            <line
              x1="190"
              y1="26"
              x2="190"
              y2="195"
              stroke="#D94E28"
              strokeWidth="1.2"
              strokeDasharray="4 4"
            />
            <text x="196" y="38" fontSize="9.5" fill="#D94E28" fontFamily="monospace">
              axis x = h
            </text>

            {/* Horizontal Pairing Line f(1)=f(5) */}
            <line
              x1="125"
              y1="84"
              x2="255"
              y2="84"
              stroke="#15803D"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <circle cx="125" cy="84" r="3.5" fill="#15803D" />
            <circle cx="255" cy="84" r="3.5" fill="#15803D" />

            {/* Parabola Curve */}
            <path
              d="M 100 38 Q 190 262 280 38"
              fill="none"
              stroke="#141413"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-vector-dash"
            />

            {/* Vertex Marker */}
            <circle cx="190" cy="150" r="8" fill="#D94E28" fillOpacity="0.2" className="animate-pulse" />
            <circle cx="190" cy="150" r="5" fill="#D94E28" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="199" y="158" fontSize="10" fontWeight="600" fill="#141413" fontFamily="monospace">
              Vertex (3, -2)
            </text>
          </>
        )}

        {curveType === 'calculus' && (
          <>
            {/* Secant Line */}
            <line
              x1="90"
              y1="154"
              x2="285"
              y2="52"
              stroke="#8C867A"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            {/* Cubic Curve */}
            <path
              d="M 80 164 C 135 152, 165 112, 192 98 C 220 84, 255 68, 305 42"
              fill="none"
              stroke="#141413"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="animate-vector-dash"
            />
            {/* Tangent Line at Inflection Point */}
            <line x1="125" y1="132" x2="260" y2="64" stroke="#D94E28" strokeWidth="1.8" />
            <circle cx="192" cy="98" r="8" fill="#D94E28" fillOpacity="0.2" className="animate-pulse" />
            <circle cx="192" cy="98" r="5" fill="#D94E28" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="199" y="114" fontSize="10" fontWeight="600" fill="#141413" fontFamily="monospace">
              MVT / Inflection C
            </text>
          </>
        )}

        {curveType === 'linear' && (
          <>
            {/* Line L1 */}
            <line x1="80" y1="162" x2="310" y2="52" stroke="#141413" strokeWidth="2.4" className="animate-vector-dash" />
            <text x="275" y="46" fontSize="9.5" fill="#141413" fontFamily="monospace">
              L1: slope m1
            </text>
            {/* Line L2 */}
            <line x1="88" y1="48" x2="305" y2="158" stroke="#15803D" strokeWidth="2.2" className="animate-vector-dash" />
            <text x="262" y="170" fontSize="9.5" fill="#15803D" fontFamily="monospace">
              L2: slope m2
            </text>
            {/* Intersection Point */}
            <circle cx="195" cy="106" r="8.5" fill="#D94E28" fillOpacity="0.2" className="animate-pulse" />
            <circle cx="195" cy="106" r="5.5" fill="#D94E28" stroke="#FFFFFF" strokeWidth="1.5" />
            <text x="205" y="102" fontSize="10" fontWeight="600" fill="#141413" fontFamily="monospace">
              Solution (x*, y*)
            </text>
          </>
        )}
      </svg>
    </div>
  );
}

export function StudySheetClient({ sheet }: { sheet: StudySheet }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(selectedAnswers).length;
  const masteredCount = sheet.practiceQuestions.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Switcher + Score + Print Strip */}
      <div className="surface-card rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {STUDY_SHEET_TABS.map((tab) => {
            const active = tab.slug === sheet.slug;
            return (
              <Link
                key={tab.slug}
                href={`/notes/${tab.slug}`}
                className={`rounded-lg px-3 py-1.5 font-mono text-[11px] font-semibold transition ${
                  active
                    ? 'bg-[#141413] text-[#F6F4EE]'
                    : 'border border-[#DCD6C8] bg-[#F6F4EE] text-[#575248] hover:text-[#141413]'
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-[#BBF7D0] bg-[#DCFCE7] px-3 py-1 font-mono text-[11px] font-semibold text-[#15803D]">
            <NumberTicker value={masteredCount} /> / {sheet.practiceQuestions.length} Mastered
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={() => setSelectedAnswers({})}
              className="inline-flex items-center gap-1 rounded-lg border border-[#CEC7B6] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#575248] hover:text-[#141413] transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#141413] px-3.5 py-1.5 text-xs font-semibold text-[#F6F4EE] hover:bg-[#2A2A27] transition"
          >
            <Printer className="h-3.5 w-3.5 text-[#F3B09A]" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Annotated Whiteboard Diagram Card */}
      <MagicSpotlightCard className="surface-card rounded-2xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE4] pb-3.5">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
            <Sparkles className="h-3.5 w-3.5" />
            {sheet.whiteboardAnnotation.title}
          </div>
          <span className="font-mono text-[11px] text-[#6E685C]">Visual Diagram</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <WhiteboardDiagram curveType={sheet.whiteboardAnnotation.curveType} />
          </div>

          <div className="lg:col-span-5 space-y-3">
            <div className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6E685C]">
              Tutor Margin Callouts
            </div>
            <ul className="space-y-2.5">
              {sheet.whiteboardAnnotation.callouts.map((callout, idx) => (
                <li
                  key={callout}
                  className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/75 p-3.5 text-xs leading-relaxed text-[#141413]"
                >
                  <span className="mr-2 font-mono font-semibold text-[#D94E28]">
                    0{idx + 1}.
                  </span>
                  {callout}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </MagicSpotlightCard>

      {/* Key Formula Reference Ledger */}
      <section className="space-y-3">
        <div className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#D94E28]">
          Key Formula Reference Ledger
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {sheet.keyFormulas.map((item) => (
            <Interactive3DCard key={item.label} maxTilt={5}>
              <MagicSpotlightCard className="surface-card h-full rounded-2xl p-5 space-y-2.5">
                <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E685C]">
                  {item.label}
                </div>
                <div className="rounded-lg border border-[#D5CFC0] bg-[#EFECE4] px-3 py-2 font-mono text-xs font-semibold text-[#141413]">
                  {item.formula}
                </div>
                <p className="text-xs leading-relaxed text-[#575248]">{item.note}</p>
              </MagicSpotlightCard>
            </Interactive3DCard>
          ))}
        </div>
      </section>

      {/* Interactive Self-Check Drill */}
      <MagicSpotlightCard
        spotlightColor="rgba(21, 128, 61, 0.1)"
        className="surface-card rounded-2xl p-6 sm:p-7 space-y-5"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE4] pb-3.5">
          <div className="inline-flex items-center gap-2">
            <BookOpenCheck className="h-4 w-4 text-[#D94E28]" />
            <h2 className="text-base font-semibold text-[#141413]">
              Practice Questions
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#6E685C]">
            Click an option for instant tutor explanation
          </span>
        </div>

        <div className="space-y-5">
          {sheet.practiceQuestions.map((q, qIdx) => {
            const chosen = selectedAnswers[q.id];
            const isAnswered = chosen !== undefined;
            const isCorrect = chosen === q.correctIndex;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-[#DCD6C8] bg-[#F6F4EE]/65 p-4 sm:p-5 space-y-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-semibold text-[#141413]">
                    <span className="mr-2 font-mono text-xs text-[#D94E28]">Q{qIdx + 1}.</span>
                    {q.prompt}
                  </div>
                  {isAnswered && (
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold ${
                        isCorrect
                          ? 'border-[#BBF7D0] bg-[#DCFCE7] text-[#15803D]'
                          : 'border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]'
                      }`}
                    >
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3" />
                          Review
                        </>
                      )}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {q.options.map((option, optIdx) => {
                    const selectedThis = chosen === optIdx;
                    const optionIsCorrect = optIdx === q.correctIndex;
                    let btnClass =
                      'border-[#DCD6C8] bg-white text-[#141413] hover:border-[#141413]';
                    if (isAnswered) {
                      if (optionIsCorrect) {
                        btnClass = 'border-[#15803D] bg-[#F0FDF4] text-[#14532D] font-semibold';
                      } else if (selectedThis) {
                        btnClass = 'border-[#B91C1C] bg-[#FEF2F2] text-[#991B1B] font-semibold';
                      } else {
                        btnClass = 'border-[#DCD6C8] bg-white/70 text-[#6E685C]';
                      }
                    }

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                        }
                        className={`rounded-lg border px-3.5 py-2.5 text-left text-xs transition ${btnClass}`}
                      >
                        <span className="mr-2 font-mono text-[11px] font-semibold text-[#6E685C]">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className="rounded-lg border border-[#D5CFC0] bg-white px-3.5 py-2.5 text-xs leading-relaxed text-[#575248]">
                    <span className="font-mono font-semibold text-[#141413]">
                      Worked Explanation:{' '}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </MagicSpotlightCard>
    </div>
  );
}
