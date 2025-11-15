/**
 * تفسیر تست PSQI (Pittsburgh Sleep Quality Index)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const PSQI_INTERPRETATION: TestInterpretationConfig = {
  testId: "PSQI",
  byLevel: {
    good: (r) => ({
      id: "psqi_good",
      title: "کیفیت خواب",
      body: "کیفیت کلی خواب در محدودهٔ مطلوب است؛ یعنی از نظر مدت، تأخیر در به خواب رفتن و بیدارشدن‌های شبانه، تصویر نسبتاً سالمی داریم.",
      testId: "PSQI",
    }),
    poor: (r) => ({
      id: "psqi_poor",
      title: "کیفیت خواب ضعیف",
      priority: "high",
      body: "نمرهٔ بالا (کیفیت خواب ضعیف) نشان می‌دهد که خواب در چند بعد دچار اختلال است و می‌تواند در کنار استرس، اضطراب یا سبک زندگی، یکی از اهداف اصلی مداخله باشد.",
      testId: "PSQI",
    }),
  },
};

