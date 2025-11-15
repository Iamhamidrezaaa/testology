/**
 * Config استاندارد برای تست انطباق‌پذیری (Adaptability Assessment)
 * منبع: 
 * - Adaptability Scale (Martin et al.)
 * - Cognitive Flexibility Inventory (CFI)
 * - Career Adaptability Scale
 * - Resilience frameworks
 * 
 * این تست انطباق‌پذیری و انعطاف‌پذیری در مواجهه با تغییرات را می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 2, 4, 5, 7, 10, 12 (6 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Cognitive_Flexibility: سوالات 1, 5, 9 (Reverse: 5)
 * - Emotional_Adaptability: سوالات 2, 6, 10 (Reverse: 2, 10)
 * - Behavioral_Adaptability: سوالات 3, 7, 11 (Reverse: 7)
 * - Openness_to_Change: سوالات 4, 8, 12 (Reverse: 4, 12)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Adaptability
 */
export const ADAPTABILITY_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب ناتوانی در انطباق یا مقاومت در برابر تغییر)
 */
export const ADAPTABILITY_REVERSE_ITEMS = [2, 4, 5, 7, 10, 12];

/**
 * زیرمقیاس‌ها
 */
export const ADAPTABILITY_SUBSCALES = {
  Cognitive_Flexibility: [1, 5, 9], // Reverse: 5
  Emotional_Adaptability: [2, 6, 10], // Reverse: 2, 10
  Behavioral_Adaptability: [3, 7, 11], // Reverse: 7
  Openness_to_Change: [4, 8, 12], // Reverse: 4, 12
};

/**
 * Mapping سوالات
 */
