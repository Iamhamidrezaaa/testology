/**
 * تفسیر تست Leadership (رهبری)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const LEADERSHIP_INTERPRETATION: TestInterpretationConfig = {
  testId: "Leadership",
  byLevel: {
    poor: (r) => ({
      id: "leadership_poor",
      title: "رهبری",
      body: "نمره پایین یعنی فعلاً تمایل یا احساس توانایی برای هدایت دیگران، تصمیم‌گیری جمعی یا مدیریت موقعیت‌های پیچیده برایت چندان پررنگ نیست؛ و این لزوماً چیز بدی نیست.",
      testId: "Leadership",
    }),
    medium: (r) => ({
      id: "leadership_medium",
      title: "رهبری متوسط",
      body: "نمره متوسط یعنی در بعضی موقعیت‌ها می‌توانی نقش رهبری یا هدایت را بگیری، ولی شاید هنوز مطمئن نباشی چقدر این نقش با تو سازگار است.",
      testId: "Leadership",
    }),
    good: (r) => ({
      id: "leadership_good",
      title: "رهبری خوب",
      body: "نمره بالا یعنی تمایل و توان نسبی خوبی برای دیدن تصویر کلی، تصمیم‌گیری، هماهنگ‌کردن آدم‌ها و نگه‌داشتن مسئولیت روی دوشت داری.",
      testId: "Leadership",
    }),
    excellent: (r) => ({
      id: "leadership_excellent",
      title: "رهبری عالی",
      body: "نمره بسیار بالا نشان می‌دهد که رهبری یک نقطه قوت جدی برای توست. این مهارت می‌تواند در کار و روابط به تو کمک بزرگی کند.",
      testId: "Leadership",
    }),
  },
};

