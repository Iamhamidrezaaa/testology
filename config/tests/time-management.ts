/**
 * Config برای تست Time Management (مدیریت زمان)
 */

import { TestConfig } from "@/types/test-scoring";

export const TIME_MANAGEMENT_CONFIG: TestConfig = {
  id: "TimeManagement",
  title: "تست مدیریت زمان",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 6, 7, 11],
  subscales: [
    { id: "planning", label: "برنامه‌ریزی", items: [1, 5, 9] },
    { id: "prioritization", label: "اولویت‌بندی", items: [2, 6, 10] },
    { id: "discipline", label: "نظم و پیگیری", items: [3, 7, 11] },
    { id: "procrastination_control", label: "کنترل تعلل", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "مدیریت زمان ضعیف: شما در برنامه‌ریزی و مدیریت زمان مشکل دارید.",
    medium: "مدیریت زمان متوسط: شما در برخی حوزه‌ها می‌توانید زمان را مدیریت کنید.",
    good: "مدیریت زمان خوب: شما می‌توانید به خوبی زمان خود را مدیریت کنید.",
    excellent: "مدیریت زمان عالی: شما یک مدیر زمان بسیار مؤثر هستید.",
  },
  recommendations: [
    {
      id: "time_management_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["FocusAttention", "TimePreference", "LearningStyle"],
    },
  ],
};

