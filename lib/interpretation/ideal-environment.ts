/**
 * تفسیر تست Ideal Environment (محیط ایده‌آل)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const IDEAL_ENVIRONMENT_INTERPRETATION: TestInterpretationConfig = {
  testId: "IdealEnvironment",
  byLevel: {
    poor: (r) => ({
      id: "ideal_env_poor",
      title: "محیط ایده‌آل",
      body: "نمره پایین یعنی محیطی که در آن زندگی یا کار می‌کنی، از نظر صدا، نور، میزان تعامل، ساختار یا تنوع، خیلی با ترجیحات طبیعی تو نمی‌خواند و همین می‌تواند بخشی از خستگی یا حواس‌پرتی‌ات را توضیح دهد.",
      testId: "IdealEnvironment",
    }),
    medium: (r) => ({
      id: "ideal_env_medium",
      title: "محیط ایده‌آل متوسط",
      body: "نمره متوسط یعنی بعضی بخش‌های محیط با تو جور هستند و بعضی نه؛ مثلاً ممکن است سکوت را دوست داشته باشی اما در محیط شلوغ کار کنی.",
      testId: "IdealEnvironment",
    }),
    good: (r) => ({
      id: "ideal_env_good",
      title: "محیط ایده‌آل خوب",
      body: "نمره بالا یعنی به‌طور کلی محیط‌های فعلی‌ات با ترجیحات حسی، اجتماعی و ساختاری تو هماهنگ‌تر هستند و همین، کار و یادگیری را برایت آسان‌تر می‌کند.",
      testId: "IdealEnvironment",
    }),
    excellent: (r) => ({
      id: "ideal_env_excellent",
      title: "محیط ایده‌آل عالی",
      body: "نمره بسیار بالا نشان می‌دهد که محیط‌های فعلی‌ات با ترجیحات تو بسیار هماهنگ هستند.",
      testId: "IdealEnvironment",
    }),
  },
};

