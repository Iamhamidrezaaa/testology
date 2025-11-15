/**
 * Config برای تست RIASEC (Holland Career Interest)
 */

import { TestConfig } from "@/types/test-scoring";

export const RIASEC_CONFIG: TestConfig = {
  id: "RIASEC",
  title: "تست علایق شغلی RIASEC",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [],
  subscales: [
    { id: "realistic", label: "واقع‌گرا", items: [1, 7, 13, 19, 25] },
    { id: "investigative", label: "پژوهش‌گر", items: [2, 8, 14, 20, 26] },
    { id: "artistic", label: "هنری", items: [3, 9, 15, 21, 27] },
    { id: "social", label: "اجتماعی", items: [4, 10, 16, 22, 28] },
    { id: "enterprising", label: "کارآفرین", items: [5, 11, 17, 23, 29] },
    { id: "conventional", label: "قراردادی", items: [6, 12, 18, 24, 30] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "بسیار خوب", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "علاقه پایین به این نوع فعالیت‌ها.",
    medium: "علاقه متوسط به این نوع فعالیت‌ها.",
    high: "علاقه خوب به این نوع فعالیت‌ها.",
    very_high: "علاقه بسیار خوب به این نوع فعالیت‌ها.",
  },
  recommendations: [
    {
      id: "riasec_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PersonalValues", "HobbiesInterests"],
    },
  ],
};

