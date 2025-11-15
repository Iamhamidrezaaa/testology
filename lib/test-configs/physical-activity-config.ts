/**
 * Config استاندارد برای تست Physical Activity Assessment (فعالیت بدنی)
 * 
 * این تست در دسته «سلامت و تندرستی» قرار می‌گیرد و یکی از مهم‌ترین فاکتورهای
 * انرژی، خلق، خواب و تمرکز محسوب می‌شود.
 * 
 * این تست بر اساس معتبرترین ابزارهای جهانی طراحی شده:
 * - IPAQ – International Physical Activity Questionnaire (نسخه Short)
 * - WHO Physical Activity Guidelines
 * - Physical Activity Readiness Measures
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Activity Frequency (تعداد دفعات فعالیت): 3 سوال
 * - Activity Intensity (شدت فعالیت): 3 سوال
 * - Sedentary Behavior (رفتار کم‌تحرکی): 3 سوال
 * - Strength & Mobility (قدرت و انعطاف): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * 5 سوال reverse (3, 6, 7, 8, 11)
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 * 
 * ⚠️ نکته مهم: در بخش Sedentary (کم‌تحرکی)، امتیاز بالاتر یعنی مشکل بیشتر
 * پس نیاز به Reverse دارد تا: نمره بالاتر = فعالیت بدنی بهتر
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const PHYSICAL_ACTIVITY_SUBSCALES = {
  Activity_Frequency: [1, 5, 9], // 3 سوال - بدون reverse
  Activity_Intensity: [2, 6, 10], // 3 سوال - سوال 6 reverse
  Sedentary_Behavior: [3, 7, 11], // 3 سوال - همه 3 سوال reverse
  Strength_Mobility: [4, 8, 12], // 3 سوال - سوال 8 reverse
};

/**
 * لیست سوالات Reverse-Scored (5 سوال)
 * فرمول Reverse: 6 - score
 */
