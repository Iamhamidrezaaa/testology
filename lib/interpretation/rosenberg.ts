/**
 * تفسیر تست Rosenberg (عزت نفس)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const ROSENBERG_INTERPRETATION: TestInterpretationConfig = {
  testId: "Rosenberg",
  byLevel: {
    low: (r) => ({
      id: "rosenberg_low",
      title: "عزت نفس",
      body: "نمرهٔ پایین در این تست یعنی تصویر کلی‌ات از خودت همراه با تردید، انتقاد شدید یا احساس «کافی نبودن» است. این به این معنی نیست که واقعاً کم‌ارزش هستی؛ بلکه یعنی ذهن‌ات فعلاً با عینکی سخت‌گیر به خودت نگاه می‌کند.",
      testId: "Rosenberg",
    }),
    medium: (r) => ({
      id: "rosenberg_medium",
      title: "عزت نفس متوسط",
      body: "نمرهٔ متوسط یعنی هم لحظاتی داری که روی خودت حساب می‌کنی و هم لحظاتی که شدیدتر خودت را قضاوت می‌کنی. این سطح بسیار رایج است و با کارکردن روی خودمهربانی و تنظیم توقعات قابل رشد است.",
      testId: "Rosenberg",
    }),
    high: (r) => ({
      id: "rosenberg_high",
      title: "عزت نفس خوب",
      body: "نمره بالا یعنی به‌طور کلی احساس می‌کنی در هستهٔ وجودت ارزشمند هستی، حتی اگر همیشه همه‌چیز طبق برنامه پیش نرود. این یک منبع مهم برای تاب‌آوری در برابر شکست‌ها و نقدهای بیرونی است.",
      testId: "Rosenberg",
    }),
  },
};

