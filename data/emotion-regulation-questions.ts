import { Question } from '../types/test'

export const emotionRegulationQuestions: any[] = [
  {
    id: 'emotion_regulation_1',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را سرکوب کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_2',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را نادیده بگیرم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_3',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_4',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_5',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_6',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_7',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_8',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_9',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    id: 'emotion_regulation_10',
    text: "وقتی احساسات منفی دارم، سعی می‌کنم آنها را به چیز دیگری فکر کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم",
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  }
]

export const emotionRegulationOptions = [
  { label: "کاملاً مخالفم", value: 1 },
  { label: "نسبتاً مخالفم", value: 2 },
  { label: "نظری ندارم", value: 3 },
  { label: "نسبتاً موافقم", value: 4 },
  { label: "کاملاً موافقم", value: 5 }
]

export const getEmotionRegulationInterpretation = (score: number): string => {
  if (score <= 20) {
    return "سطح پایین تنظیم هیجانی"
  } else if (score <= 30) {
    return "سطح متوسط تنظیم هیجانی"
  } else {
    return "سطح بالا تنظیم هیجانی"
  }
}

export const getEmotionRegulationSubscales = (answers: number[]): Record<string, number> => {
  const subscales = {
    suppression: 0,    // سرکوب
    reappraisal: 0,    // بازنگری
    acceptance: 0      // پذیرش
  }

  // محاسبه امتیاز سرکوب (سوالات 0, 1, 2, 3, 4)
  subscales.suppression = (answers[0] + answers[1] + answers[2] + answers[3] + answers[4]) / 5

  // محاسبه امتیاز بازنگری (سوالات 5, 6, 7, 8, 9)
  subscales.reappraisal = (answers[5] + answers[6] + answers[7] + answers[8] + answers[9]) / 5

  // محاسبه امتیاز پذیرش (سوالات 0, 2, 4, 6, 8)
  subscales.acceptance = (answers[0] + answers[2] + answers[4] + answers[6] + answers[8]) / 5

  return subscales
} 