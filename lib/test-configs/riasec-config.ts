/**
 * Config استاندارد برای تست RIASEC (Holland Career Interest Inventory)
 * منبع: مدل شش‌عاملی جان هالند (Holland's Six Personality Types)
 * 
 * این تست پایه‌ی تمام ابزارهای شغلی معتبر جهان است:
 * - O*NET Interest Profiler
 * - Strong Interest Inventory
 * - Holland Codes
 * 
 * تعداد سوالات: 30
 * 6 زیرمقیاس (هر کدام 5 سوال):
 * - Realistic (R): عمل‌گرا / فنی / مکانیکی
 * - Investigative (I): تحلیلی / پژوهشی / علمی
 * - Artistic (A): خلاق / هنری / آزاد
 * - Social (S): کمک‌محور / آموزشی / درمانی
 * - Enterprising (E): رهبری / فروش / مدیریت
 * - Conventional (C): منظم / دفتری / عددی
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * بدون reverse item
 * نمره هر زیرمقیاس: میانگین 1-5
 * پروفایل نهایی: سه حرف اول بر اساس نمرات مرتب شده (مثلاً IAS)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const RIASEC_SUBSCALES = {
  Realistic: [1, 7, 13, 19, 25], // 5 سوال
  Investigative: [2, 8, 14, 20, 26], // 5 سوال
  Artistic: [3, 9, 15, 21, 27], // 5 سوال
  Social: [4, 10, 16, 22, 28], // 5 سوال
  Enterprising: [5, 11, 17, 23, 29], // 5 سوال
  Conventional: [6, 12, 18, 24, 30], // 5 سوال
};

/**
 * لیست سوالات Reverse-Scored
 * RIASEC هیچ reverse item ندارد
 */
