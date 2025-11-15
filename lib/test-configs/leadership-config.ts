/**
 * Config استاندارد برای تست Leadership Assessment (ارزیابی رهبری)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین مدل‌های رهبری ساخته شده:
 * - MLQ – Multifactor Leadership Questionnaire (Bass & Avolio)
 * - LPI – Leadership Practices Inventory (Kouzes & Posner)
 * - Transformational vs Transactional Leadership Scales
 * - Emotional Leadership Model (Goleman)
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Transformational Leadership (رهبری تحول‌گرا): 3 سوال
 * - Transactional Leadership (مراوده‌ای / پاداش‌محور): 3 سوال
 * - Decision-Making & Accountability (تصمیم‌گیری و مسئولیت‌پذیری): 3 سوال
 * - Emotional Leadership (رهبری عاطفی / رابطه‌محور): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 2 سوال reverse (5 و 7)
 * نمره هر زیرمقیاس: میانگین 1-5
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const LEADERSHIP_SUBSCALES = {
  Transformational: [1, 5, 9], // 3 سوال
  Transactional: [2, 6, 10], // 3 سوال
  Decision_Making: [3, 7, 11], // 3 سوال
  Emotional: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (2 سوال)
 * فرمول Reverse: 6 - score
 */
export const LEADERSHIP_REVERSE_ITEMS = [5, 7];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface LeadershipQuestionMapping {
  questionOrder: number;
  subscale: 'Transformational' | 'Transactional' | 'Decision_Making' | 'Emotional';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createLeadershipQuestionMapping(): LeadershipQuestionMapping[] {
  const mapping: LeadershipQuestionMapping[] = [];
  const reverseSet = new Set(LEADERSHIP_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(LEADERSHIP_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Transformational' | 'Transactional' | 'Decision_Making' | 'Emotional',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Leadership
 */
export const LEADERSHIP_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Transformational', 'Transactional', 'Decision_Making', 'Emotional'],
  reverseItems: LEADERSHIP_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Transformational',
      items: LEADERSHIP_SUBSCALES.Transformational,
    },
    {
      name: 'Transactional',
      items: LEADERSHIP_SUBSCALES.Transactional,
    },
    {
      name: 'Decision_Making',
      items: LEADERSHIP_SUBSCALES.Decision_Making,
    },
    {
      name: 'Emotional',
      items: LEADERSHIP_SUBSCALES.Emotional,
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
 * Cutoff استاندارد Leadership
 */
export const LEADERSHIP_CUTOFFS = {
  Transformational: [
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
  Transactional: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Decision_Making: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Emotional: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const LEADERSHIP_INTERPRETATIONS = {
  Transformational: {
    high: 'الهام‌بخش، انگیزه‌بخش، توانایی ایجاد چشم‌انداز. مناسب تیم‌سازی و استارتاپ‌ها.',
    low: 'تمرکز بر وظایف روزمره، کمتر الهام‌بخش، نیاز به توسعه مهارت‌های رهبری تحول‌گرا.',
  },
  Transactional: {
    high: 'شفافیت قوانین، عملکردمحور، مدیریت ساختاری. مناسب محیط‌های رسمی و پروژه‌محور.',
    low: 'کمتر ساختاریافته، نیاز به شفافیت بیشتر در قوانین و انتظارات.',
  },
  Decision_Making: {
    high: 'قاطعیت، مسئولیت‌پذیری، مدیریت بحران، اعتمادسازی.',
    low: 'مشکل در تصمیم‌گیری، نیاز به توسعه قاطعیت و مسئولیت‌پذیری.',
  },
  Emotional: {
    high: 'مهارت‌های بین‌فردی، درک نیازهای افراد، مدیریت تعارض. مناسب تیم‌های انسانی و کارآفرینی.',
    low: 'نیاز به توسعه مهارت‌های بین‌فردی و همدلی.',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getLeadershipConfigJSON(): string {
  return JSON.stringify(LEADERSHIP_CONFIG);
}

/**
 * محاسبه نمره Leadership
 * Leadership از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * Range: 1-5
 */
export function calculateLeadershipScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Transformational: number;
    Transactional: number;
    Decision_Making: number;
    Emotional: number;
  };
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Transformational: [],
    Transactional: [],
    Decision_Making: [],
    Emotional: [],
  };
  const reverseSet = new Set(LEADERSHIP_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Transformational' | 'Transactional' | 'Decision_Making' | 'Emotional' | null = null;
    if (LEADERSHIP_SUBSCALES.Transformational.includes(questionOrder)) {
      subscale = 'Transformational';
    } else if (LEADERSHIP_SUBSCALES.Transactional.includes(questionOrder)) {
      subscale = 'Transactional';
    } else if (LEADERSHIP_SUBSCALES.Decision_Making.includes(questionOrder)) {
      subscale = 'Decision_Making';
    } else if (LEADERSHIP_SUBSCALES.Emotional.includes(questionOrder)) {
      subscale = 'Emotional';
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
  
  if (subscaleMeans.Transformational >= 3.5) {
    interpretations.push(`رهبری تحول‌گرا بالا: ${LEADERSHIP_INTERPRETATIONS.Transformational.high}`);
  } else if (subscaleMeans.Transformational <= 2.4) {
    interpretations.push(`رهبری تحول‌گرا پایین: ${LEADERSHIP_INTERPRETATIONS.Transformational.low}`);
  }
  
  if (subscaleMeans.Transactional >= 3.5) {
    interpretations.push(`رهبری مراوده‌ای بالا: ${LEADERSHIP_INTERPRETATIONS.Transactional.high}`);
  } else if (subscaleMeans.Transactional <= 2.4) {
    interpretations.push(`رهبری مراوده‌ای پایین: ${LEADERSHIP_INTERPRETATIONS.Transactional.low}`);
  }
  
  if (subscaleMeans.Decision_Making >= 3.5) {
    interpretations.push(`تصمیم‌گیری و مسئولیت‌پذیری بالا: ${LEADERSHIP_INTERPRETATIONS.Decision_Making.high}`);
  } else if (subscaleMeans.Decision_Making <= 2.4) {
    interpretations.push(`تصمیم‌گیری و مسئولیت‌پذیری پایین: ${LEADERSHIP_INTERPRETATIONS.Decision_Making.low}`);
  }
  
  if (subscaleMeans.Emotional >= 3.5) {
    interpretations.push(`رهبری عاطفی بالا: ${LEADERSHIP_INTERPRETATIONS.Emotional.high}`);
  } else if (subscaleMeans.Emotional <= 2.4) {
    interpretations.push(`رهبری عاطفی پایین: ${LEADERSHIP_INTERPRETATIONS.Emotional.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'پروفایل رهبری متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Transformational >= 3.5) {
    recommendedTests.push('creativity'); // خلاقیت
    recommendedTests.push('riasec'); // RIASEC – Artistic & Social
    recommendedTests.push('mbti'); // MBTI (NT و NF ترجیحاً)
  }
  
  if (subscaleMeans.Transactional >= 3.5) {
    recommendedTests.push('time-management'); // مدیریت زمان
    recommendedTests.push('detail-orientation'); // توجه به جزئیات
    recommendedTests.push('riasec'); // RIASEC – Conventional
  }
  
  if (subscaleMeans.Decision_Making <= 2.4) {
    recommendedTests.push('problem-solving'); // حل مسئله
    recommendedTests.push('executive-function'); // عملکرد اجرایی
    recommendedTests.push('focus'); // تمرکز
  }
  
  if (subscaleMeans.Emotional <= 2.4) {
    recommendedTests.push('eq'); // هوش هیجانی
    recommendedTests.push('attachment'); // دلبستگی
    recommendedTests.push('interpersonal-skills'); // مهارت‌های بین‌فردی
  }

  return {
    subscales: subscaleMeans as {
      Transformational: number;
      Transactional: number;
      Decision_Making: number;
      Emotional: number;
    },
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

