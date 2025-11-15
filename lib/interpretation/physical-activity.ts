/**
 * تفسیر تست Physical Activity (فعالیت بدنی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const PHYSICAL_ACTIVITY_INTERPRETATION: TestInterpretationConfig = {
  testId: "PhysicalActivity",
  byLevel: {
    low: (r) => ({
      id: "physical_activity_low",
      title: "فعالیت بدنی",
      body: "نمره پایین یعنی بدنت حرکت و فعالیت منظم کمتری از آن‌چه برای سلامت قلب، مغز و خلق نیاز دارد، دریافت می‌کند. این لزوماً به معنی تنبلی نیست؛ بیشتر به ترکیب شرایط و اولویت‌ها برمی‌گردد.",
      testId: "PhysicalActivity",
    }),
    medium: (r) => ({
      id: "physical_activity_medium",
      title: "فعالیت بدنی متوسط",
      body: "نمره متوسط یعنی گاهی فعال هستی و گاهی نه؛ احتمالاً می‌توانی با چند تغییر کوچک (مثلاً پیاده‌روی منظم، حرکت‌های کوتاه) وضعیت را ارتقا دهی.",
      testId: "PhysicalActivity",
    }),
    high: (r) => ({
      id: "physical_activity_high",
      title: "فعالیت بدنی خوب",
      body: "نمره بالا یعنی در زندگی‌ات سهمی برای حرکت گذاشته‌ای؛ چیزی که به خواب، خلق، انرژی و حتی تمرکز کمک می‌کند.",
      testId: "PhysicalActivity",
    }),
    very_high: (r) => ({
      id: "physical_activity_very_high",
      title: "فعالیت بدنی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که فعالیت بدنی یک نقطه قوت جدی برای توست.",
      testId: "PhysicalActivity",
    }),
  },
};

