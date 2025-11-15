/**
 * Config استاندارد برای تست Lifestyle Sleep Quality Test (کیفیت خواب سبک زندگی)
 * 
 * این تست با PSQI و ISI فرق دارد:
 * - PSQI = بالینی / پزشکی
 * - ISI = بی‌خوابی بالینی
 * - این تست فقط برای سبک زندگی، انرژی، ریکاوری، و کیفیت خواب روزمره است
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Sleep Duration (مدت خواب): 3 سوال
 * - Sleep Depth & Restfulness (عمق خواب و ریکاوری): 3 سوال
 * - Sleep Routine & Habits (عادات و نظم خواب): 3 سوال
 * - Daytime Sleepiness (خواب‌آلودگی روزانه): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * 7 سوال reverse (4, 5, 6, 7, 8, 10, 12)
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 * 
 * ⚠️ نکته مهم: تست خواب اکثر آیتم‌های مشکل‌محور دارد،
 * پس نیاز به Reverse دارد تا: نمره بالاتر = خواب بهتر
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const LIFESTYLE_SLEEP_QUALITY_SUBSCALES = {
  Sleep_Duration: [1, 5, 9], // 3 سوال - سوال 5 reverse
  Sleep_Depth_Restfulness: [2, 6, 10], // 3 سوال - سوالات 6 و 10 reverse
  Sleep_Routine_Habits: [3, 7, 11], // 3 سوال - سوال 7 reverse
  Daytime_Sleepiness: [4, 8, 12], // 3 سوال - همه 3 سوال reverse
};

/**
 * لیست سوالات Reverse-Scored (7 سوال)
 * فرمول Reverse: 6 - score
 */
