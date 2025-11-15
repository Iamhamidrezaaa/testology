/**
 * Config برای تست Resilience (تاب‌آوری)
 */

import { TestConfig } from "@/types/test-scoring";

export const RESILIENCE_CONFIG: TestConfig = {
  id: "Resilience",
  title: "تست تاب‌آوری (Resilience)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [3, 7, 9, 11],
  subscales: [
    { id: "adaptability", label: "انطباق‌پذیری", items: [1, 5, 9] },
    { id: "perseverance", label: "پشتکار", items: [2, 6, 10] },
    { id: "optimism", label: "خوش‌بینی", items: [3, 7, 11] },
    { id: "support_seeking", label: "جستجوی حمایت", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "تاب‌آوری پایین: شما در مواجهه با مشکلات و چالش‌ها مشکل دارید.",
    medium: "تاب‌آوری متوسط: شما در برخی موارد می‌توانید با مشکلات کنار بیایید اما در برخی دیگر نیاز به بهبود دارید.",
    high: "تاب‌آوری خوب: شما معمولاً می‌توانید به خوبی با مشکلات و چالش‌ها کنار بیایید.",
    very_high: "تاب‌آوری عالی: شما یک فرد بسیار تاب‌آور هستید که می‌تواند به طور مؤثر با مشکلات و چالش‌ها کنار بیاید.",
  },
  recommendations: [
    {
      id: "resilience_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSS10", "GAD7", "PHQ9", "Adaptability"],
    },
  ],
};

