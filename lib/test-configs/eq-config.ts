/**
 * Config استاندارد برای تست EQ (Emotional Intelligence)
 * منبع: بر پایه مدل Bar-On EQ-i (EQ-i Short Form - 30 آیتم)
 * 
 * این تست هوش هیجانی را می‌سنجد
 * 
 * تعداد سوالات: 30
 * 5 زیرمقیاس اصلی:
 * - Intrapersonal (درون‌فردی): 6 سوال
 * - Interpersonal (میان‌فردی): 6 سوال
 * - Stress Management (مدیریت استرس): 6 سوال
 * - Adaptability (انعطاف‌پذیری): 6 سوال
 * - General Mood (خلق عمومی): 6 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5)
 * 8 آیتم Reverse
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const EQ_SUBSCALES = {
  Intrapersonal: [1, 6, 11, 16, 21, 26],      // درون‌فردی
  Interpersonal: [2, 7, 12, 17, 22, 27],      // میان‌فردی
  StressManagement: [3, 8, 13, 18, 23, 28],   // مدیریت استرس
  Adaptability: [4, 9, 14, 19, 24, 29],       // انعطاف‌پذیری
  GeneralMood: [5, 10, 15, 20, 25, 30],        // خلق عمومی
};

/**
 * لیست سوالات Reverse-Scored (8 سوال)
 * فرمول Reverse: reverse_score = 6 - original_score
 */
