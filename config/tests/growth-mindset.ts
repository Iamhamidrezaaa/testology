/**
 * Config برای تست Growth Mindset (ذهنیت رشد)
 * منبع: Carol Dweck's Theory
 */

import { TestConfig } from "@/types/test-scoring";

export const GROWTH_MINDSET_CONFIG: TestConfig = {
  id: "GrowthMindset",
  title: "تست ذهنیت رشد (Growth Mindset Assessment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [3, 5, 7, 8, 10],
  subscales: [
    { id: "effort_beliefs", label: "باور به تلاش", items: [1, 5, 9] },
    { id: "learning_orientation", label: "گرایش به یادگیری", items: [2, 6, 10] },
    { id: "challenges_persistence", label: "چالش‌پذیری", items: [3, 7, 11] },
    { id: "growth_self_view", label: "خودانگاره رشدی", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "fixed", label: "ذهنیت ثابت", min: 1.0, max: 2.4 },
    { id: "mixed", label: "ترکیبی", min: 2.5, max: 3.4 },
    { id: "growth", label: "ذهنیت رشد سالم", min: 3.5, max: 4.2 },
    { id: "strong_growth", label: "ذهنیت رشد قدرتمند", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    fixed: "ذهنیت ثابت: شما باور دارید که توانایی‌ها و هوش ثابت هستند. این می‌تواند منجر به ناامیدی و اجتناب از چالش‌ها شود.",
    mixed: "ذهنیت ترکیبی: شما در برخی حوزه‌ها ذهنیت رشد دارید و در برخی دیگر ذهنیت ثابت.",
    growth: "ذهنیت رشد سالم: شما باور دارید که توانایی‌ها قابل توسعه هستند و از چالش‌ها لذت می‌برید.",
    strong_growth: "ذهنیت رشد قدرتمند: شما یک ذهنیت رشد پایدار و قوی دارید که به شما کمک می‌کند تا در بلندمدت به اهداف خود برسید.",
  },
  recommendations: [
    {
      id: "growth_mindset_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["Curiosity", "LearningStyle", "PSS10"],
    },
  ],
};

