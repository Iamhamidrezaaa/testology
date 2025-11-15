/**
 * Config استاندارد برای تست PHQ-9 (Patient Health Questionnaire - Depression Module)
 * منبع: Kroenke, Spitzer, Williams (2001)
 * "The PHQ-9: validity of a brief depression severity measure"
 * 
 * این تست افسردگی را می‌سنجد
 * 
 * تعداد سوالات: 9
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * کل نمره: 0-27
 * Reverse items: ندارد (همه سوالات مستقیم هستند)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات PHQ-9 (همه مستقیم، بدون reverse)
 */
export const PHQ9_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * سوال 9 (افکار خودکشی) نیاز به alert دارد
 */
export const PHQ9_SUICIDE_QUESTION = 9;

/**
 * Mapping سوالات
 */
export interface PHQ9QuestionMapping {
  questionOrder: number;
  isReverse: boolean; // همیشه false برای PHQ-9
}

/**
 * ساخت mapping کامل برای همه 9 سوال
 */
export function createPHQ9QuestionMapping(): PHQ9QuestionMapping[] {
  return PHQ9_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: false, // PHQ-9 هیچ reverse item ندارد
  }));
}

/**
 * Config استاندارد PHQ-9
 */
export const PHQ9_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: [], // هیچ reverse item ندارد
  weighting: {
    'not_at_all': 0,           // اصلاً
    'several_days': 1,          // چند روز
    'more_than_half_days': 2,   // بیش از نصف روزها
    'nearly_every_day': 3,      // تقریباً هر روز
  },
  minScore: 0,
  maxScore: 27, // 9 سوال × 3 = 27
};

/**
 * Cutoff رسمی PHQ-9 (استاندارد جهانی)
 */
export const PHQ9_CUTOFFS = {
  total: [
    { min: 0, max: 4, label: 'حداقل / طبیعی', severity: null, percentile: '0-15%' },
    { min: 5, max: 9, label: 'خفیف', severity: 'mild' as const, percentile: '15-33%' },
    { min: 10, max: 14, label: 'متوسط', severity: 'moderate' as const, percentile: '33-52%' },
    { min: 15, max: 19, label: 'نسبتاً شدید', severity: 'moderate' as const, percentile: '52-70%' },
    { min: 20, max: 27, label: 'شدید', severity: 'severe' as const, percentile: '70-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const PHQ9_INTERPRETATIONS = {
  0: 'حالت طبیعی - الگوی سالم خلقی، نشانه‌ای از افسردگی دیده نمی‌شود.',
  5: 'افسردگی خفیف - کاهش انرژی، بی‌حسی احساسی، اما عملکرد روزانه حفظ شده.',
  10: 'افسردگی متوسط - تغییرات قابل توجه در خواب، انگیزه و تمرکز.',
  15: 'نسبتاً شدید - تأثیر مستقیم بر کارکرد روزانه؛ توصیه به گفت‌وگو با درمانگر.',
  20: 'شدید - علامت‌های شدید افسردگی؛ نیاز به ارزیابی درمانی سریع.',
};

/**
 * Alert برای سوال 9 (افکار خودکشی)
 */
export interface PHQ9Alert {
  hasAlert: boolean;
  level: 'low' | 'high' | 'critical' | null;
  message: string;
}

/**
 * بررسی alert برای سوال 9
 */
export function checkPHQ9SuicideAlert(question9Score: number): PHQ9Alert {
  if (question9Score === 0) {
    return {
      hasAlert: false,
      level: null,
      message: '',
    };
  }

  if (question9Score === 3) {
    return {
      hasAlert: true,
      level: 'critical',
      message: '⚠️ هشدار: نیاز به ارجاع فوری - لطفاً با یک متخصص سلامت روان یا خط بحران تماس بگیرید.',
    };
  }

  if (question9Score >= 1) {
    return {
      hasAlert: true,
      level: 'high',
      message: '⚠️ هشدار: این پاسخ نیاز به توجه دارد. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
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
export function getPHQ9ConfigJSON(): string {
  return JSON.stringify({
    ...PHQ9_CONFIG,
    cutoffs: PHQ9_CUTOFFS,
  });
}

/**
 * محاسبه نمره PHQ-9
 */
export function calculatePHQ9Score(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3) }
): {
  totalScore: number;
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string;
  alert: PHQ9Alert;
  cutoff: {
    min: number;
    max: number;
    label: string;
    severity: 'mild' | 'moderate' | 'severe' | null;
  } | null;
} {
  // محاسبه نمره کل
  let totalScore = 0;
  
  PHQ9_QUESTIONS.forEach(questionOrder => {
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
  const cutoff = PHQ9_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // تعیین severity
  const severity = cutoff?.severity || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 4) {
    interpretation = PHQ9_INTERPRETATIONS[0];
  } else if (totalScore <= 9) {
    interpretation = PHQ9_INTERPRETATIONS[5];
  } else if (totalScore <= 14) {
    interpretation = PHQ9_INTERPRETATIONS[10];
  } else if (totalScore <= 19) {
    interpretation = PHQ9_INTERPRETATIONS[15];
  } else {
    interpretation = PHQ9_INTERPRETATIONS[20];
  }

  // بررسی alert برای سوال 9
  const question9Score = answers[PHQ9_SUICIDE_QUESTION] || 0;
  const alert = checkPHQ9SuicideAlert(question9Score);

  return {
    totalScore,
    severity,
    interpretation,
    alert,
    cutoff,
  };
}

