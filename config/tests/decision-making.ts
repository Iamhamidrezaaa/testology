/**
 * Config برای تست Decision Making (تصمیم‌گیری)
 */

import { TestConfig } from "@/types/test-scoring";

export const DECISION_MAKING_CONFIG: TestConfig = {
  id: "DecisionMaking",
  title: "تست تصمیم‌گیری",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [6, 7, 8],
  subscales: [
    { id: "rational_analysis", label: "تحلیل منطقی", items: [1, 5, 9] },
    { id: "intuitive", label: "تصمیم‌گیری شهودی", items: [2, 6, 10] },
    { id: "risk_evaluation", label: "ارزیابی ریسک", items: [3, 7, 11] },
    { id: "decisiveness", label: "قاطعیت", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "تصمیم‌گیری ضعیف: شما در تصمیم‌گیری مشکل دارید.",
    medium: "تصمیم‌گیری متوسط: شما در برخی موارد می‌توانید تصمیم‌گیری کنید.",
    good: "تصمیم‌گیری خوب: شما معمولاً می‌توانید تصمیم‌های خوب بگیرید.",
    excellent: "تصمیم‌گیری عالی: شما در تصمیم‌گیری بسیار خوب هستید.",
  },
  recommendations: [
    {
      id: "decision_making_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["TimeManagement", "FocusAttention", "ProblemSolving"],
    },
  ],
};

