/**
 * Config برای تست Hobbies & Interests (علایق و سرگرمی‌ها)
 */

import { TestConfig } from "@/types/test-scoring";

export const HOBBIES_INTERESTS_CONFIG: TestConfig = {
  id: "HobbiesInterests",
  title: "تست علایق و سرگرمی‌ها (Hobbies & Interests Profile)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [6, 7],
  subscales: [
    { id: "creative_interests", label: "علایق خلاقانه", items: [1, 5, 9] },
    { id: "physical_outdoor_interests", label: "علایق بدنی/بیرونی", items: [2, 6, 10] },
    { id: "social_community_interests", label: "علایق اجتماعی", items: [3, 7, 11] },
    { id: "intellectual_learning_interests", label: "علایق فکری/یادگیری", items: [4, 8, 12] },
  ],
  cutoffs: [
    { id: "low", label: "پایین", min: 1.0, max: 2.4 },
    { id: "medium", label: "متوسط", min: 2.5, max: 3.4 },
    { id: "high", label: "فعال", min: 3.5, max: 4.2 },
    { id: "very_high", label: "بسیار فعال", min: 4.3, max: 5.0 },
  ],
  interpretationByLevel: {
    low: "علایق و سرگرمی‌ها محدود: شما در فعالیت‌های تفریحی و علایق خود محدود هستید.",
    medium: "علایق و سرگرمی‌ها متوسط: شما در برخی حوزه‌ها علایق دارید اما در برخی دیگر نیاز به توسعه دارید.",
    high: "علایق و سرگرمی‌ها فعال: شما در چند حوزه علایق مشخص دارید و از فعالیت‌های تفریحی لذت می‌برید.",
    very_high: "علایق و سرگرمی‌ها غنی: شما یک فرد بسیار فعال با علایق متنوع هستید.",
  },
  recommendations: [
    {
      id: "hobbies_low",
      conditions: [{ target: "total", comparator: "lt", value: 3.0 }],
      recommendTests: ["Creativity", "Curiosity", "PhysicalActivity"],
    },
  ],
};

