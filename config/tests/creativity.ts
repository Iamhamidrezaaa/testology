/**
 * Config برای تست Creativity (خلاقیت ذهنی)
 * منبع: مدل Guilford + Torrance
 */

import { TestConfig } from "@/types/test-scoring";

export const CREATIVITY_CONFIG: TestConfig = {
  id: "Creativity",
  title: "تست خلاقیت ذهنی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [2, 5, 10], // طبق config موجود
  subscales: [
    { id: "fluency", label: "روان بودن تولید ایده", items: [1, 2, 3] },
    { id: "flexibility", label: "انعطاف فکری", items: [4, 5, 6] },
    { id: "originality", label: "اصالت ایده‌ها", items: [7, 8, 9] },
    { id: "elaboration", label: "بسط و جزییات", items: [10, 11, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "خوب", min: 3.5, max: 4.2 },
    { id: "very_high", label: "بسیار خوب", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "الگوی پاسخ‌ها نشان می‌دهد خلاقیتت کمتر از حد میانگین است، اما این یک مهارت قابل‌پرورش است.",
    medium: "خلاقیتت در حد متوسط است؛ در بعضی موقعیت‌ها ایده‌های خوبی می‌دهی و جا برای رشد زیاد وجود دارد.",
    high: "الگوی کلی نشان می‌دهد ذهنی خلاق و فعال داری؛ فقط کافی است فرصت بروز بیشتری به آن بدهی.",
    very_high: "خلاقیت تو یک نقطه‌ قوت جدی است. اگر آن را در مسیر درست کانالیزه کنی، می‌تواند منبع لذت، کار و اثرگذاری باشد.",
  },
  recommendations: [
    {
      id: "creativity_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["Innovation", "Curiosity", "GrowthMindset"],
    },
  ],
};

