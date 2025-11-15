/**
 * Config برای تست Learning Style (سبک یادگیری)
 */

import { TestConfig } from "@/types/test-scoring";

export const LEARNING_STYLE_CONFIG: TestConfig = {
  id: "LearningStyle",
  title: "تست سبک یادگیری (Learning Style Assessment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [3, 5, 7, 10],
  subscales: [
    { id: "reflective_active", label: "فعال / تأمل‌گرا", items: [1, 5, 9] },
    { id: "analytical_practical", label: "تحلیلی / کاربردی", items: [2, 6, 10] },
    { id: "self_regulated", label: "خودنظم‌دهی", items: [3, 7, 11] },
    { id: "environment", label: "ترجیح محیط", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "غیرسازگار / بی‌نظم", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "یادگیرنده مؤثر", min: 3.5, max: 4.2 },
    { id: "very_high", label: "یادگیرنده بسیار مؤثر", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "پروفایل یادگیری شما نشان می‌دهد که در حال حاضر نیازمند راهنمایی و ساختار بیشتر هستید. پیشنهاد می‌شود با تمرین‌های مدیریت زمان و تمرکز شروع کنید.",
    medium: "سبک یادگیری شما در حال توسعه است. با اصلاح عادات مطالعه و استفاده از تکنیک‌های مؤثر می‌توانید پیشرفت قابل توجهی داشته باشید.",
    high: "شما یک یادگیرنده مؤثر هستید. می‌توانید به خوبی اطلاعات را پردازش کنید و از روش‌های مختلف یادگیری استفاده کنید.",
    very_high: "شما یک یادگیرنده بسیار مؤثر و خودتنظیم هستید. می‌توانید به طور مستقل یاد بگیرید و از منابع مختلف استفاده کنید.",
  },
  recommendations: [
    {
      id: "learning_style_low_self_regulated",
      conditions: [{ target: "subscale", subscaleId: "self_regulated", comparator: "lt", value: 2.5 }],
      recommendTests: ["TimeManagement", "FocusAttention", "MAAS"],
    },
  ],
};

