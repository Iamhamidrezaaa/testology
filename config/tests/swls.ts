/**
 * Config برای تست SWLS (Satisfaction With Life Scale)
 */

import { TestConfig } from "@/types/test-scoring";

export const SWLS_CONFIG: TestConfig = {
  id: "SWLS",
  title: "تست رضایت از زندگی SWLS",
  scoringType: "sum",
  scaleMin: 1,
  scaleMax: 7,
  reverseItems: [],
  subscales: [
    {
      id: "life_satisfaction",
      label: "رضایت از زندگی",
      items: [1, 2, 3, 4, 5],
    },
  ],
  totalRange: { min: 5, max: 35 },
  cutoffs: [
    { id: "dissatisfied", label: "ناراضی", min: 5, max: 9 },
    { id: "slightly_dissatisfied", label: "کمی ناراضی", min: 10, max: 14 },
    { id: "neutral", label: "خنثی", min: 15, max: 19 },
    { id: "slightly_satisfied", label: "کمی راضی", min: 20, max: 24 },
    { id: "satisfied", label: "راضی", min: 25, max: 35 },
  ],
  interpretationByLevel: {
    dissatisfied: "رضایت از زندگی پایین: شما از زندگی خود راضی نیستید.",
    slightly_dissatisfied: "رضایت از زندگی کمی پایین: شما در برخی حوزه‌ها راضی نیستید.",
    neutral: "رضایت از زندگی خنثی: شما در مورد زندگی خود احساس خنثی دارید.",
    slightly_satisfied: "رضایت از زندگی کمی بالا: شما در بیشتر موارد از زندگی خود راضی هستید.",
    satisfied: "رضایت از زندگی بالا: شما از زندگی خود راضی هستید.",
  },
  recommendations: [
    {
      id: "swls_low",
      conditions: [{ target: "total", comparator: "lt", value: 20 }],
      recommendTests: ["PHQ9", "PSS10", "LifestyleHarmony"],
    },
  ],
};

