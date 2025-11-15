/**
 * Config برای تست PSS-10 (استرس ادراک‌شده)
 * منبع: Cohen, Kamarck, Mermelstein (1983)
 */

import { TestConfig } from "@/types/test-scoring";

export const PSS10_CONFIG: TestConfig = {
  id: "PSS10",
  title: "تست استرس ادراک‌شده (PSS-10)",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 4,
  reverseItems: [4, 5, 7, 8],
  subscales: [
    {
      id: "helplessness",
      label: "احساس درماندگی",
      items: [1, 2, 3, 6, 9, 10],
    },
    {
      id: "self_efficacy",
      label: "احساس توانمندی",
      items: [4, 5, 7, 8],
    },
  ],
  totalRange: { min: 0, max: 40 },
  cutoffs: [
    { id: "low", label: "پایین / معمولی", min: 0, max: 13 },
    { id: "moderate", label: "متوسط", min: 14, max: 26 },
    { id: "high", label: "بالا", min: 27, max: 40 },
  ],
  interpretationByLevel: {
    low: "فشارهای زندگی در حد معمول. سیستم بدن معمولاً فرصت ریکاوری پیدا می‌کند. گاهی استرس هست، اما مزمن و فرساینده نیست.",
    moderate: "استرس قابل توجه در چند حوزه مختلف. ممکن است روی خواب، خلق، تمرکز اثر گذاشته باشد. نقطه‌ای عالی برای شروع تمرین‌های مدیریت استرس و تغییر سبک زندگی.",
    high: "فشار ذهنی مزمن. احتمالاً با علائمی مثل بی‌خوابی، خستگی، ضعف تمرکز، زودعصبی‌شدن همراه است. پیشنهاد قوی برای بررسی خواب (PSQI / ISI)، بررسی اضطراب (GAD-7) و افسردگی (PHQ-9)، و تمرین‌های سیستماتیک ریلکسیشن، ذهن‌آگاهی، یا مشاوره.",
  },
  recommendations: [
    {
      id: "pss10_moderate_plus",
      conditions: [{ target: "total", comparator: "gte", value: 14 }],
      recommendTests: ["MAAS", "LifestyleHarmony"],
    },
    {
      id: "pss10_high",
      conditions: [{ target: "total", comparator: "gte", value: 27 }],
      recommendTests: ["PSQI", "ISI", "GAD7", "PHQ9"],
    },
  ],
};

