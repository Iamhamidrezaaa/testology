/**
 * Config استاندارد برای تست Time Management (مدیریت زمان)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین مدل‌های مدیریت زمان ساخته شده:
 * - Time Management Behavior Scale (TMBS)
 * - Procrastination Scales
 * - Executive Functioning Measures
 * 
 * این تست یکی از مهم‌ترین تست‌های مهارت فردی است و خروجی‌اش معمولاً نقش کلیدی در:
 * - پیشنهاد تست‌های تکمیلی
 * - مسیر شغلی
 * - رفتارهای مالی
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Planning & Goal Setting (برنامه‌ریزی و هدف‌گذاری): 3 سوال
 * - Prioritization (اولویت‌بندی): 3 سوال
 * - Time Tracking & Discipline (پیگیری زمان و نظم): 3 سوال
 * - Procrastination Control (کنترل تعلل): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 4 سوال reverse (4, 6, 7, 11)
 * نمره هر زیرمقیاس: میانگین 1-5
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const TIME_MANAGEMENT_SUBSCALES = {
  Planning: [1, 5, 9], // 3 سوال
  Prioritization: [2, 6, 10], // 3 سوال
  Discipline: [3, 7, 11], // 3 سوال
  Procrastination_Control: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (4 سوال)
 * فرمول Reverse: 6 - score
 */
