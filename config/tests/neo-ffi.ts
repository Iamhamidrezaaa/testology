/**
 * Config برای تست NEO-FFI (Five-Factor Inventory)
 */

import { TestConfig } from "@/types/test-scoring";

export const NEO_FFI_CONFIG: TestConfig = {
  id: "NEOFFI",
  title: "تست شخصیت NEO-FFI",
  scoringType: "mean",
  scaleMin: 0,
  scaleMax: 4,
  reverseItems: [7, 13, 14, 17, 22, 23, 24, 28, 31, 33, 35, 38, 41, 51, 57, 59],
  subscales: [
    { id: "neuroticism", label: "روان‌نژندی", items: [2, 6, 8, 11, 13, 16, 18, 23, 26, 33, 38, 41] },
    { id: "extraversion", label: "برون‌گرایی", items: [1, 3, 10, 14, 19, 21, 24, 27, 31, 34, 37, 39] },
    { id: "openness", label: "گشودگی", items: [5, 7, 9, 12, 15, 17, 20, 22, 25, 28, 30, 32] },
    { id: "agreeableness", label: "توافق‌پذیری", items: [4, 29, 35, 40, 42, 43, 45, 47, 48, 51, 53, 55] },
    { id: "conscientiousness", label: "وظیفه‌شناسی", items: [36, 44, 46, 49, 50, 52, 54, 56, 57, 58, 59, 60] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 0.0, max: 1.5 },
    { id: "medium", label: "متوسط", min: 1.6, max: 2.5 },
    { id: "high", label: "بالا", min: 2.6, max: 4.0 },
  ],
  interpretationByLevel: {
    low: "نمره پایین در این عامل شخصیت.",
    medium: "نمره متوسط در این عامل شخصیت.",
    high: "نمره بالا در این عامل شخصیت.",
  },
  recommendations: [
    {
      id: "neo_high_neuroticism",
      conditions: [{ target: "subscale", subscaleId: "neuroticism", comparator: "gte", value: 2.6 }],
      recommendTests: ["GAD7", "PSS10", "PHQ9"],
    },
  ],
};

