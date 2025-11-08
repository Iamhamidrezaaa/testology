import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
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
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
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
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
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
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
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
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
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
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const baiQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'bai',
  type: 'SINGLE_CHOICE',
  required: true
})

export const baiOptions = [
  { label: "اصلاً", value: 0 },
  { label: "کمی", value: 1 },
  { label: "متوسط", value: 2 },
  { label: "زیاد", value: 3 },
  { label: "خیلی زیاد", value: 4 }
]

export const getBaiInterpretation = (score: number): string => {
  if (score <= 10) {
    return "اضطراب پایین - شما اضطراب کمی دارید."
  } else if (score <= 20) {
    return "اضطراب متوسط - شما اضطراب متوسطی دارید."
  } else if (score <= 30) {
    return "اضطراب بالا - شما اضطراب بالایی دارید."
  } else {
    return "اضطراب بسیار بالا - شما اضطراب بسیار بالایی دارید که نیاز به مراجعه به متخصص دارد."
  }
}

export const getBaiSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 10) return 'پایین'
  if (score <= 20) return 'متوسط'
  if (score <= 30) return 'بالا'
  return 'بسیار بالا'
}

export default baiQuestions


















