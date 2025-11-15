/**
 * Config استاندارد برای تست BAI (Beck Anxiety Inventory)
 * منبع: Beck, A. T., Epstein, N., Brown, G., & Steer, R. A. (1988)
 * 
 * این تست برای سنجش شدت اضطراب فیزیولوژیک و شناختی استفاده می‌شود
 * 
 * تعداد سوالات: 21
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * کل نمره: 0-63
 * Reverse items: ندارد (همه سوالات مستقیم هستند)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات BAI (همه مستقیم، بدون reverse)
 */
export const BAI_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

/**
 * سوالات خاص که نیاز به alert دارند (تنفسی، گیجی، ترس شدید)
 * اگر کاربر نمره 2 یا 3 به این سوالات بدهد، alert نمایش داده می‌شود
 */
export const BAI_ALERT_ITEMS = [
  // این سوالات باید با سوالات واقعی BAI تطبیق داده شوند
  // به عنوان مثال: سوالات مربوط به تنفس، گیجی، ترس شدید
  // برای حالا همه سوالات را در نظر می‌گیریم
];

/**
 * Mapping سوالات
 */
export interface BAIQuestionMapping {
  questionOrder: number;
  isReverse: boolean; // همیشه false برای BAI
}

/**
 * ساخت mapping کامل برای همه 21 سوال
 */
export function createBAIQuestionMapping(): BAIQuestionMapping[] {
  return BAI_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: false, // BAI هیچ reverse item ندارد
  }));
}

/**
 * Config استاندارد BAI
 */
export const BAI_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: [], // هیچ reverse item ندارد
  weighting: {
    'not_at_all': 0,        // اصلاً احساس نکرده‌ام
    'mildly': 1,            // کمی احساس کرده‌ام
    'moderately': 2,        // به میزان متوسط احساس کرده‌ام
    'severely': 3,          // به شدت احساس کرده‌ام
  },
  minScore: 0,
  maxScore: 63, // 21 سوال × 3 = 63
};

/**
 * Cutoff رسمی BAI (استاندارد جهانی - Beck & Steer Manual)
 */
export const BAI_CUTOFFS = {
  total: [
    { min: 0, max: 7, label: 'حداقل', severity: null, percentile: '0-11%' },
    { min: 8, max: 15, label: 'خفیف', severity: 'mild' as const, percentile: '11-24%' },
    { min: 16, max: 25, label: 'متوسط', severity: 'moderate' as const, percentile: '24-40%' },
    { min: 26, max: 63, label: 'شدید', severity: 'severe' as const, percentile: '40-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const BAI_INTERPRETATIONS = {
  0: 'علائم اضطراب در حد طبیعی است و عملکرد روزمره دچار اختلال نمی‌شود.',
  8: 'احساس تنش، نگرانی بدنی (مثل سفتی عضلات یا بی‌قراری) اما هنوز عملکرد روزانه حفظ شده.',
  16: 'علائم فیزیولوژیک مثل تپش قلب، احساس گُرگرفتگی، لرزش، یا افکار مزاحم.',
  26: 'علائم پررنگ و تاثیرگذار بر کارکرد روزانه؛ پیشنهاد ارزیابی تخصصی.',
};

/**
 * Alert برای سوالات خاص (تنفسی، گیجی، ترس شدید)
 */
export interface BAIAlert {
  hasAlert: boolean;
  level: 'low' | 'high' | null;
  message: string;
}

/**
 * بررسی alert برای سوالات خاص
 * اگر کاربر نمره 2 یا 3 به سوالات تنفسی، گیجی، ترس شدید بدهد
 */
export function checkBAIAlert(
  answers: Record<number, number>,
  alertItems: number[] = BAI_ALERT_ITEMS
): BAIAlert {
  // اگر alert items خالی باشد، از همه سوالات استفاده می‌کنیم
  const itemsToCheck = alertItems.length > 0 ? alertItems : BAI_QUESTIONS;
  
  const highScores = itemsToCheck.filter(questionOrder => {
    const score = answers[questionOrder] || 0;
    return score >= 2; // نمره 2 یا 3
  });

  if (highScores.length > 0) {
    return {
      hasAlert: true,
      level: 'high',
      message: '⚠️ توجه: برخی پاسخ‌های شما نشان‌دهنده علائم قابل توجه اضطراب است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
    };
  }

  return {
    hasAlert: false,
    level: null,
    message: '',
  };
}

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getBAIConfigJSON(): string {
  return JSON.stringify({
    ...BAI_CONFIG,
    cutoffs: BAI_CUTOFFS,
  });
}

/**
 * محاسبه نمره BAI
 */
export function calculateBAIScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3) }
): {
  totalScore: number;
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string;
  alert: BAIAlert;
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
  
  BAI_QUESTIONS.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer !== undefined && answer !== null) {
      // تبدیل optionIndex (0-3) به نمره (0-3)
      // 0: اصلاً احساس نکرده‌ام → 0
      // 1: کمی احساس کرده‌ام → 1
      // 2: به میزان متوسط احساس کرده‌ام → 2
      // 3: به شدت احساس کرده‌ام → 3
      totalScore += answer;
    }
  });

  // تعیین cutoff
  const cutoff = BAI_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // تعیین severity
  const severity = cutoff?.severity || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 7) {
    interpretation = BAI_INTERPRETATIONS[0];
  } else if (totalScore <= 15) {
    interpretation = BAI_INTERPRETATIONS[8];
  } else if (totalScore <= 25) {
    interpretation = BAI_INTERPRETATIONS[16];
  } else {
    interpretation = BAI_INTERPRETATIONS[26];
  }

  // بررسی alert برای سوالات خاص
  const alert = checkBAIAlert(answers);

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (totalScore >= 16) {
    recommendedTests.push('gad7', 'phq9'); // اضطراب شدید با افسردگی همپوشانی دارد
  }
  if (totalScore >= 8) {
    recommendedTests.push('panas'); // برای عواطف منفی
  }

  return {
    totalScore,
    severity,
    interpretation,
    alert,
    cutoff,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

