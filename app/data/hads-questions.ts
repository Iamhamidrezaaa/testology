import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین یا افسرده هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین یا افسرده هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین یا افسرده هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین یا افسرده هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که نگران یا مضطرب هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که غمگین یا افسرده هستید؟",
    options: [
      "اصلاً",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const hadsQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'hads',
  type: 'SINGLE_CHOICE',
  required: true
})

export const hadsOptions = [
  { label: "اصلاً", value: 0 },
  { label: "گاهی", value: 1 },
  { label: "اغلب", value: 2 },
  { label: "همیشه", value: 3 }
]

export const getHadsInterpretation = (score: number): string => {
  if (score <= 7) {
    return "اضطراب و افسردگی پایین - شما اضطراب و افسردگی کمی دارید."
  } else if (score <= 14) {
    return "اضطراب و افسردگی متوسط - شما اضطراب و افسردگی متوسطی دارید."
  } else if (score <= 21) {
    return "اضطراب و افسردگی بالا - شما اضطراب و افسردگی بالایی دارید."
  } else {
    return "اضطراب و افسردگی بسیار بالا - شما اضطراب و افسردگی بسیار بالایی دارید که نیاز به مراجعه به متخصص دارد."
  }
}

export const getHadsSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 7) return 'پایین'
  if (score <= 14) return 'متوسط'
  if (score <= 21) return 'بالا'
  return 'بسیار بالا'
}

export default hadsQuestions


















