/**
 * Config استاندارد برای تست خلاقیت ذهنی (Creative Thinking Test)
 * منبع: مدل Guilford + Torrance (Creativity Divergent Thinking Model)
 * 
 * این تست 4 بعد خلاقیت را می‌سنجد:
 * - Fluency: روانی / تعداد ایده‌ها
 * - Flexibility: انعطاف / تنوع دسته‌های ایده
 * - Originality: اصالت / متفاوت بودن ایده
 * - Elaboration: بسط‌دادن و جزئیات
 * 
 * تعداد سوالات: 12
 * سوالات Reverse: 3 سوال (2, 5, 10)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر بعد (شماره سوالات 1-indexed)
 */
export const CREATIVITY_DIMENSIONS = {
  Fluency: [1, 2, 3],      // روانی (3 سوال)
  Flexibility: [4, 5, 6],  // انعطاف (3 سوال)
  Originality: [7, 8, 9],  // اصالت (3 سوال)
  Elaboration: [10, 11, 12], // بسط (3 سوال)
};

/**
 * لیست سوالات Reverse-Scored (3 سوال)
 * این سوالات باید معکوس نمره‌دهی شوند: reverse_score = 4 - original_score
 */
export const CREATIVITY_REVERSE_ITEMS = [
  { question: 2, dimension: 'Fluency' },
  { question: 5, dimension: 'Flexibility' },
  { question: 10, dimension: 'Elaboration' },
];

/**
 * Mapping سوالات به بعد‌ها و reverse status
 */
