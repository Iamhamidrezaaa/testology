/**
 * Config استاندارد برای تست Eating Habits Assessment (عادات غذایی)
 * 
 * این تست یکی از تست‌های مهم «سبک زندگی» در Testology است، چون به‌شدت روی سلامت روان،
 * خواب، انرژی، تمرکز و حتی اضطراب اثر می‌گذارد.
 * 
 * این تست بر اساس چند ابزار معتبر ساخته شده:
 * - Dutch Eating Behaviour Questionnaire (DEBQ)
 * - Healthy Eating Index (HEI)
 * - Eating Habits Questionnaire (EHQ)
 * - Mediterranean Diet Adherence (نسخه کوتاه)
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Meal Regularity (نظم وعده‌ها): 3 سوال
 * - Healthy Food Choices (سلامت‌محوری غذایی): 3 سوال
 * - Emotional Eating (غذا خوردن احساسی): 3 سوال
 * - Portion Control (کنترل حجم غذا): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * 5 سوال reverse (3, 7, 8, 10, 11)
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 * 
 * ⚠️ نکته مهم: برای بعضی آیتم‌ها مثل Emotional Eating، نمره بالا = مشکل
 * پس باید Reverse شوند تا: نمره بالاتر = عادات غذایی سالم‌تر
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const EATING_HABITS_SUBSCALES = {
  Meal_Regularity: [1, 5, 9], // 3 سوال - بدون reverse
  Healthy_Food_Choices: [2, 6, 10], // 3 سوال - سوال 10 reverse
  Emotional_Eating: [3, 7, 11], // 3 سوال - همه 3 سوال reverse
  Portion_Control: [4, 8, 12], // 3 سوال - سوال 8 reverse
};

/**
 * لیست سوالات Reverse-Scored (5 سوال)
 * فرمول Reverse: 6 - score
 */
