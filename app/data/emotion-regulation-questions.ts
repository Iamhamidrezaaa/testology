import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر مشکل دارید که احساسات خود را شناسایی کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را بیان کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را کنترل کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را درک کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را مدیریت کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را تنظیم کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را پردازش کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را تجربه کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را درک کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که احساسات خود را بیان کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const emotionRegulationQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'emotion-regulation',
  type: 'SINGLE_CHOICE',
  required: true
})

export const emotionRegulationOptions = [
  { label: "هیچ مشکل", value: 1 },
  { label: "مشکل خفیف", value: 2 },
  { label: "مشکل متوسط", value: 3 },
  { label: "مشکل شدید", value: 4 },
  { label: "مشکل بسیار شدید", value: 5 }
]

export const getEmotionRegulationInterpretation = (score: number): string => {
  if (score <= 20) {
    return "تنظیم هیجان پایین - شما تنظیم هیجان کمی دارید."
  } else if (score <= 30) {
    return "تنظیم هیجان متوسط - شما تنظیم هیجان متوسطی دارید."
  } else if (score <= 40) {
    return "تنظیم هیجان بالا - شما تنظیم هیجان بالایی دارید."
  } else {
    return "تنظیم هیجان بسیار بالا - شما تنظیم هیجان بسیار بالایی دارید."
  }
}

export const getEmotionRegulationSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 20) return 'پایین'
  if (score <= 30) return 'متوسط'
  if (score <= 40) return 'بالا'
  return 'بسیار بالا'
}

export default emotionRegulationQuestions


















