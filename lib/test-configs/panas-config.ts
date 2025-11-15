/**
 * Config استاندارد برای تست PANAS (Positive and Negative Affect Schedule)
 * منبع: Watson, Clark, & Tellegen (1988)
 * 
 * یکی از دقیق‌ترین ابزارها برای سنجش عاطفه مثبت و عاطفه منفی
 * 
 * تعداد سوالات: 20
 * دو زیرمقیاس:
 * - Positive Affect (PA): 10 سوال (عاطفه مثبت)
 * - Negative Affect (NA): 10 سوال (عاطفه منفی)
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * نمره هر زیرمقیاس: 10-50
 * Reverse items: ندارد (همه سوالات مستقیم هستند)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const PANAS_SUBSCALES = {
  PositiveAffect: [1, 3, 5, 9, 10, 12, 14, 16, 17, 19], // PA (عاطفه مثبت)
  NegativeAffect: [2, 4, 6, 7, 8, 11, 13, 15, 18, 20],  // NA (عاطفه منفی)
};

/**
 * Mapping سوالات به زیرمقیاس‌ها
 */
export interface PANASQuestionMapping {
  questionOrder: number;
  subscale: 'PositiveAffect' | 'NegativeAffect';
  isReverse: boolean; // همیشه false برای PANAS
}

/**
 * ساخت mapping کامل برای همه 20 سوال
 */
