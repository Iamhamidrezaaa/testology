/**
 * تفسیر تست Curiosity (کنجکاوی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const CURIOSITY_INTERPRETATION: TestInterpretationConfig = {
  testId: "Curiosity",
  byLevel: {
    low: (r) => ({
      id: "curiosity_low",
      title: "کنجکاوی",
      body: "نمره پایین یعنی در این دوره کمتر به سمت سؤال‌پرسیدن، کشف‌کردن، امتحان‌کردن چیزهای جدید یا فرو رفتن در عمق موضوعات کشیده می‌شوی؛ شاید خستگی، فشار یا ترس از اشتباه نقش داشته باشد.",
      testId: "Curiosity",
    }),
    medium: (r) => ({
      id: "curiosity_medium",
      title: "کنجکاوی متوسط",
      body: "نمره متوسط یعنی گاهی در موضوعات مورد علاقه‌ات به‌شدت کنجکاو می‌شوی و گاهی در بقیهٔ زمینه‌ها کمتر درگیر می‌شوی.",
      testId: "Curiosity",
    }),
    high: (r) => ({
      id: "curiosity_high",
      title: "کنجکاوی خوب",
      body: "نمره بالا یعنی ذهنی جست‌وجوگر داری؛ دوست داری بدانی پشت پردهٔ پدیده‌ها چیست، چرا چیزها این‌طور شده‌اند و چطور می‌شود بهترشان کرد.",
      testId: "Curiosity",
    }),
    very_high: (r) => ({
      id: "curiosity_very_high",
      title: "کنجکاوی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که کنجکاوی یک نقطه قوت جدی برای توست.",
      testId: "Curiosity",
    }),
  },
};

