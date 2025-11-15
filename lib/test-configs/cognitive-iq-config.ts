/**
 * Config استاندارد برای تست Cognitive Intelligence / IQ (نسخه کوتاه Testology)
 * 
 * ⚠️ نکته مهم: هیچ تست IQ آنلاین «IQ واقعی» نمی‌دهد — ولی می‌تواند Cognitive Ability را
 * با دقت خوبی بسنجد.
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین تست‌های هوش ساخته شده:
 * - WAIS-IV (Wechsler Adult Intelligence Scale)
 * - Raven's Progressive Matrices
 * - Cattell Culture Fair Intelligence Test (CFIT)
 * 
 * تعداد سوالات: 12
 * 3 زیرمقیاس (هر کدام 4 سوال):
 * - Fluid Reasoning (استدلال سیال / حل الگوها): 4 سوال
 * - Verbal Reasoning (استدلال کلامی): 4 سوال
 * - Quantitative Reasoning (استدلال عددی): 4 سوال
 * 
 * ⚠️ این تست با بقیه تست‌ها متفاوت است:
 * - از مقیاس Likert (1-5) استفاده نمی‌کند
 * - هر سوال فقط 1 نمره دارد (درست = 1، غلط = 0)
 * - بدون reverse (چون همه سوال‌ها درست/غلط یا انتخاب بهترین پاسخ‌اند)
 * - نمره کل: مجموع 12 سوال (0-12)
 * - Cutoff بر اساس نمره کل: 0-3 پایین، 4-6 متوسط، 7-9 خوب، 10-12 بسیار بالا
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const COGNITIVE_IQ_SUBSCALES = {
  Fluid_Reasoning: [1, 4, 7, 10], // 4 سوال - الهام‌گرفته از Raven's Matrices
  Verbal_Reasoning: [2, 5, 8, 11], // 4 سوال - شباهت‌ها، طبقه‌بندی، واژه‌های انتزاعی
  Quantitative_Reasoning: [3, 6, 9, 12], // 4 سوال - رابطه‌های عددی، توالی‌ها، مسئله‌های کوتاه
};

/**
 * لیست سوالات Reverse-Scored
 * ⚠️ این تست هیچ سوال reverse ندارد
 */
export const COGNITIVE_IQ_REVERSE_ITEMS: number[] = [];

/**
 * Mapping سوالات به زیرمقیاس‌ها
 */
