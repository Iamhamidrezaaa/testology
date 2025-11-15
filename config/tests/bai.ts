/**
 * Config برای تست BAI (Beck Anxiety Inventory)
 */

import { TestConfig } from "@/types/test-scoring";

export const BAI_CONFIG: TestConfig = {
  id: "BAI",
  title: "تست اضطراب BAI",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [],
  subscales: [
    {
      id: "anxiety",
      label: "سطح کلی اضطراب",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    },
  ],
  totalRange: { min: 0, max: 63 },
  cutoffs: [
    { id: "minimal", label: "حداقل", min: 0, max: 7 },
    { id: "mild", label: "خفیف", min: 8, max: 15 },
    { id: "moderate", label: "متوسط", min: 16, max: 25 },
    { id: "severe", label: "شدید", min: 26, max: 63 },
  ],
  interpretationByLevel: {
    minimal: "علائم اضطراب در حد طبیعی است و عملکرد روزمره دچار اختلال نمی‌شود.",
    mild: "نشانه‌های اضطراب خفیف دیده می‌شود که ممکن است روی تمرکز یا خواب تأثیر بگذارد.",
    moderate: "اضطراب در سطح متوسط است و می‌تواند عملکرد روزانه را تحت تأثیر قرار دهد.",
    severe: "اضطراب شدید است و نیاز به ارزیابی تخصصی دارد.",
  },
  recommendations: [
    {
      id: "bai_mild_plus",
      conditions: [{ target: "total", comparator: "gte", value: 8 }],
      recommendTests: ["GAD7", "PSS10", "PSQI"],
    },
  ],
};