export interface CreativityQuestionMapping {
  questionOrder: number;
  dimension: 'Fluency' | 'Flexibility' | 'Originality' | 'Elaboration';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createCreativityQuestionMapping(): CreativityQuestionMapping[] {
  const mapping: CreativityQuestionMapping[] = [];
  const reverseSet = new Set(CREATIVITY_REVERSE_ITEMS.map(item => item.question));

  // برای هر بعد
  Object.entries(CREATIVITY_DIMENSIONS).forEach(([dimension, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        dimension: dimension as 'Fluency' | 'Flexibility' | 'Originality' | 'Elaboration',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد تست خلاقیت
 */
export const CREATIVITY_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه mean داریم
  dimensions: ['Fluency', 'Flexibility', 'Originality', 'Elaboration'],
  reverseItems: CREATIVITY_REVERSE_ITEMS.map(item => item.question),
  subscales: [
    {
      name: 'Fluency',
      items: CREATIVITY_DIMENSIONS.Fluency,
    },
    {
      name: 'Flexibility',
      items: CREATIVITY_DIMENSIONS.Flexibility,
    },
    {
      name: 'Originality',
      items: CREATIVITY_DIMENSIONS.Originality,
    },
    {
      name: 'Elaboration',
      items: CREATIVITY_DIMENSIONS.Elaboration,
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
  maxScore: 4, // هر بعد: میانگین 0-4
};

/**
 * Cutoff استاندارد بر اساس Torrance/Guilford
 */
export const CREATIVITY_CUTOFFS = {
  Fluency: [
    { min: 0, max: 1.5, label: 'خلاقیت پایین', percentile: '0-37.5%' },
    { min: 1.51, max: 2.5, label: 'معمولی', percentile: '37.5-62.5%' },
    { min: 2.51, max: 3.2, label: 'خلاقیت بالا', percentile: '62.5-80%' },
    { min: 3.21, max: 4, label: 'بسیار خلاق', percentile: '80-100%' },
  ],
  Flexibility: [
    { min: 0, max: 1.5, label: 'خلاقیت پایین', percentile: '0-37.5%' },
    { min: 1.51, max: 2.5, label: 'معمولی', percentile: '37.5-62.5%' },
    { min: 2.51, max: 3.2, label: 'خلاقیت بالا', percentile: '62.5-80%' },
    { min: 3.21, max: 4, label: 'بسیار خلاق', percentile: '80-100%' },
  ],
  Originality: [
    { min: 0, max: 1.5, label: 'خلاقیت پایین', percentile: '0-37.5%' },
    { min: 1.51, max: 2.5, label: 'معمولی', percentile: '37.5-62.5%' },
    { min: 2.51, max: 3.2, label: 'خلاقیت بالا', percentile: '62.5-80%' },
    { min: 3.21, max: 4, label: 'بسیار خلاق', percentile: '80-100%' },
  ],
  Elaboration: [
    { min: 0, max: 1.5, label: 'خلاقیت پایین', percentile: '0-37.5%' },
    { min: 1.51, max: 2.5, label: 'معمولی', percentile: '37.5-62.5%' },
    { min: 2.51, max: 3.2, label: 'خلاقیت بالا', percentile: '62.5-80%' },
    { min: 3.21, max: 4, label: 'بسیار خلاق', percentile: '80-100%' },
  ],
  Overall: [
    { min: 0, max: 1.5, label: 'خلاقیت پایین', percentile: '0-37.5%' },
    { min: 1.51, max: 2.5, label: 'معمولی', percentile: '37.5-62.5%' },
    { min: 2.51, max: 3.2, label: 'خلاقیت بالا', percentile: '62.5-80%' },
    { min: 3.21, max: 4, label: 'بسیار خلاق', percentile: '80-100%' },
  ],
};

/**
 * تفسیر هر بعد
 */
export const CREATIVITY_INTERPRETATIONS = {
  Fluency: {
    high: 'ذهن سریع، تولید ایده زیاد، توانایی خلق ایده‌های متعدد',
    low: 'شروع دشوار برای خلق ایده‌های تازه، نیاز به زمان بیشتر برای تولید ایده',
  },
  Flexibility: {
    high: 'قابلیت تغییر زاویه دید، خارج شدن از چارچوب، تفکر چندبعدی',
    low: 'گیرکردن در یک مسیر فکری، دشواری در تغییر رویکرد',
  },
  Originality: {
    high: 'ایده‌های متفاوت و یونیک، تفکر نوآورانه، خروج از الگوهای معمول',
    low: 'ایده‌های تکراری و متعارف، تمایل به روش‌های شناخته شده',
  },
  Elaboration: {
    high: 'توانایی تکمیل ایده با جزئیات، بسط و توسعه ایده‌ها، توجه به جزئیات',
    low: 'ایده‌های خام و ناتمام، نیاز به توسعه بیشتر',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getCreativityConfigJSON(): string {
  return JSON.stringify({
    ...CREATIVITY_CONFIG,
    cutoffs: CREATIVITY_CUTOFFS,
  });
}

/**
 * محاسبه نمره هر بعد با در نظر گیری reverse items و میانگین‌گیری
 * تست خلاقیت از میانگین استفاده می‌کند
 */
export function calculateCreativityScore(
  answers: Record<number, number>, // { questionOrder: selectedOptionIndex (0-4) }
  mapping: CreativityQuestionMapping[]
): {
  dimensions: {
    Fluency: number;
    Flexibility: number;
    Originality: number;
    Elaboration: number;
  };
  dimensionsRaw: {
    Fluency: number;
    Flexibility: number;
    Originality: number;
    Elaboration: number;
  };
  overall: number; // میانگین کل 4 بعد
  interpretations: {
    [key: string]: string;
  };
  percentiles: {
    [key: string]: number; // 0-100
  };
} {
  const dimensionScores: { [key: string]: number[] } = {
    Fluency: [],
    Flexibility: [],
    Originality: [],
    Elaboration: [],
  };

  // محاسبه نمره هر سوال
  mapping.forEach(({ questionOrder, dimension, isReverse }) => {
    const answer = answers[questionOrder];
    if (answer === undefined || answer === null) return;

    // تبدیل optionIndex (0-4) به نمره (0-4)
    let score = answer;

    // اگر reverse است، معکوس کن: 4 - score
    if (isReverse) {
      score = 4 - score;
    }

    // اضافه کردن به لیست نمرات بعد
    dimensionScores[dimension].push(score);
  });

  // محاسبه میانگین برای هر بعد
  const dimensionMeans: { [key: string]: number } = {};
  const dimensionRaws: { [key: string]: number } = {};
  
  Object.entries(dimensionScores).forEach(([dimension, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    dimensionMeans[dimension] = Math.round(mean * 100) / 100; // 2 رقم اعشار
    dimensionRaws[dimension] = sum; // جمع خام برای نمایش
  });

  // محاسبه نمره کلی (میانگین 4 بعد)
  const overall = Object.values(dimensionMeans).reduce((sum, mean) => sum + mean, 0) / 4;
  const overallRounded = Math.round(overall * 100) / 100;

  // تبدیل به percentile (0-100)
  const percentiles: { [key: string]: number } = {};
  Object.entries(dimensionMeans).forEach(([dimension, mean]) => {
    percentiles[dimension] = Math.round((mean / 4) * 100);
  });
  percentiles['Overall'] = Math.round((overallRounded / 4) * 100);

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(dimensionMeans).forEach(([dimension, score]) => {
    const cutoff = CREATIVITY_CUTOFFS[dimension as keyof typeof CREATIVITY_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    
    const level = cutoff?.label || 'معمولی';
    const isHigh = score >= 2.51;
    const interpretation = CREATIVITY_INTERPRETATIONS[dimension as keyof typeof CREATIVITY_INTERPRETATIONS];
    
    interpretations[dimension] = `${interpretation[isHigh ? 'high' : 'low']} (${level})`;
  });

  // تفسیر نمره کلی
  const overallCutoff = CREATIVITY_CUTOFFS.Overall.find(
    c => overallRounded >= c.min && overallRounded <= c.max
  );
  if (overallCutoff) {
    interpretations['Overall'] = `نمره کلی خلاقیت: ${overallCutoff.label} (${overallCutoff.percentile})`;
  }

  return {
    dimensions: dimensionMeans as {
      Fluency: number;
      Flexibility: number;
      Originality: number;
      Elaboration: number;
    },
    dimensionsRaw: dimensionRaws as {
      Fluency: number;
      Flexibility: number;
      Originality: number;
      Elaboration: number;
    },
    overall: overallRounded,
    interpretations,
    percentiles,
  };
}

