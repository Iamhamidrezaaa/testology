/**
 * Config برای تست Focus & Attention (تمرکز و توجه)
 */

import { TestConfig } from "@/types/test-scoring";

export const FOCUS_ATTENTION_CONFIG: TestConfig = {
  id: "FocusAttention",
  title: "تست تمرکز و توجه",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [5, 6, 8, 12],
  subscales: [
    { id: "sustained_attention", label: "توجه پایدار", items: [1, 5, 9] },
    { id: "selective_attention", label: "توجه انتخابی", items: [2, 6, 10] },
    { id: "working_memory", label: "حافظه فعال", items: [3, 7, 11] },
    { id: "executive_control", label: "کنترل اجرایی", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "high_problem", label: "مشکل بالا", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "low_problem", label: "مشکل پایین", min: 3.5, max: 5.0 },
  ],
  interpretationByLevel: {
    high_problem: "مشکل تمرکز بالا: شما در حفظ تمرکز و توجه مشکل دارید.",
    medium: "تمرکز متوسط: شما در برخی موقعیت‌ها می‌توانید تمرکز کنید اما در برخی دیگر مشکل دارید.",
    low_problem: "تمرکز خوب: شما می‌توانید به خوبی تمرکز کنید و حواس‌پرتی را مدیریت کنید.",
  },
  recommendations: [
    {
      id: "focus_high_problem",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["TimeManagement", "MAAS", "PSQI"],
    },
  ],
};

