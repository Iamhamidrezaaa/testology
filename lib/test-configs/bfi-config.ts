/**
 * Config استاندارد برای تست BFI (Big Five Inventory)
 * منبع: John, O. P., & Srivastava, S. (1999)
 * "The Big Five trait taxonomy: History, measurement, and theoretical perspectives"
 * 
 * این تست 5 عامل شخصیت را می‌سنجد:
 * - E: Extraversion (برون‌گرایی)
 * - A: Agreeableness (توافق‌پذیری)
 * - C: Conscientiousness (وظیفه‌شناسی)
 * - N: Neuroticism (روان‌نژندی)
 * - O: Openness (گشودگی به تجربه)
 * 
 * تعداد سوالات: 44
 * سوالات Reverse: 12 سوال (نسخه 1999)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر عامل (شماره سوالات 1-indexed)
 */
export const BFI_FACTORS = {
  E: [1, 6, 11, 16, 21, 26, 31, 36], // Extraversion (8 سوال)
  A: [2, 7, 12, 17, 22, 27, 32, 37, 42], // Agreeableness (9 سوال)
  C: [3, 8, 13, 18, 23, 28, 33, 38, 43], // Conscientiousness (9 سوال)
  N: [4, 9, 14, 19, 24, 29, 34, 39], // Neuroticism (8 سوال)
  O: [5, 10, 15, 20, 25, 30, 35, 40, 41, 44], // Openness (10 سوال)
};

/**
 * لیست سوالات Reverse-Scored (12 سوال - نسخه 1999)
 * این سوالات باید معکوس نمره‌دهی شوند: reverse_score = 4 - original_score
 */
export const BFI_REVERSE_ITEMS = [
  { question: 11, factor: 'E' },  // Extraversion
  { question: 26, factor: 'E' },  // Extraversion
  { question: 7, factor: 'A' },   // Agreeableness
  { question: 37, factor: 'A' },   // Agreeableness
  { question: 8, factor: 'C' },    // Conscientiousness
  { question: 18, factor: 'C' },   // Conscientiousness
  { question: 43, factor: 'C' },   // Conscientiousness
  { question: 14, factor: 'N' },   // Neuroticism
  { question: 34, factor: 'N' },   // Neuroticism
  { question: 41, factor: 'O' },   // Openness
  { question: 44, factor: 'O' },   // Openness
];

/**
 * Mapping سوالات به عامل‌ها و reverse status
 */
