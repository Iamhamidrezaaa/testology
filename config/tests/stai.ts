/**
 * Config برای تست STAI (State-Trait Anxiety Inventory)
 */

import { TestConfig } from "@/types/test-scoring";

export const STAI_CONFIG: TestConfig = {
  id: "STAI",
  title: "تست اضطراب STAI",
  scoringType: "sum",
  scaleMin: 1,
  scaleMax: 4,
  reverseItems: [3, 4, 6, 7, 9, 12, 13, 14, 17, 18, 23, 24, 26, 27, 30, 33, 36, 38, 39, 40],
  subscales: [
    { id: "state_anxiety", label: "اضطراب حالت", items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    { id: "trait_anxiety", label: "اضطراب صفت", items: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
  ],
  totalRange: { min: 40, max: 160 },
  cutoffs: [
    { id: "low", label: "پایین", min: 40, max: 60 },
    { id: "medium", label: "متوسط", min: 61, max: 80 },
    { id: "high", label: "بالا", min: 81, max: 120 },
    { id: "very_high", label: "بسیار بالا", min: 121, max: 160 },
  ],
  interpretationByLevel: {
    low: "اضطراب در حد طبیعی است.",
    medium: "نشانه‌هایی از اضطراب متوسط دیده می‌شود.",
    high: "اضطراب بالا است و می‌تواند عملکرد روزانه را تحت تأثیر قرار دهد.",
    very_high: "اضطراب بسیار بالا است و نیاز به ارزیابی تخصصی دارد.",
  },
  recommendations: [
    {
      id: "stai_high",
      conditions: [{ target: "total", comparator: "gte", value: 81 }],
      recommendTests: ["GAD7", "PSS10", "MAAS"],
    },
  ],
};

