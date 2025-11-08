import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر احساس می‌کنید که خوشحال هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که عصبانی هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که ترسیده هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که مضطرب هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که خوشحال هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که عصبانی هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که ترسیده هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که مضطرب هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const panasQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'panas',
  type: 'SINGLE_CHOICE',
  required: true
})

export const panasOptions = [
  { label: "اصلاً", value: 1 },
  { label: "کمی", value: 2 },
  { label: "متوسط", value: 3 },
  { label: "زیاد", value: 4 },
  { label: "خیلی زیاد", value: 5 }
]

export const getPanasInterpretation = (score: number): string => {
  if (score <= 20) {
    return "عواطف پایین - شما عواطف کمی دارید."
  } else if (score <= 30) {
    return "عواطف متوسط - شما عواطف متوسطی دارید."
  } else if (score <= 40) {
    return "عواطف بالا - شما عواطف بالایی دارید."
  } else {
    return "عواطف بسیار بالا - شما عواطف بسیار بالایی دارید."
  }
}

export const getPanasSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 20) return 'پایین'
  if (score <= 30) return 'متوسط'
  if (score <= 40) return 'بالا'
  return 'بسیار بالا'
}

export default panasQuestions


















