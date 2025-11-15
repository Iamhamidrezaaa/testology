/**
 * تفسیر تست Decision Making (تصمیم‌گیری)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const DECISION_MAKING_INTERPRETATION: TestInterpretationConfig = {
  testId: "DecisionMaking",
  byLevel: {
    poor: (r) => ({
      id: "decision_making_poor",
      title: "تصمیم‌گیری",
      body: "نمره پایین یعنی تصمیم‌گیری، به‌خصوص در انتخاب‌های مهم، می‌تواند برایت استرس‌زا و فلج‌کننده باشد و ممکن است خودت را زیاد سرزنش کنی.",
      testId: "DecisionMaking",
    }),
    medium: (r) => ({
      id: "decision_making_medium",
      title: "تصمیم‌گیری متوسط",
      body: "نمره متوسط یعنی در بسیاری از موقعیت‌ها می‌توانی تصمیم بگیری، اما در موقعیت‌های پرریسک، طولانی‌مدت یا مبهم، تردید و کش‌مکش داخلی را بیشتر تجربه می‌کنی.",
      testId: "DecisionMaking",
    }),
    good: (r) => ({
      id: "decision_making_good",
      title: "تصمیم‌گیری خوب",
      body: "نمره بالا نشان می‌دهد که معمولاً می‌توانی بین اطلاعات موجود و احساس درونی‌ات تعادل برقرار کنی و به تصمیمی برسی که بتوانی پایش بایستی.",
      testId: "DecisionMaking",
    }),
    excellent: (r) => ({
      id: "decision_making_excellent",
      title: "تصمیم‌گیری عالی",
      body: "نمره بسیار بالا نشان می‌دهد که تصمیم‌گیری یک نقطه قوت جدی برای توست.",
      testId: "DecisionMaking",
    }),
  },
};

