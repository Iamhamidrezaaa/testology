/**
 * Config استاندارد برای تست RSES (Rosenberg Self-Esteem Scale)
 * منبع: M. Rosenberg (1965) – Society and the Adolescent Self-Image
 * 
 * یکی از پُرکاربردترین تست‌های عزت‌نفس در دنیا
 * 
 * تعداد سوالات: 10
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * کل نمره: 0-30
 * Reverse items: 5 سوال (3, 5, 8, 9, 10)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات RSES (همه مربوط به عزت‌نفس کلی)
 */
export const ROSENBERG_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

/**
 * لیست سوالات Reverse-Scored (5 سوال)
 * این سوالات منفی هستند و باید معکوس نمره‌دهی شوند: reverse_score = 3 - original_score
 */
export const ROSENBERG_REVERSE_ITEMS = [3, 5, 8, 9, 10];

/**
 * Mapping سوالات
 */
export interface RosenbergQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 10 سوال
 */
export function createRosenbergQuestionMapping(): RosenbergQuestionMapping[] {
  const reverseSet = new Set(ROSENBERG_REVERSE_ITEMS);
  
  return ROSENBERG_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: reverseSet.has(questionOrder),
  }));
}

/**
 * Config استاندارد RSES
 */
export const ROSENBERG_CONFIG: ScoringConfig = {
  type: 'sum', // جمع ساده
  reverseItems: ROSENBERG_REVERSE_ITEMS,
  weighting: {
    'strongly_disagree': 0,  // کاملاً مخالفم
    'disagree': 1,            // مخالفم
    'agree': 2,               // موافقم
    'strongly_agree': 3,      // کاملاً موافقم
  },
  minScore: 0,
  maxScore: 30, // 10 سوال × 3 = 30
};

/**
 * Cutoff رسمی RSES (استاندارد جهانی)
 */
export const ROSENBERG_CUTOFFS = {
  total: [
    { min: 0, max: 14, label: 'عزت‌نفس پایین', severity: null, percentile: '0-47%' },
    { min: 15, max: 25, label: 'عزت‌نفس متوسط / نرمال', severity: null, percentile: '47-83%' },
    { min: 26, max: 30, label: 'عزت‌نفس بالا', severity: null, percentile: '83-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const ROSENBERG_INTERPRETATIONS = {
  0: 'شک به ارزشمندی خود، حساسیت به انتقاد، گرایش به خودسرزنشی، آسیب‌پذیری هیجانی',
  15: 'دید واقع‌گرایانه نسبت به خود، توانایی مدیریت چالش‌ها، نوسانات جزئی طبیعی',
  26: 'اعتمادبه‌نفس، رضایت از خویشتن، ثبات هیجانی، انگیزه بالا',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getRosenbergConfigJSON(): string {
  return JSON.stringify({
    ...ROSENBERG_CONFIG,
    cutoffs: ROSENBERG_CUTOFFS,
  });
}

/**
 * محاسبه نمره RSES
 */
export function calculateRosenbergScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3) }
): {
  totalScore: number;
  interpretation: string;
  cutoff: {
    min: number;
    max: number;
    label: string;
    severity: 'mild' | 'moderate' | 'severe' | null;
  } | null;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  // محاسبه نمره کل
  let totalScore = 0;
  const reverseSet = new Set(ROSENBERG_REVERSE_ITEMS);
  
  ROSENBERG_QUESTIONS.forEach(questionOrder => {
    const answer = answers[questionOrder];
    if (answer === undefined || answer === null) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    let score = answer;

    // اگر reverse است، معکوس کن: 3 - score
    if (reverseSet.has(questionOrder)) {
      score = 3 - score;
    }

    totalScore += score;
  });

  // تعیین cutoff
  const cutoff = ROSENBERG_CUTOFFS.total.find(
    c => totalScore >= c.min && totalScore <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScore <= 14) {
    interpretation = ROSENBERG_INTERPRETATIONS[0];
  } else if (totalScore <= 25) {
    interpretation = ROSENBERG_INTERPRETATIONS[15];
  } else {
    interpretation = ROSENBERG_INTERPRETATIONS[26];
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (totalScore <= 14) {
    recommendedTests.push('bdi2'); // چون عزت‌نفس پایین با افسردگی پایدار همبستگی دارد
    recommendedTests.push('gad7'); // ناامنی + اضطراب اجتماعی
    recommendedTests.push('attachment'); // دلبستگی
    recommendedTests.push('spin'); // Social Anxiety
  } else if (totalScore >= 15 && totalScore <= 20) {
    recommendedTests.push('eq'); // هوش هیجانی → ارتباط مستقیم با Self-Esteem
    recommendedTests.push('communication-skills'); // ارتباطات
  } else if (totalScore >= 26) {
    recommendedTests.push('growth-mindset'); // تست‌های رشد فردی
    recommendedTests.push('curiosity'); // کنجکاوی
    recommendedTests.push('adaptability'); // انعطاف‌پذیری
  }

  return {
    totalScore,
    interpretation,
    cutoff,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

