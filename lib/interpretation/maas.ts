/**
 * تفسیر تست MAAS (Mindful Attention Awareness Scale)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const MAAS_INTERPRETATION: TestInterpretationConfig = {
  testId: "MAAS",
  byLevel: {
    low: (r) => ({
      id: "maas_low",
      title: "ذهن‌آگاهی",
      body: "نمره پایین یعنی بیشتر اوقات روی حالت «اتوماتیک» هستی؛ حواست جای دیگری است، حین کار چیز دیگری در ذهنت می‌گذرد و کمتر در لحظهٔ اکنون حاضر می‌مانی.",
      testId: "MAAS",
    }),
    medium: (r) => ({
      id: "maas_medium",
      title: "ذهن‌آگاهی متوسط",
      body: "نمره متوسط یعنی هم لحظاتی از حضور و آگاهی در لحظه داری، هم لحظاتی که حواست پخش و پلا می‌شود. با تمرین‌های سادهٔ ذهن‌آگاهی می‌توانی سهم لحظاتِ حضور را بیشتر کنی.",
      testId: "MAAS",
    }),
    high: (r) => ({
      id: "maas_high",
      title: "ذهن‌آگاهی خوب",
      body: "نمره بالا یعنی نسبتاً خوب می‌توانی متوجه حالت درونی، بدن و محیطت باشی، بدون این‌که فوراً قضاوت کنی یا واکنش نشان بدهی. این مهارت یک عامل مهم در تنظیم استرس و هیجان است.",
      testId: "MAAS",
    }),
  },
};

