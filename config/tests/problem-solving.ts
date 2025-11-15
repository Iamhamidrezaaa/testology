/**
 * Config برای تست Problem Solving (حل مسئله)
 */

import { TestConfig } from "@/types/test-scoring";

export const PROBLEM_SOLVING_CONFIG: TestConfig = {
  id: "ProblemSolving",
  title: "تست حل مسئله",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [5, 8, 10],
  subscales: [
    { id: "problem_identification", label: "تشخیص مسئله", items: [1, 5, 9] },
    { id: "generating_solutions", label: "تولید راه‌حل", items: [2, 6, 10] },
    { id: "decision_making", label: "تصمیم‌گیری", items: [3, 7, 11] },
    { id: "execution_evaluation", label: "اجرا و ارزیابی", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "حل مسئله ضعیف: شما در حل مسائل مشکل دارید.",
    medium: "حل مسئله متوسط: شما در برخی موارد می‌توانید مسائل را حل کنید.",
    good: "حل مسئله خوب: شما معمولاً می‌توانید مسائل را به خوبی حل کنید.",
    excellent: "حل مسئله عالی: شما در حل مسائل بسیار خوب هستید.",
  },
  recommendations: [
    {
      id: "problem_solving_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["DecisionMaking", "FocusAttention", "Creativity"],
    },
  ],
};

