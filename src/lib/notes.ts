import { isSafeHttpUrl } from './security';

export interface StudyFormula {
  label: string;
  formula: string;
  note: string;
}

export interface StudyPracticeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudySheet {
  slug: string;
  title: string;
  subtitle: string;
  courseTag: string;
  tutorName: string;
  updatedAt: string;
  summary: string;
  keyFormulas: StudyFormula[];
  whiteboardAnnotation: {
    title: string;
    curveType: 'parabola' | 'calculus' | 'linear';
    callouts: string[];
  };
  practiceQuestions: StudyPracticeQuestion[];
}

export const STUDY_SHEETS: Record<string, StudySheet> = {
  'sat-module-2-drill': {
    slug: 'sat-module-2-drill',
    title: 'SAT Module 2: Quadratics & Parabola Shifts',
    subtitle: 'Vertex extraction, discriminant shortcuts, and Module 2 pacing checks',
    courseTag: 'SAT MATH · MODULE 2',
    tutorName: 'Sarah Chen',
    updatedAt: 'Updated Nov 2026',
    summary:
      'Review vertex form transformations and sum/product root identities so hard Module 2 quadratic items take under 45 seconds without expanding brackets.',
    keyFormulas: [
      {
        label: 'Vertex Form',
        formula: 'f(x) = a(x - h)^2 + k',
        note: 'Minimum/maximum occurs directly at (h, k); axis of symmetry is x = h.',
      },
      {
        label: 'Sum of Roots',
        formula: 'r1 + r2 = -b / a',
        note: 'Find root sum immediately from ax^2 + bx + c = 0 without solving.',
      },
      {
        label: 'Discriminant Check',
        formula: 'D = b^2 - 4ac',
        note: 'D > 0 gives 2 real roots; D = 0 gives exactly 1 tangent root.',
      },
    ],
    whiteboardAnnotation: {
      title: 'Whiteboard Diagram · Parabola Minimum & Axis Shift',
      curveType: 'parabola',
      callouts: [
        'Vertex (h, k) sits at (3, -2) — sign inside (x - 3)^2 flips right by 3.',
        'Symmetry guarantees f(1) = f(5): spot paired x-values fast on tables.',
        'Positive leading a = +1 confirms upward opening and minimum k = -2.',
      ],
    },
    practiceQuestions: [
      {
        id: 'sat-m2-q1',
        prompt: 'What is the minimum value of f(x) = 2(x - 4)^2 - 7?',
        options: ['4', '-7', '-4', '25'],
        correctIndex: 1,
        explanation:
          'Since a = 2 > 0, the parabola opens upward with vertex at (4, -7), so the minimum y-value is -7.',
      },
      {
        id: 'sat-m2-q2',
        prompt: 'For 3x^2 - 18x + 11 = 0, what is the sum of all real solutions?',
        options: ['6', '-6', '11/3', '18'],
        correctIndex: 0,
        explanation:
          'By Vieta sum of roots, r1 + r2 = -b / a = -(-18) / 3 = 6 (D = 324 - 132 > 0 confirms two real roots).',
      },
      {
        id: 'sat-m2-q3',
        prompt:
          'If f(x) is symmetric around x = 5 and f(2) = 14, which other value must equal 14?',
        options: ['f(-2)', 'f(6)', 'f(8)', 'f(10)'],
        correctIndex: 2,
        explanation:
          'x = 2 is 3 units left of the symmetry line x = 5, so 3 units right is x = 5 + 3 = 8.',
      },
    ],
  },
  'algebra-foundations': {
    slug: 'algebra-foundations',
    title: 'Linear Systems & Slope-Intercept Equilibrium',
    subtitle: 'Infinite-solution ratios, perpendicular slopes, and word-problem setup',
    courseTag: 'ALGEBRA CORE · BASELINE',
    tutorName: 'Sarah Chen',
    updatedAt: 'Updated Nov 2026',
    summary:
      'Diagnostic foundation sheet covering fast slope ratio comparisons so parallel and coinciding linear systems require zero elimination algebra.',
    keyFormulas: [
      {
        label: 'No Solution Condition',
        formula: 'a1 / a2 = b1 / b2 != c1 / c2',
        note: 'Identical slopes with distinct y-intercepts yield parallel lines.',
      },
      {
        label: 'Perpendicular Slope',
        formula: 'm_perp = -1 / m',
        note: 'Negative reciprocal slopes intersect cleanly at 90 degrees.',
      },
      {
        label: 'Intercept Form Check',
        formula: 'Ax + By = C -> m = -A / B',
        note: 'Read standard-form slope instantly without isolating y first.',
      },
    ],
    whiteboardAnnotation: {
      title: 'Whiteboard Diagram · System Intersection (x*, y*)',
      curveType: 'linear',
      callouts: [
        'Line L1 climbs steadily while L2 descends: unequal slopes force 1 unique point.',
        'Intersection P(x*, y*) solves both constraints simultaneously.',
        'Watch for scaled equations (e.g., 2x + 4y = 10 vs x + 2y = 5) signaling infinite solutions.',
      ],
    },
    practiceQuestions: [
      {
        id: 'alg-q1',
        prompt:
          'For what value of k does the system 4x + 6y = 12 and kx + 9y = 20 have NO solution?',
        options: ['3', '6', '8', '9'],
        correctIndex: 1,
        explanation:
          'Match x/y ratios: 4/k = 6/9 = 2/3 gives k = 6. Since 12/20 != 2/3, the lines are parallel and never intersect.',
      },
      {
        id: 'alg-q2',
        prompt: 'What is the slope of any line perpendicular to 3x - 5y = 15?',
        options: ['3/5', '-3/5', '-5/3', '5/3'],
        correctIndex: 2,
        explanation:
          'First line slope is m = -A/B = -3/(-5) = 3/5. The negative reciprocal is -5/3.',
      },
      {
        id: 'alg-q3',
        prompt: 'If 2x + y = 11 and x - y = 4, what is the value of x?',
        options: ['3', '5', '7', '15'],
        correctIndex: 1,
        explanation:
          'Add both equations vertically: 3x = 15, giving x = 5 directly in one step.',
      },
    ],
  },
  'sat-math-drill': {
    slug: 'sat-math-drill',
    title: 'SAT Math Section 3 Speed & Accuracy Drill',
    subtitle: 'Desmos sanity checks, back-solving strategies, and time-saving heuristics',
    courseTag: 'SAT MATH · SPEED DRILL',
    tutorName: 'Sarah Chen',
    updatedAt: 'Updated Nov 2026',
    summary:
      'Focus drill for shaving 4–5 minutes off tough algebraic fractions, exponential percent growth models, and constant-matching polynomial items.',
    keyFormulas: [
      {
        label: 'Exponential Growth',
        formula: 'A(t) = P(1 + r)^(t / n)',
        note: 'Verify what time unit t/n triggers each compounding period.',
      },
      {
        label: 'Coefficient Matching',
        formula: 'ax^2 + bx + c == px^2 + qx + s',
        note: 'Equate like-power coefficients instead of substituting random x.',
      },
      {
        label: 'Percent Change Trap',
        formula: 'Multiplier = (1 + p1)(1 - p2)',
        note: 'Sequential percent shifts multiply; never add percentages linearly.',
      },
    ],
    whiteboardAnnotation: {
      title: 'Whiteboard Diagram · Quadratic Vertex & Intercept Audit',
      curveType: 'parabola',
      callouts: [
        'Use vertex symmetry to predict where horizontal lines y = c cross zero, once, or twice.',
        'Check boundary behavior at x = 0 before choosing between exponential answers.',
        'Always verify whether the prompt asks for x, 2x, or (x + 3).',
      ],
    },
    practiceQuestions: [
      {
        id: 'smd-q1',
        prompt: 'A jacket price rises by 20% and is then discounted by 20%. What is the net change?',
        options: ['0% change', '-4% net decrease', '+4% net increase', '-2% net decrease'],
        correctIndex: 1,
        explanation:
          '1.20 * 0.80 = 0.96, which represents a 4% net decrease from the original price.',
      },
      {
        id: 'smd-q2',
        prompt: 'If (x + 3)(x - k) = x^2 - 2x - 15 for all x, what is k?',
        options: ['5', '-5', '2', '3'],
        correctIndex: 0,
        explanation:
          'Constant term gives 3(-k) = -15, so k = 5 (verified by middle term (3 - 5)x = -2x).',
      },
      {
        id: 'smd-q3',
        prompt: 'A population doubles every 4 years starting at 300. Which models t years?',
        options: ['300(2)^(4t)', '300(2)^(t/4)', '300(1.5)^t', '600(t/4)'],
        correctIndex: 1,
        explanation:
          'Plugging t = 4 yields exponent 4/4 = 1, cleanly doubling 300 * 2 = 600.',
      },
    ],
  },
  'ap-calc-frq-pack': {
    slug: 'ap-calc-frq-pack',
    title: 'AP Calculus FRQ: FTC, Inflection & Motion Pack',
    subtitle: 'Free-response justification templates built for full AP rubric credit',
    courseTag: 'AP CALCULUS AB/BC',
    tutorName: 'Sarah Chen',
    updatedAt: 'Updated Nov 2026',
    summary:
      'Complete FRQ phrasing checklist for connecting derivative sign charts, Fundamental Theorem accumulation, and concavity inflection justifications.',
    keyFormulas: [
      {
        label: 'FTC Part 1',
        formula: "g'(x) = d/dx int_a^x f(t)dt = f(x)",
        note: "When asked for extrema of g(x), locate where g'(x) = f(x) changes sign.",
      },
      {
        label: 'Inflection Criterion',
        formula: "f''(x) changes sign at x = c",
        note: "State sign change explicitly; f''(c) = 0 alone is never enough.",
      },
      {
        label: 'Mean Value Theorem',
        formula: "f'(c) = (f(b) - f(a)) / (b - a)",
        note: 'Requires continuity on [a, b] and differentiability on (a, b).',
      },
    ],
    whiteboardAnnotation: {
      title: 'Whiteboard Diagram · Tangent Slope & Inflection Point',
      curveType: 'calculus',
      callouts: [
        'Tangent line at inflection point C tracks instantaneous rate where concavity flips.',
        'Compare secant slope AB against MVT tangent to earn full theorem points.',
        'Sign flip of derivative from + to - proves relative maximum without calculator.',
      ],
    },
    practiceQuestions: [
      {
        id: 'calc-q1',
        prompt: "If g(x) = int_2^x f(t) dt, what guarantees a local minimum of g at x = 5?",
        options: [
          'f(5) = 0 and f changes from - to + at x = 5',
          'f(5) = 0 and f changes from + to - at x = 5',
          "f'(5) = 0 only",
          'f(5) is positive on [2, 5]',
        ],
        correctIndex: 0,
        explanation:
          "Since g'(x) = f(x), a local minimum occurs when g'(x) = f(x) transitions from negative to positive.",
      },
      {
        id: 'calc-q2',
        prompt: 'Which two hypotheses must ALWAYS be stated before applying MVT on [1, 4]?',
        options: [
          'Positive & monotonic',
          'Continuous on [1, 4] and differentiable on (1, 4)',
          'Concave up & bounded',
          'Equal endpoints f(1) = f(4)',
        ],
        correctIndex: 1,
        explanation:
          "AP rubrics award the justification point only when continuity on [a,b] and differentiability on (a,b) are cited.",
      },
      {
        id: 'calc-q3',
        prompt: 'When is a particle speeding up at time t = 3?',
        options: [
          'v(3) > 0 only',
          'a(3) > 0 only',
          'v(3) and a(3) share the same sign',
          'v(3) = 0 and a(3) > 0',
        ],
        correctIndex: 2,
        explanation:
          'Speed increases whenever velocity and acceleration push in the same direction (both positive or both negative).',
      },
    ],
  },
  'diagnostic-roadmap': {
    slug: 'diagnostic-roadmap',
    title: '4-Week Diagnostic Score-Gain Roadmap',
    subtitle: 'Priority topic sequencing, error-log protocol, and weekly check-ins',
    courseTag: 'STUDY ROADMAP · 4 WEEKS',
    tutorName: 'Sarah Chen',
    updatedAt: 'Updated Nov 2026',
    summary:
      'Structured tutoring blueprint turning baseline error patterns into targeted 60-minute weekly milestones tracked directly in your Student Magic Portal.',
    keyFormulas: [
      {
        label: 'Week 1 Focus',
        formula: 'Linear + Ratio Fluency',
        note: 'Eliminate careless sign slips on first 14 Module 1 questions.',
      },
      {
        label: 'Week 2–3 Focus',
        formula: 'Quadratics + Systems + Geometry',
        note: 'Drill vertex transformations, circle equations, and similar triangles.',
      },
      {
        label: 'Week 4 Peak',
        formula: '2 Full Timed Adaptives',
        note: 'Review error log tags 48h prior to exam day for +120 pt confidence.',
      },
    ],
    whiteboardAnnotation: {
      title: 'Whiteboard Diagram · Error Reduction Trajectory Across Weeks',
      curveType: 'linear',
      callouts: [
        'Each 60-min session clears one high-weight domain before advancing.',
        'Bookmark Student Magic Portal to track remaining pack hours and lesson PDFs.',
        'Target 95%+ accuracy on Easy/Medium items before grinding Hard Module 2 problems.',
      ],
    },
    practiceQuestions: [
      {
        id: 'diag-q1',
        prompt: 'Where do most +80 to +120 SAT Math gains come from in Weeks 1–2?',
        options: [
          'Guessing on the final 2 questions',
          'Clearing silly arithmetic & algebra setup misses in Easy/Medium items',
          'Memorizing college calculus theorems',
          'Skipping diagnostic review',
        ],
        correctIndex: 1,
        explanation:
          'Locking down 100% accuracy in Module 1 unlocks the high-scoring adaptive Module 2 path.',
      },
      {
        id: 'diag-q2',
        prompt: 'What is the ideal rule when stuck past 90 seconds on a tough Module 2 item?',
        options: [
          'Spend 5 minutes forcing algebra',
          'Flag for second pass, protect time on solvable items, then revisit',
          'Leave it blank completely',
          'Restart Module 2 from Q1',
        ],
        correctIndex: 1,
        explanation:
          'Every question is weighted cleanly in pacing strategy; never sacrifice 3 easy points for 1 stubborn item.',
      },
      {
        id: 'diag-q3',
        prompt: 'How often should you review your missed-question log?',
        options: [
          'Only the night before the test',
          'Before every weekly tutoring lesson to sharpen weak templates',
          'Never redo missed problems',
          'Once per semester',
        ],
        correctIndex: 1,
        explanation:
          'Redoing missed drills 3–5 days later ensures the corrected pattern sticks under exam pressure.',
      },
    ],
  },
};

