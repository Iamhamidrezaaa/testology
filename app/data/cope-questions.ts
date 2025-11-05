import { Question } from '../../types/test'

export const copeQuestions: Question[] = [
  {
    id: 1,
    text: "وقتی با مشکل بزرگی مواجه می‌شی، اولین واکنش‌ت چیه؟",
    options: [
      "سعی می‌کنم یه برنامه برای حلش بریزم",
      "احساساتی می‌شم و به یکی درد دل می‌کنم",
      "خودمو مشغول کار دیگه می‌کنم تا فراموش کنم",
      "می‌رم تو تنهایی و فکر می‌کنم"
    ]
  },
  {
    id: 2,
    text: "اگه اتفاق بدی بیفته که کنترلی روش نداری، چه می‌کنی؟",
    options: [
      "دعا می‌کنم یا به قدرت بالاتری تکیه می‌کنم",
      "سعی می‌کنم سرگرم باشم و نادیده‌اش بگیرم",
      "با کسی که اعتماد دارم حرف می‌زنم",
      "تحلیل می‌کنم ببینم چی شد که این‌طوری شد"
    ]
  },
  {
    id: 3,
    text: "چطور خودتو آرام می‌کنی وقتی اضطراب داری؟",
    options: [
      "نفس عمیق می‌کشم یا مدیتیشن می‌کنم",
      "کاری انجام می‌دم که خوشحالم کنه",
      "با کسی که دوستش دارم وقت می‌گذرونم",
      "تلاش می‌کنم دلیل اضطراب‌مو پیدا کنم"
    ]
  },
  {
    id: 4,
    text: "وقتی اشتباهی کردی، معمولاً چی کار می‌کنی؟",
    options: [
      "سریع عذرخواهی می‌کنم",
      "خودمو سرزنش می‌کنم",
      "دنبال راه جبران می‌گردم",
      "نادیده می‌گیرم و رد می‌شم"
    ]
  },
  {
    id: 5,
    text: "در موقعیت‌های دشوار معمولاً...",
    options: [
      "از دیگران کمک می‌خوام",
      "سعی می‌کنم مستقل حلش کنم",
      "فرار می‌کنم از موقعیت",
      "با طنز و شوخی باهاش کنار میام"
    ]
  },
  {
    id: 6,
    text: "وقتی ناراحتی طول می‌کشه، چه روشی برای عبور داری؟",
    options: [
      "ورزش یا تحرک فیزیکی",
      "نوشتن یا خلاقیت",
      "صحبت با یک مشاور یا دوست",
      "خودم رو با کار مشغول می‌کنم"
    ]
  },
  {
    id: 7,
    text: "برای تصمیم‌گیری‌های سخت معمولاً...",
    options: [
      "نظر دیگران رو می‌پرسم",
      "تحقیق می‌کنم و تحلیل می‌کنم",
      "به احساساتم گوش می‌دم",
      "تصمیم رو عقب می‌اندازم"
    ]
  },
  {
    id: 8,
    text: "در لحظات بحران، بیشتر چه حسی داری؟",
    options: [
      "تمرکز بالا و عملیاتی",
      "گیجی و خستگی",
      "نیاز به تنهایی",
      "فوراً سراغ کمک می‌رم"
    ]
  },
  {
    id: 9,
    text: "واکنشت به شکست چیه؟",
    options: [
      "درس می‌گیرم و ادامه می‌دم",
      "ناراحت می‌شم و مدتی کنار می‌کشم",
      "از خودم ناامید می‌شم",
      "دنبال راهی برای جبران می‌گردم"
    ]
  },
  {
    id: 10,
    text: "وقتی از آینده می‌ترسی، چه کاری می‌کنی؟",
    options: [
      "برنامه‌ریزی می‌کنم تا آمادگی داشته باشم",
      "سعی می‌کنم به لحظه حال برگردم",
      "راجع‌به نگرانی‌هام صحبت می‌کنم",
      "بی‌خیال می‌شم و می‌رم سراغ سرگرمی"
    ]
  },
  {
    id: 11,
    text: "موقع فشار روانی شدید چه کاری بیشتر انجام می‌دی؟",
    options: [
      "زیاد می‌خوابم",
      "می‌نویسم و تخلیه می‌کنم",
      "با بقیه وقت می‌گذرونم",
      "بیشتر کار می‌کنم"
    ]
  },
  {
    id: 12,
    text: "برای تقویت روحیه‌ت در روزهای سخت، چه می‌کنی؟",
    options: [
      "موسیقی گوش می‌دم",
      "خاطرات خوبو مرور می‌کنم",
      "با عزیزانم صحبت می‌کنم",
      "کار جدیدی رو امتحان می‌کنم"
    ]
  }
]

export const copeOptions = [
  { label: "اصلاً", value: 1 },
  { label: "کمی", value: 2 },
  { label: "زیاد", value: 3 },
  { label: "خیلی زیاد", value: 4 }
]

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

export default copeQuestions


















