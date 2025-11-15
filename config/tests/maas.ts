/**
 * Config برای تست MAAS (Mindful Attention Awareness Scale)
 */

import { TestConfig } from "@/types/test-scoring";

export const MAAS_CONFIG: TestConfig = {
  id: "MAAS",
  title: "تست ذهن‌آگاهی MAAS",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 6,
  reverseItems: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // همه reverse
  subscales: [
    {
      id: "mindfulness",
      label: "ذهن‌آگاهی",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 3.0 },
    { id: "medium", label: "متوسط", min: 3.1, max: 4.5 },
    { id: "high", label: "خوب", min: 4.6, max: 6.0 },
  ],
  interpretationByLevel: {
    low: "ذهن‌آگاهی پایین: شما در حضور ذهن و آگاهی از لحظه حال مشکل دارید.",
    medium: "ذهن‌آگاهی متوسط: شما در برخی موقعیت‌ها می‌توانید حضور ذهن داشته باشید.",
    high: "ذهن‌آگاهی خوب: شما می‌توانید به خوبی در لحظه حال حضور داشته باشید و از آن آگاه باشید.",
  },
  recommendations: [
    {
      id: "maas_low",
      conditions: [{ target: "total", comparator: "lt", value: 4.0 }],
      recommendTests: ["PSS10", "FocusAttention", "LifestyleHarmony"],
    },
  ],
};

