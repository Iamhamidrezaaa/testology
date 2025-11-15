/**
 * Config برای تست Curiosity (کنجکاوی)
 * منبع: CEI-II (Kashdan)
 */

import { TestConfig } from "@/types/test-scoring";

export const CURIOSITY_CONFIG: TestConfig = {
  id: "Curiosity",
  title: "تست کنجکاوی و گشودگی (Curiosity & Openness Assessment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [3, 8, 10, 12],
  subscales: [
    { id: "joyous_exploration", label: "لذت از کشف", items: [1, 5, 9] },
    { id: "deprivation_sensitivity", label: "نیاز به دانستن", items: [2, 6, 10] },
    { id: "openness_new_experiences", label: "گشودگی به تجارب جدید", items: [3, 7, 11] },
    { id: "risk_tolerance", label: "ریسک‌پذیری", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "کنجکاوی سالم", min: 3.5, max: 4.2 },
    { id: "very_high", label: "کنجکاوی بالا", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "کنجکاوی پایین: شما در تولید ایده‌های جدید، اعتمادبه‌نفس خلاقانه و اجرای نوآوری‌ها مشکل دارید.",
    medium: "کنجکاوی متوسط: شما در برخی حوزه‌ها کنجکاو هستید اما در برخی دیگر نیاز به تقویت دارید.",
    high: "کنجکاوی سالم: شما می‌توانید ایده‌های جدید تولید کنید و از تجربه چیزهای جدید لذت ببرید.",
    very_high: "کنجکاوی بالا: شما یک فرد بسیار کنجکاو و خلاق هستید که از کشف و یادگیری لذت می‌برید.",
  },
  recommendations: [
    {
      id: "curiosity_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["GrowthMindset", "LearningStyle", "Creativity"],
    },
  ],
};

