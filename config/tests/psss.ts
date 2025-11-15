/**
 * Config برای تست PSSS (Perceived Social Support Scale)
 */

import { TestConfig } from "@/types/test-scoring";

export const PSSS_CONFIG: TestConfig = {
  id: "PSSS",
  title: "تست حمایت اجتماعی PSSS",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [],
  subscales: [
    { id: "family", label: "حمایت خانواده", items: [3, 4, 8, 11] },
    { id: "friends", label: "حمایت دوستان", items: [6, 7, 9, 12] },
    { id: "significant_other", label: "حمایت فرد مهم", items: [1, 2, 5, 10] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "حمایت اجتماعی پایین: شما حمایت اجتماعی کمی دارید.",
    medium: "حمایت اجتماعی متوسط: شما در برخی حوزه‌ها حمایت دارید.",
    high: "حمایت اجتماعی خوب: شما حمایت اجتماعی خوبی دارید.",
    very_high: "حمایت اجتماعی عالی: شما حمایت اجتماعی بسیار قوی دارید.",
  },
  recommendations: [
    {
      id: "psss_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["UCLA", "Attachment", "PHQ9"],
    },
  ],
};

