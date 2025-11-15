/**
 * تفسیر تست PSSS (Perceived Social Support Scale)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const PSSS_INTERPRETATION: TestInterpretationConfig = {
  testId: "PSSS",
  byLevel: {
    low: (r) => ({
      id: "psss_low",
      title: "حمایت اجتماعی",
      body: "نمره پایین یعنی احساس می‌کنی در موقعیت‌های سخت، آدم‌های زیادی نیستند که بتوانی با خیال راحت به آن‌ها تکیه کنی یا درد‌دل کنی؛ یا اگر هستند، احساس نمی‌کنی واقعاً تو را می‌فهمند.",
      testId: "PSSS",
    }),
    medium: (r) => ({
      id: "psss_medium",
      title: "حمایت اجتماعی متوسط",
      body: "نمره متوسط یعنی در بعضی حوزه‌ها (خانواده، دوستان، همکاران) حمایت اجمالاً وجود دارد، اما ممکن است هنوز احساس کنی از نظر عاطفی یا عملی، جا برای بهترشدن هست.",
      testId: "PSSS",
    }),
    high: (r) => ({
      id: "psss_high",
      title: "حمایت اجتماعی خوب",
      body: "نمره بالا یعنی احساس می‌کنی تنها نیستی؛ آدم‌هایی در زندگی‌ات هستند که اگر لازم باشد، می‌توانی روی حمایت عاطفی، فکری یا حتی عملی‌شان حساب کنی.",
      testId: "PSSS",
    }),
    very_high: (r) => ({
      id: "psss_very_high",
      title: "حمایت اجتماعی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که حمایت اجتماعی یک نقطه قوت جدی برای توست.",
      testId: "PSSS",
    }),
  },
};

