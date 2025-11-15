/**
 * Config استاندارد برای تست General Health Assessment (سلامت کلی)
 * 
 * این تست یکی از تست‌های مهم Testology است، چون خیلی جاها لازم داریم بدانیم:
 * - آیا مشکل کاربر ریشه جسمی دارد یا روانی؟
 * - آیا خواب/تغذیه/انرژی کم باعث امتیازهای پایین در سایر تست‌ها شده؟
 * - آیا باید تست‌های تخصصی‌تر پیشنهاد بدهیم (خواب، استرس، افسردگی، اضطراب)؟
 * 
 * این تست بر اساس چند ابزار معتبر ساخته شده:
 * - SF-36 (Vitality + Physical Functioning)
 * - WHOQOL Physical Domain
 * - Physical Health Questionnaire (PHQ)
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Physical Energy & Fatigue (انرژی و خستگی): 3 سوال
 * - Sleep Quality (کیفیت خواب): 3 سوال
 * - Pain & Physical Discomfort (درد و ناراحتی جسمی): 3 سوال
 * - Daily Functioning (عملکرد روزانه): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * 4 سوال reverse (5, 6, 7, 10)
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 * 
 * ⚠️ نکته مهم: بعضی سوال‌ها «نشانهٔ مشکل» را می‌سنجند (مثلاً "اغلب احساس خستگی دارم")
 * پس باید Reverse شوند تا: نمره بالاتر = سلامت بهتر.
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const GENERAL_HEALTH_SUBSCALES = {
  Physical_Energy_Fatigue: [1, 5, 9], // 3 سوال - سوال 5 reverse
  Sleep_Quality: [2, 6, 10], // 3 سوال - سوالات 6 و 10 reverse
  Pain_Physical_Discomfort: [3, 7, 11], // 3 سوال - سوال 7 reverse
  Daily_Functioning: [4, 8, 12], // 3 سوال - بدون reverse
};

/**
 * لیست سوالات Reverse-Scored (4 سوال)
 * فرمول Reverse: 6 - score
 */
