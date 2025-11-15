/**
 * Config برای تست GAD-7 (اضطراب)
 * کاملاً استاندارد - 7 سوال، sum-based، 0-21
 */

import { TestConfig } from "@/types/test-scoring";

export const GAD7_CONFIG: TestConfig = {
  id: "GAD7",
  title: "تست اضطراب GAD-7",
  scoringType: "sum",
  scaleMin: 0,
  scaleMax: 3,
  reverseItems: [], // هیچ سوالی reverse نیست
  subscales: [
    {
      id: "anxiety",
      label: "سطح کلی اضطراب",
      items: [1, 2, 3, 4, 5, 6, 7],
    },
  ],
  totalRange: { min: 0, max: 21 },
  cutoffs: [
    { id: "minimal", label: "اضطراب حداقلی", min: 0, max: 4 },
    { id: "mild", label: "اضطراب خفیف", min: 5, max: 9 },
    { id: "moderate", label: "اضطراب متوسط", min: 10, max: 14 },
    { id: "severe", label: "اضطراب شدید", min: 15, max: 21 },
  ],
  interpretationByLevel: {
    minimal: "در این تست نشانه‌ قابل‌توجهی از اضطراب مزمن دیده نمی‌شود.",
    mild: "مقداری اضطراب تجربه می‌کنی که هنوز لزوماً اختلال نیست، اما ارزش رسیدگی دارد.",
    moderate: "سطح اضطراب در حدی است که می‌تواند روی تمرکز، خواب یا خلق تأثیر بگذارد.",
    severe: "اضطراب در این سطح معمولاً فرساینده است و بهتر است جدی به کمک تخصصی فکر کنی.",
  },
  recommendations: [
    {
      id: "gad7_mild_or_more",
      conditions: [
        { target: "total", comparator: "gte", value: 5 },
      ],
      recommendTests: ["PSS10", "LifestyleSleepQuality", "LifestyleHarmony"],
      message:
        "با توجه به نمره اضطراب، بررسی استرس، کیفیت خواب و سبک زندگی کلی می‌تواند تصویر کامل‌تری بدهد.",
    },
  ],
};