export const EATING_HABITS_REVERSE_ITEMS = [3, 7, 8, 10, 11];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface EatingHabitsQuestionMapping {
  questionOrder: number;
  subscale: 'Meal_Regularity' | 'Healthy_Food_Choices' | 'Emotional_Eating' | 'Portion_Control';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createEatingHabitsQuestionMapping(): EatingHabitsQuestionMapping[] {
  const mapping: EatingHabitsQuestionMapping[] = [];
  const reverseSet = new Set(EATING_HABITS_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(EATING_HABITS_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Meal_Regularity' | 'Healthy_Food_Choices' | 'Emotional_Eating' | 'Portion_Control',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Eating Habits
 */
export const EATING_HABITS_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کلی
  dimensions: ['Meal_Regularity', 'Healthy_Food_Choices', 'Emotional_Eating', 'Portion_Control'],
  reverseItems: EATING_HABITS_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Meal_Regularity',
      items: EATING_HABITS_SUBSCALES.Meal_Regularity,
    },
    {
      name: 'Healthy_Food_Choices',
      items: EATING_HABITS_SUBSCALES.Healthy_Food_Choices,
    },
    {
      name: 'Emotional_Eating',
      items: EATING_HABITS_SUBSCALES.Emotional_Eating,
    },
    {
      name: 'Portion_Control',
      items: EATING_HABITS_SUBSCALES.Portion_Control,
    },
  ],
  weighting: {
    'never': 1,      // هرگز
    'rarely': 2,     // خیلی کم
    'sometimes': 3, // گاهی
    'often': 4,      // اغلب
    'always': 5,     // همیشه
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد Eating Habits
 */
export const EATING_HABITS_CUTOFFS = {
  Meal_Regularity: [
    {
      min: 1.0,
      max: 2.4,
      label: 'ناسالم / نامنظم',
      severity: undefined as const,
      percentile: '1.0-2.4',
    },
    {
      min: 2.5,
      max: 3.4,
      label: 'متوسط / نوسانی',
      severity: undefined as const,
      percentile: '2.5-3.4',
    },
    {
      min: 3.5,
      max: 4.2,
      label: 'سالم',
      severity: undefined as const,
      percentile: '3.5-4.2',
    },
    {
      min: 4.3,
      max: 5.0,
      label: 'بسیار سالم و پایدار',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 4 زیرمقیاس و نمره کلی
  Healthy_Food_Choices: [
    { min: 1.0, max: 2.4, label: 'ناسالم / نامنظم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'سالم', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار سالم و پایدار', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Emotional_Eating: [
    { min: 1.0, max: 2.4, label: 'ناسالم / احساسی', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'سالم', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار سالم و پایدار', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Portion_Control: [
    { min: 1.0, max: 2.4, label: 'ناسالم / نامنظم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'سالم', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار سالم و پایدار', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  total: [
    { min: 1.0, max: 2.4, label: 'ناسالم / احساسی / نامنظم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'سالم', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار سالم و پایدار', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const EATING_HABITS_INTERPRETATIONS = {
  Meal_Regularity: {
    high: 'نظم وعده‌های غذایی، خوردن منظم صبحانه، زمان‌بندی مناسب',
    low: 'حذف صبحانه، دیر غذا خوردن، احتمال کاهش انرژی/تمرکز',
  },
  Healthy_Food_Choices: {
    high: 'انتخاب غذاهای سالم، مصرف میوه و سبزیجات، پرهیز از غذاهای فراوری‌شده',
    low: 'مصرف زیاد غذاهای فراوری‌شده، قند زیاد، چربی‌های ناسالم',
  },
  Emotional_Eating: {
    high: 'کنترل احساسی غذا خوردن، عدم وابستگی غذا به احساسات',
    low: 'غذا خوردن برای فرار از احساسات، رابطهٔ احساسی-غذایی، ریسک اضافه‌وزن/استرس',
  },
  Portion_Control: {
    high: 'کنترل حجم غذا، آگاهی از مقدار مصرف، تعادل در خوردن',
    low: 'حجم زیاد، خوردن بدون آگاهی، ریسک چاقی/پرخوری',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getEatingHabitsConfigJSON(): string {
  return JSON.stringify(EATING_HABITS_CONFIG);
}

/**
 * محاسبه نمره Eating Habits
 * Eating Habits از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * نمره کلی: mean(4 subscales)
 * Range: 1-5
 */
export function calculateEatingHabitsScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Meal_Regularity: number;
    Healthy_Food_Choices: number;
    Emotional_Eating: number;
    Portion_Control: number;
  };
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Meal_Regularity: [],
    Healthy_Food_Choices: [],
    Emotional_Eating: [],
    Portion_Control: [],
  };
  const reverseSet = new Set(EATING_HABITS_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Meal_Regularity' | 'Healthy_Food_Choices' | 'Emotional_Eating' | 'Portion_Control' | null = null;
    if (EATING_HABITS_SUBSCALES.Meal_Regularity.includes(questionOrder)) {
      subscale = 'Meal_Regularity';
    } else if (EATING_HABITS_SUBSCALES.Healthy_Food_Choices.includes(questionOrder)) {
      subscale = 'Healthy_Food_Choices';
    } else if (EATING_HABITS_SUBSCALES.Emotional_Eating.includes(questionOrder)) {
      subscale = 'Emotional_Eating';
    } else if (EATING_HABITS_SUBSCALES.Portion_Control.includes(questionOrder)) {
      subscale = 'Portion_Control';
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
  
  if (subscaleMeans.Meal_Regularity >= 3.5) {
    interpretations.push(`نظم وعده‌های غذایی خوب: ${EATING_HABITS_INTERPRETATIONS.Meal_Regularity.high}`);
  } else if (subscaleMeans.Meal_Regularity <= 2.4) {
    interpretations.push(`نظم وعده‌های غذایی پایین: ${EATING_HABITS_INTERPRETATIONS.Meal_Regularity.low}`);
  }
  
  if (subscaleMeans.Healthy_Food_Choices >= 3.5) {
    interpretations.push(`انتخاب غذای سالم خوب: ${EATING_HABITS_INTERPRETATIONS.Healthy_Food_Choices.high}`);
  } else if (subscaleMeans.Healthy_Food_Choices <= 2.4) {
    interpretations.push(`انتخاب غذای سالم پایین: ${EATING_HABITS_INTERPRETATIONS.Healthy_Food_Choices.low}`);
  }
  
  if (subscaleMeans.Emotional_Eating >= 3.5) {
    interpretations.push(`کنترل غذا خوردن احساسی خوب: ${EATING_HABITS_INTERPRETATIONS.Emotional_Eating.high}`);
  } else if (subscaleMeans.Emotional_Eating <= 2.4) {
    interpretations.push(`غذا خوردن احساسی بالا: ${EATING_HABITS_INTERPRETATIONS.Emotional_Eating.low}`);
  }
  
  if (subscaleMeans.Portion_Control >= 3.5) {
    interpretations.push(`کنترل حجم غذا خوب: ${EATING_HABITS_INTERPRETATIONS.Portion_Control.high}`);
  } else if (subscaleMeans.Portion_Control <= 2.4) {
    interpretations.push(`کنترل حجم غذا پایین: ${EATING_HABITS_INTERPRETATIONS.Portion_Control.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'عادات غذایی متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Emotional_Eating <= 2.4) {
    recommendedTests.push('stress-scale'); // استرس (PSS)
    recommendedTests.push('gad7'); // اضطراب (GAD-7)
    recommendedTests.push('phq9'); // افسردگی (PHQ-9)
  }
  
  if (subscaleMeans.Meal_Regularity <= 2.4) {
    recommendedTests.push('psqi'); // Sleep (PSQI/ISI)
    recommendedTests.push('isi'); // ISI
    recommendedTests.push('time-management'); // Time Management
    recommendedTests.push('general-health'); // Energy Level Test
  }
  
  if (subscaleMeans.Healthy_Food_Choices <= 2.4) {
    recommendedTests.push('general-health'); // سلامت عمومی (GH)
    recommendedTests.push('physical-activity'); // فعالیت بدنی (در آینده)
  }

  return {
    subscales: subscaleMeans as {
      Meal_Regularity: number;
      Healthy_Food_Choices: number;
      Emotional_Eating: number;
      Portion_Control: number;
    },
    totalScore: totalScoreRounded,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