export interface CognitiveIQQuestionMapping {
  questionOrder: number;
  subscale: 'Fluid_Reasoning' | 'Verbal_Reasoning' | 'Quantitative_Reasoning';
  isReverse: boolean; // همیشه false
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createCognitiveIQQuestionMapping(): CognitiveIQQuestionMapping[] {
  const mapping: CognitiveIQQuestionMapping[] = [];

  // برای هر زیرمقیاس
  Object.entries(COGNITIVE_IQ_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Fluid_Reasoning' | 'Verbal_Reasoning' | 'Quantitative_Reasoning',
        isReverse: false, // هیچ سوال reverse ندارد
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Cognitive IQ
 * ⚠️ این تست از نوع خاصی است که با بقیه تست‌ها متفاوت است
 */
export const COGNITIVE_IQ_CONFIG: ScoringConfig = {
  type: 'sum', // مجموع برای هر زیرمقیاس و نمره کل
  dimensions: ['Fluid_Reasoning', 'Verbal_Reasoning', 'Quantitative_Reasoning'],
  reverseItems: [], // هیچ سوال reverse ندارد
  subscales: [
    {
      name: 'Fluid_Reasoning',
      items: COGNITIVE_IQ_SUBSCALES.Fluid_Reasoning,
    },
    {
      name: 'Verbal_Reasoning',
      items: COGNITIVE_IQ_SUBSCALES.Verbal_Reasoning,
    },
    {
      name: 'Quantitative_Reasoning',
      items: COGNITIVE_IQ_SUBSCALES.Quantitative_Reasoning,
    },
  ],
  // ⚠️ این تست از weighting استفاده نمی‌کند چون هر سوال فقط 0 یا 1 است
  weighting: {
    'correct': 1,    // پاسخ درست = 1
    'incorrect': 0,  // پاسخ غلط = 0
  },
  minScore: 0,
  maxScore: 12, // 12 سوال × 1 نمره = 12
};

/**
 * Cutoff استاندارد Cognitive IQ
 * این cutoff بر اساس نمره کل (0-12) است
 */
export const COGNITIVE_IQ_CUTOFFS = {
  total: [
    {
      min: 0,
      max: 3,
      label: 'پایین',
      severity: undefined as const,
      percentile: '0-3',
    },
    {
      min: 4,
      max: 6,
      label: 'متوسط',
      severity: undefined as const,
      percentile: '4-6',
    },
    {
      min: 7,
      max: 9,
      label: 'خوب',
      severity: undefined as const,
      percentile: '7-9',
    },
    {
      min: 10,
      max: 12,
      label: 'بسیار بالا',
      severity: undefined as const,
      percentile: '10-12',
    },
  ],
  // Cutoff برای هر زیرمقیاس (0-4)
  Fluid_Reasoning: [
    { min: 0, max: 1, label: 'پایین', severity: undefined as const, percentile: '0-1' },
    { min: 2, max: 2, label: 'متوسط', severity: undefined as const, percentile: '2' },
    { min: 3, max: 4, label: 'خوب', severity: undefined as const, percentile: '3-4' },
  ],
  Verbal_Reasoning: [
    { min: 0, max: 1, label: 'پایین', severity: undefined as const, percentile: '0-1' },
    { min: 2, max: 2, label: 'متوسط', severity: undefined as const, percentile: '2' },
    { min: 3, max: 4, label: 'خوب', severity: undefined as const, percentile: '3-4' },
  ],
  Quantitative_Reasoning: [
    { min: 0, max: 1, label: 'پایین', severity: undefined as const, percentile: '0-1' },
    { min: 2, max: 2, label: 'متوسط', severity: undefined as const, percentile: '2' },
    { min: 3, max: 4, label: 'خوب', severity: undefined as const, percentile: '3-4' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const COGNITIVE_IQ_INTERPRETATIONS = {
  Fluid_Reasoning: {
    high: 'تشخیص الگو، منطق تصویری، استدلال سریع',
    low: 'مشکل در تشخیص الگوها، نیاز به بهبود استدلال سیال',
  },
  Verbal_Reasoning: {
    high: 'تحلیل مفهومی، طبقه‌بندی معنایی، قدرت درک واژه‌ها',
    low: 'مشکل در تحلیل کلامی، نیاز به بهبود استدلال کلامی',
  },
  Quantitative_Reasoning: {
    high: 'درک اعداد، توالی‌ها، تعمیم عددی',
    low: 'مشکل در استدلال عددی، نیاز به بهبود درک کمی',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getCognitiveIQConfigJSON(): string {
  return JSON.stringify(COGNITIVE_IQ_CONFIG);
}

/**
 * محاسبه نمره Cognitive IQ
 * ⚠️ این تست متفاوت است: هر سوال فقط 0 یا 1 نمره دارد
 * 
 * @param answers - { questionOrder: selectedOptionIndex }
 *                  در این تست، selectedOptionIndex باید 0 (غلط) یا 1 (درست) باشد
 *                  یا می‌تواند index گزینه صحیح باشد که باید با correctAnswer مقایسه شود
 * 
 * @param correctAnswers - { questionOrder: correctOptionIndex } (اختیاری)
 *                        اگر ارائه شود، مقایسه می‌کند
 *                        اگر ارائه نشود، فرض می‌کند answers[questionOrder] = 1 یعنی درست
 */
export function calculateCognitiveIQScore(
  answers: Record<number, number>, // { questionOrder: selectedOptionIndex }
  correctAnswers?: Record<number, number> // { questionOrder: correctOptionIndex } (اختیاری)
): {
  subscales: {
    Fluid_Reasoning: number;
    Verbal_Reasoning: number;
    Quantitative_Reasoning: number;
  };
  totalScore: number;
  interpretation: string;
  level: 'پایین' | 'متوسط' | 'خوب' | 'بسیار بالا';
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Fluid_Reasoning: [],
    Verbal_Reasoning: [],
    Quantitative_Reasoning: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, selectedOptionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Fluid_Reasoning' | 'Verbal_Reasoning' | 'Quantitative_Reasoning' | null = null;
    if (COGNITIVE_IQ_SUBSCALES.Fluid_Reasoning.includes(questionOrder)) {
      subscale = 'Fluid_Reasoning';
    } else if (COGNITIVE_IQ_SUBSCALES.Verbal_Reasoning.includes(questionOrder)) {
      subscale = 'Verbal_Reasoning';
    } else if (COGNITIVE_IQ_SUBSCALES.Quantitative_Reasoning.includes(questionOrder)) {
      subscale = 'Quantitative_Reasoning';
    }
    
    if (!subscale) return;

    // محاسبه نمره سوال (0 یا 1)
    let score = 0;
    
    if (correctAnswers) {
      // اگر correctAnswers ارائه شده، مقایسه کن
      const correctOptionIndex = correctAnswers[questionOrder];
      if (correctOptionIndex !== undefined && selectedOptionIndex === correctOptionIndex) {
        score = 1; // پاسخ درست
      } else {
        score = 0; // پاسخ غلط
      }
    } else {
      // اگر correctAnswers ارائه نشده، فرض کن selectedOptionIndex = 1 یعنی درست
      // (این برای حالتی است که answers مستقیماً نمره 0/1 را دارد)
      score = selectedOptionIndex === 1 ? 1 : 0;
    }

    // اضافه کردن به لیست نمرات زیرمقیاس
    subscaleScores[subscale].push(score);
  });

  // محاسبه مجموع برای هر زیرمقیاس
  const subscaleSums: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    subscaleSums[subscale] = sum; // 0-4 برای هر زیرمقیاس
  });

  // محاسبه نمره کل
  const totalScore = Object.values(subscaleSums).reduce((acc, sum) => acc + sum, 0); // 0-12

  // تعیین سطح بر اساس نمره کل
  let level: 'پایین' | 'متوسط' | 'خوب' | 'بسیار بالا';
  if (totalScore >= 10) {
    level = 'بسیار بالا';
  } else if (totalScore >= 7) {
    level = 'خوب';
  } else if (totalScore >= 4) {
    level = 'متوسط';
  } else {
    level = 'پایین';
  }

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleSums.Fluid_Reasoning >= 3) {
    interpretations.push(`استدلال سیال بالا: ${COGNITIVE_IQ_INTERPRETATIONS.Fluid_Reasoning.high}`);
  } else if (subscaleSums.Fluid_Reasoning <= 1) {
    interpretations.push(`استدلال سیال پایین: ${COGNITIVE_IQ_INTERPRETATIONS.Fluid_Reasoning.low}`);
  }
  
  if (subscaleSums.Verbal_Reasoning >= 3) {
    interpretations.push(`استدلال کلامی بالا: ${COGNITIVE_IQ_INTERPRETATIONS.Verbal_Reasoning.high}`);
  } else if (subscaleSums.Verbal_Reasoning <= 1) {
    interpretations.push(`استدلال کلامی پایین: ${COGNITIVE_IQ_INTERPRETATIONS.Verbal_Reasoning.low}`);
  }
  
  if (subscaleSums.Quantitative_Reasoning >= 3) {
    interpretations.push(`استدلال عددی بالا: ${COGNITIVE_IQ_INTERPRETATIONS.Quantitative_Reasoning.high}`);
  } else if (subscaleSums.Quantitative_Reasoning <= 1) {
    interpretations.push(`استدلال عددی پایین: ${COGNITIVE_IQ_INTERPRETATIONS.Quantitative_Reasoning.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : `سطح شناخت: ${level}`;

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleSums.Fluid_Reasoning <= 1) {
    recommendedTests.push('problem-solving'); // Problem Solving
    recommendedTests.push('focus'); // Focus & Attention
    recommendedTests.push('creativity'); // Creativity (بخش الگوها)
  }
  
  if (subscaleSums.Verbal_Reasoning <= 1) {
    recommendedTests.push('communication-skills'); // Communication Skills
    recommendedTests.push('learning-style'); // Learning Style (برای پیدا کردن مشکل)
    recommendedTests.push('memory'); // Memory
  }
  
  if (subscaleSums.Quantitative_Reasoning <= 1) {
    recommendedTests.push('time-preference'); // Time Preference (برای منطق تصمیم‌گیری)
    recommendedTests.push('analytical-skills'); // Analytical Skills
  }

  return {
    subscales: subscaleSums as {
      Fluid_Reasoning: number;
      Verbal_Reasoning: number;
      Quantitative_Reasoning: number;
    },
    totalScore,
    interpretation,
    level,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

