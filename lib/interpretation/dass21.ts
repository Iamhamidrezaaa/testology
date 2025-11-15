/**
 * تفسیر تست DASS-21 (Depression, Anxiety and Stress Scale)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const DASS21_INTERPRETATION: TestInterpretationConfig = {
  testId: "DASS21",
  byLevel: {
    normal: (r) => ({
      id: "dass21_normal",
      title: "افسردگی، اضطراب و استرس",
      body: "نشانه‌های افسردگی، اضطراب و استرس در حد طبیعی است.",
      testId: "DASS21",
    }),
    mild: (r) => ({
      id: "dass21_mild",
      title: "نشانه‌های خفیف",
      body: "نشانه‌هایی از افسردگی، اضطراب یا استرس خفیف دیده می‌شود.",
      testId: "DASS21",
    }),
    moderate: (r) => ({
      id: "dass21_moderate",
      title: "نشانه‌های متوسط",
      body: "افسردگی، اضطراب یا استرس در سطح متوسط است.",
      testId: "DASS21",
    }),
    severe: (r) => ({
      id: "dass21_severe",
      title: "نشانه‌های شدید",
      priority: "high",
      body: "افسردگی، اضطراب یا استرس شدید است و نیاز به ارزیابی تخصصی دارد.",
      testId: "DASS21",
    }),
    extremely_severe: (r) => ({
      id: "dass21_extremely_severe",
      title: "نشانه‌های بسیار شدید",
      priority: "high",
      body: "افسردگی، اضطراب یا استرس بسیار شدید است و نیاز به کمک فوری دارد.",
      testId: "DASS21",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    const depression = result.subscales.find(s => s.id === "depression");
    if (depression && depression.score >= 14) {
      chunks.push({
        id: "dass21_depression_high",
        title: "افسردگی",
        priority: "high",
        body: "نشانه‌های افسردگی در سطح بالایی قرار دارند.",
        testId: "DASS21",
      });
    }

    const anxiety = result.subscales.find(s => s.id === "anxiety");
    if (anxiety && anxiety.score >= 10) {
      chunks.push({
        id: "dass21_anxiety_high",
        title: "اضطراب",
        priority: "high",
        body: "نشانه‌های اضطراب در سطح بالایی قرار دارند.",
        testId: "DASS21",
      });
    }

    const stress = result.subscales.find(s => s.id === "stress");
    if (stress && stress.score >= 19) {
      chunks.push({
        id: "dass21_stress_high",
        title: "استرس",
        priority: "high",
        body: "نشانه‌های استرس در سطح بالایی قرار دارند.",
        testId: "DASS21",
      });
    }

    return chunks;
  },
};

