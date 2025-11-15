/**
 * Config برای تست Cognitive IQ (هوش شناختی)
 * توجه: این تست از 0-1 scoring استفاده می‌کند نه Likert
 */

import { TestConfig } from "@/types/test-scoring";

export const COGNITIVE_IQ_CONFIG: TestConfig = {
  id: "CognitiveIQ",
  title: "تست هوش شناختی",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 1,
  reverseItems: [],
  subscales: [
    { id: "fluid_reasoning", label: "استدلال سیال", items: [1, 4, 7, 10] },
    { id: "verbal_reasoning", label: "استدلال کلامی", items: [2, 5, 8, 11] },
    { id: "quantitative_reasoning", label: "استدلال عددی", items: [3, 6, 9, 12] },
  ],
  totalRange: { min: 0, max: 12 },
  cutoffs: [
    { id: "low", label: "پایین", min: 0, max: 3 },
    { id: "medium", label: "متوسط", min: 4, max: 6 },
    { id: "good", label: "خوب", min: 7, max: 9 },
    { id: "very_high", label: "بسیار بالا", min: 10, max: 12 },
  ],
  interpretationByLevel: {
    low: "هوش شناختی پایین: شما در حل مسائل شناختی مشکل دارید.",
    medium: "هوش شناختی متوسط: شما در برخی موارد می‌توانید مسائل را حل کنید.",
    good: "هوش شناختی خوب: شما معمولاً می‌توانید مسائل را به خوبی حل کنید.",
    very_high: "هوش شناختی بسیار بالا: شما در حل مسائل شناختی بسیار خوب هستید.",
  },
  recommendations: [
    {
      id: "cognitive_iq_low",
      conditions: [{ target: "total", comparator: "lt", value: 4 }],
      recommendTests: ["FocusAttention", "Memory", "ProblemSolving"],
    },
  ],
};