export const RIASEC_REVERSE_ITEMS: number[] = [];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface RIASECQuestionMapping {
  questionOrder: number;
  subscale: 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 30 سوال
 */
export function createRIASECQuestionMapping(): RIASECQuestionMapping[] {
  const mapping: RIASECQuestionMapping[] = [];

  // برای هر زیرمقیاس
  Object.entries(RIASEC_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional',
        isReverse: false, // RIASEC هیچ reverse item ندارد
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد RIASEC
 */
export const RIASEC_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Realistic', 'Investigative', 'Artistic', 'Social', 'Enterprising', 'Conventional'],
  reverseItems: [], // RIASEC هیچ reverse item ندارد
  subscales: [
    {
      name: 'Realistic',
      items: RIASEC_SUBSCALES.Realistic,
    },
    {
      name: 'Investigative',
      items: RIASEC_SUBSCALES.Investigative,
    },
    {
      name: 'Artistic',
      items: RIASEC_SUBSCALES.Artistic,
    },
    {
      name: 'Social',
      items: RIASEC_SUBSCALES.Social,
    },
    {
      name: 'Enterprising',
      items: RIASEC_SUBSCALES.Enterprising,
    },
    {
      name: 'Conventional',
      items: RIASEC_SUBSCALES.Conventional,
    },
  ],
  weighting: {
    'not_interested': 1,    // اصلاً علاقه ندارم
    'low': 2,               // کم
    'medium': 3,            // متوسط
    'high': 4,              // زیاد
    'very_high': 5,         // خیلی زیاد
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد RIASEC
 */
export const RIASEC_CUTOFFS = {
  Realistic: [
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
      max: 4.2,
      label: 'زیاد',
      severity: undefined as const,
      percentile: '3.5-4.2',
    },
    {
      min: 4.3,
      max: 5.0,
      label: 'خیلی زیاد',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 6 زیرمقیاس
  Investigative: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'زیاد', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'خیلی زیاد', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Artistic: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'زیاد', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'خیلی زیاد', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Social: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'زیاد', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'خیلی زیاد', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Enterprising: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'زیاد', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'خیلی زیاد', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Conventional: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'زیاد', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'خیلی زیاد', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر تیپ شخصیتی
 */
export const RIASEC_INTERPRETATIONS = {
  Realistic: 'دوست‌دار کارهای عملی، فنی، ساخت‌وساز، مکانیکی. علاقه به کار با دست، ابزار و ماشین‌آلات.',
  Investigative: 'تحلیل، تحقیق، مسائل پیچیده، داده، علوم. علاقه به حل مسائل علمی و پیچیده.',
  Artistic: 'خلاقیت، طراحی، نوآوری، نوشتن، موسیقی. علاقه به کارهای هنری و خلاقانه.',
  Social: 'کمک به دیگران، آموزش، درمانگری، مشاوره. علاقه به کار با مردم و کمک به آن‌ها.',
  Enterprising: 'رهبری، فروش، مدیریت، راه‌اندازی کسب‌وکار. علاقه به رهبری و تأثیرگذاری.',
  Conventional: 'کار دقیق، منظم، حسابداری، بانک، امور اداری. علاقه به کارهای منظم و ساختاریافته.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getRIASECConfigJSON(): string {
  return JSON.stringify(RIASEC_CONFIG);
}

/**
 * تعیین کد RIASEC (سه حرف اول بر اساس نمرات مرتب شده)
 */
export function determineRIASECCode(
  subscales: {
    Realistic: number;
    Investigative: number;
    Artistic: number;
    Social: number;
    Enterprising: number;
    Conventional: number;
  }
): string {
  // مرتب‌سازی نمرات به صورت نزولی
  const sorted = Object.entries(subscales)
    .map(([type, score]) => ({ type, score }))
    .sort((a, b) => b.score - a.score);

  // سه حرف اول
  const code = sorted
    .slice(0, 3)
    .map(item => {
      // تبدیل نام کامل به حرف اول
      const typeMap: { [key: string]: string } = {
        Realistic: 'R',
        Investigative: 'I',
        Artistic: 'A',
        Social: 'S',
        Enterprising: 'E',
        Conventional: 'C',
      };
      return typeMap[item.type] || item.type[0];
    })
    .join('');

  return code;
}

/**
 * محاسبه نمره RIASEC
 * RIASEC از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(5 items)
 * Range: 1-5
 * پروفایل نهایی: سه حرف اول بر اساس نمرات مرتب شده
 */
export function calculateRIASECScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Realistic: number;
    Investigative: number;
    Artistic: number;
    Social: number;
    Enterprising: number;
    Conventional: number;
  };
  code: string; // کد سه‌حرفی (مثلاً IAS)
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Realistic: [],
    Investigative: [],
    Artistic: [],
    Social: [],
    Enterprising: [],
    Conventional: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 30) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Realistic' | 'Investigative' | 'Artistic' | 'Social' | 'Enterprising' | 'Conventional' | null = null;
    if (RIASEC_SUBSCALES.Realistic.includes(questionOrder)) {
      subscale = 'Realistic';
    } else if (RIASEC_SUBSCALES.Investigative.includes(questionOrder)) {
      subscale = 'Investigative';
    } else if (RIASEC_SUBSCALES.Artistic.includes(questionOrder)) {
      subscale = 'Artistic';
    } else if (RIASEC_SUBSCALES.Social.includes(questionOrder)) {
      subscale = 'Social';
    } else if (RIASEC_SUBSCALES.Enterprising.includes(questionOrder)) {
      subscale = 'Enterprising';
    } else if (RIASEC_SUBSCALES.Conventional.includes(questionOrder)) {
      subscale = 'Conventional';
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    // RIASEC هیچ reverse item ندارد
    const score = optionIndex + 1; // تبدیل 0-4 به 1-5

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

  // تعیین کد RIASEC (سه حرف اول)
  const code = determineRIASECCode(subscaleMeans as {
    Realistic: number;
    Investigative: number;
    Artistic: number;
    Social: number;
    Enterprising: number;
    Conventional: number;
  });

  // ساخت تفسیر بر اساس کد
  const codeTypes = code.split('').map(letter => {
    const typeMap: { [key: string]: string } = {
      'R': 'Realistic',
      'I': 'Investigative',
      'A': 'Artistic',
      'S': 'Social',
      'E': 'Enterprising',
      'C': 'Conventional',
    };
    return typeMap[letter] || '';
  });

  const interpretations = codeTypes
    .filter(type => type)
    .map(type => RIASEC_INTERPRETATIONS[type as keyof typeof RIASEC_INTERPRETATIONS])
    .join(' | ');

  const interpretation = `کد شما: ${code}. ${interpretations}`;

  // پیشنهاد تست‌های تکمیلی بر اساس تیپ‌های برتر
  const recommendedTests: string[] = [];
  const topTypes = codeTypes.slice(0, 2); // دو تیپ اول

  if (topTypes.includes('Investigative')) {
    recommendedTests.push('problem-solving'); // حل مسئله
    recommendedTests.push('iq'); // هوش
  }
  
  if (topTypes.includes('Artistic')) {
    recommendedTests.push('creativity'); // خلاقیت
    recommendedTests.push('communication-skills'); // مهارت‌های ارتباطی
  }
  
  if (topTypes.includes('Social')) {
    recommendedTests.push('eq'); // هوش هیجانی (بخصوص Interpersonal)
    recommendedTests.push('attachment'); // دلبستگی
  }
  
  if (topTypes.includes('Enterprising')) {
    recommendedTests.push('leadership'); // رهبری
    recommendedTests.push('decision-making'); // تصمیم‌گیری
  }
  
  if (topTypes.includes('Conventional')) {
    recommendedTests.push('time-management'); // مدیریت زمان
    recommendedTests.push('detail-orientation'); // توجه به جزئیات
  }

  return {
    subscales: subscaleMeans as {
      Realistic: number;
      Investigative: number;
      Artistic: number;
      Social: number;
      Enterprising: number;
      Conventional: number;
    },
    code,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

