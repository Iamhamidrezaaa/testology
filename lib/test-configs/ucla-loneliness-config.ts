/**
 * Config استاندارد برای تست UCLA Loneliness Scale (Version 3)
 * منبع: Russell, 1996 — UCLA Loneliness Scale (Version 3)
 * 
 * این تست یکی از معتبرترین ابزارهای جهان برای سنجش احساس تنهایی، انزوای اجتماعی، و ارتباطات ناکارآمد است.
 * 
 * تعداد سوالات: 20
 * هیچ زیرمقیاس رسمی ندارد → یک نمره کلی
 * مقیاس پاسخ: 4 گزینه‌ای (1-4) - از 1 شروع می‌شود نه 0!
 * 9 سوال reverse
 * نمره کل: sum(20 items after reverse) → range: 20-80
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست همه سوالات (20 سوال)
 */
export const UCLA_QUESTIONS = Array.from({ length: 20 }, (_, i) => i + 1);

/**
 * لیست سوالات Reverse-Scored (9 سوال)
 * این سوالات مثبت هستند مثل "I feel part of a group of friends"
 * و باید معکوس شوند
 * فرمول Reverse: 5 - score
 */
export const UCLA_REVERSE_ITEMS = [1, 5, 6, 9, 10, 15, 16, 19, 20];

/**
 * Mapping سوالات به reverse status
 */
export interface UCLALonelinessQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 20 سوال
 */
export function createUCLALonelinessQuestionMapping(): UCLALonelinessQuestionMapping[] {
  const reverseSet = new Set(UCLA_REVERSE_ITEMS);
  
  return UCLA_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: reverseSet.has(questionOrder),
  }));
}

/**
 * Config استاندارد UCLA Loneliness
 */
export const UCLA_LONELINESS_CONFIG: ScoringConfig = {
  type: 'sum', // جمع همه سوالات
  reverseItems: UCLA_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Loneliness_Total',
      items: UCLA_QUESTIONS,
    },
  ],
  weighting: {
    'never': 1,      // هیچ‌وقت
    'rarely': 2,     // به‌ندرت
    'sometimes': 3,  // گاهی
    'often': 4,      // همیشه
  },
  minScore: 20,
  maxScore: 80,
};

/**
 * Cutoff استاندارد UCLA Loneliness
 */
export const UCLA_CUTOFFS = {
  Loneliness_Total: [
    {
      min: 20,
      max: 34,
      label: 'پایین (Loneliness Low)',
      severity: undefined as const,
      percentile: '20-34',
    },
    {
      min: 35,
      max: 49,
      label: 'متوسط (Moderate)',
      severity: undefined as const,
      percentile: '35-49',
    },
    {
      min: 50,
      max: 64,
      label: 'بالا (High)',
      severity: 'moderate' as const,
      percentile: '50-64',
    },
    {
      min: 65,
      max: 80,
      label: 'بسیار بالا (Severe Loneliness)',
      severity: 'severe' as const,
      percentile: '65-80',
    },
  ],
};

/**
 * تفسیر برای هر سطح
 */
export const UCLA_INTERPRETATIONS = {
  '20-34': 'احساس تنهایی پایین. روابط کافی، حس پذیرش، شبکه اجتماعی مناسب.',
  '35-49': 'احساس تنهایی متوسط. گه‌گاهی احساس عدم تعلق، نوسانات در روابط، نیاز به بهبود کیفیت ارتباطات.',
  '50-64': 'تنهایی بالا. احساس فاصله از دیگران، کمبود همراهی، کاهش اعتماد اجتماعی، احتمال همراهی با اضطراب/افسردگی.',
  '65-80': 'تنهایی شدید. احساس انزوا، تجربهٔ معنادار از دل‌زدگی اجتماعی، احتمال شدید همراهی با افسردگی و ریسک‌های هیجانی.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getUCLALonelinessConfigJSON(): string {
  return JSON.stringify(UCLA_LONELINESS_CONFIG);
}

/**
 * محاسبه نمره UCLA Loneliness
 * UCLA از sum استفاده می‌کند
 * Total = sum(20 items after reverse)
 * Range: 20-80
 */
export function calculateUCLALonelinessScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3 که معادل 1-4 است) }
): {
  totalScore: number;
  interpretation: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const reverseSet = new Set(UCLA_REVERSE_ITEMS);
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 20) return;

    // تبدیل optionIndex (0-3) به نمره واقعی (1-4)
    let score = optionIndex + 1; // تبدیل 0-3 به 1-4

    // اگر reverse است، معکوس کن: 5 - score
    if (reverseSet.has(questionOrder)) {
      score = 5 - score;
    }

    totalScore += score;
  });

  // تعیین cutoff و تفسیر
  let interpretation = '';
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  
  if (totalScore >= 20 && totalScore <= 34) {
    interpretation = UCLA_INTERPRETATIONS['20-34'];
  } else if (totalScore >= 35 && totalScore <= 49) {
    interpretation = UCLA_INTERPRETATIONS['35-49'];
  } else if (totalScore >= 50 && totalScore <= 64) {
    interpretation = UCLA_INTERPRETATIONS['50-64'];
    severity = 'moderate';
  } else if (totalScore >= 65 && totalScore <= 80) {
    interpretation = UCLA_INTERPRETATIONS['65-80'];
    severity = 'severe';
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScore >= 50) {
    recommendedTests.push('phq9'); // افسردگی
    recommendedTests.push('gad7'); // اضطراب
    recommendedTests.push('psss'); // حمایت اجتماعی
    recommendedTests.push('attachment'); // سبک دلبستگی
  }
  
  if (totalScore >= 35 && totalScore < 50) {
    recommendedTests.push('communication-skills'); // مهارت‌های ارتباطی
    recommendedTests.push('eq'); // هوش هیجانی (بخصوص Interpersonal)
    recommendedTests.push('mbti'); // برای درک الگوی تعامل اجتماعی
  }
  
  if (totalScore >= 65) {
    recommendedTests.push('bdi2'); // جزئیات افسردگی
    recommendedTests.push('hads'); // اضطراب و افسردگی
    recommendedTests.push('psqi'); // کیفیت خواب
  }

  return {
    totalScore,
    interpretation,
    severity,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

