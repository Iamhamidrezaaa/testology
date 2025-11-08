import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "به طور کلی، از خودم راضی هستم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "گاهی احساس می‌کنم که اصلاً خوب نیستم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "فکر می‌کنم که چندین ویژگی خوب دارم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "می‌توانم کارها را به خوبی انجام دهم، مثل بیشتر مردم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "احساس می‌کنم که چیزهای زیادی برای افتخار کردن ندارم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "گاهی احساس می‌کنم که بی‌فایده هستم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "فکر می‌کنم که یک فرد ارزشمند هستم، حداقل به اندازه دیگران.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "آرزو می‌کنم که بتوانم خودم را بیشتر احترام کنم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "به طور کلی، تمایل دارم فکر کنم که شکست خورده‌ام.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  },
  {
    text: "نگرش مثبتی نسبت به خودم دارم.",
    options: [
      "کاملاً موافقم",
      "موافقم",
      "مخالفم",
      "کاملاً مخالفم"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const rseiQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'rsei',
  type: 'SINGLE_CHOICE',
  required: true
})

export const rseiOptions = [
  { label: "کاملاً موافقم", value: 4 },
  { label: "موافقم", value: 3 },
  { label: "مخالفم", value: 2 },
  { label: "کاملاً مخالفم", value: 1 }
]

export const getRseiInterpretation = (score: number): string => {
  if (score <= 15) {
    return "عزت نفس بزرگسالان پایین - شما عزت نفس بزرگسالان پایینی دارید."
  } else if (score <= 25) {
    return "عزت نفس بزرگسالان متوسط - شما عزت نفس بزرگسالان متوسطی دارید."
  } else if (score <= 35) {
    return "عزت نفس بزرگسالان بالا - شما عزت نفس بزرگسالان خوبی دارید."
  } else {
    return "عزت نفس بزرگسالان بسیار بالا - شما عزت نفس بزرگسالان بسیار بالایی دارید."
  }
}

export const getRseiSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 15) return 'پایین'
  if (score <= 25) return 'متوسط'
  if (score <= 35) return 'بالا'
  return 'بسیار بالا'
}

export default rseiQuestions


















