import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر مشکل دارید که به خواب بروید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که خواب بمانید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل دارید که زود از خواب بیدار می‌شوید؟",
    options: [
      "هیچ مشکل",
      "مشکل خفیف",
      "مشکل متوسط",
      "مشکل شدید",
      "مشکل بسیار شدید"
    ]
  },
  {
    text: "چقدر از خواب خود راضی هستید؟",
    options: [
      "خیلی راضی",
      "راضی",
      "نظری ندارم",
      "ناراضی",
      "خیلی ناراضی"
    ]
  },
  {
    text: "چقدر مشکل خواب بر عملکرد روزانه شما تأثیر می‌گذارد؟",
    options: [
      "هیچ تأثیر",
      "تأثیر خفیف",
      "تأثیر متوسط",
      "تأثیر شدید",
      "تأثیر بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل خواب بر کیفیت زندگی شما تأثیر می‌گذارد؟",
    options: [
      "هیچ تأثیر",
      "تأثیر خفیف",
      "تأثیر متوسط",
      "تأثیر شدید",
      "تأثیر بسیار شدید"
    ]
  },
  {
    text: "چقدر مشکل خواب بر خلق و خوی شما تأثیر می‌گذارد؟",
    options: [
      "هیچ تأثیر",
      "تأثیر خفیف",
      "تأثیر متوسط",
      "تأثیر شدید",
      "تأثیر بسیار شدید"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const isiQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'isi',
  type: 'SINGLE_CHOICE',
  required: true
})

export const isiOptions = [
  { label: "هیچ مشکل", value: 0 },
  { label: "مشکل خفیف", value: 1 },
  { label: "مشکل متوسط", value: 2 },
  { label: "مشکل شدید", value: 3 },
  { label: "مشکل بسیار شدید", value: 4 }
]

export const getIsiInterpretation = (score: number): string => {
  if (score <= 7) {
    return "بی‌خوابی خفیف - شما بی‌خوابی خفیفی دارید."
  } else if (score <= 14) {
    return "بی‌خوابی متوسط - شما بی‌خوابی متوسطی دارید."
  } else if (score <= 21) {
    return "بی‌خوابی شدید - شما بی‌خوابی شدیدی دارید."
  } else {
    return "بی‌خوابی بسیار شدید - شما بی‌خوابی بسیار شدیدی دارید که نیاز به مراجعه به متخصص دارد."
  }
}

export const getIsiSeverity = (score: number): 'خفیف' | 'متوسط' | 'شدید' | 'بسیار شدید' => {
  if (score <= 7) return 'خفیف'
  if (score <= 14) return 'متوسط'
  if (score <= 21) return 'شدید'
  return 'بسیار شدید'
}

export default isiQuestions


















