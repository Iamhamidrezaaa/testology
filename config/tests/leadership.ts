/**
 * Config برای تست Leadership (رهبری)
 */

import { TestConfig } from "@/types/test-scoring";

export const LEADERSHIP_CONFIG: TestConfig = {
  id: "Leadership",
  title: "تست رهبری",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [5, 7],
  subscales: [
    { id: "transformational", label: "رهبری تحول‌گرا", items: [1, 5, 9] },
    { id: "transactional", label: "رهبری مراوده‌ای", items: [2, 6, 10] },
    { id: "decision_making", label: "تصمیم‌گیری", items: [3, 7, 11] },
    { id: "emotional", label: "رهبری عاطفی", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "poor", label: "ضعیف", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "good", label: "خوب", min: 3.5, max: 4.2 },
    { id: "excellent", label: "عالی", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    poor: "رهبری ضعیف: شما در رهبری مشکل دارید.",
    medium: "رهبری متوسط: شما در برخی موارد می‌توانید رهبری کنید.",
    good: "رهبری خوب: شما معمولاً می‌توانید به خوبی رهبری کنید.",
    excellent: "رهبری عالی: شما در رهبری بسیار خوب هستید.",
  },
  recommendations: [
    {
      id: "leadership_poor",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["EQ", "Teamwork", "CommunicationSkills"],
    },
  ],
};

