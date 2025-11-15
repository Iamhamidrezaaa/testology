/**
 * تفسیر تست Adaptability (انطباق‌پذیری)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const ADAPTABILITY_INTERPRETATION: TestInterpretationConfig = {
  testId: "Adaptability",
  byLevel: {
    low: (r) => ({
      id: "adaptability_low",
      title: "انطباق‌پذیری",
      body: "نمره پایین یعنی تغییرات، اتفاق‌های غیرمنتظره یا محیط‌های جدید برایت خیلی استرس‌زا و خسته‌کننده هستند و ممکن است زمان زیادی طول بکشد تا با آن‌ها کنار بیایی.",
      testId: "Adaptability",
    }),
    medium: (r) => ({
      id: "adaptability_medium",
      title: "انطباق‌پذیری متوسط",
      body: "نمره متوسط یعنی در بسیاری از تغییرها می‌توانی خودت را وفق بدهی، اما در تغییرهای بزرگ‌تر یا هم‌زمان، تحت فشار زیادی قرار می‌گیری.",
      testId: "Adaptability",
    }),
    good: (r) => ({
      id: "adaptability_good",
      title: "انطباق‌پذیری خوب",
      body: "نمره بالا یعنی معمولاً می‌توانی خودت، برنامه‌هایت و انتظارهایت را با شرایط جدید هماهنگ کنی، بدون این‌که هویت‌ات را گم کنی.",
      testId: "Adaptability",
    }),
    very_high: (r) => ({
      id: "adaptability_very_high",
      title: "انطباق‌پذیری عالی",
      body: "نمره بسیار بالا نشان می‌دهد که انطباق‌پذیری یک نقطه قوت جدی برای توست.",
      testId: "Adaptability",
    }),
  },
};