export const GENERAL_HEALTH_REVERSE_ITEMS = [5, 6, 7, 10];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface GeneralHealthQuestionMapping {
  questionOrder: number;
  subscale: 'Physical_Energy_Fatigue' | 'Sleep_Quality' | 'Pain_Physical_Discomfort' | 'Daily_Functioning';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createGeneralHealthQuestionMapping(): GeneralHealthQuestionMapping[] {
  const mapping: GeneralHealthQuestionMapping[] = [];
  const reverseSet = new Set(GENERAL_HEALTH_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(GENERAL_HEALTH_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Physical_Energy_Fatigue' | 'Sleep_Quality' | 'Pain_Physical_Discomfort' | 'Daily_Functioning',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد General Health
 */
export const GENERAL_HEALTH_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کلی
  dimensions: ['Physical_Energy_Fatigue', 'Sleep_Quality', 'Pain_Physical_Discomfort', 'Daily_Functioning'],
  reverseItems: GENERAL_HEALTH_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Physical_Energy_Fatigue',
      items: GENERAL_HEALTH_SUBSCALES.Physical_Energy_Fatigue,
    },
    {
      name: 'Sleep_Quality',
      items: GENERAL_HEALTH_SUBSCALES.Sleep_Quality,
    },
    {
      name: 'Pain_Physical_Discomfort',
      items: GENERAL_HEALTH_SUBSCALES.Pain_Physical_Discomfort,
    },
    {
      name: 'Daily_Functioning',
      items: GENERAL_HEALTH_SUBSCALES.Daily_Functioning,
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
 * Cutoff استاندارد General Health
 */
export const GENERAL_HEALTH_CUTOFFS = {
  Physical_Energy_Fatigue: [
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
      label: 'بسیار خوب',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 4 زیرمقیاس و نمره کلی
  Sleep_Quality: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Pain_Physical_Discomfort: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Daily_Functioning: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  total: [
    { min: 1.0, max: 2.4, label: 'ضعیف / نیازمند توجه', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار خوب', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const GENERAL_HEALTH_INTERPRETATIONS = {
  Physical_Energy_Fatigue: {
    high: 'انرژی کافی، احساس سرزندگی، عملکرد فیزیکی مناسب',
    low: 'خستگی مداوم، افت تمرکز، کاهش عملکرد',
  },
  Sleep_Quality: {
    high: 'خواب باکیفیت، استراحت کافی، بیداری سرحال',
    low: 'خواب سبک، بیداری‌های مکرر، خواب ناکافی',
  },
  Pain_Physical_Discomfort: {
    high: 'بدون درد یا ناراحتی جسمی، احساس راحتی فیزیکی',
    low: 'سردرد، درد عضلانی، ناراحتی جسمی مزمن',
  },
  Daily_Functioning: {
    high: 'عملکرد روزانه مناسب، انرژی صبحگاهی خوب، بهره‌وری بالا',
    low: 'سختی در انجام کارهای روزمره، انرژی صبحگاهی پایین، بهره‌وری کم',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getGeneralHealthConfigJSON(): string {
  return JSON.stringify(GENERAL_HEALTH_CONFIG);
}

/**
 * محاسبه نمره General Health
 * General Health از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * نمره کلی: mean(4 subscales)
 * Range: 1-5
 */
export function calculateGeneralHealthScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Physical_Energy_Fatigue: number;
    Sleep_Quality: number;
    Pain_Physical_Discomfort: number;
    Daily_Functioning: number;
  };
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Physical_Energy_Fatigue: [],
    Sleep_Quality: [],
    Pain_Physical_Discomfort: [],
    Daily_Functioning: [],
  };
  const reverseSet = new Set(GENERAL_HEALTH_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Physical_Energy_Fatigue' | 'Sleep_Quality' | 'Pain_Physical_Discomfort' | 'Daily_Functioning' | null = null;
    if (GENERAL_HEALTH_SUBSCALES.Physical_Energy_Fatigue.includes(questionOrder)) {
      subscale = 'Physical_Energy_Fatigue';
    } else if (GENERAL_HEALTH_SUBSCALES.Sleep_Quality.includes(questionOrder)) {
      subscale = 'Sleep_Quality';
    } else if (GENERAL_HEALTH_SUBSCALES.Pain_Physical_Discomfort.includes(questionOrder)) {
      subscale = 'Pain_Physical_Discomfort';
    } else if (GENERAL_HEALTH_SUBSCALES.Daily_Functioning.includes(questionOrder)) {
      subscale = 'Daily_Functioning';
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
  
  if (subscaleMeans.Physical_Energy_Fatigue >= 3.5) {
    interpretations.push(`انرژی و خستگی خوب: ${GENERAL_HEALTH_INTERPRETATIONS.Physical_Energy_Fatigue.high}`);
  } else if (subscaleMeans.Physical_Energy_Fatigue <= 2.4) {
    interpretations.push(`انرژی و خستگی پایین: ${GENERAL_HEALTH_INTERPRETATIONS.Physical_Energy_Fatigue.low}`);
  }
  
  if (subscaleMeans.Sleep_Quality >= 3.5) {
    interpretations.push(`کیفیت خواب خوب: ${GENERAL_HEALTH_INTERPRETATIONS.Sleep_Quality.high}`);
  } else if (subscaleMeans.Sleep_Quality <= 2.4) {
    interpretations.push(`کیفیت خواب پایین: ${GENERAL_HEALTH_INTERPRETATIONS.Sleep_Quality.low}`);
  }
  
  if (subscaleMeans.Pain_Physical_Discomfort >= 3.5) {
    interpretations.push(`درد و ناراحتی جسمی کم: ${GENERAL_HEALTH_INTERPRETATIONS.Pain_Physical_Discomfort.high}`);
  } else if (subscaleMeans.Pain_Physical_Discomfort <= 2.4) {
    interpretations.push(`درد و ناراحتی جسمی بالا: ${GENERAL_HEALTH_INTERPRETATIONS.Pain_Physical_Discomfort.low}`);
  }
  
  if (subscaleMeans.Daily_Functioning >= 3.5) {
    interpretations.push(`عملکرد روزانه خوب: ${GENERAL_HEALTH_INTERPRETATIONS.Daily_Functioning.high}`);
  } else if (subscaleMeans.Daily_Functioning <= 2.4) {
    interpretations.push(`عملکرد روزانه پایین: ${GENERAL_HEALTH_INTERPRETATIONS.Daily_Functioning.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'سلامت کلی متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Sleep_Quality <= 2.4) {
    recommendedTests.push('isi'); // ISI
    recommendedTests.push('psqi'); // PSQI
    recommendedTests.push('stress-scale'); // Stress
    recommendedTests.push('maas'); // MAAS
  }
  
  if (subscaleMeans.Pain_Physical_Discomfort <= 2.4) {
    recommendedTests.push('stress-scale'); // Stress
    recommendedTests.push('gad7'); // General Anxiety
    recommendedTests.push('psqi'); // Sleep Quality
  }
  
  if (subscaleMeans.Physical_Energy_Fatigue <= 2.4) {
    recommendedTests.push('phq9'); // PHQ-9
    recommendedTests.push('gad7'); // GAD-7
    recommendedTests.push('burnout-screening'); // Burnout Screening
    recommendedTests.push('psqi'); // Sleep
    recommendedTests.push('maas'); // MAAS
  }
  
  if (subscaleMeans.Daily_Functioning <= 2.4) {
    recommendedTests.push('time-management'); // Time Management
    recommendedTests.push('stress-scale'); // Stress
    recommendedTests.push('phq9'); // PHQ-9
  }

  return {
    subscales: subscaleMeans as {
      Physical_Energy_Fatigue: number;
      Sleep_Quality: number;
      Pain_Physical_Discomfort: number;
      Daily_Functioning: number;
    },
    totalScore: totalScoreRounded,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

