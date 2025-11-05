import { Question, Option } from '@/types/test'

interface DERSQuestion extends Question {
  isReversed: boolean;
  subscale: 'clarity' | 'acceptance' | 'strategies' | 'impulse' | 'awareness';
}

interface DERSScores {
  totalScore: number;
  clarityScore: number;
  acceptanceScore: number;
  strategiesScore: number;
  impulseScore: number;
  awarenessScore: number;
}

interface DERSInterpretation {
  level: 'خوب' | 'متوسط' | 'نیازمند بهبود';
  description: string;
  recommendations: string[];
}

export const dersQuestions: any[] = [
  {
    id: 'ders_1',
    text: "وقتی احساساتم شدید می‌شن، برام سخته تمرکز کنم.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "تا حدی موافقم",
      "موافقم",
      "کاملاً موافقم"
    ],
    isReversed: false,
    subscale: 'clarity'
  },
  {
    id: 'ders_2',
    text: "وقتی ناراحتم، نمی‌دونم دقیقاً چه احساسی دارم.",
    options: [
      { label: "اصلاً این‌طور نیست", value: "1" },
      { label: "کمی این‌طور است", value: "2" },
      { label: "نسبتاً این‌طور است", value: "3" },
      { label: "خیلی این‌طور است", value: "4" },
      { label: "کاملاً این‌طور است", value: "5" }
    ],
    isReversed: false,
    subscale: 'clarity'
  },
  {
    id: 'ders_3',
    text: "در مواجهه با احساسات منفی، توانایی کنترل رفتارم رو از دست می‌دم.",
    options: [
      { label: "هیچ‌وقت", value: "1" },
      { label: "گاهی", value: "2" },
      { label: "نصف مواقع", value: "3" },
      { label: "اغلب", value: "4" },
      { label: "همیشه", value: "5" }
    ],
    isReversed: false,
    subscale: 'impulse'
  },
  {
    id: 'ders_4',
    text: "وقتی ناراحتم، نمی‌تونم هدف‌هام رو دنبال کنم.",
    options: [
      { label: "کاملاً نادرسته", value: "1" },
      { label: "نادرسته", value: "2" },
      { label: "نظری ندارم", value: "3" },
      { label: "درسته", value: "4" },
      { label: "کاملاً درسته", value: "5" }
    ],
    isReversed: false,
    subscale: 'strategies'
  },
  {
    id: 'ders_5',
    text: "نمی‌دونم چطور احساساتم رو مدیریت کنم.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "تا حدی موافقم",
      "موافقم",
      "کاملاً موافقم"
    ],
    isReversed: false,
    subscale: 'strategies'
  },
  {
    id: 'ders_6',
    text: "احساس می‌کنم تحت سلطه هیجاناتم هستم.",
    options: [
      { label: "اصلاً این حس رو ندارم", value: "1" },
      { label: "خیلی کم", value: "2" },
      { label: "متوسط", value: "3" },
      { label: "زیاد", value: "4" },
      { label: "خیلی زیاد", value: "5" }
    ],
    isReversed: false,
    subscale: 'acceptance'
  },
  {
    id: 'ders_7',
    text: "در شرایط پراسترس، نمی‌تونم درست تصمیم بگیرم.",
    options: [
      { label: "کاملاً مخالفم", value: "1" },
      { label: "مخالفم", value: "2" },
      { label: "نظری ندارم", value: "3" },
      { label: "موافقم", value: "4" },
      { label: "کاملاً موافقم", value: "5" }
    ],
    isReversed: false,
    subscale: 'impulse'
  },
  {
    id: 'ders_8',
    text: "وقتی ناراحتم، خودم رو نمی‌فهمم.",
    options: [
      { label: "اصلاً", value: "1" },
      { label: "کمی", value: "2" },
      { label: "نسبتاً", value: "3" },
      { label: "خیلی", value: "4" },
      { label: "کاملاً", value: "5" }
    ],
    isReversed: false,
    subscale: 'clarity'
  },
  {
    id: 'ders_9',
    text: "از مواجهه با احساسات دردناک فرار می‌کنم.",
    options: [
      { label: "هیچ‌وقت", value: "1" },
      { label: "گاهی", value: "2" },
      { label: "گاهی اوقات", value: "3" },
      { label: "اکثر اوقات", value: "4" },
      { label: "همیشه", value: "5" }
    ],
    isReversed: false,
    subscale: 'acceptance'
  },
  {
    id: 'ders_10',
    text: "وقتی احساساتم شدید می‌شن، نمی‌تونم درست رفتار کنم.",
    options: [
      "کاملاً مخالفم",
      "مخالفم",
      "تا حدی موافقم",
      "موافقم",
      "کاملاً موافقم"
    ],
    isReversed: false,
    subscale: 'impulse'
  },
  {
    id: 'ders_11',
    text: "به سختی می‌تونم افکارم رو در شرایط احساسی منفی منظم نگه دارم.",
    options: [
      { label: "هیچ‌وقت", value: "1" },
      { label: "به‌ندرت", value: "2" },
      { label: "گاهی", value: "3" },
      { label: "اغلب", value: "4" },
      { label: "همیشه", value: "5" }
    ],
    isReversed: false,
    subscale: 'strategies'
  },
  {
    id: 'ders_12',
    text: "کنترل احساسات منفی برام دشواره.",
    options: [
      { label: "خیلی راحت", value: "1" },
      { label: "نسبتاً راحت", value: "2" },
      { label: "متوسط", value: "3" },
      { label: "نسبتاً سخت", value: "4" },
      { label: "خیلی سخت", value: "5" }
    ],
    isReversed: false,
    subscale: 'acceptance'
  },
  {
    id: 'ders_13',
    text: "وقتی ناراحتم، خودم رو قضاوت می‌کنم.",
    options: [
      { label: "کاملاً نادرسته", value: "1" },
      { label: "نادرسته", value: "2" },
      { label: "نظری ندارم", value: "3" },
      { label: "درسته", value: "4" },
      { label: "کاملاً درسته", value: "5" }
    ],
    isReversed: false,
    subscale: 'acceptance'
  },
  {
    id: 'ders_14',
    text: "نمی‌دونم چطور احساساتمو بدون آسیب به دیگران ابراز کنم.",
    options: [
      { label: "کاملاً مخالفم", value: "1" },
      { label: "مخالفم", value: "2" },
      { label: "نسبتاً موافقم", value: "3" },
      { label: "موافقم", value: "4" },
      { label: "کاملاً موافقم", value: "5" }
    ],
    isReversed: false,
    subscale: 'strategies'
  },
  {
    id: 'ders_15',
    text: "وقتی هیجان‌زده‌ام، کنترل کارهام از دستم در می‌ره.",
    options: [
      { label: "هیچ‌وقت", value: "1" },
      { label: "به‌ندرت", value: "2" },
      { label: "گاهی", value: "3" },
      { label: "اغلب", value: "4" },
      { label: "همیشه", value: "5" }
    ],
    isReversed: false,
    subscale: 'impulse'
  }
];

