/**
 * تفسیر تست Problem Solving (حل مسئله)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const PROBLEM_SOLVING_INTERPRETATION: TestInterpretationConfig = {
  testId: "ProblemSolving",
  byLevel: {
    poor: (r) => ({
      id: "problem_solving_poor",
      title: "حل مسئله",
      body: "نمره پایین یعنی در مواجهه با مسائل پیچیده ممکن است زودتر احساس سردرگمی یا ناتوانی کنی و نیاز به ساختار و راهنمایی بیشتر داشته باشی.",
      testId: "ProblemSolving",
    }),
    medium: (r) => ({
      id: "problem_solving_medium",
      title: "حل مسئله متوسط",
      body: "نمره متوسط یعنی در بسیاری از مسائل روزمره می‌توانی راه‌حل‌های قابل قبول پیدا کنی، اما در موقعیت‌های پیچیده‌تر گاهی گیر می‌کنی.",
      testId: "ProblemSolving",
    }),
    good: (r) => ({
      id: "problem_solving_good",
      title: "حل مسئله خوب",
      body: "نمره بالا یعنی معمولاً می‌توانی مسئله را تجزیه کنی، گزینه‌ها را ببینی و مسیر واقع‌بینانه‌ای برای اقدام پیدا کنی.",
      testId: "ProblemSolving",
    }),
    excellent: (r) => ({
      id: "problem_solving_excellent",
      title: "حل مسئله عالی",
      body: "نمره بسیار بالا نشان می‌دهد که حل مسئله یک نقطه قوت جدی برای توست.",
      testId: "ProblemSolving",
    }),
  },
};

