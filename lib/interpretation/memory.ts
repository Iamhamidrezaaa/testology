/**
 * تفسیر تست Memory (حافظه)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const MEMORY_INTERPRETATION: TestInterpretationConfig = {
  testId: "Memory",
  byLevel: {
    poor: (r) => ({
      id: "memory_poor",
      title: "حافظه",
      body: "نمره پایین یعنی در بازبینی اطلاعات، به‌خاطرآوردن جزئیات یا حفظ اطلاعات تازه، در این دوره چالش بیشتری احساس می‌کنی. این می‌تواند به خستگی، استرس، خواب یا حواس‌پرتی هم ربط داشته باشد.",
      testId: "Memory",
    }),
    medium: (r) => ({
      id: "memory_medium",
      title: "حافظه متوسط",
      body: "نمره متوسط یعنی حافظه‌ات در حد معمول جمعیت کار می‌کند؛ نه خیلی برجسته، نه خیلی ضعیف.",
      testId: "Memory",
    }),
    good: (r) => ({
      id: "memory_good",
      title: "حافظه خوب",
      body: "نمره بالا یعنی در به‌خاطرآوردن اطلاعات، جزئیات یا الگوها توان نسبی خوبی داری.",
      testId: "Memory",
    }),
    excellent: (r) => ({
      id: "memory_excellent",
      title: "حافظه عالی",
      body: "نمره بسیار بالا نشان می‌دهد که حافظه یک نقطه قوت جدی برای توست.",
      testId: "Memory",
    }),
  },
};

