/**
 * تفسیر تست Teamwork (کار تیمی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const TEAMWORK_INTERPRETATION: TestInterpretationConfig = {
  testId: "Teamwork",
  byLevel: {
    poor: (r) => ({
      id: "teamwork_poor",
      title: "کار تیمی",
      body: "نمره پایین یعنی کار تیمی برایت بیشتر خسته‌کننده یا مبهم است تا الهام‌بخش؛ شاید ترجیح بدهی بیشتر مستقل کار کنی.",
      testId: "Teamwork",
    }),
    medium: (r) => ({
      id: "teamwork_medium",
      title: "کار تیمی متوسط",
      body: "نمره متوسط یعنی هم می‌توانی در تیم کار کنی، هم گاهی از تعارض‌ها یا کندی تصمیم‌گیری در گروه خسته شوی.",
      testId: "Teamwork",
    }),
    good: (r) => ({
      id: "teamwork_good",
      title: "کار تیمی خوب",
      body: "نمره بالا نشان می‌دهد در محیط‌های تیمی احساس راحتی بیشتری می‌کنی، از همکاری، تقسیم کار و ساختن نتیجهٔ مشترک لذت می‌بری.",
      testId: "Teamwork",
    }),
    excellent: (r) => ({
      id: "teamwork_excellent",
      title: "کار تیمی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که کار تیمی یک نقطه قوت جدی برای توست.",
      testId: "Teamwork",
    }),
  },
};

