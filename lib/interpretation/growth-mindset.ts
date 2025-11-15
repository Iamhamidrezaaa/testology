/**
 * تفسیر تست Growth Mindset (ذهنیت رشد)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const GROWTH_MINDSET_INTERPRETATION: TestInterpretationConfig = {
  testId: "GrowthMindset",
  byLevel: {
    low: (r) => ({
      id: "growth_mindset_low",
      title: "ذهنیت رشد",
      body: "نمره پایین یعنی در عمق ذهنت بیشتر باور داری که استعدادها و توانایی‌ها تقریباً ثابت‌اند و شکست بیشتر نشانهٔ «ناتوانی» است تا یک مرحله از رشد.",
      testId: "GrowthMindset",
    }),
    medium: (r) => ({
      id: "growth_mindset_medium",
      title: "ذهنیت رشد متوسط",
      body: "نمره متوسط یعنی در بعضی حوزه‌ها به رشد و یادگیری باور داری، و در بعضی حوزه‌ها هنوز شکست را نشانهٔ «بی‌استعدادی» می‌بینی.",
      testId: "GrowthMindset",
    }),
    high: (r) => ({
      id: "growth_mindset_high",
      title: "ذهنیت رشد خوب",
      body: "نمره بالا یعنی بیشتر تمایل داری اشتباه و شکست را به‌عنوان بخشی از مسیر یادگیری ببینی و باور داری که می‌توانی با تمرین، بازخورد و زمان رشد کنی.",
      testId: "GrowthMindset",
    }),
    very_high: (r) => ({
      id: "growth_mindset_very_high",
      title: "ذهنیت رشد عالی",
      body: "نمره بسیار بالا نشان می‌دهد که ذهنیت رشد یک نقطه قوت جدی برای توست.",
      testId: "GrowthMindset",
    }),
  },
};

