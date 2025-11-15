/**
 * Config برای تست Time Preference (ترجیح زمانی)
 * منبع: ZTPI, CFC
 */

import { TestConfig } from "@/types/test-scoring";

export const TIME_PREFERENCE_CONFIG: TestConfig = {
  id: "TimePreference",
  title: "تست ترجیح زمانی (Time Preference / Temporal Orientation)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 6, 7, 11],
  subscales: [
    { id: "future_orientation", label: "آینده‌نگری", items: [1, 5, 9] },
    { id: "present_focused", label: "تمرکز بر حال", items: [2, 6, 10] },
    { id: "impulsivity_delay_discounting", label: "تکانشگری", items: [3, 7, 11] },
    { id: "past_reflection", label: "رابطه با گذشته", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "imbalanced", label: "نامتوازن", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "balanced", label: "متوازن", min: 3.5, max: 4.2 },
    { id: "very_balanced", label: "بسیار سالم", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    imbalanced: "ترجیح زمانی نامتوازن: شما در مدیریت زمان و نگرش نسبت به زمان مشکل دارید.",
    medium: "ترجیح زمانی متوسط: شما در برخی حوزه‌ها نگرش سالم دارید اما در برخی دیگر نیاز به بهبود دارید.",
    balanced: "ترجیح زمانی متوازن: شما می‌توانید به خوبی بین آینده، حال و گذشته تعادل برقرار کنید.",
    very_balanced: "ترجیح زمانی بسیار سالم: شما یک نگرش سالم و متوازن نسبت به زمان دارید.",
  },
  recommendations: [
    {
      id: "time_preference_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["TimeManagement", "FocusAttention", "LearningStyle"],
    },
  ],
};

