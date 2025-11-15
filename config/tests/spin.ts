/**
 * Config برای تست SPIN (Social Phobia Inventory)
 */

import { TestConfig } from "@/types/test-scoring";

export const SPIN_CONFIG: TestConfig = {
  id: "SPIN",
  title: "تست اضطراب اجتماعی SPIN",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 4,
  reverseItems: [],
  subscales: [
    { id: "fear", label: "ترس اجتماعی", items: [1, 2, 3, 4, 5, 6] },
    { id: "avoidance", label: "اجتناب", items: [7, 8, 9, 10, 11, 12] },
    { id: "physiological", label: "علائم جسمی", items: [13, 14, 15, 16, 17] },
  ],
  totalRange: { min: 0, max: 68 },
  cutoffs: [
    { id: "minimal", label: "حداقل", min: 0, max: 20 },
    { id: "mild", label: "خفیف", min: 21, max: 30 },
    { id: "moderate", label: "متوسط", min: 31, max: 40 },
    { id: "severe", label: "شدید", min: 41, max: 68 },
  ],
  interpretationByLevel: {
    minimal: "اضطراب اجتماعی در حد طبیعی است.",
    mild: "نشانه‌هایی از اضطراب اجتماعی خفیف دیده می‌شود.",
    moderate: "اضطراب اجتماعی در سطح متوسط است و می‌تواند عملکرد اجتماعی را تحت تأثیر قرار دهد.",
    severe: "اضطراب اجتماعی شدید است و نیاز به ارزیابی تخصصی دارد.",
  },
  recommendations: [
    {
      id: "spin_mild_plus",
      conditions: [{ target: "total", comparator: "gte", value: 21 }],
      recommendTests: ["GAD7", "UCLA", "Attachment"],
    },
  ],
};

