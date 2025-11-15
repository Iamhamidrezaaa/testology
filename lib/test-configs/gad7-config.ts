/**
 * Config استاندارد برای تست GAD-7 (Generalized Anxiety Disorder)
 * منبع: Spitzer RL, Kroenke K, Williams JBW, Löwe B. (2006)
 * "A brief measure for assessing generalized anxiety disorder: the GAD-7"
 * 
 * این تست اضطراب را می‌سنجد
 * 
 * تعداد سوالات: 7
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * کل نمره: 0-21
 * Reverse items: ندارد (همه سوالات مستقیم هستند)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات GAD-7 (همه مستقیم، بدون reverse)
 */
export const GAD7_QUESTIONS = [1, 2, 3, 4, 5, 6, 7];

/**
 * آستانه بالینی (Clinical Threshold)
 * نمره ≥10 نشان‌دهنده احتمال اختلال اضطراب قابل توجه بالینی است
 */
export const GAD7_CLINICAL_THRESHOLD = 10;

/**
 * Mapping سوالات
 */
export interface GAD7QuestionMapping {
  questionOrder: number;
  isReverse: boolean; // همیشه false برای GAD-7
}

/**
 * ساخت mapping کامل برای همه 7 سوال
 */
export function createGAD7QuestionMapping(): GAD7QuestionMapping[] {
  return GAD7_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: false, // GAD-7 هیچ reverse item ندارد
  }));
}

/**
 * Config استاندارد GAD-7
 */
export const GAD7_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: [], // هیچ reverse item ندارد
  weighting: {
    'not_at_all': 0,           // اصلاً
    'several_days': 1,         // چند روز
    'more_than_half_days': 2,  // بیش از نصف روزها
    'nearly_every_day': 3,     // تقریباً هر روز
  },
  minScore: 0,
  maxScore: 21, // 7 سوال × 3 = 21
};

/**
 * Cutoff رسمی GAD-7 (استاندارد جهانی)
 */
export const GAD7_CUTOFFS = {
  total: [
    { min: 0, max: 4, label: 'حداقل / طبیعی', severity: null, percentile: '0-19%' },
    { min: 5, max: 9, label: 'خفیف', severity: 'mild' as const, percentile: '19-43%' },
    { min: 10, max: 14, label: 'متوسط', severity: 'moderate' as const, percentile: '43-67%' },
    { min: 15, max: 21, label: 'شدید', severity: 'severe' as const, percentile: '67-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const GAD7_INTERPRETATIONS = {
  0: 'الگوی اضطراب روزمره‌ات در محدوده طبیعی است و نشانه‌ای از اضطراب بالینی دیده نمی‌شود.',
  5: 'نشانه‌هایی از نگرانی و تنش در زندگی روزمره‌ات دیده می‌شود، اما هنوز در حد خفیف است. ممکن است با تکنیک‌های مدیریت استرس و مراقبت از خود بهبود یابد.',
  10: 'اضطراب تو به حدی رسیده که می‌تواند روی تمرکز، خواب یا کیفیت زندگی‌ات اثر بگذارد. توصیه می‌شود با یک متخصص سلامت روان مشورت کنی.',
  15: 'شدت نشانه‌های اضطراب بالاست و احتمالاً تأثیر قابل‌توجهی روی زندگی روزمره‌ات دارد. ارزیابی تخصصی و احتمالاً درمان می‌تواند کمک‌کننده باشد.',
};

/**
 * بررسی آستانه بالینی (≥10)
 */
export interface GAD7ClinicalAlert {
  hasAlert: boolean;
  needsClinicalAssessment: boolean;
  message: string;
}

/**
 * بررسی alert برای آستانه بالینی
 */
export function checkGAD7ClinicalAlert(totalScore: number): GAD7ClinicalAlert {
  if (totalScore >= GAD7_CLINICAL_THRESHOLD) {
    return {
      hasAlert: true,
      needsClinicalAssessment: true,
      message: '⚠️ آستانه بالینی: نمره شما نشان‌دهنده احتمال اختلال اضطراب قابل توجه بالینی است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
    };
  }

  return {
    hasAlert: false,
    needsClinicalAssessment: false,
    message: '',
  };
}

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getGAD7ConfigJSON(): string {
  return JSON.stringify({
    ...GAD7_CONFIG,
    cutoffs: GAD7_CUTOFFS,
  });
}

/**
 * محاسبه نمره GAD-7
 */
export function calculateGAD7Score(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3) }
): {
  totalScore: number;
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string;
  clinicalAlert: GAD7ClinicalAlert;
  cutoff: {
    min: number;
    max: number;
    label: string;
    severity: 'mild' | 'moderate' | 'severe' | null;
  } | null;
} {
  // محاسبه نمره کل
  let totalScore = 0;
  
  GAD7_QUESTIONS.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer !== undefined && answer !== null) {
      // تبدیل optionIndex (0-3) به نمره (0-3)
      // 0: اصلاً → 0
      // 1: چند روز → 1
      // 2: بیش از نصف روزها → 2
      // 3: تقریباً هر روز → 3
      totalScore += answer;
    }
  });

  // تعیین cutoff
  const cutoff = GAD7_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // تعیین severity
  const severity = cutoff?.severity || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 4) {
    interpretation = GAD7_INTERPRETATIONS[0];
  } else if (totalScore <= 9) {
    interpretation = GAD7_INTERPRETATIONS[5];
  } else if (totalScore <= 14) {
    interpretation = GAD7_INTERPRETATIONS[10];
  } else {
    interpretation = GAD7_INTERPRETATIONS[15];
  }

  // اضافه کردن disclaimer
  interpretation += '\n\n⚠️ توجه: این تست تشخیص پزشکی نیست و اگر احساس می‌کنی حال خوبی نداری، صحبت با روان‌درمانگر یا روان‌پزشک می‌تونه قدم مهم بعدی باشه.';

  // بررسی alert برای آستانه بالینی
  const clinicalAlert = checkGAD7ClinicalAlert(totalScore);

  return {
    totalScore,
    severity,
    interpretation,
    clinicalAlert,
    cutoff,
  };
}

