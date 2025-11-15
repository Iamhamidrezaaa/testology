/**
 * Config برای تست Personal Values (ارزش‌های شخصی)
 * منبع: Schwartz Value Theory
 */

import { TestConfig } from "@/types/test-scoring";

export const PERSONAL_VALUES_CONFIG: TestConfig = {
  id: "PersonalValues",
  title: "تست ارزش‌های شخصی (Personal Values Assessment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [4, 6, 7],
  subscales: [
    { id: "self_enhancement", label: "پیشرفت فردی", items: [1, 5, 9] },
    { id: "self_transcendence", label: "دیگرگرایی", items: [2, 6, 10] },
    { id: "openness_to_change", label: "گشودگی به تغییر", items: [3, 7, 11] },
    { id: "conservation", label: "ثبات و امنیت", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "unclear", label: "کم‌رنگ", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "stable", label: "پایدار", min: 3.5, max: 4.2 },
    { id: "strong", label: "قوی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    unclear: "ارزش‌های کم‌رنگ: ارزش‌های شخصی شما نامشخص یا کم‌رنگ هستند.",
    medium: "ارزش‌های متوسط: شما در برخی حوزه‌ها ارزش‌های مشخص دارید اما در برخی دیگر نیاز به وضوح دارید.",
    stable: "ارزش‌های پایدار: شما ارزش‌های مشخص و پایدار دارید که به تصمیم‌گیری و انگیزه شما کمک می‌کند.",
    strong: "ارزش‌های قوی: شما ارزش‌های قوی و بسیار مشخص دارید که به شدت روی تصمیم‌گیری و سبک زندگی شما تأثیر می‌گذارد.",
  },
  recommendations: [
    {
      id: "values_low_openness",
      conditions: [{ target: "subscale", subscaleId: "openness_to_change", comparator: "lt", value: 2.5 }],
      recommendTests: ["GrowthMindset", "Curiosity", "Innovation"],
    },
  ],
};

