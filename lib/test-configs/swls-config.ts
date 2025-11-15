/**
 * Config استاندارد برای تست SWLS (Satisfaction With Life Scale)
 * منبع: Diener, E., Emmons, R. A., Larson, R. J., & Griffin, S. (1985)
 * 
 * یکی از استانداردترین ابزارها برای سنجش رضایت کلی از زندگی
 * 
 * تعداد سوالات: 5
 * فرمت پاسخ: 7 گزینه‌ای (1-7) - از 1 شروع می‌شود نه 0!
 * کل نمره: 5-35
 * Reverse items: ندارد (همه سوالات مثبت هستند)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات SWLS (همه مستقیم، بدون reverse)
 */
export const SWLS_QUESTIONS = [1, 2, 3, 4, 5];

/**
 * Mapping سوالات
 */
export interface SWLSQuestionMapping {
  questionOrder: number;
  isReverse: boolean; // همیشه false برای SWLS
}

/**
 * ساخت mapping کامل برای همه 5 سوال
 */
export function createSWLSQuestionMapping(): SWLSQuestionMapping[] {
  return SWLS_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: false, // SWLS هیچ reverse item ندارد
  }));
}

/**
 * Config استاندارد SWLS
 */
export const SWLS_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: [], // هیچ reverse item ندارد
  weighting: {
    'option_1': 1,  // کاملاً مخالفم
    'option_2': 2,  // مخالفم
    'option_3': 3,  // تا حدی مخالفم
    'option_4': 4,  // نه موافق نه مخالف
    'option_5': 5,  // تا حدی موافقم
    'option_6': 6,  // موافقم
    'option_7': 7,  // کاملاً موافقم
  },
  minScore: 5, // 5 سوال × 1 = 5
  maxScore: 35, // 5 سوال × 7 = 35
};

/**
 * Cutoff استاندارد SWLS (بر اساس پیشنهاد Diener)
 */
export const SWLS_CUTOFFS = {
  total: [
    { min: 5, max: 9, label: 'به شدت ناراضی از زندگی', severity: null, percentile: '0-14%' },
    { min: 10, max: 14, label: 'نسبتاً ناراضی', severity: null, percentile: '14-26%' },
    { min: 15, max: 19, label: 'کمی زیر حد متوسط', severity: null, percentile: '26-40%' },
    { min: 20, max: 24, label: 'محدودهٔ متوسط / نرمال', severity: null, percentile: '40-57%' },
    { min: 25, max: 29, label: 'راضی از زندگی', severity: null, percentile: '57-83%' },
    { min: 30, max: 35, label: 'به شدت راضی از زندگی', severity: null, percentile: '83-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const SWLS_INTERPRETATIONS = {
  5: 'احساس نارضایتی عمیق، احتمال ناامیدی نسبت به آینده، اغلب همراه با افسردگی / اضطراب',
  10: 'احساس می‌کنی زندگی‌ات با چیزی که می‌خواستی فاصله زیادی دارد. ممکن است حس گیر افتادن، تعلیق یا بی‌جهتی وجود داشته باشد.',
  15: 'بعضی چیزها خوب است، بعضی چیزها نه. احساس می‌کنی جا برای تغییر و رشد زیاد است.',
  20: 'رضایت کلی قابل قبول، نوسان‌های طبیعی وابسته به شرایط لحظه‌ای زندگی.',
  25: 'احساس می‌کنی بخش زیادی از چیزهای مهم زندگی‌ات روی ریل درست است. انرژی و انگیزه برای ادامه مسیر و ارتقا داری.',
  30: 'حس معنا، رضایت و سپاسگزاری بالا. معمولاً همراه با حمایت اجتماعی، ثبات نسبی و احساس پیشرفت.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getSWLSConfigJSON(): string {
  return JSON.stringify({
    ...SWLS_CONFIG,
    cutoffs: SWLS_CUTOFFS,
  });
}

/**
 * محاسبه نمره SWLS
 */
export function calculateSWLSScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-6 که معادل 1-7 است) }
): {
  totalScore: number;
  interpretation: string;
  cutoff: {
    min: number;
    max: number;
    label: string;
    severity: 'mild' | 'moderate' | 'severe' | null;
  } | null;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  // محاسبه نمره کل
  let totalScore = 0;
  
  SWLS_QUESTIONS.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer === undefined || answer === null) return;

    // تبدیل optionIndex (0-6) به نمره واقعی (1-7)
    // چون SWLS از 1 شروع می‌شود، باید +1 کنیم
    const score = answer + 1; // تبدیل 0-6 به 1-7
    totalScore += score;
  });

  // تعیین cutoff
  const cutoff = SWLS_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 9) {
    interpretation = SWLS_INTERPRETATIONS[5];
  } else if (totalScore <= 14) {
    interpretation = SWLS_INTERPRETATIONS[10];
  } else if (totalScore <= 19) {
    interpretation = SWLS_INTERPRETATIONS[15];
  } else if (totalScore <= 24) {
    interpretation = SWLS_INTERPRETATIONS[20];
  } else if (totalScore <= 29) {
    interpretation = SWLS_INTERPRETATIONS[25];
  } else {
    interpretation = SWLS_INTERPRETATIONS[30];
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (totalScore <= 14) {
    recommendedTests.push('phq9'); // افسردگی
    recommendedTests.push('bdi2'); // جزئیات شناختی افسردگی
    recommendedTests.push('gad7'); // اضطراب
    recommendedTests.push('pss'); // Perceived Stress Scale (اگر واردش شدیم)
  } else if (totalScore >= 15 && totalScore <= 24) {
    recommendedTests.push('rosenberg'); // Self-Esteem
    recommendedTests.push('eq'); // هوش هیجانی
    recommendedTests.push('attachment', 'psss'); // Attachment / Support
  } else if (totalScore >= 25) {
    recommendedTests.push('growth-mindset'); // رشد و توسعه فردی
    recommendedTests.push('curiosity'); // کنجکاوی
    recommendedTests.push('values'); // Personal Values Test
    recommendedTests.push('time-preference'); // Future Orientation
  }

  return {
    totalScore,
    interpretation,
    cutoff,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

