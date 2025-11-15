/**
 * Config برای تست Adaptability (انطباق‌پذیری)
 */

import { TestConfig } from "@/types/test-scoring";

export const ADAPTABILITY_CONFIG: TestConfig = {
  id: "Adaptability",
  title: "تست انطباق‌پذیری (Adaptability Assessment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [2, 4, 5, 7, 10, 12],
  subscales: [
    { id: "cognitive_flexibility", label: "انعطاف ذهنی", items: [1, 5, 9] },
    { id: "emotional_adaptability", label: "سازگاری هیجانی", items: [2, 6, 10] },
    { id: "behavioral_adaptability", label: "انعطاف رفتاری", items: [3, 7, 11] },
    { id: "openness_to_change", label: "گشودگی به تغییر", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "انطباق‌پذیری پایین: شما در سازگاری با تغییرات مشکل دارید. این می‌تواند منجر به استرس و کاهش عملکرد شود.",
    medium: "انطباق‌پذیری متوسط: شما در برخی موقعیت‌ها می‌توانید سازگار باشید اما در برخی دیگر نیاز به بهبود دارید.",
    high: "انطباق‌پذیری خوب: شما می‌توانید به خوبی با تغییرات سازگار شوید و از آن‌ها بهره ببرید.",
    very_high: "انطباق‌پذیری عالی: شما یک فرد بسیار انعطاف‌پذیر هستید که می‌تواند به راحتی با تغییرات کنار بیاید.",
  },
  recommendations: [
    {
      id: "adaptability_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["GrowthMindset", "Curiosity", "PSS10"],
    },
  ],
};