export function createPANASQuestionMapping(): PANASQuestionMapping[] {
  const mapping: PANASQuestionMapping[] = [];

  // Positive Affect
  PANAS_SUBSCALES.PositiveAffect.forEach(questionOrder => {
    mapping.push({
      questionOrder,
      subscale: 'PositiveAffect',
      isReverse: false,
    });
  });

  // Negative Affect
  PANAS_SUBSCALES.NegativeAffect.forEach(questionOrder => {
    mapping.push({
      questionOrder,
      subscale: 'NegativeAffect',
      isReverse: false,
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد PANAS
 */
export const PANAS_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه subscales داریم
  dimensions: ['PositiveAffect', 'NegativeAffect'],
  reverseItems: [], // هیچ reverse item ندارد
  subscales: [
    {
      name: 'PositiveAffect',
      items: PANAS_SUBSCALES.PositiveAffect,
    },
    {
      name: 'NegativeAffect',
      items: PANAS_SUBSCALES.NegativeAffect,
    },
  ],
  weighting: {
    'very_little': 1,    // خیلی کم / اصلاً
    'a_little': 2,       // کمی
    'moderate': 3,       // متوسط
    'quite_a_bit': 4,    // زیاد
    'very_much': 5,      // خیلی زیاد
  },
  minScore: 10, // هر زیرمقیاس: 10 سوال × 1 = 10
  maxScore: 50, // هر زیرمقیاس: 10 سوال × 5 = 50
};

/**
 * Cutoff استاندارد PANAS (بر اساس داده‌های نرمال جهانی)
 */
export const PANAS_CUTOFFS = {
  PositiveAffect: [
    { min: 10, max: 20, label: 'عاطفه مثبت پایین', percentile: '0-25%' },
    { min: 21, max: 30, label: 'متوسط', percentile: '25-50%' },
    { min: 31, max: 40, label: 'بالا', percentile: '50-75%' },
    { min: 41, max: 50, label: 'بسیار بالا', percentile: '75-100%' },
  ],
  NegativeAffect: [
    { min: 10, max: 20, label: 'عاطفه منفی پایین', percentile: '0-25%' },
    { min: 21, max: 30, label: 'متوسط', percentile: '25-50%' },
    { min: 31, max: 40, label: 'بالا', percentile: '50-75%' },
    { min: 41, max: 50, label: 'بسیار بالا', percentile: '75-100%' },
  ],
};

/**
 * تفسیر هر زیرمقیاس
 */
export const PANAS_INTERPRETATIONS = {
  PositiveAffect: {
    low: 'کم‌انرژی، بی‌انگیزه، احساسات مثبت کم',
    medium: 'انگیزه و اشتیاق طبیعی',
    high: 'شاد، فعال، هدفمند',
    veryHigh: 'خوش‌بینی قوی، انرژی زیاد',
  },
  NegativeAffect: {
    low: 'آرام، کم‌تنش',
    medium: 'نگرانی‌ها و استرس روزمره',
    high: 'نوسانات خلقی، اضطراب عمومی',
    veryHigh: 'استرس شدید، حساسیت هیجانی',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getPANASConfigJSON(): string {
  return JSON.stringify({
    ...PANAS_CONFIG,
    cutoffs: PANAS_CUTOFFS,
  });
}

/**
 * محاسبه نمره PANAS
 */
export function calculatePANASScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    PositiveAffect: number;
    NegativeAffect: number;
  };
  normalized: {
    PositiveAffect: number; // 0-1
    NegativeAffect: number; // 0-1
  };
  interpretations: {
    PositiveAffect: string;
    NegativeAffect: string;
  };
  cutoffs: {
    PositiveAffect: {
      min: number;
      max: number;
      label: string;
    } | null;
    NegativeAffect: {
      min: number;
      max: number;
      label: string;
    } | null;
  };
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number } = {
    PositiveAffect: 0,
    NegativeAffect: 0,
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    // پیدا کردن زیرمقیاس
    let subscale: 'PositiveAffect' | 'NegativeAffect' | null = null;
    if (PANAS_SUBSCALES.PositiveAffect.includes(questionOrder)) {
      subscale = 'PositiveAffect';
    } else if (PANAS_SUBSCALES.NegativeAffect.includes(questionOrder)) {
      subscale = 'NegativeAffect';
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    // چون PANAS از 1 شروع می‌شود، باید +1 کنیم
    const score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اضافه کردن به نمره زیرمقیاس
    subscaleScores[subscale] += score;
  });

  // Normalize کردن (0-1)
  const normalized = {
    PositiveAffect: (subscaleScores.PositiveAffect - 10) / 40,
    NegativeAffect: (subscaleScores.NegativeAffect - 10) / 40,
  };

  // تعیین cutoff برای هر زیرمقیاس
  const cutoffs: {
    PositiveAffect: { min: number; max: number; label: string } | null;
    NegativeAffect: { min: number; max: number; label: string } | null;
  } = {
    PositiveAffect: null,
    NegativeAffect: null,
  };

  Object.entries(subscaleScores).forEach(([subscale, score]) => {
    const cutoff = PANAS_CUTOFFS[subscale as keyof typeof PANAS_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    if (cutoff) {
      cutoffs[subscale as keyof typeof cutoffs] = cutoff;
    }
  });

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(subscaleScores).forEach(([subscale, score]) => {
    const cutoff = cutoffs[subscale as keyof typeof cutoffs];
    const interpretation = PANAS_INTERPRETATIONS[subscale as keyof typeof PANAS_INTERPRETATIONS];
    
    let level = '';
    if (score <= 20) {
      level = interpretation.low;
    } else if (score <= 30) {
      level = interpretation.medium;
    } else if (score <= 40) {
      level = interpretation.high;
    } else {
      level = interpretation.veryHigh;
    }
    
    interpretations[subscale] = `${level} (${cutoff?.label || ''})`;
  });

  // پیشنهاد تست‌های تکمیلی بر اساس ترکیب PA و NA
  const recommendedTests: string[] = [];
  const paScore = subscaleScores.PositiveAffect;
  const naScore = subscaleScores.NegativeAffect;
  
  if (paScore <= 20 && naScore >= 31) {
    // PA پایین و NA بالا
    recommendedTests.push('phq9'); // افسردگی
    recommendedTests.push('bdi2'); // جزئیات افسردگی
    recommendedTests.push('gad7', 'hads'); // اضطراب
    recommendedTests.push('isi', 'psqi'); // کیفیت خواب
  } else if (paScore >= 31 && naScore >= 21 && naScore <= 30) {
    // PA بالا و NA متوسط
    recommendedTests.push('eq'); // هوش هیجانی
    recommendedTests.push('rosenberg'); // Self-Esteem
    recommendedTests.push('growth-mindset'); // Growth Mindset
  } else if (naScore >= 41) {
    // NA خیلی بالا
    recommendedTests.push('stai'); // اضطراب حالت/صفت
    recommendedTests.push('bai'); // اضطراب بدنی
    recommendedTests.push('stress-management'); // مدیریت استرس
  }

  return {
    subscales: subscaleScores as { PositiveAffect: number; NegativeAffect: number },
    normalized,
    interpretations: interpretations as { PositiveAffect: string; NegativeAffect: string },
    cutoffs,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