export const TIME_MANAGEMENT_REVERSE_ITEMS = [4, 6, 7, 11];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface TimeManagementQuestionMapping {
  questionOrder: number;
  subscale: 'Planning' | 'Prioritization' | 'Discipline' | 'Procrastination_Control';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createTimeManagementQuestionMapping(): TimeManagementQuestionMapping[] {
  const mapping: TimeManagementQuestionMapping[] = [];
  const reverseSet = new Set(TIME_MANAGEMENT_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(TIME_MANAGEMENT_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Planning' | 'Prioritization' | 'Discipline' | 'Procrastination_Control',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Time Management
 */
export const TIME_MANAGEMENT_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Planning', 'Prioritization', 'Discipline', 'Procrastination_Control'],
  reverseItems: TIME_MANAGEMENT_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Planning',
      items: TIME_MANAGEMENT_SUBSCALES.Planning,
    },
    {
      name: 'Prioritization',
      items: TIME_MANAGEMENT_SUBSCALES.Prioritization,
    },
    {
      name: 'Discipline',
      items: TIME_MANAGEMENT_SUBSCALES.Discipline,
    },
    {
      name: 'Procrastination_Control',
      items: TIME_MANAGEMENT_SUBSCALES.Procrastination_Control,
    },
  ],
  weighting: {
    'strongly_disagree': 1,  // کاملاً مخالفم
    'disagree': 2,           // مخالفم
    'neutral': 3,            // نه موافق نه مخالف
    'agree': 4,              // موافقم
    'strongly_agree': 5,     // کاملاً موافقم
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد Time Management
 */
export const TIME_MANAGEMENT_CUTOFFS = {
  Planning: [
    {
      min: 1.0,
      max: 2.4,
      label: 'پایین',
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
      max: 5.0,
      label: 'بالا',
      severity: undefined as const,
      percentile: '3.5-5.0',
    },
  ],
  // همین cutoff برای همه 4 زیرمقیاس
  Prioritization: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Discipline: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Procrastination_Control: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const TIME_MANAGEMENT_INTERPRETATIONS = {
  Planning: {
    high: 'هدف‌گذاری دقیق، تقسیم کار، برنامه‌ریزی روزانه/هفتگی',
    low: 'مشکل در برنامه‌ریزی، نیاز به توسعه مهارت‌های هدف‌گذاری و تقسیم کار',
  },
  Prioritization: {
    high: 'شناخت کارهای مهم، مدیریت انرژی، جلوگیری از اتلاف وقت',
    low: 'مشکل در اولویت‌بندی، نیاز به توسعه مهارت‌های تشخیص کارهای مهم',
  },
  Discipline: {
    high: 'اجرای برنامه، پایبندی به زمان‌بندی، نظم در کار',
    low: 'مشکل در نظم و انضباط، نیاز به توسعه مهارت‌های پایبندی به برنامه',
  },
  Procrastination_Control: {
    high: 'مدیریت تعلل، شروع به‌موقع کار، کنترل «اجتناب» ذهنی',
    low: 'مشکل در کنترل تعلل، نیاز به توسعه مهارت‌های شروع به‌موقع و مدیریت اجتناب',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getTimeManagementConfigJSON(): string {
  return JSON.stringify(TIME_MANAGEMENT_CONFIG);
}

/**
 * محاسبه نمره Time Management
 * Time Management از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * Range: 1-5
 */
export function calculateTimeManagementScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Planning: number;
    Prioritization: number;
    Discipline: number;
    Procrastination_Control: number;
  };
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Planning: [],
    Prioritization: [],
    Discipline: [],
    Procrastination_Control: [],
  };
  const reverseSet = new Set(TIME_MANAGEMENT_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Planning' | 'Prioritization' | 'Discipline' | 'Procrastination_Control' | null = null;
    if (TIME_MANAGEMENT_SUBSCALES.Planning.includes(questionOrder)) {
      subscale = 'Planning';
    } else if (TIME_MANAGEMENT_SUBSCALES.Prioritization.includes(questionOrder)) {
      subscale = 'Prioritization';
    } else if (TIME_MANAGEMENT_SUBSCALES.Discipline.includes(questionOrder)) {
      subscale = 'Discipline';
    } else if (TIME_MANAGEMENT_SUBSCALES.Procrastination_Control.includes(questionOrder)) {
      subscale = 'Procrastination_Control';
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

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Planning >= 3.5) {
    interpretations.push(`برنامه‌ریزی بالا: ${TIME_MANAGEMENT_INTERPRETATIONS.Planning.high}`);
  } else if (subscaleMeans.Planning <= 2.4) {
    interpretations.push(`برنامه‌ریزی پایین: ${TIME_MANAGEMENT_INTERPRETATIONS.Planning.low}`);
  }
  
  if (subscaleMeans.Prioritization >= 3.5) {
    interpretations.push(`اولویت‌بندی بالا: ${TIME_MANAGEMENT_INTERPRETATIONS.Prioritization.high}`);
  } else if (subscaleMeans.Prioritization <= 2.4) {
    interpretations.push(`اولویت‌بندی پایین: ${TIME_MANAGEMENT_INTERPRETATIONS.Prioritization.low}`);
  }
  
  if (subscaleMeans.Discipline >= 3.5) {
    interpretations.push(`نظم و انضباط بالا: ${TIME_MANAGEMENT_INTERPRETATIONS.Discipline.high}`);
  } else if (subscaleMeans.Discipline <= 2.4) {
    interpretations.push(`نظم و انضباط پایین: ${TIME_MANAGEMENT_INTERPRETATIONS.Discipline.low}`);
  }
  
  if (subscaleMeans.Procrastination_Control >= 3.5) {
    interpretations.push(`کنترل تعلل بالا: ${TIME_MANAGEMENT_INTERPRETATIONS.Procrastination_Control.high}`);
  } else if (subscaleMeans.Procrastination_Control <= 2.4) {
    interpretations.push(`کنترل تعلل پایین: ${TIME_MANAGEMENT_INTERPRETATIONS.Procrastination_Control.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های مدیریت زمان متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Planning <= 2.4) {
    recommendedTests.push('time-preference'); // Time Preference
    recommendedTests.push('problem-solving'); // Problem Solving
    recommendedTests.push('executive-function'); // Executive Function
  }
  
  if (subscaleMeans.Prioritization <= 2.4) {
    recommendedTests.push('focus'); // Focus
    recommendedTests.push('stress-management'); // Stress Management
    recommendedTests.push('eq'); // EQ (برای آگاهی از نیازها)
  }
  
  if (subscaleMeans.Discipline <= 2.4) {
    recommendedTests.push('habit-formation'); // Habit Formation
    recommendedTests.push('productivity-skills'); // Productivity Skills
    recommendedTests.push('gad7'); // Anxiety (اگر استرس دلیل تعلل باشد)
  }
  
  if (subscaleMeans.Procrastination_Control <= 2.4) {
    recommendedTests.push('ders'); // DERS (تنظیم هیجان)
    recommendedTests.push('maas'); // MAAS (ذهن‌آگاهی)
    recommendedTests.push('motivation-profile'); // Motivation Profile Test (در آینده)
  }

  return {
    subscales: subscaleMeans as {
      Planning: number;
      Prioritization: number;
      Discipline: number;
      Procrastination_Control: number;
    },
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

