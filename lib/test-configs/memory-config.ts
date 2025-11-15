/**
 * Config استاندارد برای تست Memory (حافظه)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین ابزارهای سنجش حافظه ساخته شده:
 * - Wechsler Memory Scale (WMS)
 * - Working Memory Index
 * - Prospective Memory & Everyday Memory Scales
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Working Memory (حافظه فعال / توی لحظه): 3 سوال
 * - Short-Term Memory (حافظه کوتاه‌مدت روزمره): 3 سوال
 * - Long-Term Memory (حافظه بلندمدت / رویدادی): 3 سوال
 * - Prospective Memory (حافظه آینده‌نگر – یادآوری کارهای آینده): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * 4 سوال reverse (4, 5, 7, 10)
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس یا میانگین کل 12 آیتم
 * 
 * ⚠️ نکته مهم: اکثر سوال‌ها «مشکل» را می‌سنجند (فراموش می‌کنم / یادم می‌ره)،
 * بنابراین نمره بالاتر = مشکل بیشتر → باید با Reverse درستش کنیم،
 * تا نمره نهایی حافظه بهتر = نمره بالاتر باشد.
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const MEMORY_SUBSCALES = {
  Working_Memory: [1, 5, 9], // 3 سوال - سوال 5 reverse
  Short_Term_Memory: [2, 6, 10], // 3 سوال - سوال 10 reverse
  Long_Term_Memory: [3, 7, 11], // 3 سوال - سوال 7 reverse
  Prospective_Memory: [4, 8, 12], // 3 سوال - سوال 4 reverse
};

/**
 * لیست سوالات Reverse-Scored (4 سوال)
 * فرمول Reverse: 6 - score
 */
