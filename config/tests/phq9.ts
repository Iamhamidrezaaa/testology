/**
 * Config برای تست PHQ-9 (افسردگی)
 * استاندارد - 9 سوال، sum-based، 0-27
 */

import { TestConfig } from "@/types/test-scoring";

export const PHQ9_CONFIG: TestConfig = {
  id: "PHQ9",
  title: "تست افسردگی PHQ-9",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [],
  subscales: [
    {
      id: "depression",
      label: "نشانه‌های افسردگی",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
  ],
  totalRange: { min: 0, max: 27 },
  cutoffs: [
    { id: "minimal", label: "حداقلی", min: 0, max: 4 },
    { id: "mild", label: "خفیف", min: 5, max: 9 },
    { id: "moderate", label: "متوسط", min: 10, max: 14 },
    { id: "moderately_severe", label: "نسبتاً شدید", min: 15, max: 19 },
    { id: "severe", label: "شدید", min: 20, max: 27 },
  ],
  interpretationByLevel: {
    minimal: "در این تست نشانه‌ قابل‌توجهی از افسردگی پایدار دیده نمی‌شود.",
    mild: "چند علامت ملایم از افت خلق و انرژی دیده می‌شود.",
    moderate:
      "الگوی پاسخ‌ها نشان می‌دهد خلق، انرژی یا انگیزه‌ات در حد متوسط تحت فشار قرار گرفته.",
    moderately_severe:
      "نشانه‌های افسردگی در سطح نسبتاً شدیدی قرار دارند و ممکن است عملکرد روزمره را تحت تأثیر قرار دهند.",
    severe:
      "سطح نشانه‌ها نشان‌دهنده‌ یک وضعیت جدی افسردگی است که نیازمند ارزیابی تخصصی است.",
  },
  recommendations: [
    {
      id: "phq9_mild",
      conditions: [{ target: "total", comparator: "gte", value: 5 }],
      recommendTests: ["PSS10", "LifestyleSleepQuality", "GeneralHealth"],
    },
    {
      id: "phq9_moderate_plus",
      conditions: [{ target: "total", comparator: "gte", value: 10 }],
      recommendTests: ["GAD7", "LifestyleHarmony"],
      message:
        "بهتر است اضطراب، سبک زندگی و تعادل کار–زندگی هم بررسی شوند؛ چون اغلب همراه افسردگی درگیرند.",
    },
  ],
};

