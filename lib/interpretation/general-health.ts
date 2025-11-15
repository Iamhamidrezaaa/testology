/**
 * تفسیر تست General Health (سلامت کلی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const GENERAL_HEALTH_INTERPRETATION: TestInterpretationConfig = {
  testId: "GeneralHealth",
  byLevel: {
    poor: (r) => ({
      id: "general_health_poor",
      title: "سلامت کلی",
      body: "نمره پایین یعنی در این دوره از نظر ترکیبیِ جسمی و روانی، احساس خوبی نسبت به وضعیت سلامتت نداری؛ ممکن است خستگی، درد، مشکلات گوارشی، خواب یا خلق در هم تنیده شده باشند.",
      testId: "GeneralHealth",
    }),
    medium: (r) => ({
      id: "general_health_medium",
      title: "سلامت کلی متوسط",
      body: "نمره متوسط یعنی ترکیبی از روزهای خوب و نه‌چندان خوب را تجربه می‌کنی؛ بعضی جنبه‌های سلامتی‌ات قابل قبول است و بعضی بخش‌ها نیاز به توجه بیشتری دارند.",
      testId: "GeneralHealth",
    }),
    good: (r) => ({
      id: "general_health_good",
      title: "سلامت کلی خوب",
      body: "نمره بالا نشان می‌دهد در مجموع از وضعیت سلامتی‌ات – حداقل در این بازه – احساس نسبتاً خوبی داری.",
      testId: "GeneralHealth",
    }),
    excellent: (r) => ({
      id: "general_health_excellent",
      title: "سلامت کلی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که سلامت کلی یک نقطه قوت جدی برای توست.",
      testId: "GeneralHealth",
    }),
  },
};

