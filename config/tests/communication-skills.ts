/**
 * Config برای تست Communication Skills (مهارت‌های ارتباطی)
 */

import { TestConfig } from "@/types/test-scoring";

export const COMMUNICATION_SKILLS_CONFIG: TestConfig = {
  id: "CommunicationSkills",
  title: "تست مهارت‌های ارتباطی",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [6, 9, 12],
  subscales: [
    { id: "expressiveness", label: "بیان‌گری", items: [1, 5, 9] },
    { id: "active_listening", label: "گوش‌دادن فعال", items: [2, 6, 10] },
    { id: "assertiveness", label: "قاطعیت", items: [3, 7, 11] },
    { id: "social_awareness", label: "آگاهی اجتماعی", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "مهارت‌های ارتباطی ضعیف: شما در ارتباطات مشکل دارید.",
    medium: "مهارت‌های ارتباطی متوسط: شما در برخی موارد می‌توانید ارتباط برقرار کنید.",
    good: "مهارت‌های ارتباطی خوب: شما معمولاً می‌توانید به خوبی ارتباط برقرار کنید.",
    excellent: "مهارت‌های ارتباطی عالی: شما در ارتباطات بسیار خوب هستید.",
  },
  recommendations: [
    {
      id: "communication_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["EQ", "Teamwork", "SPIN"],
    },
  ],
};

