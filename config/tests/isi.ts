/**
 * Config برای تست ISI (Insomnia Severity Index)
 */

import { TestConfig } from "@/types/test-scoring";

export const ISI_CONFIG: TestConfig = {
  id: "ISI",
  title: "تست شدت بی‌خوابی ISI",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 4,
  reverseItems: [],
  subscales: [
    {
      id: "insomnia_severity",
      label: "شدت بی‌خوابی",
      items: [1, 2, 3, 4, 5, 6, 7],
    },
  ],
  totalRange: { min: 0, max: 28 },
  cutoffs: [
    { id: "no_insomnia", label: "بدون بی‌خوابی", min: 0, max: 7 },
    { id: "subthreshold", label: "زیرآستانه", min: 8, max: 14 },
    { id: "moderate", label: "متوسط", min: 15, max: 21 },
    { id: "severe", label: "شدید", min: 22, max: 28 },
  ],
  interpretationByLevel: {
    no_insomnia: "بدون بی‌خوابی: شما مشکل بی‌خوابی ندارید.",
    subthreshold: "بی‌خوابی زیرآستانه: شما نشانه‌هایی از بی‌خوابی دارید اما در حد خفیف.",
    moderate: "بی‌خوابی متوسط: شما مشکل بی‌خوابی متوسط دارید که می‌تواند روی عملکرد روزانه تأثیر بگذارد.",
    severe: "بی‌خوابی شدید: شما مشکل بی‌خوابی شدید دارید که نیاز به ارزیابی تخصصی دارد.",
  },
  recommendations: [
    {
      id: "isi_moderate_plus",
      conditions: [{ target: "total", comparator: "gte", value: 8 }],
      recommendTests: ["PSQI", "PSS10", "GAD7"],
    },
  ],
};