export interface BFIQuestionMapping {
  questionOrder: number;
  factor: 'E' | 'A' | 'C' | 'N' | 'O';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 44 سوال
 */
export function createBFIQuestionMapping(): BFIQuestionMapping[] {
  const mapping: BFIQuestionMapping[] = [];
  const reverseSet = new Set(BFI_REVERSE_ITEMS.map(item => item.question));

  // برای هر عامل
  Object.entries(BFI_FACTORS).forEach(([factor, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        factor: factor as 'E' | 'A' | 'C' | 'N' | 'O',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد BFI
 */
export const BFI_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه mean داریم
  dimensions: ['E', 'A', 'C', 'N', 'O'],
  reverseItems: BFI_REVERSE_ITEMS.map(item => item.question),
  subscales: [
    {
      name: 'E',
      items: BFI_FACTORS.E,
    },
    {
      name: 'A',
      items: BFI_FACTORS.A,
    },
    {
      name: 'C',
      items: BFI_FACTORS.C,
    },
    {
      name: 'N',
      items: BFI_FACTORS.N,
    },
    {
      name: 'O',
      items: BFI_FACTORS.O,
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
  maxScore: 4, // هر عامل: میانگین 0-4
};

/**
 * Cutoff استاندارد بر اساس Percentile (John & Srivastava, 1999)
 */
export const BFI_CUTOFFS = {
  E: [
    { min: 0, max: 0.8, label: 'خیلی پایین', percentile: '0-20%' },
    { min: 0.81, max: 1.6, label: 'پایین', percentile: '20-40%' },
    { min: 1.61, max: 2.4, label: 'متوسط', percentile: '40-60%' },
    { min: 2.41, max: 3.2, label: 'بالا', percentile: '60-80%' },
    { min: 3.21, max: 4, label: 'خیلی بالا', percentile: '80-100%' },
  ],
  A: [
    { min: 0, max: 0.8, label: 'خیلی پایین', percentile: '0-20%' },
    { min: 0.81, max: 1.6, label: 'پایین', percentile: '20-40%' },
    { min: 1.61, max: 2.4, label: 'متوسط', percentile: '40-60%' },
    { min: 2.41, max: 3.2, label: 'بالا', percentile: '60-80%' },
    { min: 3.21, max: 4, label: 'خیلی بالا', percentile: '80-100%' },
  ],
  C: [
    { min: 0, max: 0.8, label: 'خیلی پایین', percentile: '0-20%' },
    { min: 0.81, max: 1.6, label: 'پایین', percentile: '20-40%' },
    { min: 1.61, max: 2.4, label: 'متوسط', percentile: '40-60%' },
    { min: 2.41, max: 3.2, label: 'بالا', percentile: '60-80%' },
    { min: 3.21, max: 4, label: 'خیلی بالا', percentile: '80-100%' },
  ],
  N: [
    { min: 0, max: 0.8, label: 'خیلی پایین', percentile: '0-20%' },
    { min: 0.81, max: 1.6, label: 'پایین', percentile: '20-40%' },
    { min: 1.61, max: 2.4, label: 'متوسط', percentile: '40-60%' },
    { min: 2.41, max: 3.2, label: 'بالا', percentile: '60-80%' },
    { min: 3.21, max: 4, label: 'خیلی بالا', percentile: '80-100%' },
  ],
  O: [
    { min: 0, max: 0.8, label: 'خیلی پایین', percentile: '0-20%' },
    { min: 0.81, max: 1.6, label: 'پایین', percentile: '20-40%' },
    { min: 1.61, max: 2.4, label: 'متوسط', percentile: '40-60%' },
    { min: 2.41, max: 3.2, label: 'بالا', percentile: '60-80%' },
    { min: 3.21, max: 4, label: 'خیلی بالا', percentile: '80-100%' },
  ],
};

/**
 * تفسیر هر عامل
 */
export const BFI_INTERPRETATIONS = {
  E: {
    high: 'اجتماعی، پرانرژی، علاقه به تعامل با دیگران',
    low: 'آرام، نیازمند تنهایی، ترجیح محیط‌های آرام',
  },
  A: {
    high: 'همدل، مودب، اعتماد به دیگران، تمایل به همکاری',
    low: 'رقابتی، مستقیم، محتاط در روابط، مستقل',
  },
  C: {
    high: 'سازمان‌یافته، وظیفه‌شناس، منظم، قابل اعتماد',
    low: 'بی‌برنامه، انعطاف‌پذیر، خودجوش، کمتر ساختاریافته',
  },
  N: {
    high: 'حساس، مضطرب، نوسانات خلقی، استرس‌پذیر',
    low: 'آرام، مقاوم در برابر استرس، پایدار، کنترل هیجانی خوب',
  },
  O: {
    high: 'خلاق، کنجکاو، علاقه به تجربیات جدید، تفکر انتزاعی',
    low: 'عمل‌گرا، ترجیح‌دهنده ثبات، سنت‌گرا، روش‌های ثابت',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getBFIConfigJSON(): string {
  return JSON.stringify({
    ...BFI_CONFIG,
    cutoffs: BFI_CUTOFFS,
  });
}

/**
 * محاسبه نمره هر عامل با در نظر گیری reverse items و میانگین‌گیری
 * BFI از میانگین استفاده می‌کند نه جمع
 */
export function calculateBFIScore(
  answers: Record<number, number>, // { questionOrder: selectedOptionIndex (0-4) }
  mapping: BFIQuestionMapping[]
): {
  factors: {
    E: number;
    A: number;
    C: number;
    N: number;
    O: number;
  };
  factorsRaw: {
    E: number;
    A: number;
    C: number;
    N: number;
    O: number;
  };
  interpretations: {
    [key: string]: string;
  };
  percentiles: {
    [key: string]: number; // 0-100
  };
} {
  const factorScores: { [key: string]: number[] } = {
    E: [],
    A: [],
    C: [],
    N: [],
    O: [],
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

    // اضافه کردن به لیست نمرات عامل
    factorScores[factor].push(score);
  });

  // محاسبه میانگین برای هر عامل
  const factorMeans: { [key: string]: number } = {};
  const factorRaws: { [key: string]: number } = {};
  
  Object.entries(factorScores).forEach(([factor, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    factorMeans[factor] = Math.round(mean * 100) / 100; // 2 رقم اعشار
    factorRaws[factor] = sum; // جمع خام برای نمایش
  });

  // تبدیل به percentile (0-100)
  const percentiles: { [key: string]: number } = {};
  Object.entries(factorMeans).forEach(([factor, mean]) => {
    percentiles[factor] = Math.round((mean / 4) * 100);
  });

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(factorMeans).forEach(([factor, score]) => {
    const cutoff = BFI_CUTOFFS[factor as keyof typeof BFI_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    
    const level = cutoff?.label || 'متوسط';
    const isHigh = score >= 2.41;
    const interpretation = BFI_INTERPRETATIONS[factor as keyof typeof BFI_INTERPRETATIONS];
    
    interpretations[factor] = `${interpretation[isHigh ? 'high' : 'low']} (${level})`;
  });

  return {
    factors: factorMeans as { E: number; A: number; C: number; N: number; O: number },
    factorsRaw: factorRaws as { E: number; A: number; C: number; N: number; O: number },
    interpretations,
    percentiles,
  };
}

