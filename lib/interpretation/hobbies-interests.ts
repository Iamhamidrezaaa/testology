/**
 * تفسیر تست Hobbies & Interests (علایق و سرگرمی‌ها)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const HOBBIES_INTERESTS_INTERPRETATION: TestInterpretationConfig = {
  testId: "HobbiesInterests",
  byLevel: {
    low: (r) => ({
      id: "hobbies_low",
      title: "علایق و سرگرمی‌ها",
      body: "نمره پایین یعنی در این دوره زندگی‌ات احتمالاً کم‌فعالیت‌تر یا کم‌لذت‌تر از چیزی است که دلت می‌خواهد؛ شاید وقت یا انرژی کافی برای سرگرمی‌ها و علایقی که دوست داری پیدا نکرده‌ای.",
      testId: "HobbiesInterests",
    }),
    medium: (r) => ({
      id: "hobbies_medium",
      title: "علایق و سرگرمی‌ها متوسط",
      body: "نمره متوسط یعنی بعضی سرگرمی‌ها و علایق در زندگی‌ات حضور دارند، اما هنوز جا برای پررنگ‌تر شدن لذت، بازی و فعالیت‌های غیرکاری وجود دارد.",
      testId: "HobbiesInterests",
    }),
    high: (r) => ({
      id: "hobbies_high",
      title: "علایق و سرگرمی‌ها خوب",
      body: "نمره بالا یعنی برای چیزهایی که صرفاً برای لذت، کنجکاوی یا استراحت روانی انجام می‌دهی جا باز کرده‌ای؛ این خودش یک عامل محافظتی مهم در برابر فرسودگی است.",
      testId: "HobbiesInterests",
    }),
    very_high: (r) => ({
      id: "hobbies_very_high",
      title: "علایق و سرگرمی‌ها عالی",
      body: "نمره بسیار بالا نشان می‌دهد که علایق و سرگرمی‌ها یک نقطه قوت جدی برای توست.",
      testId: "HobbiesInterests",
    }),
  },
};

