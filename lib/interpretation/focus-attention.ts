/**
 * تفسیر تست Focus & Attention (تمرکز و توجه)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const FOCUS_ATTENTION_INTERPRETATION: TestInterpretationConfig = {
  testId: "FocusAttention",
  byLevel: {
    high_problem: (r) => ({
      id: "focus_high_problem",
      title: "تمرکز و توجه",
      body: "نمرهٔ پایین یعنی در حال حاضر حفظ تمرکز، ماندن روی یک کار، یا جمع‌کردن حواس برایت چالش‌برانگیز شده؛ این می‌تواند به استرس، خواب، افسردگی، ADHD یا عوامل محیطی هم ربط داشته باشد.",
      testId: "FocusAttention",
    }),
    medium: (r) => ({
      id: "focus_medium",
      title: "تمرکز و توجه متوسط",
      body: "نمرهٔ متوسط یعنی گاهی تمرکز خوبی داری و گاهی حواس‌ات زود پرت می‌شود؛ چیزی بین «نوسان طبیعی» و «چالش جدی» است.",
      testId: "FocusAttention",
    }),
    low_problem: (r) => ({
      id: "focus_low_problem",
      title: "تمرکز و توجه خوب",
      body: "نمرهٔ بالا نشان می‌دهد در بسیاری از موقعیت‌ها می‌توانی توجه‌ات را روی کاری که مهم است نگه داری، حتی اگر اطراف‌ات محرک زیاد باشد.",
      testId: "FocusAttention",
    }),
  },
};

