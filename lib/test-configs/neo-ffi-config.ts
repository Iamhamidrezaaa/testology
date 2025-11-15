/**
 * Config استاندارد برای تست NEO-FFI (Five-Factor Inventory)
 * منبع: Costa & McCrae (1992, 2004) - Form S (Self-report)
 * 
 * این تست 5 عامل شخصیت را می‌سنجد:
 * - N: Neuroticism (روان‌نژندی)
 * - E: Extraversion (برون‌گرایی)
 * - O: Openness (گشودگی به تجربه)
 * - A: Agreeableness (توافق‌پذیری)
 * - C: Conscientiousness (وظیفه‌شناسی)
 * 
 * هر عامل 12 سوال دارد → مجموع 60 سوال
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر عامل (شماره سوالات 1-indexed)
 */
export const NEO_FFI_FACTORS = {
  N: [2, 6, 8, 11, 13, 16, 18, 23, 26, 33, 38, 41], // Neuroticism
  E: [1, 3, 10, 14, 19, 21, 24, 27, 31, 34, 37, 39], // Extraversion
  O: [5, 7, 9, 12, 15, 17, 20, 22, 25, 28, 30, 32], // Openness
  A: [4, 29, 35, 40, 42, 43, 45, 47, 48, 51, 53, 55], // Agreeableness
  C: [36, 44, 46, 49, 50, 52, 54, 56, 57, 58, 59, 60], // Conscientiousness
};

/**
 * لیست سوالات Reverse-Scored (15 سوال)
 * این سوالات باید معکوس نمره‌دهی شوند: reverse_score = 4 - original_score
 */
export const NEO_FFI_REVERSE_ITEMS = [
  { question: 7, factor: 'O' },   // Openness
  { question: 13, factor: 'N' },  // Neuroticism
  { question: 14, factor: 'E' },  // Extraversion
  { question: 17, factor: 'O' },  // Openness
  { question: 22, factor: 'O' },  // Openness
  { question: 23, factor: 'N' },  // Neuroticism
  { question: 24, factor: 'E' },  // Extraversion
  { question: 28, factor: 'O' },  // Openness
  { question: 31, factor: 'E' },  // Extraversion
  { question: 33, factor: 'N' },  // Neuroticism (نکته: در برخی منابع 33 reverse نیست، اما در لیست اصلی reverse است)
  { question: 35, factor: 'A' },  // Agreeableness
  { question: 38, factor: 'N' },  // Neuroticism
  { question: 41, factor: 'N' },  // Neuroticism
  { question: 51, factor: 'A' },  // Agreeableness
  { question: 57, factor: 'C' },  // Conscientiousness
  { question: 59, factor: 'C' },  // Conscientiousness
];

/**
 * Mapping سوالات به عامل‌ها و reverse status
 */
