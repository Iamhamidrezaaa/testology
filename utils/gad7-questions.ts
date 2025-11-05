export const gad7Questions = [
  "احساس عصبی بودن، اضطراب یا لبه پرتگاه بودن",
  "عدم توانایی در متوقف کردن نگرانی یا کنترل آن",
  "نگرانی بیش از حد در مورد مسائل مختلف",
  "داشتن مشکل در استراحت کردن",
  "احساس بی‌قراری به حدی که نتوانید ساکت بنشینید",
  "به راحتی تحریک‌پذیر شدن یا زود عصبانی شدن",
  "احساس ترس مثل اینکه اتفاق بدی در راه است"
]

export const gad7Options = [
  { label: "اصلاً", value: 0 },
  { label: "چند روز", value: 1 },
  { label: "بیشتر روزها", value: 2 },
  { label: "تقریباً هر روز", value: 3 }
]

export const gad7Levels = [
  { min: 0, max: 4, level: "خفیف", description: "سطح اضطراب شما خفیف است. این سطح از اضطراب طبیعی است و نیازی به نگرانی ندارد." },
  { min: 5, max: 9, level: "متوسط", description: "سطح اضطراب شما متوسط است. پیشنهاد می‌شود با یک متخصص مشورت کنید." },
  { min: 10, max: 21, level: "شدید", description: "سطح اضطراب شما شدید است. حتماً با یک متخصص مشورت کنید." }
]

export function calculateGad7Score(answers: number[]): number {
  return answers.reduce((sum, answer) => sum + answer, 0)
}

export function getGad7Level(score: number) {
  return gad7Levels.find(level => score >= level.min && score <= level.max)
} 