export const LIFESTYLE_SLEEP_QUALITY_REVERSE_ITEMS = [4, 5, 6, 7, 8, 10, 12];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface LifestyleSleepQualityQuestionMapping {
  questionOrder: number;
  subscale: 'Sleep_Duration' | 'Sleep_Depth_Restfulness' | 'Sleep_Routine_Habits' | 'Daytime_Sleepiness';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createLifestyleSleepQualityQuestionMapping(): LifestyleSleepQualityQuestionMapping[] {
  const mapping: LifestyleSleepQualityQuestionMapping[] = [];
  const reverseSet = new Set(LIFESTYLE_SLEEP_QUALITY_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(LIFESTYLE_SLEEP_QUALITY_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Sleep_Duration' | 'Sleep_Depth_Restfulness' | 'Sleep_Routine_Habits' | 'Daytime_Sleepiness',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Lifestyle Sleep Quality
 */
export const LIFESTYLE_SLEEP_QUALITY_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کلی
  dimensions: ['Sleep_Duration', 'Sleep_Depth_Restfulness', 'Sleep_Routine_Habits', 'Daytime_Sleepiness'],
  reverseItems: LIFESTYLE_SLEEP_QUALITY_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Sleep_Duration',
      items: LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Sleep_Duration,
    },
    {
      name: 'Sleep_Depth_Restfulness',
      items: LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Sleep_Depth_Restfulness,
    },
    {
      name: 'Sleep_Routine_Habits',
      items: LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Sleep_Routine_Habits,
    },
    {
      name: 'Daytime_Sleepiness',
      items: LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Daytime_Sleepiness,
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
 * Cutoff استاندارد Lifestyle Sleep Quality
 */
export const LIFESTYLE_SLEEP_QUALITY_CUTOFFS = {
  Sleep_Duration: [
    {
      min: 1.0,
      max: 2.4,
      label: 'ضعیف / نیازمند توجه',
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
      label: 'عالی',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 4 زیرمقیاس و نمره کلی
  Sleep_Depth_Restfulness: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'عالی', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Sleep_Routine_Habits: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'عالی', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Daytime_Sleepiness: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'عالی', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  total: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'عالی', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS = {
  Sleep_Duration: {
    high: 'مدت خواب کافی، استراحت مناسب، انرژی کافی',
    low: 'خواب کم، خستگی مزمن، کاهش تمرکز',
  },
  Sleep_Depth_Restfulness: {
    high: 'خواب عمیق، ریکاوری خوب، بیداری سرحال',
    low: 'خواب سبک، بیدار شدن‌های مکرر، بی‌کیفیتی خواب',
  },
  Sleep_Routine_Habits: {
    high: 'نظم خواب، ساعت خواب منظم، ریتم خواب سالم',
    low: 'ساعت خواب نامنظم، شب بیداری، ریتم خواب به‌هم‌ریخته',
  },
  Daytime_Sleepiness: {
    high: 'هوشیاری روزانه، انرژی کافی، بهره‌وری مناسب',
    low: 'خواب‌آلودگی شدید، کاهش بهره‌وری، نشانه قطعی اختلال خواب',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getLifestyleSleepQualityConfigJSON(): string {
  return JSON.stringify(LIFESTYLE_SLEEP_QUALITY_CONFIG);
}

/**
 * محاسبه نمره Lifestyle Sleep Quality
 * Lifestyle Sleep Quality از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * نمره کلی: mean(4 subscales)
 * Range: 1-5
 */
export function calculateLifestyleSleepQualityScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Sleep_Duration: number;
    Sleep_Depth_Restfulness: number;
    Sleep_Routine_Habits: number;
    Daytime_Sleepiness: number;
  };
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Sleep_Duration: [],
    Sleep_Depth_Restfulness: [],
    Sleep_Routine_Habits: [],
    Daytime_Sleepiness: [],
  };
  const reverseSet = new Set(LIFESTYLE_SLEEP_QUALITY_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Sleep_Duration' | 'Sleep_Depth_Restfulness' | 'Sleep_Routine_Habits' | 'Daytime_Sleepiness' | null = null;
    if (LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Sleep_Duration.includes(questionOrder)) {
      subscale = 'Sleep_Duration';
    } else if (LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Sleep_Depth_Restfulness.includes(questionOrder)) {
      subscale = 'Sleep_Depth_Restfulness';
    } else if (LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Sleep_Routine_Habits.includes(questionOrder)) {
      subscale = 'Sleep_Routine_Habits';
    } else if (LIFESTYLE_SLEEP_QUALITY_SUBSCALES.Daytime_Sleepiness.includes(questionOrder)) {
      subscale = 'Daytime_Sleepiness';
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
  
  if (subscaleMeans.Sleep_Duration >= 3.5) {
    interpretations.push(`مدت خواب خوب: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Sleep_Duration.high}`);
  } else if (subscaleMeans.Sleep_Duration <= 2.4) {
    interpretations.push(`مدت خواب پایین: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Sleep_Duration.low}`);
  }
  
  if (subscaleMeans.Sleep_Depth_Restfulness >= 3.5) {
    interpretations.push(`عمق خواب خوب: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Sleep_Depth_Restfulness.high}`);
  } else if (subscaleMeans.Sleep_Depth_Restfulness <= 2.4) {
    interpretations.push(`عمق خواب پایین: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Sleep_Depth_Restfulness.low}`);
  }
  
  if (subscaleMeans.Sleep_Routine_Habits >= 3.5) {
    interpretations.push(`نظم خواب خوب: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Sleep_Routine_Habits.high}`);
  } else if (subscaleMeans.Sleep_Routine_Habits <= 2.4) {
    interpretations.push(`نظم خواب پایین: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Sleep_Routine_Habits.low}`);
  }
  
  if (subscaleMeans.Daytime_Sleepiness >= 3.5) {
    interpretations.push(`هوشیاری روزانه خوب: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Daytime_Sleepiness.high}`);
  } else if (subscaleMeans.Daytime_Sleepiness <= 2.4) {
    interpretations.push(`خواب‌آلودگی روزانه بالا: ${LIFESTYLE_SLEEP_QUALITY_INTERPRETATIONS.Daytime_Sleepiness.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'کیفیت خواب متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    // اگر کیفیت خواب کلی پایین باشد
    recommendedTests.push('psqi'); // PSQI (خواب بالینی)
    recommendedTests.push('isi'); // ISI (بی‌خوابی)
    recommendedTests.push('stress-scale'); // استرس (PSS)
    recommendedTests.push('phq9'); // افسردگی/اضطراب (PHQ-9/GAD-7)
    recommendedTests.push('gad7'); // GAD-7
    recommendedTests.push('physical-activity'); // فعالیت بدنی (Test 36)
  }
  
  if (subscaleMeans.Daytime_Sleepiness <= 2.4) {
    // اگر فقط خواب‌آلودگی روزانه پایین باشد
    recommendedTests.push('focus'); // تست تمرکز
    recommendedTests.push('general-health'); // تست انرژی
    recommendedTests.push('work-life-balance'); // تست تعادل کار-زندگی
    recommendedTests.push('eating-habits'); // تست عادات غذایی
  }

  return {
    subscales: subscaleMeans as {
      Sleep_Duration: number;
      Sleep_Depth_Restfulness: number;
      Sleep_Routine_Habits: number;
      Daytime_Sleepiness: number;
    },
    totalScore: totalScoreRounded,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

