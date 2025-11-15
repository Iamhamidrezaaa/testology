/**
 * Config برای تست Work-Life Balance (تعادل کار-زندگی)
 */

import { TestConfig } from "@/types/test-scoring";

export const WORK_LIFE_BALANCE_CONFIG: TestConfig = {
  id: "WorkLifeBalance",
  title: "تست تعادل کار–زندگی (Work–Life Balance)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [1, 2, 4, 5, 6, 7, 9, 10],
  subscales: [
    { id: "work_to_life_interference", label: "مزاحمت کار→زندگی", items: [1, 5, 9] },
    { id: "life_to_work_interference", label: "مزاحمت زندگی→کار", items: [2, 6, 10] },
    { id: "recovery_rest", label: "ریکاوری و استراحت", items: [3, 7, 11] },
    { id: "boundaries_control", label: "مرزبندی و کنترل", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "تعادل کار–زندگی ضعیف: شما در تعادل بین کار و زندگی شخصی مشکل دارید. این می‌تواند منجر به فرسودگی و استرس مزمن شود.",
    medium: "تعادل کار–زندگی متوسط: شما در برخی حوزه‌ها تعادل دارید اما در برخی دیگر نیاز به بهبود دارید.",
    good: "تعادل کار–زندگی خوب: شما می‌توانید به خوبی بین کار و زندگی شخصی تعادل برقرار کنید.",
    excellent: "تعادل کار–زندگی عالی: شما یک تعادل پایدار و سالم بین کار و زندگی شخصی دارید.",
  },
  recommendations: [
    {
      id: "wlb_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSS10", "PSQI", "LifestyleHarmony", "MAAS"],
    },
  ],
};

