import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر مشکل دارید که روی کارهای مهم تمرکز کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که حواس‌پرتی را کنترل کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که توجه خود را حفظ کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که تمرکز خود را حفظ کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که توجه خود را تقسیم کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که توجه خود را تغییر دهید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که توجه خود را حفظ کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که تمرکز خود را حفظ کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که توجه خود را تقسیم کنید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که توجه خود را تغییر دهید؟",
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
export const focusQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'focus',
  type: 'SINGLE_CHOICE',
  required: true
})

export const focusOptions = [
  { label: "هیچ مشکل", value: 1 },
  { label: "مشکل خفیف", value: 2 },
  { label: "مشکل متوسط", value: 3 },
  { label: "مشکل شدید", value: 4 },
  { label: "مشکل بسیار شدید", value: 5 }
]

export const getFocusInterpretation = (score: number): string => {
  if (score <= 20) {
    return "تمرکز پایین - شما تمرکز کمی دارید."
  } else if (score <= 30) {
    return "تمرکز متوسط - شما تمرکز متوسطی دارید."
  } else if (score <= 40) {
    return "تمرکز بالا - شما تمرکز خوبی دارید."
  } else {
    return "تمرکز بسیار بالا - شما تمرکز بسیار بالایی دارید."
  }
}

export const getFocusSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 20) return 'پایین'
  if (score <= 30) return 'متوسط'
  if (score <= 40) return 'بالا'
  return 'بسیار بالا'
}

export default focusQuestions


















