/**
 * Config استاندارد برای تست Problem Solving (حل مسئله)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین مدل‌های حل مسئله ساخته شده:
 * - Problem-Solving Inventory (PSI – Heppner)
 * - Cognitive Problem-Solving Skills Test
 * - Executive Function / Decision-Making frameworks
 * 
 * این تست کیفیت مهارت حل مسئله را نه فقط در عمل، بلکه در شناخت، احساس و رویکرد ذهنی هم می‌سنجد.
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Problem Identification (تشخیص مسئله): 3 سوال
 * - Generating Solutions (تولید راه‌حل): 3 سوال
 * - Decision-Making (تصمیم‌گیری): 3 سوال
 * - Execution & Evaluation (اجرا و ارزیابی): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 3 سوال reverse (5, 10, 8)
 * نمره هر زیرمقیاس: میانگین 1-5
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const PROBLEM_SOLVING_SUBSCALES = {
  Problem_Identification: [1, 5, 9], // 3 سوال
  Generating_Solutions: [2, 6, 10], // 3 سوال
  Decision_Making: [3, 7, 11], // 3 سوال
  Execution_Evaluation: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (3 سوال)
 * فرمول Reverse: 6 - score
 */
export const PROBLEM_SOLVING_REVERSE_ITEMS = [5, 10, 8];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface ProblemSolvingQuestionMapping {
  questionOrder: number;
  subscale: 'Problem_Identification' | 'Generating_Solutions' | 'Decision_Making' | 'Execution_Evaluation';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createProblemSolvingQuestionMapping(): ProblemSolvingQuestionMapping[] {
  const mapping: ProblemSolvingQuestionMapping[] = [];
  const reverseSet = new Set(PROBLEM_SOLVING_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(PROBLEM_SOLVING_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Problem_Identification' | 'Generating_Solutions' | 'Decision_Making' | 'Execution_Evaluation',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Problem Solving
 */
export const PROBLEM_SOLVING_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Problem_Identification', 'Generating_Solutions', 'Decision_Making', 'Execution_Evaluation'],
  reverseItems: PROBLEM_SOLVING_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Problem_Identification',
      items: PROBLEM_SOLVING_SUBSCALES.Problem_Identification,
    },
    {
      name: 'Generating_Solutions',
      items: PROBLEM_SOLVING_SUBSCALES.Generating_Solutions,
    },
    {
      name: 'Decision_Making',
      items: PROBLEM_SOLVING_SUBSCALES.Decision_Making,
    },
    {
      name: 'Execution_Evaluation',
      items: PROBLEM_SOLVING_SUBSCALES.Execution_Evaluation,
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
 * Cutoff استاندارد Problem Solving
 */
export const PROBLEM_SOLVING_CUTOFFS = {
  Problem_Identification: [
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
  Generating_Solutions: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Decision_Making: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Execution_Evaluation: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const PROBLEM_SOLVING_INTERPRETATIONS = {
  Problem_Identification: {
    high: 'توانایی دیدن ریشهٔ مشکل، تحلیل اولیه، تشخیص درست شرایط',
    low: 'مشکل در تشخیص مسئله، نیاز به توسعه مهارت‌های تحلیل و مشاهده',
  },
  Generating_Solutions: {
    high: 'تعداد راه‌حل‌های ممکن، خلاقیت در باز کردن مسئله، توانایی فکر کردن خارج از چارچوب',
    low: 'مشکل در تولید راه‌حل، نیاز به توسعه خلاقیت و تفکر انعطاف‌پذیر',
  },
  Decision_Making: {
    high: 'انتخاب مناسب‌ترین گزینه، قاطعیت، ارزیابی ریسک',
    low: 'مشکل در تصمیم‌گیری، نیاز به توسعه قاطعیت و ارزیابی گزینه‌ها',
  },
  Execution_Evaluation: {
    high: 'اجرای راه‌حل، بازبینی نتیجه، اصلاح مسیر در صورت نیاز',
    low: 'مشکل در اجرا و ارزیابی، نیاز به توسعه مهارت‌های پیگیری و بازبینی',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getProblemSolvingConfigJSON(): string {
  return JSON.stringify(PROBLEM_SOLVING_CONFIG);
}

/**
 * محاسبه نمره Problem Solving
 * Problem Solving از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * Range: 1-5
 */
export function calculateProblemSolvingScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Problem_Identification: number;
    Generating_Solutions: number;
    Decision_Making: number;
    Execution_Evaluation: number;
  };
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Problem_Identification: [],
    Generating_Solutions: [],
    Decision_Making: [],
    Execution_Evaluation: [],
  };
  const reverseSet = new Set(PROBLEM_SOLVING_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Problem_Identification' | 'Generating_Solutions' | 'Decision_Making' | 'Execution_Evaluation' | null = null;
    if (PROBLEM_SOLVING_SUBSCALES.Problem_Identification.includes(questionOrder)) {
      subscale = 'Problem_Identification';
    } else if (PROBLEM_SOLVING_SUBSCALES.Generating_Solutions.includes(questionOrder)) {
      subscale = 'Generating_Solutions';
    } else if (PROBLEM_SOLVING_SUBSCALES.Decision_Making.includes(questionOrder)) {
      subscale = 'Decision_Making';
    } else if (PROBLEM_SOLVING_SUBSCALES.Execution_Evaluation.includes(questionOrder)) {
      subscale = 'Execution_Evaluation';
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
  
  if (subscaleMeans.Problem_Identification >= 3.5) {
    interpretations.push(`تشخیص مسئله بالا: ${PROBLEM_SOLVING_INTERPRETATIONS.Problem_Identification.high}`);
  } else if (subscaleMeans.Problem_Identification <= 2.4) {
    interpretations.push(`تشخیص مسئله پایین: ${PROBLEM_SOLVING_INTERPRETATIONS.Problem_Identification.low}`);
  }
  
  if (subscaleMeans.Generating_Solutions >= 3.5) {
    interpretations.push(`تولید راه‌حل بالا: ${PROBLEM_SOLVING_INTERPRETATIONS.Generating_Solutions.high}`);
  } else if (subscaleMeans.Generating_Solutions <= 2.4) {
    interpretations.push(`تولید راه‌حل پایین: ${PROBLEM_SOLVING_INTERPRETATIONS.Generating_Solutions.low}`);
  }
  
  if (subscaleMeans.Decision_Making >= 3.5) {
    interpretations.push(`تصمیم‌گیری بالا: ${PROBLEM_SOLVING_INTERPRETATIONS.Decision_Making.high}`);
  } else if (subscaleMeans.Decision_Making <= 2.4) {
    interpretations.push(`تصمیم‌گیری پایین: ${PROBLEM_SOLVING_INTERPRETATIONS.Decision_Making.low}`);
  }
  
  if (subscaleMeans.Execution_Evaluation >= 3.5) {
    interpretations.push(`اجرا و ارزیابی بالا: ${PROBLEM_SOLVING_INTERPRETATIONS.Execution_Evaluation.high}`);
  } else if (subscaleMeans.Execution_Evaluation <= 2.4) {
    interpretations.push(`اجرا و ارزیابی پایین: ${PROBLEM_SOLVING_INTERPRETATIONS.Execution_Evaluation.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های حل مسئله متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Problem_Identification <= 2.4) {
    recommendedTests.push('focus'); // تمرکز
    recommendedTests.push('maas'); // MAAS (ذهن‌آگاهی)
    recommendedTests.push('cognitive-skills'); // مهارت‌های شناختی
  }
  
  if (subscaleMeans.Generating_Solutions <= 2.4) {
    recommendedTests.push('creativity'); // خلاقیت
    recommendedTests.push('eq'); // EQ (درک موقعیت)
  }
  
  if (subscaleMeans.Decision_Making <= 2.4) {
    recommendedTests.push('time-preference'); // ترجیح زمانی
    recommendedTests.push('leadership'); // Leadership (زیرمقیاس DM)
  }
  
  if (subscaleMeans.Execution_Evaluation <= 2.4) {
    recommendedTests.push('time-management'); // مدیریت زمان
    recommendedTests.push('executive-function'); // عملکرد اجرایی
    recommendedTests.push('stress-management'); // مدیریت استرس
  }

  return {
    subscales: subscaleMeans as {
      Problem_Identification: number;
      Generating_Solutions: number;
      Decision_Making: number;
      Execution_Evaluation: number;
    },
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

