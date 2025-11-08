import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر احساس می‌کنید که دیگران شما را درک می‌کنند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌پذیرند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌فهمند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌پذیرند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌فهمند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌پذیرند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌فهمند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌پذیرند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌فهمند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
  {
    text: "چقدر احساس می‌کنید که دیگران شما را می‌پذیرند؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  }
]



// خروجی نهایی با فیلدهای اجباری تکمیل می‌شود
export const psssQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'psss',
  type: 'SINGLE_CHOICE',
  required: true
})

export const psssOptions = [
  { label: "هرگز", value: 1 },
  { label: "به ندرت", value: 2 },
  { label: "گاهی", value: 3 },
  { label: "اغلب", value: 4 },
  { label: "همیشه", value: 5 }
]

export const getPsssInterpretation = (score: number): string => {
  if (score <= 20) {
    return "حمایت اجتماعی پایین - شما حمایت اجتماعی کمی دارید."
  } else if (score <= 30) {
    return "حمایت اجتماعی متوسط - شما حمایت اجتماعی متوسطی دارید."
  } else if (score <= 40) {
    return "حمایت اجتماعی بالا - شما حمایت اجتماعی خوبی دارید."
  } else {
    return "حمایت اجتماعی بسیار بالا - شما حمایت اجتماعی بسیار بالایی دارید."
  }
}

export const getPsssSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 20) return 'پایین'
  if (score <= 30) return 'متوسط'
  if (score <= 40) return 'بالا'
  return 'بسیار بالا'
}

export default psssQuestions


















