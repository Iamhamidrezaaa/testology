/**
 * تفسیر تست Attachment (دلبستگی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const ATTACHMENT_INTERPRETATION: TestInterpretationConfig = {
  testId: "Attachment",
  byLevel: {
    secure: (r) => ({
      id: "attachment_secure",
      title: "سبک دلبستگی",
      body: "نشان می‌دهد به‌طور کلی در رابطه‌های صمیمی احساس می‌کنی قابل دوست‌داشتن و حمایت‌شدن هستی و از نزدیکی عاطفی کمتر می‌ترسی.",
      testId: "Attachment",
    }),
    anxious: (r) => ({
      id: "attachment_anxious",
      title: "سبک دلبستگی اضطرابی",
      body: "یعنی ترس از رهاشدن یا دوست‌نداشته‌شدن ممکن است در رابطه‌هایت فعال شود، و گاهی زیاد درگیر فکر و خیال دربارهٔ رابطه باشی.",
      testId: "Attachment",
    }),
    avoidant: (r) => ({
      id: "attachment_avoidant",
      title: "سبک دلبستگی اجتنابی",
      body: "یعنی نزدیکی زیاد ممکن است برایت تهدیدکننده یا خفه‌کننده به‌نظر برسد و ترجیح بدهی بیشتر روی خوداتکایی تأکید کنی.",
      testId: "Attachment",
    }),
    fearful: (r) => ({
      id: "attachment_fearful",
      title: "سبک دلبستگی ترسناک",
      priority: "high",
      body: "یعنی هم از صمیمیت و هم از طرد شدن می‌ترسی. این می‌تواند در روابط چالش‌برانگیز باشد و ارزش دارد که با یک متخصص روی آن کار کنی.",
      testId: "Attachment",
    }),
  },
};

