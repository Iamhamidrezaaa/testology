/**
 * Config برای تست BDI-II (Beck Depression Inventory)
 */

import { TestConfig } from "@/types/test-scoring";

export const BDI2_CONFIG: TestConfig = {
  id: "BDI2",
  title: "تست افسردگی BDI-II",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [],
  subscales: [
    {
      id: "depression",
      label: "نشانه‌های افسردگی",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    },
  ],
  totalRange: { min: 0, max: 63 },
  cutoffs: [
    { id: "minimal", label: "حداقل", min: 0, max: 13 },
    { id: "mild", label: "خفیف", min: 14, max: 19 },
    { id: "moderate", label: "متوسط", min: 20, max: 28 },
    { id: "severe", label: "شدید", min: 29, max: 63 },
  ],
  interpretationByLevel: {
    minimal: "تغییرات خلقی طبیعی، گاهی خستگی یا بی‌حالی. احتمال افسردگی بالینی کم است.",
    mild: "کاهش انرژی، کاهش تمرکز، بی‌علاقگی خفیف به فعالیت‌ها.",
    moderate: "تأثیر مستقیم بر خواب، اشتها، انگیزه و عملکرد روزانه.",
    severe: "احساس بی‌ارزشی، ناامیدی، خستگی شدید ذهنی و جسمی. پیشنهاد: ارزیابی تخصصی.",
  },
  recommendations: [
    {
      id: "bdi2_mild_plus",
      conditions: [{ target: "total", comparator: "gte", value: 14 }],
      recommendTests: ["PHQ9", "GAD7", "PSS10"],
    },
  ],
};