export const MEMORY_REVERSE_ITEMS = [4, 5, 7, 10];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface MemoryQuestionMapping {
  questionOrder: number;
  subscale: 'Working_Memory' | 'Short_Term_Memory' | 'Long_Term_Memory' | 'Prospective_Memory';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createMemoryQuestionMapping(): MemoryQuestionMapping[] {
  const mapping: MemoryQuestionMapping[] = [];
  const reverseSet = new Set(MEMORY_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(MEMORY_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Working_Memory' | 'Short_Term_Memory' | 'Long_Term_Memory' | 'Prospective_Memory',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Memory
 */
export const MEMORY_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کلی
  dimensions: ['Working_Memory', 'Short_Term_Memory', 'Long_Term_Memory', 'Prospective_Memory'],
  reverseItems: MEMORY_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Working_Memory',
      items: MEMORY_SUBSCALES.Working_Memory,
    },
    {
      name: 'Short_Term_Memory',
      items: MEMORY_SUBSCALES.Short_Term_Memory,
    },
    {
      name: 'Long_Term_Memory',
      items: MEMORY_SUBSCALES.Long_Term_Memory,
    },
    {
      name: 'Prospective_Memory',
      items: MEMORY_SUBSCALES.Prospective_Memory,
    },
  ],
  weighting: {
    'never': 1,      // هرگز
    'rarely': 2,     // خیلی کم
    'sometimes': 3,  // گاهی
    'often': 4,      // بیشتر اوقات
    'always': 5,     // همیشه
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد Memory
 */
export const MEMORY_CUTOFFS = {
  Working_Memory: [
    {
      min: 1.0,
      max: 2.4,
      label: 'ضعیف',
      severity: undefined as const,
      percentile: '1.0-2.4',
    },
    {
      min: 2.5,
      max: 3.4,
      label: 'متوسط',
      severity: undefined as const,
      percentile: '2.5-3.4',
    },
    {
      min: 3.5,
      max: 4.2,
      label: 'خوب',
      severity: undefined as const,
      percentile: '3.5-4.2',
    },
    {
      min: 4.3,
      max: 5.0,
      label: 'بسیار خوب',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 4 زیرمقیاس و نمره کلی
  Short_Term_Memory: [
    { min: 1.0, max: 2.4, label: 'ضعیف', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Long_Term_Memory: [
    { min: 1.0, max: 2.4, label: 'ضعیف', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Prospective_Memory: [
    { min: 1.0, max: 2.4, label: 'ضعیف', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  total: [
    { min: 1.0, max: 2.4, label: 'ضعیف', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const MEMORY_INTERPRETATIONS = {
  Working_Memory: {
    high: 'توانایی خوب در نگه داشتن چند چیز همزمان، حل مسائل پیچیده',
    low: 'سختی در نگه داشتن چند چیز همزمان، سختی در حل مسأله‌های پیچیده، بیشتر در تمرکز و حل مسأله خودش را نشان می‌دهد',
  },
  Short_Term_Memory: {
    high: 'یادآوری خوب چیزهای روزمره، به خاطر سپردن آنچه گفته شده',
    low: 'فراموش‌کاری‌های روزمره، یادش می‌رود کسی چی گفت، یا چی باید بیاره، "چی داشتم می‌گفتم؟" زیاد تکرار می‌شود',
  },
  Long_Term_Memory: {
    high: 'یادآوری خوب جزئیات رویدادها، تاریخ‌ها، قرارهای مهم',
    low: 'یادآوری ضعیف جزئیات رویدادها، تاریخ‌ها، قرارهای مهم، احساس «خاطره‌ها تار شده‌اند»',
  },
  Prospective_Memory: {
    high: 'یادآوری خوب کارهای آینده، قرارها، taskهای ساده',
    low: 'یادش می‌رود کاری را بعداً انجام دهد، قرارهای آینده، خوردن دارو، taskهای ساده',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getMemoryConfigJSON(): string {
  return JSON.stringify(MEMORY_CONFIG);
}

/**
 * محاسبه نمره Memory
 * Memory از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * نمره کلی: mean(4 subscales) یا mean(12 items)
 * Range: 1-5
 */
export function calculateMemoryScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Working_Memory: number;
    Short_Term_Memory: number;
    Long_Term_Memory: number;
    Prospective_Memory: number;
  };
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Working_Memory: [],
    Short_Term_Memory: [],
    Long_Term_Memory: [],
    Prospective_Memory: [],
  };
  const reverseSet = new Set(MEMORY_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Working_Memory' | 'Short_Term_Memory' | 'Long_Term_Memory' | 'Prospective_Memory' | null = null;
    if (MEMORY_SUBSCALES.Working_Memory.includes(questionOrder)) {
      subscale = 'Working_Memory';
    } else if (MEMORY_SUBSCALES.Short_Term_Memory.includes(questionOrder)) {
      subscale = 'Short_Term_Memory';
    } else if (MEMORY_SUBSCALES.Long_Term_Memory.includes(questionOrder)) {
      subscale = 'Long_Term_Memory';
    } else if (MEMORY_SUBSCALES.Prospective_Memory.includes(questionOrder)) {
      subscale = 'Prospective_Memory';
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

  // محاسبه نمره کلی (میانگین 4 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 4;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Working_Memory >= 3.5) {
    interpretations.push(`حافظه فعال بالا: ${MEMORY_INTERPRETATIONS.Working_Memory.high}`);
  } else if (subscaleMeans.Working_Memory <= 2.4) {
    interpretations.push(`حافظه فعال پایین: ${MEMORY_INTERPRETATIONS.Working_Memory.low}`);
  }
  
  if (subscaleMeans.Short_Term_Memory >= 3.5) {
    interpretations.push(`حافظه کوتاه‌مدت بالا: ${MEMORY_INTERPRETATIONS.Short_Term_Memory.high}`);
  } else if (subscaleMeans.Short_Term_Memory <= 2.4) {
    interpretations.push(`حافظه کوتاه‌مدت پایین: ${MEMORY_INTERPRETATIONS.Short_Term_Memory.low}`);
  }
  
  if (subscaleMeans.Long_Term_Memory >= 3.5) {
    interpretations.push(`حافظه بلندمدت بالا: ${MEMORY_INTERPRETATIONS.Long_Term_Memory.high}`);
  } else if (subscaleMeans.Long_Term_Memory <= 2.4) {
    interpretations.push(`حافظه بلندمدت پایین: ${MEMORY_INTERPRETATIONS.Long_Term_Memory.low}`);
  }
  
  if (subscaleMeans.Prospective_Memory >= 3.5) {
    interpretations.push(`حافظه آینده‌نگر بالا: ${MEMORY_INTERPRETATIONS.Prospective_Memory.high}`);
  } else if (subscaleMeans.Prospective_Memory <= 2.4) {
    interpretations.push(`حافظه آینده‌نگر پایین: ${MEMORY_INTERPRETATIONS.Prospective_Memory.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'پروفایل حافظه متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    // اگر نمره کلی پایین باشد
    recommendedTests.push('focus'); // Focus & Attention Test
    recommendedTests.push('maas'); // MAAS (ذهن‌آگاهی)
    recommendedTests.push('psqi'); // PSQI / ISI (خواب)
    recommendedTests.push('gad7'); // Stress / Anxiety (GAD-7, PHQ-9)
    recommendedTests.push('phq9'); // چون استرس، اضطراب و خواب بد → مستقیماً روی حافظه می‌زنند
  }
  
  if (subscaleMeans.Working_Memory <= 2.4) {
    recommendedTests.push('cognitive-iq'); // IQ (به‌خصوص بخش Fluid Reasoning)
    recommendedTests.push('problem-solving'); // Problem Solving
  }
  
  if (subscaleMeans.Prospective_Memory <= 2.4) {
    recommendedTests.push('time-management'); // Time Management
    recommendedTests.push('decision-making'); // Executive Function / Decision-Making
  }

  return {
    subscales: subscaleMeans as {
      Working_Memory: number;
      Short_Term_Memory: number;
      Long_Term_Memory: number;
      Prospective_Memory: number;
    },
    totalScore: totalScoreRounded,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

