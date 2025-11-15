/**
 * Config برای تست UCLA Loneliness (تنهایی)
 */

import { TestConfig } from "@/types/test-scoring";

export const UCLA_LONELINESS_CONFIG: TestConfig = {
  id: "UCLA",
  title: "تست تنهایی UCLA",
  scoringType: "sum",
  scaleMin: 1,
  scaleMax: 4,
  reverseItems: [1, 5, 6, 9, 10, 15, 16, 19, 20],
  subscales: [
    {
      id: "loneliness",
      label: "احساس تنهایی",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    },
  ],
  totalRange: { min: 20, max: 80 },
  cutoffs: [
    { id: "low", label: "پایین", min: 20, max: 34 },
    { id: "medium", label: "متوسط", min: 35, max: 49 },
    { id: "high", label: "بالا", min: 50, max: 80 },
  ],
  interpretationByLevel: {
    low: "احساس تنهایی پایین: شما ارتباطات اجتماعی خوبی دارید و احساس تنهایی نمی‌کنید.",
    medium: "احساس تنهایی متوسط: شما در برخی موقعیت‌ها احساس تنهایی می‌کنید.",
    high: "احساس تنهایی بالا: شما احساس تنهایی شدیدی دارید که می‌تواند روی سلامت روان تأثیر بگذارد.",
  },
  recommendations: [
    {
      id: "ucla_high",
      conditions: [{ target: "total", comparator: "gte", value: 50 }],
      recommendTests: ["SPIN", "Attachment", "PHQ9", "GAD7"],
    },
  ],
};

