/**
 * Config برای تست Eating Habits (عادات غذایی)
 */

import { TestConfig } from "@/types/test-scoring";

export const EATING_HABITS_CONFIG: TestConfig = {
  id: "EatingHabits",
  title: "تست عادات غذایی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [3, 7, 8, 10, 11],
  subscales: [
    { id: "meal_regularity", label: "نظم وعده‌ها", items: [1, 5, 9] },
    { id: "healthy_food_choices", label: "انتخاب‌های سالم", items: [2, 6, 10] },
    { id: "emotional_eating", label: "غذا خوردن احساسی", items: [3, 7, 11] },
    { id: "portion_control", label: "کنترل حجم", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "عادات غذایی ضعیف: شما در تغذیه مشکل دارید که می‌تواند روی سلامت تأثیر بگذارد.",
    medium: "عادات غذایی متوسط: شما در برخی موارد تغذیه سالم دارید اما در برخی دیگر نیاز به بهبود دارید.",
    good: "عادات غذایی خوب: شما معمولاً تغذیه سالم و متعادل دارید.",
    excellent: "عادات غذایی عالی: شما تغذیه بسیار سالم و متعادل دارید.",
  },
  recommendations: [
    {
      id: "eating_habits_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["LifestyleHarmony", "PSS10"],
    },
  ],
};