export interface AdaptabilityQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Cognitive_Flexibility' | 'Emotional_Adaptability' | 'Behavioral_Adaptability' | 'Openness_to_Change';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createAdaptabilityQuestionMapping(): AdaptabilityQuestionMapping[] {
  return ADAPTABILITY_QUESTIONS.map(questionOrder => {
    let subscale: 'Cognitive_Flexibility' | 'Emotional_Adaptability' | 'Behavioral_Adaptability' | 'Openness_to_Change';
    
    if (ADAPTABILITY_SUBSCALES.Cognitive_Flexibility.includes(questionOrder)) {
      subscale = 'Cognitive_Flexibility';
    } else if (ADAPTABILITY_SUBSCALES.Emotional_Adaptability.includes(questionOrder)) {
      subscale = 'Emotional_Adaptability';
    } else if (ADAPTABILITY_SUBSCALES.Behavioral_Adaptability.includes(questionOrder)) {
      subscale = 'Behavioral_Adaptability';
    } else {
      subscale = 'Openness_to_Change';
    }
    
    return {
      questionOrder,
      isReverse: ADAPTABILITY_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Adaptability
 */
export const ADAPTABILITY_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: ADAPTABILITY_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Cognitive_Flexibility',
      items: ADAPTABILITY_SUBSCALES.Cognitive_Flexibility,
    },
    {
      name: 'Emotional_Adaptability',
      items: ADAPTABILITY_SUBSCALES.Emotional_Adaptability,
    },
    {
      name: 'Behavioral_Adaptability',
      items: ADAPTABILITY_SUBSCALES.Behavioral_Adaptability,
    },
    {
      name: 'Openness_to_Change',
      items: ADAPTABILITY_SUBSCALES.Openness_to_Change,
    },
  ],
  weighting: {
    'strongly_disagree': 1,
    'disagree': 2,
    'neutral': 3,
    'agree': 4,
    'strongly_agree': 5,
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff برای Adaptability
 */
export const ADAPTABILITY_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'پایین (سختی در سازگاری)', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط (نیازمند تقویت)', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'عالی / انعطاف‌پذیری قوی', severity: null, percentile: '85-100%' },
  ],
  Cognitive_Flexibility: [
    { min: 1.0, max: 2.4, label: 'انعطاف ذهنی پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'انعطاف ذهنی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'انعطاف ذهنی بالا', severity: null },
  ],
  Emotional_Adaptability: [
    { min: 1.0, max: 2.4, label: 'سازگاری هیجانی پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'سازگاری هیجانی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'سازگاری هیجانی بالا', severity: null },
  ],
  Behavioral_Adaptability: [
    { min: 1.0, max: 2.4, label: 'انعطاف رفتاری پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'انعطاف رفتاری متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'انعطاف رفتاری بالا', severity: null },
  ],
  Openness_to_Change: [
    { min: 1.0, max: 2.4, label: 'گشودگی پایین نسبت به تغییر', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'گشودگی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'گشودگی بالا نسبت به تغییر', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const ADAPTABILITY_INTERPRETATIONS = {
  1.0: 'انطباق‌پذیری پایین: شما در سازگاری با تغییرات و موقعیت‌های جدید مشکل دارید. این می‌تواند منجر به استرس، اضطراب و کاهش کارآمدی شود. پیشنهاد می‌شود با تست Growth Mindset، Curiosity و Stress شروع کنید.',
  2.5: 'انطباق‌پذیری متوسط: شما در برخی موقعیت‌ها می‌توانید سازگار شوید اما در برخی دیگر نیاز به تقویت دارید. با تمرین و آگاهی می‌توانید انطباق‌پذیری خود را بهبود بخشید.',
  3.5: 'انطباق‌پذیری خوب: شما می‌توانید به خوبی با تغییرات و موقعیت‌های جدید سازگار شوید. این به شما کمک می‌کند تا در محیط کار و زندگی موفق باشید.',
  4.3: 'انطباق‌پذیری عالی: شما یک فرد بسیار انعطاف‌پذیر و سازگار هستید. شما می‌توانید به راحتی با تغییرات کنار بیایید و از موقعیت‌های جدید بهره ببرید. این به شما کمک می‌کند تا در محیط‌های پویا و در حال تغییر موفق باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getAdaptabilityConfigJSON(): string {
  return JSON.stringify({
    ...ADAPTABILITY_CONFIG,
    cutoffs: ADAPTABILITY_CUTOFFS,
  });
}

/**
 * محاسبه نمره Adaptability
 */
export function calculateAdaptabilityScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Cognitive_Flexibility: number;
    Emotional_Adaptability: number;
    Behavioral_Adaptability: number;
    Openness_to_Change: number;
  };
  interpretation: string;
  cutoff: {
    min: number;
    max: number;
    label: string;
    severity: 'mild' | 'moderate' | 'severe' | null;
  } | null;
  recommendedTests?: string[];
  subscaleInterpretations: {
    Cognitive_Flexibility: string;
    Emotional_Adaptability: string;
    Behavioral_Adaptability: string;
    Openness_to_Change: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Cognitive_Flexibility: [],
    Emotional_Adaptability: [],
    Behavioral_Adaptability: [],
    Openness_to_Change: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (ADAPTABILITY_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (ADAPTABILITY_SUBSCALES.Cognitive_Flexibility.includes(questionOrder)) {
      subscaleScores.Cognitive_Flexibility.push(score);
    } else if (ADAPTABILITY_SUBSCALES.Emotional_Adaptability.includes(questionOrder)) {
      subscaleScores.Emotional_Adaptability.push(score);
    } else if (ADAPTABILITY_SUBSCALES.Behavioral_Adaptability.includes(questionOrder)) {
      subscaleScores.Behavioral_Adaptability.push(score);
    } else if (ADAPTABILITY_SUBSCALES.Openness_to_Change.includes(questionOrder)) {
      subscaleScores.Openness_to_Change.push(score);
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کل (میانگین همه زیرمقیاس‌ها)
  const totalScore = Object.values(subscaleMeans).reduce((sum, mean) => sum + mean, 0) / Object.keys(subscaleMeans).length;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // تعیین cutoff برای نمره کل
  const cutoff = ADAPTABILITY_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = ADAPTABILITY_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = ADAPTABILITY_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = ADAPTABILITY_INTERPRETATIONS[3.5];
  } else {
    interpretation = ADAPTABILITY_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Cognitive_Flexibility
  if (subscaleMeans.Cognitive_Flexibility <= 2.4) {
    subscaleInterpretations.Cognitive_Flexibility = 'انعطاف ذهنی پایین: شما در تفکر به روش‌های جدید و تغییر زاویه دید مشکل دارید. این می‌تواند منجر به تفکر خشک، گیر کردن در یک راه‌حل و مشکل در حل مسائل شود. پیشنهاد می‌شود تست کنجکاوی و خلاقیت را انجام دهید.';
  } else if (subscaleMeans.Cognitive_Flexibility <= 3.4) {
    subscaleInterpretations.Cognitive_Flexibility = 'انعطاف ذهنی متوسط: شما در حال توسعه انعطاف ذهنی هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Cognitive_Flexibility = 'انعطاف ذهنی بالا: شما می‌توانید به راحتی به روش‌های جدید فکر کنید و زاویه دید خود را تغییر دهید. این به شما کمک می‌کند تا راه‌حل‌های خلاقانه پیدا کنید.';
  }

  // Emotional_Adaptability
  if (subscaleMeans.Emotional_Adaptability <= 2.4) {
    subscaleInterpretations.Emotional_Adaptability = 'سازگاری هیجانی پایین: شما در مدیریت احساسات هنگام تغییر یا موقعیت‌های جدید مشکل دارید. این می‌تواند منجر به استرس زیاد، اضطراب و کاهش کارآمدی شود. پیشنهاد می‌شود تست استرس، اضطراب و تنظیم هیجان را انجام دهید.';
  } else if (subscaleMeans.Emotional_Adaptability <= 3.4) {
    subscaleInterpretations.Emotional_Adaptability = 'سازگاری هیجانی متوسط: شما در حال توسعه مهارت‌های سازگاری هیجانی هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Emotional_Adaptability = 'سازگاری هیجانی بالا: شما می‌توانید به خوبی احساسات خود را در مواجهه با تغییرات مدیریت کنید. این به شما کمک می‌کند تا در موقعیت‌های جدید آرام بمانید.';
  }

  // Behavioral_Adaptability
  if (subscaleMeans.Behavioral_Adaptability <= 2.4) {
    subscaleInterpretations.Behavioral_Adaptability = 'انعطاف رفتاری پایین: شما در تغییر رفتار، عادت‌ها و واکنش‌ها مشکل دارید. این می‌تواند منجر به مقاومت در برابر تغییر و مشکل در سازگاری شود. پیشنهاد می‌شود تست عادت‌ها و انگیزش را انجام دهید.';
  } else if (subscaleMeans.Behavioral_Adaptability <= 3.4) {
    subscaleInterpretations.Behavioral_Adaptability = 'انعطاف رفتاری متوسط: شما در حال توسعه انعطاف رفتاری هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Behavioral_Adaptability = 'انعطاف رفتاری بالا: شما می‌توانید به راحتی رفتار و عادت‌های خود را تغییر دهید. این به شما کمک می‌کند تا با موقعیت‌های جدید سازگار شوید.';
  }

  // Openness_to_Change
  if (subscaleMeans.Openness_to_Change <= 2.4) {
    subscaleInterpretations.Openness_to_Change = 'گشودگی پایین نسبت به تغییر: شما تمایل کمی به تجربه تغییرات دارید و ترجیح می‌دهید در محیط‌های ثابت بمانید. این می‌تواند منجر به گریز از تجربه جدید و محدودیت رشد شود. پیشنهاد می‌شود تست کنجکاوی و Growth Mindset را انجام دهید.';
  } else if (subscaleMeans.Openness_to_Change <= 3.4) {
    subscaleInterpretations.Openness_to_Change = 'گشودگی متوسط نسبت به تغییر: شما در حال توسعه گشودگی نسبت به تغییر هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Openness_to_Change = 'گشودگی بالا نسبت به تغییر: شما به تغییرات بسیار گشوده هستید و از تجربه چیزهای جدید لذت می‌برید. این به شما کمک می‌کند تا به طور مداوم رشد کنید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('growth-mindset', 'curiosity', 'pss10', 'creativity', 'learning-style', 'problem-solving');
  }
  
  if (subscaleMeans.Cognitive_Flexibility <= 2.4) {
    recommendedTests.push('curiosity', 'creativity');
  }
  
  if (subscaleMeans.Emotional_Adaptability <= 2.4) {
    recommendedTests.push('pss10', 'gad7', 'ders');
  }
  
  if (subscaleMeans.Behavioral_Adaptability <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention');
  }
  
  if (subscaleMeans.Openness_to_Change <= 2.4) {
    recommendedTests.push('curiosity', 'growth-mindset');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• انعطاف ذهنی: ${subscaleMeans.Cognitive_Flexibility.toFixed(2)}/5\n`;
  interpretation += `• سازگاری هیجانی: ${subscaleMeans.Emotional_Adaptability.toFixed(2)}/5\n`;
  interpretation += `• انعطاف رفتاری: ${subscaleMeans.Behavioral_Adaptability.toFixed(2)}/5\n`;
  interpretation += `• گشودگی نسبت به تغییر: ${subscaleMeans.Openness_to_Change.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Cognitive_Flexibility: subscaleMeans.Cognitive_Flexibility,
      Emotional_Adaptability: subscaleMeans.Emotional_Adaptability,
      Behavioral_Adaptability: subscaleMeans.Behavioral_Adaptability,
      Openness_to_Change: subscaleMeans.Openness_to_Change,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Cognitive_Flexibility: subscaleInterpretations.Cognitive_Flexibility,
      Emotional_Adaptability: subscaleInterpretations.Emotional_Adaptability,
      Behavioral_Adaptability: subscaleInterpretations.Behavioral_Adaptability,
      Openness_to_Change: subscaleInterpretations.Openness_to_Change,
    },
  };
}