export const PHYSICAL_ACTIVITY_REVERSE_ITEMS = [3, 6, 7, 8, 11];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface PhysicalActivityQuestionMapping {
  questionOrder: number;
  subscale: 'Activity_Frequency' | 'Activity_Intensity' | 'Sedentary_Behavior' | 'Strength_Mobility';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createPhysicalActivityQuestionMapping(): PhysicalActivityQuestionMapping[] {
  const mapping: PhysicalActivityQuestionMapping[] = [];
  const reverseSet = new Set(PHYSICAL_ACTIVITY_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(PHYSICAL_ACTIVITY_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Activity_Frequency' | 'Activity_Intensity' | 'Sedentary_Behavior' | 'Strength_Mobility',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Physical Activity
 */
export const PHYSICAL_ACTIVITY_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کلی
  dimensions: ['Activity_Frequency', 'Activity_Intensity', 'Sedentary_Behavior', 'Strength_Mobility'],
  reverseItems: PHYSICAL_ACTIVITY_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Activity_Frequency',
      items: PHYSICAL_ACTIVITY_SUBSCALES.Activity_Frequency,
    },
    {
      name: 'Activity_Intensity',
      items: PHYSICAL_ACTIVITY_SUBSCALES.Activity_Intensity,
    },
    {
      name: 'Sedentary_Behavior',
      items: PHYSICAL_ACTIVITY_SUBSCALES.Sedentary_Behavior,
    },
    {
      name: 'Strength_Mobility',
      items: PHYSICAL_ACTIVITY_SUBSCALES.Strength_Mobility,
    },
  ],
  weighting: {
    'never': 1,      // هرگز
    'rarely': 2,     // به‌ندرت
    'sometimes': 3, // گاهی
    'often': 4,      // اغلب
    'always': 5,     // همیشه
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد Physical Activity
 */
export const PHYSICAL_ACTIVITY_CUTOFFS = {
  Activity_Frequency: [
    {
      min: 1.0,
      max: 2.4,
      label: 'کم‌تحرک / ناسالم',
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
      label: 'فعال',
      severity: undefined as const,
      percentile: '3.5-4.2',
    },
    {
      min: 4.3,
      max: 5.0,
      label: 'بسیار فعال و سالم',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 4 زیرمقیاس و نمره کلی
  Activity_Intensity: [
    { min: 1.0, max: 2.4, label: 'کم‌تحرک / ناسالم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'فعال', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار فعال و سالم', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Sedentary_Behavior: [
    { min: 1.0, max: 2.4, label: 'کم‌تحرک / ناسالم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'فعال', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار فعال و سالم', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Strength_Mobility: [
    { min: 1.0, max: 2.4, label: 'کم‌تحرک / ناسالم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'فعال', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار فعال و سالم', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  total: [
    { min: 1.0, max: 2.4, label: 'کم‌تحرک / ناسالم', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'فعال', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار فعال و سالم', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const PHYSICAL_ACTIVITY_INTERPRETATIONS = {
  Activity_Frequency: {
    high: 'فعالیت بدنی منظم، چند بار در هفته ورزش، سبک زندگی فعال',
    low: 'کمتر از ۲ بار ورزش در هفته، احتمال کاهش انرژی و افزایش استرس',
  },
  Activity_Intensity: {
    high: 'فعالیت بدنی شدید، افزایش ضربان قلب، چالش فیزیکی مناسب',
    low: 'ورزش سبک یا بدون چالش، نیاز به افزایش ضربان قلب/قدرت',
  },
  Sedentary_Behavior: {
    high: 'کم‌تحرکی کم، نشستن محدود، سبک زندگی فعال',
    low: 'نشستن طولانی، ریسک چاقی، افسردگی، خستگی',
  },
  Strength_Mobility: {
    high: 'قدرت بدنی خوب، انعطاف مناسب، توان انجام فعالیت‌ها',
    low: 'ضعف بدنی، خشکی عضلانی، مشکل در فعالیت‌ها',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getPhysicalActivityConfigJSON(): string {
  return JSON.stringify(PHYSICAL_ACTIVITY_CONFIG);
}

/**
 * محاسبه نمره Physical Activity
 * Physical Activity از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * نمره کلی: mean(4 subscales)
 * Range: 1-5
 */
export function calculatePhysicalActivityScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Activity_Frequency: number;
    Activity_Intensity: number;
    Sedentary_Behavior: number;
    Strength_Mobility: number;
  };
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Activity_Frequency: [],
    Activity_Intensity: [],
    Sedentary_Behavior: [],
    Strength_Mobility: [],
  };
  const reverseSet = new Set(PHYSICAL_ACTIVITY_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Activity_Frequency' | 'Activity_Intensity' | 'Sedentary_Behavior' | 'Strength_Mobility' | null = null;
    if (PHYSICAL_ACTIVITY_SUBSCALES.Activity_Frequency.includes(questionOrder)) {
      subscale = 'Activity_Frequency';
    } else if (PHYSICAL_ACTIVITY_SUBSCALES.Activity_Intensity.includes(questionOrder)) {
      subscale = 'Activity_Intensity';
    } else if (PHYSICAL_ACTIVITY_SUBSCALES.Sedentary_Behavior.includes(questionOrder)) {
      subscale = 'Sedentary_Behavior';
    } else if (PHYSICAL_ACTIVITY_SUBSCALES.Strength_Mobility.includes(questionOrder)) {
      subscale = 'Strength_Mobility';
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
  
  if (subscaleMeans.Activity_Frequency >= 3.5) {
    interpretations.push(`تعداد دفعات فعالیت خوب: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Activity_Frequency.high}`);
  } else if (subscaleMeans.Activity_Frequency <= 2.4) {
    interpretations.push(`تعداد دفعات فعالیت پایین: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Activity_Frequency.low}`);
  }
  
  if (subscaleMeans.Activity_Intensity >= 3.5) {
    interpretations.push(`شدت فعالیت خوب: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Activity_Intensity.high}`);
  } else if (subscaleMeans.Activity_Intensity <= 2.4) {
    interpretations.push(`شدت فعالیت پایین: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Activity_Intensity.low}`);
  }
  
  if (subscaleMeans.Sedentary_Behavior >= 3.5) {
    interpretations.push(`کم‌تحرکی کم: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Sedentary_Behavior.high}`);
  } else if (subscaleMeans.Sedentary_Behavior <= 2.4) {
    interpretations.push(`کم‌تحرکی بالا: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Sedentary_Behavior.low}`);
  }
  
  if (subscaleMeans.Strength_Mobility >= 3.5) {
    interpretations.push(`قدرت و انعطاف خوب: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Strength_Mobility.high}`);
  } else if (subscaleMeans.Strength_Mobility <= 2.4) {
    interpretations.push(`قدرت و انعطاف پایین: ${PHYSICAL_ACTIVITY_INTERPRETATIONS.Strength_Mobility.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'فعالیت بدنی متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    // اگر فعالیت بدنی کلی پایین باشد
    recommendedTests.push('isi'); // Sleep (ISI / PSQI)
    recommendedTests.push('psqi'); // PSQI
    recommendedTests.push('stress-scale'); // Stress
    recommendedTests.push('general-health'); // Energy Levels
    recommendedTests.push('eating-habits'); // Eating Habits
  }
  
  if (subscaleMeans.Sedentary_Behavior <= 2.4) {
    // اگر کم‌تحرکی بالا باشد (بعد از reverse)
    recommendedTests.push('time-management'); // Time Management
    recommendedTests.push('maas'); // Mindfulness (MAAS)
  }
  
  if (subscaleMeans.Activity_Intensity <= 2.4) {
    // اگر شدت فعالیت پایین باشد
    recommendedTests.push('health-motivation'); // Health Motivation (در آینده)
    recommendedTests.push('self-discipline'); // Self-Discipline (در آینده)
  }

  return {
    subscales: subscaleMeans as {
      Activity_Frequency: number;
      Activity_Intensity: number;
      Sedentary_Behavior: number;
      Strength_Mobility: number;
    },
    totalScore: totalScoreRounded,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