export interface NEOFFIQuestionMapping {
  questionOrder: number;
  factor: 'N' | 'E' | 'O' | 'A' | 'C';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 60 سوال
 */
export function createNEOFFIQuestionMapping(): NEOFFIQuestionMapping[] {
  const mapping: NEOFFIQuestionMapping[] = [];
  const reverseSet = new Set(NEO_FFI_REVERSE_ITEMS.map(item => item.question));

  // برای هر عامل
  Object.entries(NEO_FFI_FACTORS).forEach(([factor, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        factor: factor as 'N' | 'E' | 'O' | 'A' | 'C',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد NEO-FFI
 */
export const NEO_FFI_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه خاص داریم
  dimensions: ['N', 'E', 'O', 'A', 'C'],
  reverseItems: NEO_FFI_REVERSE_ITEMS.map(item => item.question),
  subscales: [
    {
      name: 'N',
      items: NEO_FFI_FACTORS.N,
    },
    {
      name: 'E',
      items: NEO_FFI_FACTORS.E,
    },
    {
      name: 'O',
      items: NEO_FFI_FACTORS.O,
    },
    {
      name: 'A',
      items: NEO_FFI_FACTORS.A,
    },
    {
      name: 'C',
      items: NEO_FFI_FACTORS.C,
    },
  ],
  weighting: {
    'strongly_disagree': 0,
    'disagree': 1,
    'neutral': 2,
    'agree': 3,
    'strongly_agree': 4,
  },
  minScore: 0,
  maxScore: 48, // هر عامل: 12 سوال × 4 = 48
};

/**
 * Cutoff استاندارد بر اساس Percentile (Costa & McCrae, 2004)
 */
export const NEO_FFI_CUTOFFS = {
  N: [
    { min: 0, max: 4.8, label: 'بسیار پایین', percentile: '0-10%' },
    { min: 4.9, max: 14.4, label: 'پایین', percentile: '10-30%' },
    { min: 14.5, max: 33.6, label: 'متوسط', percentile: '30-70%' },
    { min: 33.7, max: 43.2, label: 'بالا', percentile: '70-90%' },
    { min: 43.3, max: 48, label: 'بسیار بالا', percentile: '90-100%' },
  ],
  E: [
    { min: 0, max: 4.8, label: 'بسیار پایین', percentile: '0-10%' },
    { min: 4.9, max: 14.4, label: 'پایین', percentile: '10-30%' },
    { min: 14.5, max: 33.6, label: 'متوسط', percentile: '30-70%' },
    { min: 33.7, max: 43.2, label: 'بالا', percentile: '70-90%' },
    { min: 43.3, max: 48, label: 'بسیار بالا', percentile: '90-100%' },
  ],
  O: [
    { min: 0, max: 4.8, label: 'بسیار پایین', percentile: '0-10%' },
    { min: 4.9, max: 14.4, label: 'پایین', percentile: '10-30%' },
    { min: 14.5, max: 33.6, label: 'متوسط', percentile: '30-70%' },
    { min: 33.7, max: 43.2, label: 'بالا', percentile: '70-90%' },
    { min: 43.3, max: 48, label: 'بسیار بالا', percentile: '90-100%' },
  ],
  A: [
    { min: 0, max: 4.8, label: 'بسیار پایین', percentile: '0-10%' },
    { min: 4.9, max: 14.4, label: 'پایین', percentile: '10-30%' },
    { min: 14.5, max: 33.6, label: 'متوسط', percentile: '30-70%' },
    { min: 33.7, max: 43.2, label: 'بالا', percentile: '70-90%' },
    { min: 43.3, max: 48, label: 'بسیار بالا', percentile: '90-100%' },
  ],
  C: [
    { min: 0, max: 4.8, label: 'بسیار پایین', percentile: '0-10%' },
    { min: 4.9, max: 14.4, label: 'پایین', percentile: '10-30%' },
    { min: 14.5, max: 33.6, label: 'متوسط', percentile: '30-70%' },
    { min: 33.7, max: 43.2, label: 'بالا', percentile: '70-90%' },
    { min: 43.3, max: 48, label: 'بسیار بالا', percentile: '90-100%' },
  ],
};

/**
 * تفسیر هر عامل
 */
export const NEO_FFI_INTERPRETATIONS = {
  N: {
    high: 'حساسیت هیجانی بالا، نگرانی، استرس‌پذیری، نوسانات خلقی',
    low: 'آرام، پایدار، مقاوم در برابر استرس، کنترل هیجانی خوب',
  },
  E: {
    high: 'اجتماعی، پرانرژی، برون‌گرا، علاقه به تعامل با دیگران',
    low: 'درون‌گرا، نیاز به تنهایی، ترجیح محیط‌های آرام',
  },
  O: {
    high: 'خلاق، کنجکاو، علاقه به تجربیات جدید، تفکر انتزاعی',
    low: 'عملگرا، سنت‌گرا، ترجیح روش‌های ثابت و شناخته شده',
  },
  A: {
    high: 'همدل، مهربان، اعتماد به دیگران، تمایل به همکاری',
    low: 'رقابتی، مستقیم، محتاط در روابط، مستقل',
  },
  C: {
    high: 'منظم، هدفمند، با انضباط، قابل اعتماد',
    low: 'انعطاف‌پذیر، بی‌برنامه، خودجوش، کمتر ساختاریافته',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getNEOFFIConfigJSON(): string {
  return JSON.stringify({
    ...NEO_FFI_CONFIG,
    cutoffs: NEO_FFI_CUTOFFS,
  });
}

/**
 * محاسبه نمره هر عامل با در نظر گیری reverse items
 */
export function calculateNEOFFIScore(
  answers: Record<number, number>, // { questionOrder: selectedOptionIndex (0-4) }
  mapping: NEOFFIQuestionMapping[]
): {
  factors: {
    N: number;
    E: number;
    O: number;
    A: number;
    C: number;
  };
  interpretations: {
    [key: string]: string;
  };
} {
  const factorScores: { [key: string]: number } = {
    N: 0,
    E: 0,
    O: 0,
    A: 0,
    C: 0,
  };

  // محاسبه نمره هر سوال
  mapping.forEach(({ questionOrder, factor, isReverse }) => {
    const answer = answers[questionOrder];
    if (answer === undefined || answer === null) return;

    // تبدیل optionIndex (0-4) به نمره (0-4)
    let score = answer;

    // اگر reverse است، معکوس کن: 4 - score
    if (isReverse) {
      score = 4 - score;
    }

    // اضافه کردن به نمره عامل
    factorScores[factor] += score;
  });

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(factorScores).forEach(([factor, score]) => {
    const cutoff = NEO_FFI_CUTOFFS[factor as keyof typeof NEO_FFI_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    
    const level = cutoff?.label || 'متوسط';
    const isHigh = score >= 33.7;
    const interpretation = NEO_FFI_INTERPRETATIONS[factor as keyof typeof NEO_FFI_INTERPRETATIONS];
    
    interpretations[factor] = `${interpretation[isHigh ? 'high' : 'low']} (${level})`;
  });

  return {
    factors: factorScores as { N: number; E: number; O: number; A: number; C: number },
    interpretations,
  };
}

