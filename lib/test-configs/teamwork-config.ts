/**
 * Config استاندارد برای تست Teamwork / Collaboration (کار تیمی)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین مدل‌های کار تیمی ساخته شده:
 * - Teamwork KSA Test (Knowledge, Skills & Abilities)
 * - Team Climate Inventory (TCI)
 * - Belbin Team Roles Indicators
 * - Collaborative Problem-Solving Models
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Cooperation (همکاری مؤثر): 3 سوال
 * - Communication in Teams (ارتباطات تیمی): 3 سوال
 * - Responsibility & Reliability (مسئولیت‌پذیری / قابل اعتماد بودن): 3 سوال
 * - Conflict Resolution (حل تعارض): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 4 سوال reverse (4, 6, 9, 12)
 * نمره هر زیرمقیاس: میانگین 1-5
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const TEAMWORK_SUBSCALES = {
  Cooperation: [1, 5, 9], // 3 سوال
  Communication: [2, 6, 10], // 3 سوال
  Responsibility: [3, 7, 11], // 3 سوال
  Conflict_Resolution: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (4 سوال)
 * فرمول Reverse: 6 - score
 */
export const TEAMWORK_REVERSE_ITEMS = [4, 6, 9, 12];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface TeamworkQuestionMapping {
  questionOrder: number;
  subscale: 'Cooperation' | 'Communication' | 'Responsibility' | 'Conflict_Resolution';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createTeamworkQuestionMapping(): TeamworkQuestionMapping[] {
  const mapping: TeamworkQuestionMapping[] = [];
  const reverseSet = new Set(TEAMWORK_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(TEAMWORK_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Cooperation' | 'Communication' | 'Responsibility' | 'Conflict_Resolution',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Teamwork
 */
export const TEAMWORK_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Cooperation', 'Communication', 'Responsibility', 'Conflict_Resolution'],
  reverseItems: TEAMWORK_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Cooperation',
      items: TEAMWORK_SUBSCALES.Cooperation,
    },
    {
      name: 'Communication',
      items: TEAMWORK_SUBSCALES.Communication,
    },
    {
      name: 'Responsibility',
      items: TEAMWORK_SUBSCALES.Responsibility,
    },
    {
      name: 'Conflict_Resolution',
      items: TEAMWORK_SUBSCALES.Conflict_Resolution,
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
 * Cutoff استاندارد Teamwork
 */
export const TEAMWORK_CUTOFFS = {
  Cooperation: [
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
  Communication: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Responsibility: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Conflict_Resolution: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const TEAMWORK_INTERPRETATIONS = {
  Cooperation: {
    high: 'کمک به دیگران، هماهنگی در پروژه‌ها، روحیه تیمی',
    low: 'مشکل در همکاری، نیاز به توسعه روحیه تیمی و مشارکت',
  },
  Communication: {
    high: 'شنیدن و فهم دقیق پیام‌ها، انتقال واضح اطلاعات، جلوگیری از سوءتفاهم',
    low: 'مشکل در ارتباطات تیمی، نیاز به بهبود انتقال و دریافت پیام',
  },
  Responsibility: {
    high: 'انجام کار در زمان مشخص، اعتماد تیم به فرد، ثبات عملکرد',
    low: 'مشکل در مسئولیت‌پذیری، نیاز به توسعه قابلیت اعتماد و ثبات',
  },
  Conflict_Resolution: {
    high: 'مدیریت اختلاف، آرام‌سازی تیم، یافتن راه‌حل مشترک',
    low: 'مشکل در حل تعارض، نیاز به توسعه مهارت‌های مدیریت اختلاف',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getTeamworkConfigJSON(): string {
  return JSON.stringify(TEAMWORK_CONFIG);
}

/**
 * محاسبه نمره Teamwork
 * Teamwork از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * Range: 1-5
 */
export function calculateTeamworkScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Cooperation: number;
    Communication: number;
    Responsibility: number;
    Conflict_Resolution: number;
  };
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Cooperation: [],
    Communication: [],
    Responsibility: [],
    Conflict_Resolution: [],
  };
  const reverseSet = new Set(TEAMWORK_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Cooperation' | 'Communication' | 'Responsibility' | 'Conflict_Resolution' | null = null;
    if (TEAMWORK_SUBSCALES.Cooperation.includes(questionOrder)) {
      subscale = 'Cooperation';
    } else if (TEAMWORK_SUBSCALES.Communication.includes(questionOrder)) {
      subscale = 'Communication';
    } else if (TEAMWORK_SUBSCALES.Responsibility.includes(questionOrder)) {
      subscale = 'Responsibility';
    } else if (TEAMWORK_SUBSCALES.Conflict_Resolution.includes(questionOrder)) {
      subscale = 'Conflict_Resolution';
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
  
  if (subscaleMeans.Cooperation >= 3.5) {
    interpretations.push(`همکاری بالا: ${TEAMWORK_INTERPRETATIONS.Cooperation.high}`);
  } else if (subscaleMeans.Cooperation <= 2.4) {
    interpretations.push(`همکاری پایین: ${TEAMWORK_INTERPRETATIONS.Cooperation.low}`);
  }
  
  if (subscaleMeans.Communication >= 3.5) {
    interpretations.push(`ارتباطات تیمی بالا: ${TEAMWORK_INTERPRETATIONS.Communication.high}`);
  } else if (subscaleMeans.Communication <= 2.4) {
    interpretations.push(`ارتباطات تیمی پایین: ${TEAMWORK_INTERPRETATIONS.Communication.low}`);
  }
  
  if (subscaleMeans.Responsibility >= 3.5) {
    interpretations.push(`مسئولیت‌پذیری بالا: ${TEAMWORK_INTERPRETATIONS.Responsibility.high}`);
  } else if (subscaleMeans.Responsibility <= 2.4) {
    interpretations.push(`مسئولیت‌پذیری پایین: ${TEAMWORK_INTERPRETATIONS.Responsibility.low}`);
  }
  
  if (subscaleMeans.Conflict_Resolution >= 3.5) {
    interpretations.push(`حل تعارض بالا: ${TEAMWORK_INTERPRETATIONS.Conflict_Resolution.high}`);
  } else if (subscaleMeans.Conflict_Resolution <= 2.4) {
    interpretations.push(`حل تعارض پایین: ${TEAMWORK_INTERPRETATIONS.Conflict_Resolution.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های کار تیمی متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Communication <= 2.4) {
    recommendedTests.push('communication-skills'); // مهارت‌های ارتباطی
    recommendedTests.push('eq'); // EQ Interpersonal
    recommendedTests.push('active-listening'); // گوش‌دادن فعال
  }
  
  if (subscaleMeans.Responsibility <= 2.4) {
    recommendedTests.push('time-management'); // مدیریت زمان
    recommendedTests.push('decision-making'); // تصمیم‌گیری
    recommendedTests.push('executive-function'); // عملکرد اجرایی
  }
  
  if (subscaleMeans.Conflict_Resolution <= 2.4) {
    recommendedTests.push('ders'); // Emotional Regulation (DERS)
    recommendedTests.push('stress-management'); // مدیریت استرس
    recommendedTests.push('leadership'); // Leadership (بخش EL)
  }
  
  if (subscaleMeans.Cooperation <= 2.4) {
    recommendedTests.push('attachment'); // دلبستگی
    recommendedTests.push('social-awareness'); // آگاهی اجتماعی
    recommendedTests.push('mbti'); // MBTI (برای شناخت سبک تعامل)
  }

  return {
    subscales: subscaleMeans as {
      Cooperation: number;
      Communication: number;
      Responsibility: number;
      Conflict_Resolution: number;
    },
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

