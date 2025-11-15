/**
 * Config برای تست Ideal Environment (محیط ایده‌آل)
 */

import { TestConfig } from "@/types/test-scoring";

export const IDEAL_ENVIRONMENT_CONFIG: TestConfig = {
  id: "IdealEnvironment",
  title: "تست محیط ایده‌آل (Ideal Environment Profile)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 5, 6, 7, 10],
  subscales: [
    { id: "sensory_preferences", label: "ترجیح حسی", items: [1, 5, 9] },
    { id: "social_environment", label: "محیط اجتماعی", items: [2, 6, 10] },
    { id: "structure_predictability", label: "ساختار و نظم", items: [3, 7, 11] },
    { id: "stimulation_variety", label: "تنوع و تغییر", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "عدم تطابق", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "نسبتاً مناسب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "بسیار هماهنگ", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "عدم تطابق با محیط: شما در محیط فعلی خود احساس راحتی نمی‌کنید.",
    medium: "محیط متوسط: شما در برخی حوزه‌ها با محیط خود هماهنگ هستید.",
    good: "محیط نسبتاً مناسب: شما در بیشتر موارد با محیط خود هماهنگ هستید.",
    excellent: "محیط بسیار هماهنگ: شما در محیط ایده‌آل خود هستید.",
  },
  recommendations: [
    {
      id: "environment_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSS10", "Adaptability", "WorkLifeBalance"],
    },
  ],
};

