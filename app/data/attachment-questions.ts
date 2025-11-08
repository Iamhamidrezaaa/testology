import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "وقتی با کسی صمیمی می‌شوم، نگران می‌شوم که به من آسیب برساند.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "نزدیک شدن به دیگران برایم سخت است.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "نگرانم که اگر به کسی نزدیک شوم، مرا رها کند.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "دیگران اغلب از من انتظار دارند که بیشتر از آنچه راحت هستم، به آنها نزدیک شوم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "در روابطم، اغلب نگرانم که طرف مقابل واقعاً مرا دوست نداشته باشد.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "وقتی کسی به من نزدیک می‌شود، احساس ناراحتی می‌کنم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "نگرانم که اگر به کسی اعتماد کنم، از اعتمادم سوءاستفاده کند.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "در روابطم، اغلب احساس می‌کنم که طرف مقابل می‌خواهد از من دور شود.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "ترجیح می‌دهم به کسی وابسته نباشم.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "وقتی کسی به من نزدیک می‌شود، احساس می‌کنم که می‌خواهد چیزی از من بگیرد.",
    options: [
      "کاملاً موافقم",
      "نسبتاً موافقم", 
      "نظری ندارم",
      "نسبتاً مخالفم",
      "کاملاً مخالفم"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const attachmentQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'attachment',
  type: 'SINGLE_CHOICE',
  required: true
})

export const attachmentOptions = [
  { label: "کاملاً مخالفم", value: 1 },
  { label: "نسبتاً مخالفم", value: 2 },
  { label: "نظری ندارم", value: 3 },
  { label: "نسبتاً موافقم", value: 4 },
  { label: "کاملاً موافقم", value: 5 }
]

export const getAttachmentInterpretation = (score: number): string => {
  if (score <= 20) {
    return "سبک دلبستگی ایمن - شما سبک دلبستگی ایمنی دارید."
  } else if (score <= 30) {
    return "سبک دلبستگی اضطرابی - شما سبک دلبستگی اضطرابی دارید."
  } else {
    return "سبک دلبستگی اجتنابی - شما سبک دلبستگی اجتنابی دارید."
  }
}

export const getAttachmentSubscales = (answers: number[]): Record<string, number> => {
  const subscales = {
    anxiety: 0,    // اضطراب
    avoidance: 0   // اجتناب
  }

  // محاسبه امتیاز اضطراب (سوالات 0, 2, 4, 6, 8)
  subscales.anxiety = (answers[0] + answers[2] + answers[4] + answers[6] + answers[8]) / 5

  // محاسبه امتیاز اجتناب (سوالات 1, 3, 5, 7, 9)
  subscales.avoidance = (answers[1] + answers[3] + answers[5] + answers[7] + answers[9]) / 5

  return subscales
}

export default attachmentQuestions


