export const dersOptions = [
  { label: "کاملاً مخالفم", value: 1 },
  { label: "مخالفم", value: 2 },
  { label: "نه موافقم نه مخالف", value: 3 },
  { label: "موافقم", value: 4 },
  { label: "کاملاً موافقم", value: 5 }
]

export function calculateDERSScores(answers: number[]): DERSScores {
  const scores: DERSScores = {
    totalScore: 0,
    clarityScore: 0,
    acceptanceScore: 0,
    strategiesScore: 0,
    impulseScore: 0,
    awarenessScore: 0
  }

  dersQuestions.forEach((question, index) => {
    let score = answers[index]
    if (question.isReversed) {
      score = 6 - score // معکوس کردن امتیاز برای سوالات معکوس
    }

    scores.totalScore += score

    switch (question.subscale) {
      case 'clarity':
        scores.clarityScore += score
        break
      case 'acceptance':
        scores.acceptanceScore += score
        break
      case 'strategies':
        scores.strategiesScore += score
        break
      case 'impulse':
        scores.impulseScore += score
        break
      case 'awareness':
        scores.awarenessScore += score
        break
    }
  })

  return scores
}

export function getDERSInterpretation(scores: DERSScores): DERSInterpretation {
  const getLevel = (score: number, maxScore: number): 'خوب' | 'متوسط' | 'نیازمند بهبود' => {
    const percentage = (score / maxScore) * 100
    if (percentage <= 40) return 'خوب'
    if (percentage <= 70) return 'متوسط'
    return 'نیازمند بهبود'
  }

  const totalLevel = getLevel(scores.totalScore, 90) // حداکثر امتیاز کل: 18 * 5 = 90
  const clarityLevel = getLevel(scores.clarityScore, 25)
  const acceptanceLevel = getLevel(scores.acceptanceScore, 35)
  const strategiesLevel = getLevel(scores.strategiesScore, 25)
  const impulseLevel = getLevel(scores.impulseScore, 15)
  const awarenessLevel = getLevel(scores.awarenessScore, 5)

  const description = `
    توانایی شما در تنظیم هیجانات ${totalLevel} است.
    در زمینه وضوح هیجانی: ${clarityLevel}
    در زمینه پذیرش احساسات: ${acceptanceLevel}
    در زمینه راهبردهای مقابله‌ای: ${strategiesLevel}
    در زمینه کنترل تکانه: ${impulseLevel}
    در زمینه آگاهی هیجانی: ${awarenessLevel}
  `

  const recommendations = [
    "تمرین ذهن‌آگاهی برای افزایش آگاهی از احساسات",
    "یادگیری تکنیک‌های تنفس عمیق برای مدیریت هیجانات",
    "تمرین شناسایی و نام‌گذاری احساسات",
    "یادگیری راهبردهای مقابله‌ای سالم",
    "تمرین پذیرش احساسات بدون قضاوت"
  ]

  return {
    level: totalLevel,
    description,
    recommendations
  }
}

export const getDersInterpretation = (score: number): string => {
  if (score <= 30) {
    return "سطح مشکلات تنظیم هیجانی پایین"
  } else if (score <= 45) {
    return "سطح مشکلات تنظیم هیجانی متوسط"
  } else {
    return "سطح مشکلات تنظیم هیجانی بالا"
  }
}; 