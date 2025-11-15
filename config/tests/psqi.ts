/**
 * Config برای تست PSQI (Pittsburgh Sleep Quality Index)
 */

import { TestConfig } from "@/types/test-scoring";

export const PSQI_CONFIG: TestConfig = {
  id: "PSQI",
  title: "تست کیفیت خواب PSQI",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [],
  subscales: [
    {
      id: "sleep_quality",
      label: "کیفیت خواب کلی",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    },
  ],
  totalRange: { min: 0, max: 21 },
  cutoffs: [
    { id: "good", label: "خوب", min: 0, max: 5 },
    { id: "poor", label: "ضعیف", min: 6, max: 21 },
  ],
  interpretationByLevel: {
    good: "کیفیت خواب شما خوب است و احتمالاً خواب کافی و راحت دارید.",
    poor: "کیفیت خواب شما ضعیف است. این می‌تواند روی انرژی، خلق و عملکرد روزانه تأثیر بگذارد.",
  },
  recommendations: [
    {
      id: "psqi_poor",
      conditions: [{ target: "total", comparator: "gte", value: 6 }],
      recommendTests: ["PSS10", "GAD7", "LifestyleHarmony"],
    },
  ],
};

