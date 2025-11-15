/**
 * تفسیر تست Time Preference (ترجیح زمانی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const TIME_PREFERENCE_INTERPRETATION: TestInterpretationConfig = {
  testId: "TimePreference",
  byLevel: {
    low: (r) => ({
      id: "time_preference_low",
      title: "ترجیح زمانی",
      body: "نمره پایین یعنی در ترجیح زمانی و نگرش نسبت به زمان، الگوی نامتوازنی داری.",
      testId: "TimePreference",
    }),
    medium: (r) => ({
      id: "time_preference_medium",
      title: "ترجیح زمانی متوسط",
      body: "نمره متوسط یعنی در بسیاری از موقعیت‌ها می‌توانی بین لذت کوتاه‌مدت و هدف بلندمدت تعادل برقرار کنی.",
      testId: "TimePreference",
    }),
    good: (r) => ({
      id: "time_preference_good",
      title: "ترجیح زمانی خوب",
      body: "نمره بالا یعنی بیشتر تمایل داری پیامدهای بلندمدت تصمیم‌ها را ببینی و برای آینده برنامه‌ریزی کنی، حتی اگر الان کمی سخت‌تر باشد.",
      testId: "TimePreference",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    const futureOrientation = result.subscales.find(s => s.id === "future_orientation");
    if (futureOrientation && futureOrientation.score >= 3.5) {
      chunks.push({
        id: "time_pref_future_high",
        title: "آینده‌نگری",
        body: "بیشتر تمایل داری پیامدهای بلندمدت تصمیم‌ها را ببینی و برای آینده برنامه‌ریزی کنی.",
        testId: "TimePreference",
      });
    }

    const impulsivity = result.subscales.find(s => s.id === "impulsivity_delay_discounting");
    if (impulsivity && impulsivity.score >= 3.5) {
      chunks.push({
        id: "time_pref_impulse_high",
        title: "تکانشگری",
        body: "بیشتر ترجیح می‌دهی پاداش‌های کوچک و فوری را به پاداش‌های بزرگ ولی دیرتر ترجیح بدهی؛ این می‌تواند در پس‌انداز، سلامت و پروژه‌های بلندمدت تأثیر بگذارد.",
        testId: "TimePreference",
      });
    }

    return chunks;
  },
};

