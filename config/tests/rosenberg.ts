/**
 * Config برای تست Rosenberg (عزت‌نفس)
 */

import { TestConfig } from "@/types/test-scoring";

export const ROSENBERG_CONFIG: TestConfig = {
  id: "Rosenberg",
  title: "تست عزت‌نفس Rosenberg",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [3, 5, 8, 9, 10],
  subscales: [
    {
      id: "self_esteem",
      label: "عزت‌نفس کلی",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
  ],
  totalRange: { min: 0, max: 30 },
  cutoffs: [
    { id: "low", label: "پایین", min: 0, max: 14 },
    { id: "medium", label: "متوسط", min: 15, max: 25 },
    { id: "high", label: "بالا", min: 26, max: 30 },
  ],
  interpretationByLevel: {
    low: "عزت‌نفس پایین: شک به ارزشمندی خود، حساسیت به انتقاد، گرایش به خودسرزنشی.",
    medium: "عزت‌نفس متوسط: دید واقع‌گرایانه نسبت به خود، توانایی مدیریت چالش‌ها.",
    high: "عزت‌نفس بالا: اعتمادبه‌نفس، رضایت از خویشتن، ثبات هیجانی.",
  },
  recommendations: [
    {
      id: "rosenberg_low",
      conditions: [{ target: "total", comparator: "lt", value: 15 }],
      recommendTests: ["PHQ9", "PSS10", "Attachment"],
    },
  ],
};

