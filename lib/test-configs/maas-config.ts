/**
 * Config استاندارد برای تست MAAS (Mindful Attention Awareness Scale)
 * منبع: Brown & Ryan (2003)
 * 
 * این تست یکی از استانداردترین تست‌ها برای ذهن‌آگاهی (Mindfulness) است
 * و ستون اصلی خیلی از پژوهش‌های استرس، تمرکز، اضطراب، تنظیم هیجان و افسردگی است.
 * 
 * تعداد سوالات: 15
 * یک زیرمقیاس واحد: Mindfulness
 * مقیاس پاسخ: 6 گزینه‌ای (1-6) - از 1 شروع می‌شود نه 0!
 * همه 15 سوال Reverse هستند! (این نکته خیلی مهمه!)
 * 
 * تمام سؤالات تجربهٔ «عدم حضور ذهن» را می‌سنجند.
 * پس نمره بالاتر = توجه کمتر
 * و باید ریورس شوند تا «ذهن‌آگاهی» به دست بیاید.
 * 
 * نمره نهایی: mean(15 reverse_scored_items) → range: 1-6
 * نمره بالاتر = ذهن‌آگاهی بیشتر
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست همه سوالات (15 سوال)
 */
export const MAAS_QUESTIONS = Array.from({ length: 15 }, (_, i) => i + 1);

/**
 * لیست سوالات Reverse-Scored
 * MAAS همه 15 سوال Reverse هستند!
 */
export const MAAS_REVERSE_ITEMS = MAAS_QUESTIONS; // همه سوالات

/**
 * Mapping سوالات به reverse status
 */
export interface MAASQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 15 سوال
 */
export function createMAASQuestionMapping(): MAASQuestionMapping[] {
  return MAAS_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: true, // همه سوالات MAAS reverse هستند
  }));
}

/**
 * Config استاندارد MAAS
 */
export const MAAS_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای نمره نهایی
  reverseItems: MAAS_REVERSE_ITEMS, // همه 15 سوال
  subscales: [
    {
      name: 'Mindfulness',
      items: MAAS_QUESTIONS,
    },
  ],
  weighting: {
    'almost_always': 1,      // تقریباً همیشه
    'very_often': 2,         // خیلی زیاد
    'often': 3,              // غالباً
    'sometimes': 4,          // گاهی
    'rarely': 5,             // به ندرت
    'almost_never': 6,       // تقریباً هیچ‌وقت
  },
  minScore: 1,
  maxScore: 6,
};

/**
 * Cutoff استاندارد MAAS
 */
export const MAAS_CUTOFFS = {
  Mindfulness: [
    {
      min: 1.0,
      max: 2.9,
      label: 'ذهن‌آگاهی پایین',
      severity: undefined as const,
      percentile: '1.0-2.9',
    },
    {
      min: 3.0,
      max: 4.0,
      label: 'متوسط',
      severity: undefined as const,
      percentile: '3.0-4.0',
    },
    {
      min: 4.1,
      max: 5.0,
      label: 'خوب',
      severity: undefined as const,
      percentile: '4.1-5.0',
    },
    {
      min: 5.1,
      max: 6.0,
      label: 'بسیار بالا',
      severity: undefined as const,
      percentile: '5.1-6.0',
    },
  ],
};

/**
 * تفسیر برای هر سطح
 */
export const MAAS_INTERPRETATIONS = {
  '1.0-2.9': 'ذهن‌آگاهی پایین. زندگی اتوماتیک، سختی در حضور ذهن، افزایش استرس و واکنش‌های هیجانی، بیشتر تحت تأثیر افکار مزاحم.',
  '3.0-4.0': 'ذهن‌آگاهی متوسط. حضور ذهن مناسب، نوسان در توجه، گه‌گاهی اسیر حواس‌پرتی.',
  '4.1-5.0': 'ذهن‌آگاهی خوب. توانایی بالا در توجه به لحظه، کنترل خوب روی افکار، واکنش‌پذیری کمتر، مدیریت بهتر استرس.',
  '5.1-6.0': 'ذهن‌آگاهی بسیار بالا. تمرکز بالا، آگاهی عمیق از ذهن و بدن، خودتنظیمی عالی، آرامش پایدار و کیفیت بالای عملکرد.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getMAASConfigJSON(): string {
  return JSON.stringify(MAAS_CONFIG);
}

/**
 * محاسبه نمره MAAS
 * MAAS از میانگین استفاده می‌کند
 * همه 15 سوال Reverse هستند
 * فرمول Reverse: 7 - score
 * نمره نهایی: mean(15 reverse_scored_items) → range: 1-6
 * نمره بالاتر = ذهن‌آگاهی بیشتر
 */
export function calculateMAASScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-5 که معادل 1-6 است) }
): {
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const scores: number[] = [];

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 15) return;

    // تبدیل optionIndex (0-5) به نمره واقعی (1-6)
    let score = optionIndex + 1; // تبدیل 0-5 به 1-6

    // همه سوالات MAAS Reverse هستند: 7 - score
    score = 7 - score;

    scores.push(score);
  });

  // محاسبه میانگین
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const totalScore = scores.length > 0 ? Math.round((sum / scores.length) * 100) / 100 : 0;

  // تعیین cutoff و تفسیر
  let interpretation = '';
  
  if (totalScore >= 1.0 && totalScore <= 2.9) {
    interpretation = MAAS_INTERPRETATIONS['1.0-2.9'];
  } else if (totalScore >= 3.0 && totalScore <= 4.0) {
    interpretation = MAAS_INTERPRETATIONS['3.0-4.0'];
  } else if (totalScore >= 4.1 && totalScore <= 5.0) {
    interpretation = MAAS_INTERPRETATIONS['4.1-5.0'];
  } else if (totalScore >= 5.1 && totalScore <= 6.0) {
    interpretation = MAAS_INTERPRETATIONS['5.1-6.0'];
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScore <= 3.0) {
    recommendedTests.push('pss'); // استرس ادراک‌شده
    recommendedTests.push('focus'); // تمرکز
    recommendedTests.push('isi'); // بی‌خوابی
    recommendedTests.push('psqi'); // کیفیت خواب
    recommendedTests.push('gad7'); // اضطراب
    recommendedTests.push('ders'); // تنظیم هیجان (در تست‌های بعدی)
  } else if (totalScore >= 3.0 && totalScore <= 5.0) {
    recommendedTests.push('growth-mindset'); // رشد ذهنی
    recommendedTests.push('curiosity'); // کنجکاوی
    recommendedTests.push('eq'); // هوش هیجانی
  } else if (totalScore >= 5.1) {
    recommendedTests.push('values'); // ارزش‌ها
    recommendedTests.push('life-purpose'); // هدف زندگی
    recommendedTests.push('time-preference'); // ترجیح زمانی
  }

  return {
    totalScore,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

