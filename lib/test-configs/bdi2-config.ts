/**
 * Config استاندارد برای تست BDI-II (Beck Depression Inventory - نسخه دوم)
 * منبع: Beck, Steer, & Brown (1996)
 * 
 * یکی از 3 تست برتر افسردگی در روان‌پزشکی
 * 
 * تعداد سوالات: 21
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * کل نمره: 0-63
 * Reverse items: ندارد (همه سوالات مستقیم هستند)
 * زمان ارزیابی: 2 هفته اخیر
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات BDI-II (همه مستقیم، بدون reverse)
 */
export const BDI2_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

/**
 * آستانه بالینی (Clinical Threshold)
 * نمره ≥14 نشان‌دهنده افسردگی قابل توجه بالینی است
 */
export const BDI2_CLINICAL_THRESHOLD = 14;

/**
 * Mapping سوالات
 */
export interface BDI2QuestionMapping {
  questionOrder: number;
  isReverse: boolean; // همیشه false برای BDI-II
}

/**
 * ساخت mapping کامل برای همه 21 سوال
 */
export function createBDI2QuestionMapping(): BDI2QuestionMapping[] {
  return BDI2_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: false, // BDI-II هیچ reverse item ندارد
  }));
}

/**
 * Config استاندارد BDI-II
 */
export const BDI2_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: [], // هیچ reverse item ندارد
  weighting: {
    'option_0': 0,  // هیچ / کم
    'option_1': 1,  // خفیف
    'option_2': 2,  // متوسط
    'option_3': 3,  // شدید
  },
  minScore: 0,
  maxScore: 63, // 21 سوال × 3 = 63
};

/**
 * Cutoff رسمی BDI-II (استاندارد جهانی - بیمارستانی و کلینیکی)
 */
export const BDI2_CUTOFFS = {
  total: [
    { min: 0, max: 13, label: 'حداقل', severity: null, percentile: '0-21%' },
    { min: 14, max: 19, label: 'خفیف', severity: 'mild' as const, percentile: '21-30%' },
    { min: 20, max: 28, label: 'متوسط', severity: 'moderate' as const, percentile: '30-44%' },
    { min: 29, max: 63, label: 'شدید', severity: 'severe' as const, percentile: '44-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const BDI2_INTERPRETATIONS = {
  0: 'تغییرات خلقی طبیعی، گاهی خستگی یا بی‌حالی. احتمال افسردگی بالینی کم است.',
  14: 'کاهش انرژی، کاهش تمرکز، بی‌علاقگی خفیف به فعالیت‌ها.',
  20: 'تأثیر مستقیم بر خواب، اشتها، انگیزه و عملکرد روزانه.',
  29: 'احساس بی‌ارزشی، ناامیدی، خستگی شدید ذهنی و جسمی. پیشنهاد: ارزیابی تخصصی.',
};

/**
 * Alert برای آستانه بالینی (≥14)
 */
export interface BDI2ClinicalAlert {
  hasAlert: boolean;
  needsClinicalAssessment: boolean;
  message: string;
}

/**
 * بررسی alert برای آستانه بالینی
 */
export function checkBDI2ClinicalAlert(totalScore: number): BDI2ClinicalAlert {
  if (totalScore >= BDI2_CLINICAL_THRESHOLD) {
    return {
      hasAlert: true,
      needsClinicalAssessment: true,
      message: '⚠️ آستانه بالینی: نمره شما نشان‌دهنده افسردگی قابل توجه بالینی است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
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
export function getBDI2ConfigJSON(): string {
  return JSON.stringify({
    ...BDI2_CONFIG,
    cutoffs: BDI2_CUTOFFS,
  });
}

/**
 * محاسبه نمره BDI-II
 */
export function calculateBDI2Score(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3) }
): {
  totalScore: number;
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string;
  clinicalAlert: BDI2ClinicalAlert;
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
  
  BDI2_QUESTIONS.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer !== undefined && answer !== null) {
      // تبدیل optionIndex (0-3) به نمره (0-3)
      // 0: هیچ / کم → 0
      // 1: خفیف → 1
      // 2: متوسط → 2
      // 3: شدید → 3
      totalScore += answer;
    }
  });

  // تعیین cutoff
  const cutoff = BDI2_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // تعیین severity
  const severity = cutoff?.severity || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 13) {
    interpretation = BDI2_INTERPRETATIONS[0];
  } else if (totalScore <= 19) {
    interpretation = BDI2_INTERPRETATIONS[14];
  } else if (totalScore <= 28) {
    interpretation = BDI2_INTERPRETATIONS[20];
  } else {
    interpretation = BDI2_INTERPRETATIONS[29];
  }

  // بررسی alert برای آستانه بالینی
  const clinicalAlert = checkBDI2ClinicalAlert(totalScore);

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (totalScore >= 20) {
    recommendedTests.push('phq9'); // برای مقایسه شدت افسردگی
    recommendedTests.push('gad7'); // چون افسردگی متوسط/شدید معمولاً با اضطراب همراه است
    recommendedTests.push('isi', 'psqi'); // اگر به مشکل خواب اشاره کند
    recommendedTests.push('panas'); // برای بررسی عاطفه مثبت/منفی
  } else if (totalScore >= 14) {
    recommendedTests.push('phq9'); // برای مقایسه
    recommendedTests.push('gad7'); // بررسی اضطراب
  }

  return {
    totalScore,
    severity,
    interpretation,
    clinicalAlert,
    cutoff,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

