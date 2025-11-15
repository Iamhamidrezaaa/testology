/**
 * Config برای تست Innovation (نوآوری)
 */

import { TestConfig } from "@/types/test-scoring";

export const INNOVATION_CONFIG: TestConfig = {
  id: "Innovation",
  title: "تست نوآوری و عمل خلاقانه (Innovation & Creative Action)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [2, 7, 8, 12],
  subscales: [
    { id: "idea_generation", label: "ایده‌پردازی", items: [1, 5, 9] },
    { id: "creative_confidence", label: "اعتمادبه‌نفس خلاقانه", items: [2, 6, 10] },
    { id: "innovation_implementation", label: "اجرای ایده‌ها", items: [3, 7, 11] },
    { id: "risk_taking_experimentation", label: "ریسک‌پذیری", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "نوآور فعال", min: 3.5, max: 4.2 },
    { id: "very_high", label: "بسیار نوآور", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "نوآوری پایین: شما در تولید ایده‌های جدید، اعتمادبه‌نفس خلاقانه و اجرای نوآوری‌ها مشکل دارید.",
    medium: "نوآوری متوسط: شما در برخی حوزه‌ها نوآور هستید اما در برخی دیگر نیاز به تقویت دارید.",
    high: "نوآور فعال: شما می‌توانید ایده‌های جدید تولید کنید و آن‌ها را به عمل تبدیل کنید.",
    very_high: "بسیار نوآور: شما یک فرد بسیار نوآور و خلاق هستید که می‌تواند به طور مداوم ایده‌های جدید تولید کند.",
  },
  recommendations: [
    {
      id: "innovation_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["Creativity", "GrowthMindset", "Curiosity"],
    },
  ],
};

