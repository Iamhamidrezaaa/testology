/**
 * Config برای تست DASS-21 (Depression, Anxiety and Stress Scale)
 */

import { TestConfig } from "@/types/test-scoring";

export const DASS21_CONFIG: TestConfig = {
  id: "DASS21",
  title: "تست افسردگی، اضطراب و استرس DASS-21",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [],
  subscales: [
    { id: "depression", label: "افسردگی", items: [3, 5, 10, 13, 16, 17, 21] },
    { id: "anxiety", label: "اضطراب", items: [2, 4, 7, 9, 15, 19, 20] },
    { id: "stress", label: "استرس", items: [1, 6, 8, 11, 12, 14, 18] },
  ],
  totalRange: { min: 0, max: 63 },
  cutoffs: [
    { id: "normal", label: "طبیعی", min: 0, max: 9 },
    { id: "mild", label: "خفیف", min: 10, max: 13 },
    { id: "moderate", label: "متوسط", min: 14, max: 20 },
    { id: "severe", label: "شدید", min: 21, max: 27 },
    { id: "extremely_severe", label: "بسیار شدید", min: 28, max: 42 },
  ],
  interpretationByLevel: {
    normal: "نشانه‌های افسردگی، اضطراب و استرس در حد طبیعی است.",
    mild: "نشانه‌هایی از افسردگی، اضطراب یا استرس خفیف دیده می‌شود.",
    moderate: "افسردگی، اضطراب یا استرس در سطح متوسط است.",
    severe: "افسردگی، اضطراب یا استرس شدید است و نیاز به ارزیابی تخصصی دارد.",
    extremely_severe: "افسردگی، اضطراب یا استرس بسیار شدید است و نیاز به کمک فوری دارد.",
  },
  recommendations: [
    {
      id: "dass21_moderate_plus",
      conditions: [{ target: "total", comparator: "gte", value: 14 }],
      recommendTests: ["GAD7", "PHQ9", "PSS10"],
    },
  ],
};

