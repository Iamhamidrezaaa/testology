/**
 * Config برای تست Physical Activity (فعالیت بدنی)
 */

import { TestConfig } from "@/types/test-scoring";

export const PHYSICAL_ACTIVITY_CONFIG: TestConfig = {
  id: "PhysicalActivity",
  title: "تست فعالیت بدنی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [3, 6, 7, 8, 11],
  subscales: [
    { id: "activity_frequency", label: "تعداد دفعات", items: [1, 5, 9] },
    { id: "activity_intensity", label: "شدت فعالیت", items: [2, 6, 10] },
    { id: "sedentary_behavior", label: "کم‌تحرکی", items: [3, 7, 11] },
    { id: "strength_mobility", label: "قدرت و انعطاف", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "فعالیت بدنی پایین: شما فعالیت بدنی کمی دارید که می‌تواند روی انرژی و سلامت تأثیر بگذارد.",
    medium: "فعالیت بدنی متوسط: شما در برخی موارد فعالیت بدنی دارید اما نیاز به افزایش دارید.",
    good: "فعالیت بدنی خوب: شما به طور منظم فعالیت بدنی دارید.",
    very_high: "فعالیت بدنی عالی: شما یک فرد بسیار فعال هستید.",
  },
  recommendations: [
    {
      id: "physical_activity_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["LifestyleHarmony", "PSQI", "PSS10"],
    },
  ],
};

