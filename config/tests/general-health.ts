/**
 * Config برای تست General Health (سلامت کلی)
 */

import { TestConfig } from "@/types/test-scoring";

export const GENERAL_HEALTH_CONFIG: TestConfig = {
  id: "GeneralHealth",
  title: "تست سلامت کلی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [5, 6, 7, 10],
  subscales: [
    { id: "physical_energy_fatigue", label: "انرژی و خستگی", items: [1, 5, 9] },
    { id: "sleep_quality", label: "کیفیت خواب", items: [2, 6, 10] },
    { id: "pain_physical_discomfort", label: "درد و ناراحتی", items: [3, 7, 11] },
    { id: "daily_functioning", label: "عملکرد روزانه", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "سلامت کلی ضعیف: شما در چند حوزه سلامت مشکل دارید.",
    medium: "سلامت کلی متوسط: شما در برخی حوزه‌ها سلامت خوب دارید اما در برخی دیگر نیاز به بهبود دارید.",
    good: "سلامت کلی خوب: شما در بیشتر موارد سلامت خوب دارید.",
    excellent: "سلامت کلی عالی: شما سلامت بسیار خوب دارید.",
  },
  recommendations: [
    {
      id: "general_health_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSQI", "PSS10", "PHQ9", "LifestyleHarmony"],
    },
  ],
};

