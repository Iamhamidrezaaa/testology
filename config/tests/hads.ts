/**
 * Config برای تست HADS (Hospital Anxiety and Depression Scale)
 */

import { TestConfig } from "@/types/test-scoring";

export const HADS_CONFIG: TestConfig = {
  id: "HADS",
  title: "تست اضطراب و افسردگی HADS",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [7, 10, 11, 14],
  subscales: [
    { id: "anxiety", label: "اضطراب", items: [1, 3, 5, 7, 9, 11, 13] },
    { id: "depression", label: "افسردگی", items: [2, 4, 6, 8, 10, 12, 14] },
  ],
  totalRange: { min: 0, max: 42 },
  cutoffs: [
    { id: "normal", label: "طبیعی", min: 0, max: 7 },
    { id: "mild", label: "خفیف", min: 8, max: 10 },
    { id: "moderate", label: "متوسط", min: 11, max: 14 },
    { id: "severe", label: "شدید", min: 15, max: 21 },
  ],
  interpretationByLevel: {
    normal: "نشانه‌های اضطراب و افسردگی در حد طبیعی است.",
    mild: "نشانه‌هایی از اضطراب یا افسردگی خفیف دیده می‌شود.",
    moderate: "اضطراب یا افسردگی در سطح متوسط است.",
    severe: "اضطراب یا افسردگی شدید است و نیاز به ارزیابی تخصصی دارد.",
  },
  recommendations: [
    {
      id: "hads_moderate_plus",
      conditions: [{ target: "total", comparator: "gte", value: 11 }],
      recommendTests: ["GAD7", "PHQ9", "PSS10"],
    },
  ],
};

