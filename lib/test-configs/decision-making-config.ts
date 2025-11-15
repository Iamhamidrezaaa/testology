/**
 * Config استاندارد برای تست Decision-Making (ارزیابی مهارت تصمیم‌گیری)
 * 
 * این تست بر اساس ترکیب دقیق معتبرترین مدل‌های تصمیم‌گیری ساخته شده:
 * - General Decision-Making Style (GDMS)
 * - Decision-Making Competence (DMC)
 * - Cognitive-Reflective Models
 * 
 * این تست به چند دلیل کلیدی فوق‌العاده مهم است:
 * - پیش‌بینی استرس
 * - توانایی مدیریت شغل
 * - رفتار مالی
 * - کنترل تکانه
 * - برنامه‌ریزی و آینده‌نگری
 * - حل مسئله و مدیریت بحران
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس (هر کدام 3 سوال):
 * - Rational Analysis (تحلیل منطقی): 3 سوال
 * - Intuitive Decision-Making (تصمیم‌گیری شهودی): 3 سوال
 * - Risk Evaluation (ارزیابی ریسک): 3 سوال
 * - Decisiveness (قاطعیت / سرعت تصمیم): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 3 سوال reverse (6, 7, 8)
 * نمره هر زیرمقیاس: میانگین 1-5
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const DECISION_MAKING_SUBSCALES = {
  Rational_Analysis: [1, 5, 9], // 3 سوال
  Intuitive: [2, 6, 10], // 3 سوال
  Risk_Evaluation: [3, 7, 11], // 3 سوال
  Decisiveness: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (3 سوال)
 * فرمول Reverse: 6 - score
 */
