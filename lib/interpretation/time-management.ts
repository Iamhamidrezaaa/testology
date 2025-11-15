/**
 * تفسیر تست Time Management (مدیریت زمان)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const TIME_MANAGEMENT_INTERPRETATION: TestInterpretationConfig = {
  testId: "TimeManagement",
  byLevel: {
    poor: (r) => ({
      id: "time_management_poor",
      title: "مدیریت زمان",
      body: "نمره پایین یعنی احساس می‌کنی زمان مدام از دستت می‌لغزد؛ کارها عقب می‌افتند، اولویت‌ها قاطی می‌شوند و آخر روز خسته‌ای، بدون این‌که حس کنی به اندازهٔ کافی جلو رفته‌ای.",
      testId: "TimeManagement",
    }),
    medium: (r) => ({
      id: "time_management_medium",
      title: "مدیریت زمان متوسط",
      body: "نمره متوسط یعنی در بعضی روزها و پروژه‌ها برنامه‌ریزی خوبی داری، اما در بعضی موقعیت‌ها حواس‌پرتی، تعویق یا درخواست‌های دیگران برنامه‌ات را به‌هم می‌ریزند.",
      testId: "TimeManagement",
    }),
    good: (r) => ({
      id: "time_management_good",
      title: "مدیریت زمان خوب",
      body: "نمره بالا یعنی معمولاً می‌توانی برای کارهایت زمان‌بندی واقع‌بینانه بچینی، بین مهم و غیرمهم فرق بگذاری و به برنامه‌ای که می‌چینی تا حد خوبی پایبند بمانی.",
      testId: "TimeManagement",
    }),
    excellent: (r) => ({
      id: "time_management_excellent",
      title: "مدیریت زمان عالی",
      body: "نمره بسیار بالا نشان می‌دهد که مدیریت زمان یک نقطه قوت جدی برای توست.",
      testId: "TimeManagement",
    }),
  },
};

