/**
 * تفسیر تست Resilience (تاب‌آوری)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const RESILIENCE_INTERPRETATION: TestInterpretationConfig = {
  testId: "Resilience",
  byLevel: {
    low: (r) => ({
      id: "resilience_low",
      title: "تاب‌آوری",
      body: "نمره پایین یعنی در مواجهه با مشکلات و چالش‌ها مشکل دارید.",
      testId: "Resilience",
    }),
    medium: (r) => ({
      id: "resilience_medium",
      title: "تاب‌آوری متوسط",
      body: "نمره متوسط یعنی در برخی موارد می‌توانید با مشکلات کنار بیایید اما در برخی دیگر نیاز به بهبود دارید.",
      testId: "Resilience",
    }),
    high: (r) => ({
      id: "resilience_high",
      title: "تاب‌آوری خوب",
      body: "نمره بالا یعنی معمولاً می‌توانید به خوبی با مشکلات و چالش‌ها کنار بیایید.",
      testId: "Resilience",
    }),
    very_high: (r) => ({
      id: "resilience_very_high",
      title: "تاب‌آوری عالی",
      body: "نمره بسیار بالا نشان می‌دهد که شما یک فرد بسیار تاب‌آور هستید که می‌تواند به طور مؤثر با مشکلات و چالش‌ها کنار بیاید.",
      testId: "Resilience",
    }),
  },
};

