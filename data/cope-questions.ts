import { Question, Option } from '@/types/test'

export const copeQuestions: any[] = [
  {
    id: 'cope_1',
    text: "وقتی با مشکل بزرگی مواجه می‌شی، اولین واکنش‌ت چیه؟",
    options: [
      "سعی می‌کنم یه برنامه برای حلش بریزم",
      "احساساتی می‌شم و به یکی درد دل می‌کنم",
      "خودمو مشغول کار دیگه می‌کنم تا فراموش کنم",
      "می‌رم تو تنهایی و فکر می‌کنم"
    ]
  },
  {
    id: 'cope_2',
    text: "اگه اتفاق بدی بیفته که کنترلی روش نداری، چه می‌کنی؟",
    options: [
      { label: "دعا می‌کنم یا به قدرت بالاتری تکیه می‌کنم", value: "spiritual" },
      { label: "سعی می‌کنم سرگرم باشم و نادیده‌اش بگیرم", value: "avoidant" },
      { label: "با کسی که اعتماد دارم حرف می‌زنم", value: "social_support" },
      { label: "تحلیل می‌کنم ببینم چی شد که این‌طوری شد", value: "analytical" }
    ]
  },
  {
    id: 'cope_3',
    text: "چطور خودتو آرام می‌کنی وقتی اضطراب داری؟",
    options: [
      { label: "نفس عمیق می‌کشم یا مدیتیشن می‌کنم", value: "mindfulness" },
      { label: "کاری انجام می‌دم که خوشحالم کنه", value: "distraction" },
      { label: "با کسی که دوستش دارم وقت می‌گذرونم", value: "social_support" },
      { label: "تلاش می‌کنم دلیل اضطراب‌مو پیدا کنم", value: "analytical" }
    ]
  },
  {
    id: 'cope_4',
    text: "وقتی اشتباهی کردی، معمولاً چی کار می‌کنی؟",
    options: [
      { label: "سریع عذرخواهی می‌کنم", value: "accountable" },
      { label: "خودمو سرزنش می‌کنم", value: "self_critical" },
      { label: "دنبال راه جبران می‌گردم", value: "problem_focused" },
      { label: "نادیده می‌گیرم و رد می‌شم", value: "avoidant" }
    ]
  },
  {
    id: 'cope_5',
    text: "در موقعیت‌های دشوار معمولاً...",
    options: [
      { label: "از دیگران کمک می‌خوام", value: "social_support" },
      { label: "سعی می‌کنم مستقل حلش کنم", value: "independent" },
      { label: "فرار می‌کنم از موقعیت", value: "avoidant" },
      { label: "با طنز و شوخی باهاش کنار میام", value: "humor" }
    ]
  },
  {
    id: 'cope_6',
    text: "وقتی ناراحتی طول می‌کشه، چه روشی برای عبور داری؟",
    options: [
      { label: "ورزش یا تحرک فیزیکی", value: "physical" },
      { label: "نوشتن یا خلاقیت", value: "creative" },
      { label: "صحبت با یک مشاور یا دوست", value: "social_support" },
      { label: "خودم رو با کار مشغول می‌کنم", value: "distraction" }
    ]
  },
  {
    id: 'cope_7',
    text: "برای تصمیم‌گیری‌های سخت معمولاً...",
    options: [
      { label: "نظر دیگران رو می‌پرسم", value: "social_support" },
      { label: "تحقیق می‌کنم و تحلیل می‌کنم", value: "analytical" },
      { label: "به احساساتم گوش می‌دم", value: "emotional" },
      { label: "تصمیم رو عقب می‌اندازم", value: "avoidant" }
    ]
  },
  {
    id: 'cope_8',
    text: "در لحظات بحران، بیشتر چه حسی داری؟",
    options: [
      { label: "تمرکز بالا و عملیاتی", value: "problem_focused" },
      { label: "گیجی و خستگی", value: "overwhelmed" },
      { label: "نیاز به تنهایی", value: "withdrawal" },
      { label: "فوراً سراغ کمک می‌رم", value: "social_support" }
    ]
  },
  {
    id: 'cope_9',
    text: "واکنشت به شکست چیه؟",
    options: [
      { label: "درس می‌گیرم و ادامه می‌دم", value: "growth" },
      { label: "ناراحت می‌شم و مدتی کنار می‌کشم", value: "withdrawal" },
      { label: "از خودم ناامید می‌شم", value: "self_critical" },
      { label: "دنبال راهی برای جبران می‌گردم", value: "problem_focused" }
    ]
  },
  {
    id: 'cope_10',
    text: "وقتی از آینده می‌ترسی، چه کاری می‌کنی؟",
    options: [
      { label: "برنامه‌ریزی می‌کنم تا آمادگی داشته باشم", value: "planning" },
      { label: "سعی می‌کنم به لحظه حال برگردم", value: "mindfulness" },
      { label: "راجع‌به نگرانی‌هام صحبت می‌کنم", value: "social_support" },
      { label: "بی‌خیال می‌شم و می‌رم سراغ سرگرمی", value: "distraction" }
    ]
  },
  {
    id: 'cope_11',
    text: "موقع فشار روانی شدید چه کاری بیشتر انجام می‌دی؟",
    options: [
      { label: "زیاد می‌خوابم", value: "withdrawal" },
      { label: "می‌نویسم و تخلیه می‌کنم", value: "creative" },
      { label: "با بقیه وقت می‌گذرونم", value: "social_support" },
      { label: "بیشتر کار می‌کنم", value: "distraction" }
    ]
  },
  {
    id: 'cope_12',
    text: "برای تقویت روحیه‌ت در روزهای سخت، چه می‌کنی؟",
    options: [
      { label: "موسیقی گوش می‌دم", value: "distraction" },
      { label: "خاطرات خوبو مرور می‌کنم", value: "positive_reflection" },
      { label: "با عزیزانم صحبت می‌کنم", value: "social_support" },
      { label: "کار جدیدی رو امتحان می‌کنم", value: "growth" }
    ]
  }
];

