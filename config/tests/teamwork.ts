/**
 * Config برای تست Teamwork (کار تیمی)
 */

import { TestConfig } from "@/types/test-scoring";

export const TEAMWORK_CONFIG: TestConfig = {
  id: "Teamwork",
  title: "تست کار تیمی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 6, 9, 12],
  subscales: [
    { id: "cooperation", label: "همکاری", items: [1, 5, 9] },
    { id: "communication", label: "ارتباطات", items: [2, 6, 10] },
    { id: "responsibility", label: "مسئولیت‌پذیری", items: [3, 7, 11] },
    { id: "conflict_resolution", label: "حل تعارض", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "کار تیمی ضعیف: شما در کار تیمی مشکل دارید.",
    medium: "کار تیمی متوسط: شما در برخی موارد می‌توانید در تیم کار کنید.",
    good: "کار تیمی خوب: شما معمولاً می‌توانید به خوبی در تیم کار کنید.",
    excellent: "کار تیمی عالی: شما در کار تیمی بسیار خوب هستید.",
  },
  recommendations: [
    {
      id: "teamwork_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["CommunicationSkills", "EQ", "Leadership"],
    },
  ],
};