export const DECISION_MAKING_REVERSE_ITEMS = [6, 7, 8];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface DecisionMakingQuestionMapping {
  questionOrder: number;
  subscale: 'Rational_Analysis' | 'Intuitive' | 'Risk_Evaluation' | 'Decisiveness';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createDecisionMakingQuestionMapping(): DecisionMakingQuestionMapping[] {
  const mapping: DecisionMakingQuestionMapping[] = [];
  const reverseSet = new Set(DECISION_MAKING_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(DECISION_MAKING_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Rational_Analysis' | 'Intuitive' | 'Risk_Evaluation' | 'Decisiveness',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Decision Making
 */
export const DECISION_MAKING_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  dimensions: ['Rational_Analysis', 'Intuitive', 'Risk_Evaluation', 'Decisiveness'],
  reverseItems: DECISION_MAKING_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Rational_Analysis',
      items: DECISION_MAKING_SUBSCALES.Rational_Analysis,
    },
    {
      name: 'Intuitive',
      items: DECISION_MAKING_SUBSCALES.Intuitive,
    },
    {
      name: 'Risk_Evaluation',
      items: DECISION_MAKING_SUBSCALES.Risk_Evaluation,
    },
    {
      name: 'Decisiveness',
      items: DECISION_MAKING_SUBSCALES.Decisiveness,
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
 * Cutoff استاندارد Decision Making
 */
export const DECISION_MAKING_CUTOFFS = {
  Rational_Analysis: [
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
  Intuitive: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Risk_Evaluation: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
  Decisiveness: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 5.0, label: 'بالا', severity: undefined as const, percentile: '3.5-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const DECISION_MAKING_INTERPRETATIONS = {
  Rational_Analysis: {
    high: 'تحلیل داده، منطق، مقایسه گزینه‌ها، تفکر ساختاری',
    low: 'مشکل در تحلیل منطقی، نیاز به توسعه مهارت‌های تفکر ساختاری',
  },
  Intuitive: {
    high: 'تصمیم‌گیری سریع با تکیه بر تجربه، حس درونی، پردازش ناخودآگاه',
    low: 'کمتر تکیه بر شهود، نیاز به توسعه اعتماد به تجربه',
  },
  Risk_Evaluation: {
    high: 'درک خطرات، ارزیابی پیامدها، تفکر پیشگیرانه',
    low: 'مشکل در ارزیابی ریسک، نیاز به توسعه تفکر پیشگیرانه',
  },
  Decisiveness: {
    high: 'سرعت تصمیم‌گیری، قاطعیت، جلوگیری از تعلل',
    low: 'مشکل در قاطعیت، نیاز به توسعه سرعت و قطعیت در تصمیم‌گیری',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getDecisionMakingConfigJSON(): string {
  return JSON.stringify(DECISION_MAKING_CONFIG);
}

/**
 * محاسبه نمره Decision Making
 * Decision Making از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * Range: 1-5
 */
export function calculateDecisionMakingScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Rational_Analysis: number;
    Intuitive: number;
    Risk_Evaluation: number;
    Decisiveness: number;
  };
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Rational_Analysis: [],
    Intuitive: [],
    Risk_Evaluation: [],
    Decisiveness: [],
  };
  const reverseSet = new Set(DECISION_MAKING_REVERSE_ITEMS);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Rational_Analysis' | 'Intuitive' | 'Risk_Evaluation' | 'Decisiveness' | null = null;
    if (DECISION_MAKING_SUBSCALES.Rational_Analysis.includes(questionOrder)) {
      subscale = 'Rational_Analysis';
    } else if (DECISION_MAKING_SUBSCALES.Intuitive.includes(questionOrder)) {
      subscale = 'Intuitive';
    } else if (DECISION_MAKING_SUBSCALES.Risk_Evaluation.includes(questionOrder)) {
      subscale = 'Risk_Evaluation';
    } else if (DECISION_MAKING_SUBSCALES.Decisiveness.includes(questionOrder)) {
      subscale = 'Decisiveness';
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
  
  if (subscaleMeans.Rational_Analysis >= 3.5) {
    interpretations.push(`تحلیل منطقی بالا: ${DECISION_MAKING_INTERPRETATIONS.Rational_Analysis.high}`);
  } else if (subscaleMeans.Rational_Analysis <= 2.4) {
    interpretations.push(`تحلیل منطقی پایین: ${DECISION_MAKING_INTERPRETATIONS.Rational_Analysis.low}`);
  }
  
  if (subscaleMeans.Intuitive >= 3.5) {
    interpretations.push(`تصمیم‌گیری شهودی بالا: ${DECISION_MAKING_INTERPRETATIONS.Intuitive.high}`);
  } else if (subscaleMeans.Intuitive <= 2.4) {
    interpretations.push(`تصمیم‌گیری شهودی پایین: ${DECISION_MAKING_INTERPRETATIONS.Intuitive.low}`);
  }
  
  if (subscaleMeans.Risk_Evaluation >= 3.5) {
    interpretations.push(`ارزیابی ریسک بالا: ${DECISION_MAKING_INTERPRETATIONS.Risk_Evaluation.high}`);
  } else if (subscaleMeans.Risk_Evaluation <= 2.4) {
    interpretations.push(`ارزیابی ریسک پایین: ${DECISION_MAKING_INTERPRETATIONS.Risk_Evaluation.low}`);
  }
  
  if (subscaleMeans.Decisiveness >= 3.5) {
    interpretations.push(`قاطعیت بالا: ${DECISION_MAKING_INTERPRETATIONS.Decisiveness.high}`);
  } else if (subscaleMeans.Decisiveness <= 2.4) {
    interpretations.push(`قاطعیت پایین: ${DECISION_MAKING_INTERPRETATIONS.Decisiveness.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های تصمیم‌گیری متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Rational_Analysis <= 2.4) {
    recommendedTests.push('problem-solving'); // Problem-Solving
    recommendedTests.push('cognitive-skills'); // Cognitive Skills
    recommendedTests.push('focus'); // Focus
  }
  
  if (subscaleMeans.Intuitive >= 3.8) {
    recommendedTests.push('risk-management'); // Risk Management
    recommendedTests.push('time-preference'); // Time Preference
    recommendedTests.push('stress-management'); // Stress Management
  }
  
  if (subscaleMeans.Risk_Evaluation <= 2.4) {
    recommendedTests.push('gad7'); // Anxiety (برای تشخیص اضطراب پنهان)
    recommendedTests.push('time-preference'); // Time Preference
    recommendedTests.push('leadership'); // Leadership (زیرمقیاس DM)
  }
  
  if (subscaleMeans.Decisiveness <= 2.4) {
    recommendedTests.push('procrastination'); // Procrastination
    recommendedTests.push('time-management'); // Time Management
    recommendedTests.push('executive-function'); // Executive Function
  }

  return {
    subscales: subscaleMeans as {
      Rational_Analysis: number;
      Intuitive: number;
      Risk_Evaluation: number;
      Decisiveness: number;
    },
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

