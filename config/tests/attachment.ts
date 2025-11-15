/**
 * Config برای تست Attachment (دلبستگی)
 */

import { TestConfig } from "@/types/test-scoring";

export const ATTACHMENT_CONFIG: TestConfig = {
  id: "Attachment",
  title: "تست دلبستگی (Attachment)",
  scoringType: "mean",
  scaleMin: 1,
  scaleMax: 7,
  reverseItems: [1, 7, 11, 14, 18, 22, 24, 27, 29, 31],
  subscales: [
    { id: "avoidance", label: "اجتناب دلبستگی", items: [1, 3, 5, 7, 9, 11, 12, 14, 16, 18, 19, 21, 22, 24, 26, 27, 29, 31] },
    { id: "anxiety", label: "اضطراب دلبستگی", items: [2, 4, 6, 8, 10, 13, 15, 17, 20, 23, 25, 28, 30, 32, 33, 34, 35, 36] },
  ],
  cutoffs: [
    { id: "secure", label: "ایمن", min: 1.0, max: 3.0 },
    { id: "anxious", label: "اضطرابی", min: 3.1, max: 5.0 },
    { id: "avoidant", label: "اجتنابی", min: 3.1, max: 5.0 },
    { id: "fearful", label: "ترسناک", min: 5.1, max: 7.0 },
  ],
  interpretationByLevel: {
    secure: "دلبستگی ایمن: شما می‌توانید به راحتی با دیگران ارتباط برقرار کنید و از صمیمیت لذت ببرید.",
    anxious: "دلبستگی اضطرابی: شما نگران طرد شدن هستید و به تأیید دیگران نیاز دارید.",
    avoidant: "دلبستگی اجتنابی: شما از صمیمیت دوری می‌کنید و استقلال را ترجیح می‌دهید.",
    fearful: "دلبستگی ترسناک: شما هم از صمیمیت و هم از طرد شدن می‌ترسید.",
  },
  recommendations: [
    {
      id: "attachment_insecure",
      conditions: [{ target: "subscale", subscaleId: "anxiety", comparator: "gte", value: 3.5 }],
      recommendTests: ["GAD7", "PSS10", "Rosenberg"],
    },
  ],
};

