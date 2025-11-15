/**
 * Config برای تست Lifestyle Sleep Quality (کیفیت خواب سبک زندگی)
 */

import { TestConfig } from "@/types/test-scoring";

export const LIFESTYLE_SLEEP_QUALITY_CONFIG: TestConfig = {
  id: "LifestyleSleepQuality",
  title: "تست کیفیت خواب سبک زندگی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 5, 6, 7, 8, 10, 12],
  subscales: [
    { id: "sleep_duration", label: "مدت خواب", items: [1, 5, 9] },
    { id: "sleep_depth_restfulness", label: "عمق خواب", items: [2, 6, 10] },
    { id: "sleep_routine_habits", label: "عادات خواب", items: [3, 7, 11] },
    { id: "daytime_sleepiness", label: "خواب‌آلودگی روزانه", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "کیفیت خواب ضعیف: شما در خواب مشکل دارید که می‌تواند روی انرژی و عملکرد تأثیر بگذارد.",
    medium: "کیفیت خواب متوسط: شما در برخی موارد خواب خوب دارید اما در برخی دیگر نیاز به بهبود دارید.",
    good: "کیفیت خواب خوب: شما معمولاً خواب کافی و راحت دارید.",
    excellent: "کیفیت خواب عالی: شما خواب بسیار خوب و ریکاوری‌کننده دارید.",
  },
  recommendations: [
    {
      id: "sleep_quality_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSQI", "PSS10", "LifestyleHarmony"],
    },
  ],
};

