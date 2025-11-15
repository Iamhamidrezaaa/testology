/**
 * Config برای تست PANAS (Positive and Negative Affect Schedule)
 */

import { TestConfig } from "@/types/test-scoring";

export const PANAS_CONFIG: TestConfig = {
  id: "PANAS",
  title: "تست عاطفه مثبت و منفی PANAS",
  scoringType: "sum",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [],
  subscales: [
    { id: "positive_affect", label: "عاطفه مثبت", items: [1, 3, 5, 9, 10, 12, 14, 16, 17, 19] },
    { id: "negative_affect", label: "عاطفه منفی", items: [2, 4, 6, 7, 8, 11, 13, 15, 18, 20] },
  ],
  totalRange: { min: 10, max: 50 },
  cutoffs: [
    { id: "low", label: "پایین", min: 10, max: 20 },
    { id: "medium", label: "متوسط", min: 21, max: 35 },
    { id: "high", label: "بالا", min: 36, max: 50 },
  ],
  interpretationByLevel: {
    low: "عاطفه پایین: شما احساسات مثبت یا منفی کمی دارید.",
    medium: "عاطفه متوسط: شما در برخی موقعیت‌ها احساسات قوی دارید.",
    high: "عاطفه بالا: شما احساسات قوی و شدیدی دارید.",
  },
  recommendations: [
    {
      id: "panas_high_negative",
      conditions: [{ target: "subscale", subscaleId: "negative_affect", comparator: "gte", value: 30 }],
      recommendTests: ["GAD7", "PHQ9", "PSS10"],
    },
  ],
};

