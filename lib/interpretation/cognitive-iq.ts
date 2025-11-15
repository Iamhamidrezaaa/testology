/**
 * تفسیر تست Cognitive IQ (هوش شناختی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const COGNITIVE_IQ_INTERPRETATION: TestInterpretationConfig = {
  testId: "CognitiveIQ",
  byLevel: {
    low: (r) => ({
      id: "cognitive_iq_low",
      title: "هوش شناختی",
      body: "نمرهٔ پایین در این تست به این معناست که در اینٔ نوع سؤال‌های خاص (استدلال منطقی، عددی یا الگو) در این نوبت، عملکردت پایین‌تر از میانگین بوده. این تست تصویر کاملِ هوش تو نیست، فقط بخشی از آن را می‌سنجد.",
      testId: "CognitiveIQ",
    }),
    medium: (r) => ({
      id: "cognitive_iq_medium",
      title: "هوش شناختی متوسط",
      body: "نمرهٔ متوسط یعنی در محدودهٔ معمول جمعیت در این نوع مهارت‌های شناختی قرار داری.",
      testId: "CognitiveIQ",
    }),
    good: (r) => ({
      id: "cognitive_iq_good",
      title: "هوش شناختی خوب",
      body: "نمرهٔ بالا نشان می‌دهد در این نوع وظایف شناختی (مثل تحلیل، استدلال، کشف الگو) عملکرد خوبی داری. این فقط یک بخش از هوش کلی توست.",
      testId: "CognitiveIQ",
    }),
    very_high: (r) => ({
      id: "cognitive_iq_very_high",
      title: "هوش شناختی بسیار بالا",
      body: "نمرهٔ بسیار بالا نشان می‌دهد که در این نوع وظایف شناختی عملکرد عالی داری.",
      testId: "CognitiveIQ",
    }),
  },
};