export function getCopeInterpretation(answers: Record<string, string>): string {
  const styleCounts: Record<string, number> = {};
  
  // شمارش سبک‌های مقابله‌ای
  Object.values(answers).forEach(style => {
    styleCounts[style] = (styleCounts[style] || 0) + 1;
  });

  // یافتن سبک‌های غالب
  const dominantStyles = Object.entries(styleCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([style]) => style);

  return `سبک‌های غالب مقابله‌ای شما: ${dominantStyles.join('، ')}`;
}

export const getCopeStyle = (answers: Record<string, string>): Record<string, number> => {
  const counts = {
    active: 0,
    social: 0,
    avoidant: 0,
    spiritual: 0,
    planning: 0,
    suppression: 0,
    venting: 0,
    expression: 0,
    optimism: 0,
    'self-blame': 0,
    support: 0,
    distraction: 0,
    'high-blame': 0,
    'moderate-blame': 0,
    'external-blame': 0,
    'no-blame': 0,
    physical: 0,
    escape: 0,
    'problem-solving': 0,
    mindfulness: 0,
    learning: 0,
    hopeless: 0,
    busy: 0,
    dependency: 0,
    'quick-action': 0,
    patience: 0,
    'help-seeking': 0,
    waiting: 0,
    solution: 0,
    past: 0,
    others: 0,
    future: 0,
    health: 0,
    fun: 0,
    reflection: 0,
    self: 0,
    family: 0,
    friends: 0,
    none: 0,
    kind: 0,
    critical: 0,
    indifferent: 0,
    analytical: 0,
    persistent: 0,
    'giving-up': 0,
    apologetic: 0,
    'social-support': 0,
    distance: 0,
    'problem-focus': 0,
    denial: 0
  }

  Object.values(answers).forEach(answer => {
    counts[answer as keyof typeof counts]++
  })

  return counts
}

export const getCopeStyleInterpretation = (counts: Record<string, number>): string => {
  const styles = {
    'مقابله فعال': counts.active + counts.planning + counts['problem-solving'] + counts.learning + counts['quick-action'] + counts.solution + counts.health + counts.persistent + counts['problem-focus'],
    'مقابله اجتماعی': counts.social + counts.support + counts['help-seeking'] + counts.others + counts.family + counts.friends + counts['social-support'],
    'مقابله اجتنابی': counts.avoidant + counts.suppression + counts.escape + counts.busy + counts.waiting + counts.fun + counts.distance + counts.denial,
    'مقابله معنوی': counts.spiritual + counts.optimism + counts.mindfulness + counts.future + counts.reflection,
    'مقابله هیجانی': counts.venting + counts.expression + counts['self-blame'] + counts.hopeless + counts.past + counts.critical + counts['giving-up']
  }

  const maxStyle = Object.entries(styles).reduce((a, b) => a[1] > b[1] ? a : b)[0]
  return maxStyle
}

export const copeOptions = [
  { label: "اصلاً", value: 1 },
  { label: "کمی", value: 2 },
  { label: "زیاد", value: 3 },
  { label: "خیلی زیاد", value: 4 }
]

// تعریف سبک‌های مقابله‌ای و سوالات مربوط به هر سبک
export const copingStyles = {
  acceptance: [22], // پذیرش
  activeCoping: [3, 11], // مقابله فعال
  behavioralDisengagement: [23], // کناره‌گیری رفتاری
  denial: [16], // انکار
  emotionalSupport: [5, 10], // حمایت عاطفی
  humor: [8, 17], // شوخ‌طبعی
  instrumentalSupport: [18], // حمایت ابزاری
  positiveReframing: [6, 27], // بازنگری مثبت
  religion: [2], // مذهب
  selfBlame: [14], // سرزنش خود
  selfDistraction: [9, 15], // حواس‌پرتی
  substanceUse: [20], // مصرف مواد
  venting: [4, 19], // تخلیه هیجانی
  planning: [3] // برنامه‌ریزی
}

// تابع محاسبه امتیاز هر سبک مقابله‌ای
export const calculateCopingStyleScore = (answers: number[], style: keyof typeof copingStyles): number => {
  const questions = copingStyles[style]
  return questions.reduce((sum, questionIndex) => sum + (answers[questionIndex - 1] || 0), 0)
}

// تابع تعیین نوع سبک مقابله‌ای
export const getCopingStyleType = (score: number): 'سازگار' | 'ناسازگار' | 'متوسط' => {
  if (score <= 2) return 'ناسازگار'
  if (score <= 3) return 'متوسط'
  return 'سازگار'
} 