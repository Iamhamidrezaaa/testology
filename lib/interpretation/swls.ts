/**
 * تفسیر تست SWLS (Satisfaction With Life Scale)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const SWLS_INTERPRETATION: TestInterpretationConfig = {
  testId: "SWLS",
  byLevel: {
    dissatisfied: (r) => ({
      id: "swls_dissatisfied",
      title: "رضایت از زندگی",
      body: "نمرهٔ پایین یعنی در حال حاضر فاصلهٔ قابل توجهی بین زندگی‌ای که داری و زندگی‌ای که آرزو داری وجود دارد. این احساس می‌تواند دردناک باشد، اما همین آگاهی نقطهٔ شروع طراحی تغییرات واقعی است.",
      testId: "SWLS",
    }),
    slightly_dissatisfied: (r) => ({
      id: "swls_slightly_dissatisfied",
      title: "رضایت از زندگی",
      body: "نمرهٔ پایین یعنی در حال حاضر فاصلهٔ قابل توجهی بین زندگی‌ای که داری و زندگی‌ای که آرزو داری وجود دارد. این احساس می‌تواند دردناک باشد، اما همین آگاهی نقطهٔ شروع طراحی تغییرات واقعی است.",
      testId: "SWLS",
    }),
    neutral: (r) => ({
      id: "swls_neutral",
      title: "رضایت از زندگی",
      body: "نمرهٔ متوسط یعنی بعضی بخش‌های زندگی‌ات برایت رضایت‌بخش هستند و بعضی دیگر نه؛ تصویر کلی، ترکیبی از رضایت و نارضایتی است.",
      testId: "SWLS",
    }),
    slightly_satisfied: (r) => ({
      id: "swls_slightly_satisfied",
      title: "رضایت از زندگی",
      body: "نمرهٔ بالا نشان می‌دهد در مجموع از مسیر زندگی‌ات – با وجود همهٔ نقص‌ها – احساس رضایت نسبی تا بالایی داری و بخش‌های مهم زندگی‌ات با ارزش‌ها و خواسته‌هایت هماهنگ‌تر هستند.",
      testId: "SWLS",
    }),
    satisfied: (r) => ({
      id: "swls_satisfied",
      title: "رضایت از زندگی",
      body: "نمرهٔ بالا نشان می‌دهد در مجموع از مسیر زندگی‌ات – با وجود همهٔ نقص‌ها – احساس رضایت نسبی تا بالایی داری و بخش‌های مهم زندگی‌ات با ارزش‌ها و خواسته‌هایت هماهنگ‌تر هستند.",
      testId: "SWLS",
    }),
  },
};

