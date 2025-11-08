import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "در بیشتر موارد، زندگی من به ایده‌آل‌هایم نزدیک است.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "نظری ندارم",
      "موافقم",
      "کاملاً موافقم"
    ]
  },
  {
    text: "شرایط زندگی من عالی است.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "نظری ندارم",
      "موافقم",
      "کاملاً موافقم"
    ]
  },
  {
    text: "از زندگی خود راضی هستم.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "نظری ندارم",
      "موافقم",
      "کاملاً موافقم"
    ]
  },
  {
    text: "تا کنون چیزهای مهمی که در زندگی می‌خواستم را به دست آورده‌ام.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "نظری ندارم",
      "موافقم",
      "کاملاً موافقم"
    ]
  },
  {
    text: "اگر می‌توانستم زندگی خود را دوباره شروع کنم، تقریباً هیچ چیز را تغییر نمی‌دادم.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "نظری ندارم",
      "موافقم",
      "کاملاً موافقم"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const swlsQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'swls',
  type: 'SINGLE_CHOICE',
  required: true
})

export const swlsOptions = [
  { label: "کاملاً مخالفم", value: 1 },
  { label: "مخالفم", value: 2 },
  { label: "نظری ندارم", value: 3 },
  { label: "موافقم", value: 4 },
  { label: "کاملاً موافقم", value: 5 }
]

export const getSwlsInterpretation = (score: number): string => {
  if (score <= 5) {
    return "رضایت از زندگی بسیار پایین - شما از زندگی خود بسیار ناراضی هستید و نیاز به تغییرات اساسی دارید."
  } else if (score <= 10) {
    return "رضایت از زندگی پایین - شما از زندگی خود ناراضی هستید و نیاز به بهبود شرایط دارید."
  } else if (score <= 15) {
    return "رضایت از زندگی متوسط - شما از زندگی خود رضایت متوسطی دارید."
  } else if (score <= 20) {
    return "رضایت از زندگی بالا - شما از زندگی خود راضی هستید."
  } else {
    return "رضایت از زندگی بسیار بالا - شما از زندگی خود بسیار راضی هستید."
  }
}

export const getSwlsSeverity = (score: number): 'بسیار پایین' | 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 5) return 'بسیار پایین'
  if (score <= 10) return 'پایین'
  if (score <= 15) return 'متوسط'
  if (score <= 20) return 'بالا'
  return 'بسیار بالا'
}

export default swlsQuestions


















