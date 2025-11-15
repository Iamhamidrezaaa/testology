/**
 * تفسیر تست Communication Skills (مهارت‌های ارتباطی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const COMMUNICATION_SKILLS_INTERPRETATION: TestInterpretationConfig = {
  testId: "CommunicationSkills",
  byLevel: {
    poor: (r) => ({
      id: "communication_poor",
      title: "مهارت‌های ارتباطی",
      body: "نمره پایین یعنی احساس می‌کنی در رساندن پیام، بیان احساسات یا شنیدن طرف مقابل، چالش‌هایی داری. این کاملاً قابل آموزش و تمرین است.",
      testId: "CommunicationSkills",
    }),
    medium: (r) => ({
      id: "communication_medium",
      title: "مهارت‌های ارتباطی متوسط",
      body: "نمره متوسط یعنی در اغلب موقعیت‌ها ارتباطت قابل قبول است، اما در موقعیت‌های حساس یا پرتنش ممکن است یا سکوت کنی یا واکنش‌محور شوی.",
      testId: "CommunicationSkills",
    }),
    good: (r) => ({
      id: "communication_good",
      title: "مهارت‌های ارتباطی خوب",
      body: "نمره بالا یعنی معمولاً می‌توانی هم پیام خودت را شفاف منتقل کنی، هم طرف مقابل را بفهمی و در عین حال احترام رابطه را حفظ کنی.",
      testId: "CommunicationSkills",
    }),
    excellent: (r) => ({
      id: "communication_excellent",
      title: "مهارت‌های ارتباطی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که مهارت‌های ارتباطی یک نقطه قوت جدی برای توست.",
      testId: "CommunicationSkills",
    }),
  },
};

