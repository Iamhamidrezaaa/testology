/**
 * Config استاندارد برای تست Communication Skills (مهارت‌های ارتباطی)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین مدل‌های مهارت‌های ارتباطی ساخته شده:
 * - Interpersonal Communication Inventory (ICI)
 * - Social Skills Inventory (SSI)
 * - Assertiveness Scale
 * - Active Listening Measures
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Expressiveness (بیان‌گری و انتقال پیام): 3 سوال
 * - Active Listening (گوش‌دادن فعال): 3 سوال
 * - Assertiveness (قاطعیت محترمانه): 3 سوال
 * - Social Awareness (آگاهی اجتماعی / درک دیگران): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 3 سوال reverse (6, 9, 12)
 * نمره هر زیرمقیاس: میانگین 1-5
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const COMMUNICATION_SKILLS_SUBSCALES = {
  Expressiveness: [1, 5, 9], // 3 سوال
  Active_Listening: [2, 6, 10], // 3 سوال
  Assertiveness: [3, 7, 11], // 3 سوال
  Social_Awareness: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (3 سوال)
 * فرمول Reverse: 6 - score
 */
export const COMMUNICATION_SKILLS_REVERSE_ITEMS = [6, 9, 12];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface CommunicationSkillsQuestionMapping {
  questionOrder: number;
  subscale: 'Expressiveness' | 'Active_Listening' | 'Assertiveness' | 'Social_Awareness';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createCommunicationSkillsQuestionMapping(): CommunicationSkillsQuestionMapping[] {
  const mapping: CommunicationSkillsQuestionMapping[] = [];
  const reverseSet = new Set(COMMUNICATION_SKILLS_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(COMMUNICATION_SKILLS_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Expressiveness' | 'Active_Listening' | 'Assertiveness' | 'Social_Awareness',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Communication Skills
 */
export const COMMUNICATION_SKILLS_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Expressiveness', 'Active_Listening', 'Assertiveness', 'Social_Awareness'],
  reverseItems: COMMUNICATION_SKILLS_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Expressiveness',
      items: COMMUNICATION_SKILLS_SUBSCALES.Expressiveness,
    },
    {
      name: 'Active_Listening',
      items: COMMUNICATION_SKILLS_SUBSCALES.Active_Listening,
    },
    {
      name: 'Assertiveness',
      items: COMMUNICATION_SKILLS_SUBSCALES.Assertiveness,
    },
    {
      name: 'Social_Awareness',
      items: COMMUNICATION_SKILLS_SUBSCALES.Social_Awareness,
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
 * Cutoff استاندارد Communication Skills
 */
export const COMMUNICATION_SKILLS_CUTOFFS = {
  Expressiveness: [
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
  Active_Listening: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Assertiveness: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Social_Awareness: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const COMMUNICATION_SKILLS_INTERPRETATIONS = {
  Expressiveness: {
    high: 'توان بیان شفاف و جذاب، انتقال پیام مؤثر، راحتی در گفت‌وگو',
    low: 'مشکل در بیان افکار و احساسات، نیاز به توسعه مهارت‌های بیان',
  },
  Active_Listening: {
    high: 'تمرکز کامل روی مخاطب، فهم دقیق پیام‌ها، مدیریت مکالمه مؤثر',
    low: 'مشکل در گوش‌دادن فعال، نیاز به بهبود تمرکز و درک در مکالمات',
  },
  Assertiveness: {
    high: 'توان گفتن «نه»، بیان نیازها بدون پرخاشگری، احترام متقابل در گفت‌وگو',
    low: 'مشکل در قاطعیت، نیاز به توسعه مهارت‌های ابراز نیاز و مرزبندی',
  },
  Social_Awareness: {
    high: 'درک احساسات دیگران، شناخت موقعیت اجتماعی، خواندن زبان بدن',
    low: 'مشکل در درک دیگران، نیاز به توسعه همدلی و آگاهی اجتماعی',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getCommunicationSkillsConfigJSON(): string {
  return JSON.stringify(COMMUNICATION_SKILLS_CONFIG);
}

/**
 * محاسبه نمره Communication Skills
 * Communication Skills از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * Range: 1-5
 */
export function calculateCommunicationSkillsScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Expressiveness: number;
    Active_Listening: number;
    Assertiveness: number;
    Social_Awareness: number;
  };
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Expressiveness: [],
    Active_Listening: [],
    Assertiveness: [],
    Social_Awareness: [],
  };
  const reverseSet = new Set(COMMUNICATION_SKILLS_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Expressiveness' | 'Active_Listening' | 'Assertiveness' | 'Social_Awareness' | null = null;
    if (COMMUNICATION_SKILLS_SUBSCALES.Expressiveness.includes(questionOrder)) {
      subscale = 'Expressiveness';
    } else if (COMMUNICATION_SKILLS_SUBSCALES.Active_Listening.includes(questionOrder)) {
      subscale = 'Active_Listening';
    } else if (COMMUNICATION_SKILLS_SUBSCALES.Assertiveness.includes(questionOrder)) {
      subscale = 'Assertiveness';
    } else if (COMMUNICATION_SKILLS_SUBSCALES.Social_Awareness.includes(questionOrder)) {
      subscale = 'Social_Awareness';
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
  
  if (subscaleMeans.Expressiveness >= 3.5) {
    interpretations.push(`بیان‌گری بالا: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Expressiveness.high}`);
  } else if (subscaleMeans.Expressiveness <= 2.4) {
    interpretations.push(`بیان‌گری پایین: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Expressiveness.low}`);
  }
  
  if (subscaleMeans.Active_Listening >= 3.5) {
    interpretations.push(`گوش‌دادن فعال بالا: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Active_Listening.high}`);
  } else if (subscaleMeans.Active_Listening <= 2.4) {
    interpretations.push(`گوش‌دادن فعال پایین: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Active_Listening.low}`);
  }
  
  if (subscaleMeans.Assertiveness >= 3.5) {
    interpretations.push(`قاطعیت بالا: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Assertiveness.high}`);
  } else if (subscaleMeans.Assertiveness <= 2.4) {
    interpretations.push(`قاطعیت پایین: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Assertiveness.low}`);
  }
  
  if (subscaleMeans.Social_Awareness >= 3.5) {
    interpretations.push(`آگاهی اجتماعی بالا: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Social_Awareness.high}`);
  } else if (subscaleMeans.Social_Awareness <= 2.4) {
    interpretations.push(`آگاهی اجتماعی پایین: ${COMMUNICATION_SKILLS_INTERPRETATIONS.Social_Awareness.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های ارتباطی متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Expressiveness <= 2.4) {
    recommendedTests.push('eq'); // EQ – زیرمقیاس بیان هیجانی
    recommendedTests.push('riasec'); // RIASEC – Artistic
    recommendedTests.push('rosenberg'); // Self-Esteem (RSES)
  }
  
  if (subscaleMeans.Active_Listening <= 2.4) {
    recommendedTests.push('focus'); // Focus & Attention
    recommendedTests.push('ucla'); // UCLA Loneliness
    recommendedTests.push('eq'); // Interpersonal EQ
  }
  
  if (subscaleMeans.Assertiveness <= 2.4) {
    recommendedTests.push('ders'); // DERS (تنظیم هیجان)
    recommendedTests.push('decision-making'); // Decision-Making
    recommendedTests.push('spin'); // Social Anxiety (SPIN)
  }
  
  if (subscaleMeans.Social_Awareness <= 2.4) {
    recommendedTests.push('attachment'); // Attachment
    recommendedTests.push('empathy'); // Empathy Scale
    recommendedTests.push('eq'); // EQ Interpersonal
  }

  return {
    subscales: subscaleMeans as {
      Expressiveness: number;
      Active_Listening: number;
      Assertiveness: number;
      Social_Awareness: number;
    },
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

