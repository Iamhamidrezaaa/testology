/**
 * تفسیر تست Innovation (نوآوری)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const INNOVATION_INTERPRETATION: TestInterpretationConfig = {
  testId: "Innovation",
  byLevel: {
    low: (r) => ({
      id: "innovation_low",
      title: "نوآوری",
      body: "نمره پایین یعنی فعلاً ترجیح می‌دهی بیشتر از راه‌های امتحان‌شده و آشنا استفاده کنی و تبدیل ایده‌ها به عمل برایت چالش‌برانگیزتر است.",
      testId: "Innovation",
    }),
    medium: (r) => ({
      id: "innovation_medium",
      title: "نوآوری متوسط",
      body: "نمره متوسط یعنی گاهی ایده‌های جدید می‌دهی و گاهی از مسیرهای تکراری استفاده می‌کنی؛ ضمن این‌که اجرای ایده‌ها همیشه آسان نیست.",
      testId: "Innovation",
    }),
    good: (r) => ({
      id: "innovation_good",
      title: "نوآوری خوب",
      body: "نمره بالا یعنی هم تمایل به ساختن و امتحان‌کردن چیزهای جدید داری، هم می‌توانی ایده‌ها را وارد عمل کنی و از شکست‌های احتمالی هم یاد بگیری.",
      testId: "Innovation",
    }),
    very_high: (r) => ({
      id: "innovation_very_high",
      title: "نوآوری عالی",
      body: "نمره بسیار بالا نشان می‌دهد که نوآوری یک نقطه قوت جدی برای توست.",
      testId: "Innovation",
    }),
  },
};

