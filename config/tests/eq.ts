/**
 * Config برای تست EQ (هوش هیجانی)
 */

import { TestConfig } from "@/types/test-scoring";

export const EQ_CONFIG: TestConfig = {
  id: "EQ",
  title: "تست هوش هیجانی EQ",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [9, 10, 12, 13, 20, 22, 23, 24],
  subscales: [
    { id: "intrapersonal", label: "درون‌فردی", items: [1, 6, 11, 16, 21, 26] },
    { id: "interpersonal", label: "میان‌فردی", items: [2, 7, 12, 17, 22, 27] },
    { id: "stress_management", label: "مدیریت استرس", items: [3, 8, 13, 18, 23, 28] },
    { id: "adaptability", label: "انعطاف‌پذیری", items: [4, 9, 14, 19, 24, 29] },
    { id: "general_mood", label: "خلق عمومی", items: [5, 10, 15, 20, 25, 30] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "هوش هیجانی پایین: شما در درک و مدیریت احساسات خود و دیگران مشکل دارید.",
    medium: "هوش هیجانی متوسط: شما در برخی حوزه‌ها هوش هیجانی خوبی دارید اما در برخی دیگر نیاز به بهبود دارید.",
    high: "هوش هیجانی خوب: شما می‌توانید به خوبی احساسات خود و دیگران را درک و مدیریت کنید.",
    very_high: "هوش هیجانی عالی: شما یک فرد بسیار باهوش هیجانی هستید که می‌تواند به طور مؤثر با احساسات کار کند.",
  },
  recommendations: [
    {
      id: "eq_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSS10", "GAD7", "MAAS"],
    },
  ],
};

