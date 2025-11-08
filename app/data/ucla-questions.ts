import { Question } from '@/types/test'
import { normalizeQuestions } from '@/lib/helpers/question-helper'

// فقط فیلدهای خام هر سؤال
type RawQuestion = Pick<Question, 'text' | 'options'>


const rawQuestions: RawQuestion[] = [
  {
    text: "چقدر احساس می‌کنید که با دیگران در ارتباط هستید؟",
    options: [
      "هرگز",
      "به ندرت",
      "گاهی",
      "اغلب",
      "همیشه"
    ]
  },
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
    text: "چقدر احساس می‌کنید که دیگران شما را دوست دارند؟",
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
export const uclaQuestions: Question[] = normalizeQuestions(rawQuestions, {
  testId: 'ucla',
  type: 'SINGLE_CHOICE',
  required: true
})

export const uclaOptions = [
  { label: "هرگز", value: 1 },
  { label: "به ندرت", value: 2 },
  { label: "گاهی", value: 3 },
  { label: "اغلب", value: 4 },
  { label: "همیشه", value: 5 }
]

export const getUclaInterpretation = (score: number): string => {
  if (score <= 20) {
    return "احساس تنهایی پایین - شما احساس تنهایی کمی دارید."
  } else if (score <= 30) {
    return "احساس تنهایی متوسط - شما احساس تنهایی متوسطی دارید."
  } else if (score <= 40) {
    return "احساس تنهایی بالا - شما احساس تنهایی بالایی دارید."
  } else {
    return "احساس تنهایی بسیار بالا - شما احساس تنهایی بسیار بالایی دارید که نیاز به مراجعه به متخصص دارد."
  }
}

export const getUclaSeverity = (score: number): 'پایین' | 'متوسط' | 'بالا' | 'بسیار بالا' => {
  if (score <= 20) return 'پایین'
  if (score <= 30) return 'متوسط'
  if (score <= 40) return 'بالا'
  return 'بسیار بالا'
}

export default uclaQuestions


