export const EQ_REVERSE_ITEMS = [
  { question: 12, subscale: 'Interpersonal' },
  { question: 22, subscale: 'Interpersonal' },
  { question: 13, subscale: 'StressManagement' },
  { question: 23, subscale: 'StressManagement' },
  { question: 9, subscale: 'Adaptability' },
  { question: 24, subscale: 'Adaptability' },
  { question: 10, subscale: 'GeneralMood' },
  { question: 20, subscale: 'GeneralMood' },
];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface EQQuestionMapping {
  questionOrder: number;
  subscale: 'Intrapersonal' | 'Interpersonal' | 'StressManagement' | 'Adaptability' | 'GeneralMood';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 30 سوال
 */
export function createEQQuestionMapping(): EQQuestionMapping[] {
  const mapping: EQQuestionMapping[] = [];
  const reverseSet = new Set(EQ_REVERSE_ITEMS.map(item => item.question));

  // برای هر زیرمقیاس
  Object.entries(EQ_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Intrapersonal' | 'Interpersonal' | 'StressManagement' | 'Adaptability' | 'GeneralMood',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد EQ
 */
export const EQ_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه mean داریم
  dimensions: ['Intrapersonal', 'Interpersonal', 'StressManagement', 'Adaptability', 'GeneralMood'],
  reverseItems: EQ_REVERSE_ITEMS.map(item => item.question),
  subscales: [
    {
      name: 'Intrapersonal',
      items: EQ_SUBSCALES.Intrapersonal,
    },
    {
      name: 'Interpersonal',
      items: EQ_SUBSCALES.Interpersonal,
    },
    {
      name: 'StressManagement',
      items: EQ_SUBSCALES.StressManagement,
    },
    {
      name: 'Adaptability',
      items: EQ_SUBSCALES.Adaptability,
    },
    {
      name: 'GeneralMood',
      items: EQ_SUBSCALES.GeneralMood,
    },
  ],
  weighting: {
    'option_1': 1,
    'option_2': 2,
    'option_3': 3,
    'option_4': 4,
    'option_5': 5,
  },
  minScore: 1,
  maxScore: 5, // هر زیرمقیاس: میانگین 1-5
};

/**
 * Cutoff استاندارد EQ (بر اساس داده‌های EQ-i جهانی)
 */
export const EQ_CUTOFFS = {
  Intrapersonal: [
    { min: 1.0, max: 2.4, label: 'پایین', percentile: '0-28%' },
    { min: 2.5, max: 3.4, label: 'متوسط', percentile: '28-48%' },
    { min: 3.5, max: 4.2, label: 'خوب', percentile: '48-64%' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', percentile: '64-100%' },
  ],
  Interpersonal: [
    { min: 1.0, max: 2.4, label: 'پایین', percentile: '0-28%' },
    { min: 2.5, max: 3.4, label: 'متوسط', percentile: '28-48%' },
    { min: 3.5, max: 4.2, label: 'خوب', percentile: '48-64%' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', percentile: '64-100%' },
  ],
  StressManagement: [
    { min: 1.0, max: 2.4, label: 'پایین', percentile: '0-28%' },
    { min: 2.5, max: 3.4, label: 'متوسط', percentile: '28-48%' },
    { min: 3.5, max: 4.2, label: 'خوب', percentile: '48-64%' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', percentile: '64-100%' },
  ],
  Adaptability: [
    { min: 1.0, max: 2.4, label: 'پایین', percentile: '0-28%' },
    { min: 2.5, max: 3.4, label: 'متوسط', percentile: '28-48%' },
    { min: 3.5, max: 4.2, label: 'خوب', percentile: '48-64%' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', percentile: '64-100%' },
  ],
  GeneralMood: [
    { min: 1.0, max: 2.4, label: 'پایین', percentile: '0-28%' },
    { min: 2.5, max: 3.4, label: 'متوسط', percentile: '28-48%' },
    { min: 3.5, max: 4.2, label: 'خوب', percentile: '48-64%' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', percentile: '64-100%' },
  ],
  Overall: [
    { min: 1.0, max: 2.4, label: 'پایین', percentile: '0-28%' },
    { min: 2.5, max: 3.4, label: 'متوسط', percentile: '28-48%' },
    { min: 3.5, max: 4.2, label: 'خوب', percentile: '48-64%' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', percentile: '64-100%' },
  ],
};

/**
 * تفسیر هر زیرمقیاس
 */
export const EQ_INTERPRETATIONS = {
  Intrapersonal: {
    high: 'خودشناسی، مدیریت احساسات، اعتمادبه‌نفس، خودپذیری',
    low: 'سردرگمی هیجانی، سختی در ابراز احساسات، عدم خودآگاهی',
  },
  Interpersonal: {
    high: 'همدلی، روابط اجتماعی قوی، مسئولیت اجتماعی، ارتباط موثر',
    low: 'فاصله‌گیری، سختی در ارتباط‌گیری، کمبود همدلی',
  },
  StressManagement: {
    high: 'کنترل تکانه، مقاومت در برابر فشار، مدیریت استرس موثر',
    low: 'واکنش شدید به استرس، انفجار هیجانی، عدم کنترل تکانه',
  },
  Adaptability: {
    high: 'حل مسئله، تفکر انعطاف‌پذیر، سازگاری با تغییرات، واقع‌گرایی',
    low: 'گیر کردن در یک چارچوب ذهنی، مقاومت در برابر تغییر، عدم انعطاف',
  },
  GeneralMood: {
    high: 'خوش‌بینی، انگیزه، شادی، نگرش مثبت',
    low: 'بدبینی، ناامیدی، خلق پایین، نگرش منفی',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getEQConfigJSON(): string {
  return JSON.stringify({
    ...EQ_CONFIG,
    cutoffs: EQ_CUTOFFS,
  });
}

/**
 * محاسبه نمره EQ
 * EQ از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(6 items after reverse)
 * Range: 1-5
 */
export function calculateEQScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Intrapersonal: number;
    Interpersonal: number;
    StressManagement: number;
    Adaptability: number;
    GeneralMood: number;
  };
  overall: number; // میانگین کل 5 زیرمقیاس
  interpretations: {
    [key: string]: string;
  };
  percentiles: {
    [key: string]: number; // 0-100
  };
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Intrapersonal: [],
    Interpersonal: [],
    StressManagement: [],
    Adaptability: [],
    GeneralMood: [],
  };
  const reverseSet = new Set(EQ_REVERSE_ITEMS.map(item => item.question));

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    // پیدا کردن زیرمقیاس
    let subscale: keyof typeof subscaleScores | null = null;
    for (const [key, questions] of Object.entries(EQ_SUBSCALES)) {
      if (questions.includes(questionOrder)) {
        subscale = key as keyof typeof subscaleScores;
        break;
      }
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به لیست نمرات زیرمقیاس
    subscaleScores[subscale].push(score);
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین همه زیرمقیاس‌ها)
  const overall = Object.values(subscaleMeans).reduce((sum, mean) => sum + mean, 0) / 5;
  const overallRounded = Math.round(overall * 100) / 100;

  // تبدیل به percentile (0-100)
  const percentiles: { [key: string]: number } = {};
  Object.entries(subscaleMeans).forEach(([subscale, mean]) => {
    percentiles[subscale] = Math.round(((mean - 1) / 4) * 100); // تبدیل 1-5 به 0-100
  });
  percentiles['Overall'] = Math.round(((overallRounded - 1) / 4) * 100);

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(subscaleMeans).forEach(([subscale, score]) => {
    const cutoff = EQ_CUTOFFS[subscale as keyof typeof EQ_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    
    const level = cutoff?.label || 'متوسط';
    const isHigh = score >= 3.5;
    const interpretation = EQ_INTERPRETATIONS[subscale as keyof typeof EQ_INTERPRETATIONS];
    
    interpretations[subscale] = `${interpretation[isHigh ? 'high' : 'low']} (${level})`;
  });

  // تفسیر نمره کلی
  const overallCutoff = EQ_CUTOFFS.Overall.find(
    c => overallRounded >= c.min && overallRounded <= c.max
  );
  if (overallCutoff) {
    interpretations['Overall'] = `نمره کلی هوش هیجانی: ${overallCutoff.label} (${overallCutoff.percentile})`;
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (subscaleMeans.Interpersonal < 2.5) {
    recommendedTests.push('attachment'); // دلبستگی
    recommendedTests.push('communication-skills'); // ارتباطات
    recommendedTests.push('teamwork'); // کار تیمی
  }
  if (subscaleMeans.StressManagement < 2.5) {
    recommendedTests.push('pss'); // استرس ادراک‌شده
    recommendedTests.push('bai'); // اضطراب بدنی
    recommendedTests.push('gad7'); // اضطراب تعمیم‌یافته
  }
  if (subscaleMeans.GeneralMood < 2.5) {
    recommendedTests.push('phq9'); // افسردگی
    recommendedTests.push('bdi2'); // افسردگی جزئیات
    recommendedTests.push('panas'); // عاطفه مثبت/منفی
  }

  return {
    subscales: subscaleMeans as {
      Intrapersonal: number;
      Interpersonal: number;
      StressManagement: number;
      Adaptability: number;
      GeneralMood: number;
    },
    overall: overallRounded,
    interpretations,
    percentiles,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

