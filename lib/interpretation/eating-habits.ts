/**
 * تفسیر تست Eating Habits (عادات غذایی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const EATING_HABITS_INTERPRETATION: TestInterpretationConfig = {
  testId: "EatingHabits",
  byLevel: {
    poor: (r) => ({
      id: "eating_habits_poor",
      title: "عادات غذایی",
      body: "نمره پایین یعنی الگوی غذایی‌ات در حال حاضر از نظر نظم، کیفیت یا تنوع، فاصلهٔ قابل توجهی با آن‌چیزی دارد که بدنت برای ریکاوری و انرژی پایدار نیاز دارد.",
      testId: "EatingHabits",
    }),
    medium: (r) => ({
      id: "eating_habits_medium",
      title: "عادات غذایی متوسط",
      body: "نمره متوسط یعنی بعضی عادت‌هایت مفید هستند و بعضی دیگر (مثل ریزه‌خواری، پرخوری، وعده‌های نامنظم) می‌توانند بهتر شوند.",
      testId: "EatingHabits",
    }),
    good: (r) => ({
      id: "eating_habits_good",
      title: "عادات غذایی خوب",
      body: "نمره بالا یعنی به‌طور کلی الگوی غذایی‌ات از نظر نظم، کیفیت و توجه به بدن، تصویر نسبتاً سالمی را نشان می‌دهد.",
      testId: "EatingHabits",
    }),
    excellent: (r) => ({
      id: "eating_habits_excellent",
      title: "عادات غذایی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که عادات غذایی یک نقطه قوت جدی برای توست.",
      testId: "EatingHabits",
    }),
  },
};

