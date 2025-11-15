/**
 * Config استاندارد برای تست PSS-10 (Perceived Stress Scale - 10 Items)
 * منبع: Cohen, Kamarck, Mermelstein (1983)
 * "A global measure of perceived stress"
 * 
 * این تست استرس ادراک‌شده را می‌سنجد
 * 
 * تعداد سوالات: 10
 * فرمت پاسخ: 5 گزینه‌ای (0-4)
 * کل نمره: 0-40
 * Reverse items: 4, 5, 7, 8 (سوالات مثبت که باید reverse شوند)
 * 
 * زیرمقیاس‌ها:
 * - Helplessness (درماندگی): سوالات 1, 2, 3, 6, 9, 10
 * - Self_Efficacy (توانمندی): سوالات 4, 5, 7, 8 (همه reverse)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات PSS-10
 */
export const PSS10_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * سوالات Reverse (مثبت - باید reverse شوند)
 */
export const PSS10_REVERSE_ITEMS = [4, 5, 7, 8];

/**
 * زیرمقیاس‌ها
 */
export const PSS10_SUBSCALES = {
  Helplessness: [1, 2, 3, 6, 9, 10], // همه مستقیم
  Self_Efficacy: [4, 5, 7, 8], // همه reverse
};

/**
 * Mapping سوالات
 */
export interface PSS10QuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Helplessness' | 'Self_Efficacy';
}

/**
 * ساخت mapping کامل برای همه 10 سوال
 */
export function createPSS10QuestionMapping(): PSS10QuestionMapping[] {
  return PSS10_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: PSS10_REVERSE_ITEMS.includes(questionOrder),
    subscale: PSS10_SUBSCALES.Helplessness.includes(questionOrder)
      ? 'Helplessness'
      : 'Self_Efficacy',
  }));
}

/**
 * Config استاندارد PSS-10
 */
export const PSS10_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: PSS10_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Helplessness',
      items: PSS10_SUBSCALES.Helplessness,
    },
    {
      name: 'Self_Efficacy',
      items: PSS10_SUBSCALES.Self_Efficacy,
    },
  ],
  weighting: {
    'never': 0,              // هرگز
    'almost_never': 1,       // به‌ندرت
    'sometimes': 2,          // گاهی
    'fairly_often': 3,       // اغلب
    'very_often': 4,         // تقریباً همیشه
  },
  minScore: 0,
  maxScore: 40, // 10 سوال × 4 = 40
};

/**
 * Cutoff رسمی PSS-10 (استاندارد جهانی)
 */
export const PSS10_CUTOFFS = {
  total: [
    { min: 0, max: 13, label: 'پایین / معمولی', severity: null, percentile: '0-33%' },
    { min: 14, max: 26, label: 'متوسط', severity: 'mild' as const, percentile: '33-67%' },
    { min: 27, max: 40, label: 'بالا', severity: 'moderate' as const, percentile: '67-100%' },
  ],
  Helplessness: [
    { min: 0, max: 8, label: 'پایین', severity: null },
    { min: 9, max: 16, label: 'متوسط', severity: 'mild' as const },
    { min: 17, max: 24, label: 'بالا', severity: 'moderate' as const },
  ],
  Self_Efficacy: [
    { min: 0, max: 8, label: 'پایین', severity: null },
    { min: 9, max: 12, label: 'متوسط', severity: 'mild' as const },
    { min: 13, max: 16, label: 'بالا', severity: 'moderate' as const },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const PSS10_INTERPRETATIONS = {
  0: 'فشارهای زندگی در حد معمول. سیستم بدن معمولاً فرصت ریکاوری پیدا می‌کند. گاهی استرس هست، اما مزمن و فرساینده نیست.',
  14: 'استرس قابل توجه در چند حوزه مختلف. ممکن است روی خواب، خلق، تمرکز اثر گذاشته باشد. نقطه‌ای عالی برای شروع تمرین‌های مدیریت استرس و تغییر سبک زندگی.',
  27: 'فشار ذهنی مزمن. احتمالاً با علائمی مثل بی‌خوابی، خستگی، ضعف تمرکز، زودعصبی‌شدن همراه است. پیشنهاد قوی برای بررسی خواب (PSQI / ISI)، بررسی اضطراب (GAD-7) و افسردگی (PHQ-9)، و تمرین‌های سیستماتیک ریلکسیشن، ذهن‌آگاهی، یا مشاوره.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getPSS10ConfigJSON(): string {
  return JSON.stringify({
    ...PSS10_CONFIG,
    cutoffs: PSS10_CUTOFFS,
  });
}

/**
 * محاسبه نمره PSS-10
 */
export function calculatePSS10Score(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Helplessness: number;
    Self_Efficacy: number;
  };
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string;
  cutoff: {
    min: number;
    max: number;
    label: string;
    severity: 'mild' | 'moderate' | 'severe' | null;
  } | null;
  recommendedTests?: string[];
} {
  // محاسبه نمره هر زیرمقیاس
  let helplessnessScore = 0;
  let selfEfficacyScore = 0;

  // محاسبه Helplessness (سوالات 1, 2, 3, 6, 9, 10 - همه مستقیم)
  PSS10_SUBSCALES.Helplessness.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer !== undefined && answer !== null) {
      // تبدیل optionIndex (0-4) به نمره (0-4)
      helplessnessScore += answer;
    }
  });

  // محاسبه Self_Efficacy (سوالات 4, 5, 7, 8 - همه reverse)
  PSS10_SUBSCALES.Self_Efficacy.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer !== undefined && answer !== null) {
      // تبدیل optionIndex (0-4) به نمره (0-4) و سپس reverse
      const reversedScore = 4 - answer;
      selfEfficacyScore += reversedScore;
    }
  });

  // محاسبه نمره کل
  const totalScore = helplessnessScore + selfEfficacyScore;

  // تعیین cutoff برای نمره کل
  const cutoff = PSS10_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // تعیین severity
  const severity = cutoff?.severity || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 13) {
    interpretation = PSS10_INTERPRETATIONS[0];
  } else if (totalScore <= 26) {
    interpretation = PSS10_INTERPRETATIONS[14];
  } else {
    interpretation = PSS10_INTERPRETATIONS[27];
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  if (totalScore >= 27) {
    recommendedTests.push('psqi', 'isi', 'gad7', 'phq9');
    if (helplessnessScore >= 17 && selfEfficacyScore <= 8) {
      recommendedTests.push('rosenberg', 'gse');
    }
  } else if (totalScore >= 14) {
    recommendedTests.push('maas');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• احساس درماندگی: ${helplessnessScore} از 24\n`;
  interpretation += `• احساس توانمندی: ${selfEfficacyScore} از 16\n`;

  if (helplessnessScore >= 17 && selfEfficacyScore <= 8) {
    interpretation += `\n⚠️ توجه: احساس درماندگی بالا و توانمندی پایین نشان می‌دهد که ممکن است از تمرین‌های coping و بازسازی شناختی بهره ببری.`;
  }

  return {
    totalScore,
    subscales: {
      Helplessness: helplessnessScore,
      Self_Efficacy: selfEfficacyScore,
    },
    severity,
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
  };
}

