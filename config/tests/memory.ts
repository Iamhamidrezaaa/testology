/**
 * Config برای تست Memory (حافظه)
 */

import { TestConfig } from "@/types/test-scoring";

export const MEMORY_CONFIG: TestConfig = {
  id: "Memory",
  title: "تست حافظه",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 5, 7, 10],
  subscales: [
    { id: "working_memory", label: "حافظه فعال", items: [1, 5, 9] },
    { id: "short_term_memory", label: "حافظه کوتاه‌مدت", items: [2, 6, 10] },
    { id: "long_term_memory", label: "حافظه بلندمدت", items: [3, 7, 11] },
    { id: "prospective_memory", label: "حافظه آینده‌نگر", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "حافظه ضعیف: شما در حافظه مشکل دارید.",
    medium: "حافظه متوسط: شما در برخی موارد حافظه خوب دارید.",
    good: "حافظه خوب: شما معمولاً حافظه خوبی دارید.",
    excellent: "حافظه عالی: شما حافظه بسیار خوبی دارید.",
  },
  recommendations: [
    {
      id: "memory_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["FocusAttention", "PSQI", "PSS10"],
    },
  ],
};

