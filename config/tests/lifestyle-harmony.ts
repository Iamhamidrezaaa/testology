/**
 * Config برای تست Lifestyle Harmony (سبک زندگی کلی)
 */

import { TestConfig } from "@/types/test-scoring";

export const LIFESTYLE_HARMONY_CONFIG: TestConfig = {
  id: "LifestyleHarmony",
  title: "تست سبک زندگی کلی (Lifestyle Harmony Assessment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [2, 4, 5, 6, 7],
  subscales: [
    { id: "healthy_habits", label: "عادت‌های سالم", items: [1, 5, 9] },
    { id: "daily_balance_stress", label: "تعادل و استرس", items: [2, 6, 10] },
    { id: "energy_mood_regulation", label: "انرژی و خلق", items: [3, 7, 11] },
    { id: "routine_productivity", label: "روتین و بهره‌وری", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "unhealthy", label: "ناسالم", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "healthy", label: "سالم", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    unhealthy: "سبک زندگی ناسالم: شما در چند حوزه سبک زندگی مشکل دارید. این می‌تواند منجر به فرسایش و کاهش کیفیت زندگی شود.",
    medium: "سبک زندگی متوسط: شما در برخی حوزه‌ها سبک زندگی سالم دارید اما در برخی دیگر نیاز به بهبود دارید.",
    healthy: "سبک زندگی سالم: شما در بیشتر موارد سبک زندگی سالم و پایدار دارید.",
    excellent: "سبک زندگی عالی: شما یک سبک زندگی بسیار سالم، پایدار و هماهنگ دارید.",
  },
  recommendations: [
    {
      id: "lifestyle_unhealthy",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["PSQI", "LifestyleSleepQuality", "WorkLifeBalance", "PSS10"],
    },
  ],
};