export const STUDY_SHEET_TABS = [
  { slug: 'sat-module-2-drill', label: 'SAT Module 2 Drill' },
  { slug: 'algebra-foundations', label: 'Algebra Foundations' },
  { slug: 'sat-math-drill', label: 'SAT Speed Drill' },
  { slug: 'ap-calc-frq-pack', label: 'AP Calc FRQ Pack' },
  { slug: 'diagnostic-roadmap', label: 'Diagnostic Roadmap' },
];

export function getStudySheet(slug: string): StudySheet | null {
  const clean = slug.replace(/\.pdf$/i, '');
  return STUDY_SHEETS[clean] ?? null;
}

/**
 * Maps seeded/preset slotlink.app PDF URLs to interactive in-app Study Sheet routes.
 */
export function resolveHomeworkHref(url: string | null | undefined): {
  href: string;
  isInternal: boolean;
} {
  if (!url) return { href: '', isInternal: false };
  const trimmed = url.trim();
  if (!trimmed) return { href: '', isInternal: false };

  const internalMatch = trimmed.match(
    /^(?:https?:\/\/(?:www\.)?slotlink\.app)?\/(?:files|notes)\/([a-zA-Z0-9_-]+?)(?:\.pdf)?$/i
  );
  if (internalMatch && internalMatch[1]) {
    return { href: `/notes/${internalMatch[1]}`, isInternal: true };
  }

  if (!isSafeHttpUrl(trimmed)) {
    return { href: '', isInternal: false };
  }

  return { href: trimmed, isInternal: false };
}
