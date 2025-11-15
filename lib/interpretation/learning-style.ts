/**
 * تفسیر تست Learning Style (سبک یادگیری)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const LEARNING_STYLE_INTERPRETATION: TestInterpretationConfig = {
  testId: "LearningStyle",
  byLevel: {
    high_problem: (r) => ({
      id: "learning_style_high_problem",
      title: "سبک یادگیری",
      body: "نتایج نشان می‌دهد سبک یادگیری فعلی‌ات آن‌قدری که می‌تواند مؤثر باشد، برای تو کار نمی‌کند؛ ممکن است سریع خسته شوی، حواست پرت شود یا روش‌هایت با مغزت جور نباشد.",
      testId: "LearningStyle",
    }),
    medium: (r) => ({
      id: "learning_style_medium",
      title: "سبک یادگیری متوسط",
      body: "سبک یادگیری‌ات در حد متوسط عمل می‌کند؛ یعنی در بعضی موقعیت‌ها خوب جواب می‌دهند و در بعضی شرایط نه.",
      testId: "LearningStyle",
    }),
    low_problem: (r) => ({
      id: "learning_style_low_problem",
      title: "سبک یادگیری مؤثر",
      body: "نمره بالا یعنی تا حد زیادی فهمیده‌ای چطور بهتر یاد می‌گیری؛ مثلاً با مثال، با تمرین، با توضیح‌دادن برای دیگران یا با دیدن تصویر کلی.",
      testId: "LearningStyle",
    }),
  },
};

