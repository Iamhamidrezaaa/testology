import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر احساس می‌کنید که در لحظه حال هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که ذهن‌آگاه هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که تمرکز دارید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که آرام هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که متعادل هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که در لحظه حال هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که ذهن‌آگاه هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که تمرکز دارید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که آرام هستید؟",
    options: [
      "اصلاً",
      "کمی",
      "متوسط",
      "زیاد",
      "خیلی زیاد"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که متعادل هستید؟",
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
export const maasQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'maas',
  type: 'SINGLE_CHOICE',
  required: true
})

export const maasOptions = [
  { label: "اصلاً", value: 1 },
  { label: "کمی", value: 2 },
  { label: "متوسط", value: 3 },
  { label: "زیاد", value: 4 },
  { label: "خیلی زیاد", value: 5 }
]

export const getMaasInterpretation = (score: number): string => {
  if (score <= 20) {
    return "ذهن‌آگاهی پایین - شما ذهن‌آگاهی کمی دارید."
  } else if (score <= 30) {
    return "ذهن‌آگاهی متوسط - شما ذهن‌آگاهی متوسطی دارید."
  } else if (score <= 40) {
    return "ذهن‌آگاهی بالا - شما ذهن‌آگاهی خوبی دارید."
  } else {
    return "ذهن‌آگاهی بسیار بالا - شما ذهن‌آگاهی بسیار بالایی دارید."
  }
}

export const getMaasSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 20) return 'پایین'
  if (score <= 30) return 'متوسط'
  if (score <= 40) return 'بالا'
  return 'بسیار بالا'
}

export default maasQuestions


















