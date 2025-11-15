/**
 * Config برای تست BFI (Big Five Inventory)
 */

import { TestConfig } from "@/types/test-scoring";

export const BFI_CONFIG: TestConfig = {
  id: "BFI",
  title: "تست شخصیت BFI",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [7, 8, 11, 14, 18, 26, 34, 37, 41, 43, 44],
  subscales: [
    { id: "extraversion", label: "برون‌گرایی", items: [1, 6, 11, 16, 21, 26, 31, 36] },
    { id: "agreeableness", label: "توافق‌پذیری", items: [2, 7, 12, 17, 22, 27, 32, 37, 42] },
    { id: "conscientiousness", label: "وظیفه‌شناسی", items: [3, 8, 13, 18, 23, 28, 33, 38, 43] },
    { id: "neuroticism", label: "روان‌نژندی", items: [4, 9, 14, 19, 24, 29, 34, 39] },
    { id: "openness", label: "گشودگی", items: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "بالا", min: 3.5, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "نمره پایین در این عامل شخصیت.",
    medium: "نمره متوسط در این عامل شخصیت.",
    high: "نمره بالا در این عامل شخصیت.",
  },
  recommendations: [
    {
      id: "bfi_high_neuroticism",
      conditions: [{ target: "subscale", subscaleId: "neuroticism", comparator: "gte", value: 3.5 }],
      recommendTests: ["GAD7", "PSS10", "PHQ9"],
    },
  ],
};

