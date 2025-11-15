/**
 * Config استاندارد برای تست محیط ایده‌آل (Ideal Environment Profile)
 * 
 * این تست ترجیحات محیطی فرد را می‌سنجد تا مشخص شود در چه محیطی بهترین عملکرد را دارد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 4, 5, 6, 7, 10 (5 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Sensory_Preferences: سوالات 1, 5, 9 (Reverse: 5)
 * - Social_Environment: سوالات 2, 6, 10 (Reverse: 6, 10)
 * - Structure_Predictability: سوالات 3, 7, 11 (Reverse: 7)
 * - Stimulation_Variety: سوالات 4, 8, 12 (Reverse: 4)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Ideal Environment
 */
export const IDEAL_ENVIRONMENT_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب عدم‌تناسب یا مقاومت به محیط)
 */
export const IDEAL_ENVIRONMENT_REVERSE_ITEMS = [4, 5, 6, 7, 10];

/**
 * زیرمقیاس‌ها
 */
export const IDEAL_ENVIRONMENT_SUBSCALES = {
  Sensory_Preferences: [1, 5, 9], // Reverse: 5
  Social_Environment: [2, 6, 10], // Reverse: 6, 10
  Structure_Predictability: [3, 7, 11], // Reverse: 7
  Stimulation_Variety: [4, 8, 12], // Reverse: 4
};

/**
 * Mapping سوالات
 */
export interface IdealEnvironmentQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Sensory_Preferences' | 'Social_Environment' | 'Structure_Predictability' | 'Stimulation_Variety';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createIdealEnvironmentQuestionMapping(): IdealEnvironmentQuestionMapping[] {
  return IDEAL_ENVIRONMENT_QUESTIONS.map(questionOrder => {
    let subscale: 'Sensory_Preferences' | 'Social_Environment' | 'Structure_Predictability' | 'Stimulation_Variety';
    
    if (IDEAL_ENVIRONMENT_SUBSCALES.Sensory_Preferences.includes(questionOrder)) {
      subscale = 'Sensory_Preferences';
    } else if (IDEAL_ENVIRONMENT_SUBSCALES.Social_Environment.includes(questionOrder)) {
      subscale = 'Social_Environment';
    } else if (IDEAL_ENVIRONMENT_SUBSCALES.Structure_Predictability.includes(questionOrder)) {
      subscale = 'Structure_Predictability';
    } else {
      subscale = 'Stimulation_Variety';
    }
    
    return {
      questionOrder,
      isReverse: IDEAL_ENVIRONMENT_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Ideal Environment
 */
export const IDEAL_ENVIRONMENT_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: IDEAL_ENVIRONMENT_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Sensory_Preferences',
      items: IDEAL_ENVIRONMENT_SUBSCALES.Sensory_Preferences,
    },
    {
      name: 'Social_Environment',
      items: IDEAL_ENVIRONMENT_SUBSCALES.Social_Environment,
    },
    {
      name: 'Structure_Predictability',
      items: IDEAL_ENVIRONMENT_SUBSCALES.Structure_Predictability,
    },
    {
      name: 'Stimulation_Variety',
      items: IDEAL_ENVIRONMENT_SUBSCALES.Stimulation_Variety,
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
 * Cutoff برای Ideal Environment
 */
export const IDEAL_ENVIRONMENT_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'عدم تطابق با محیط فعلی / فشار محیطی', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / قابل‌بهبود', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'محیط نسبتاً مناسب', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'محیط بسیار هماهنگ و ایده‌آل', severity: null, percentile: '85-100%' },
  ],
  Sensory_Preferences: [
    { min: 1.0, max: 2.4, label: 'حساسیت به محیط حسی', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'ترجیح محیط حسی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'هماهنگی با محیط حسی', severity: null },
  ],
  Social_Environment: [
    { min: 1.0, max: 2.4, label: 'عدم سازگاری با محیط اجتماعی', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'ترجیح محیط اجتماعی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'هماهنگی با محیط اجتماعی', severity: null },
  ],
  Structure_Predictability: [
    { min: 1.0, max: 2.4, label: 'نیاز به انعطاف بیشتر', severity: null },
    { min: 2.5, max: 3.4, label: 'نیاز به ساختار متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'نیاز به ساختار و نظم', severity: null },
  ],
  Stimulation_Variety: [
    { min: 1.0, max: 2.4, label: 'ترجیح روتین ثابت', severity: null },
    { min: 2.5, max: 3.4, label: 'نیاز به تنوع متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'نیاز به تنوع و تغییر', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const IDEAL_ENVIRONMENT_INTERPRETATIONS = {
  1.0: 'عدم تطابق با محیط: شما در محیط فعلی خود احساس راحتی نمی‌کنید و ممکن است فشار محیطی را تجربه کنید. این می‌تواند منجر به کاهش عملکرد، استرس و کاهش کیفیت کار/مطالعه/خلاقیت شود. پیشنهاد می‌شود با تست Stress، Adaptability، Work-Life Balance و Learning Style شروع کنید.',
  2.5: 'محیط متوسط: شما در برخی حوزه‌ها با محیط خود هماهنگ هستید اما در برخی دیگر نیاز به بهبود دارید. با شناسایی نیازهای محیطی خود می‌توانید محیط بهتری برای خود ایجاد کنید.',
  3.5: 'محیط نسبتاً مناسب: شما در بیشتر موارد با محیط خود هماهنگ هستید. این به شما کمک می‌کند تا عملکرد بهتری داشته باشید و آرامش روانی بیشتری تجربه کنید.',
  4.3: 'محیط بسیار هماهنگ: شما در محیط ایده‌آل خود هستید یا می‌دانید چه محیطی برای شما مناسب است. این به شما کمک می‌کند تا بهترین عملکرد را داشته باشید و آرامش روانی کامل را تجربه کنید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getIdealEnvironmentConfigJSON(): string {
  return JSON.stringify({
    ...IDEAL_ENVIRONMENT_CONFIG,
    cutoffs: IDEAL_ENVIRONMENT_CUTOFFS,
  });
}

/**
 * محاسبه نمره Ideal Environment
 */
export function calculateIdealEnvironmentScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Sensory_Preferences: number;
    Social_Environment: number;
    Structure_Predictability: number;
    Stimulation_Variety: number;
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
    Sensory_Preferences: string;
    Social_Environment: string;
    Structure_Predictability: string;
    Stimulation_Variety: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Sensory_Preferences: [],
    Social_Environment: [],
    Structure_Predictability: [],
    Stimulation_Variety: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (IDEAL_ENVIRONMENT_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (IDEAL_ENVIRONMENT_SUBSCALES.Sensory_Preferences.includes(questionOrder)) {
      subscaleScores.Sensory_Preferences.push(score);
    } else if (IDEAL_ENVIRONMENT_SUBSCALES.Social_Environment.includes(questionOrder)) {
      subscaleScores.Social_Environment.push(score);
    } else if (IDEAL_ENVIRONMENT_SUBSCALES.Structure_Predictability.includes(questionOrder)) {
      subscaleScores.Structure_Predictability.push(score);
    } else if (IDEAL_ENVIRONMENT_SUBSCALES.Stimulation_Variety.includes(questionOrder)) {
      subscaleScores.Stimulation_Variety.push(score);
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
  const cutoff = IDEAL_ENVIRONMENT_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = IDEAL_ENVIRONMENT_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = IDEAL_ENVIRONMENT_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = IDEAL_ENVIRONMENT_INTERPRETATIONS[3.5];
  } else {
    interpretation = IDEAL_ENVIRONMENT_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Sensory_Preferences
  if (subscaleMeans.Sensory_Preferences <= 2.4) {
    subscaleInterpretations.Sensory_Preferences = 'حساسیت به محیط حسی: شما به نور، صدا یا محرک‌های حسی حساس هستید. این می‌تواند منجر به اضطراب محیطی، مشکل در تمرکز و کاهش عملکرد شود. پیشنهاد می‌شود تست Sleep، Focus و Anxiety را انجام دهید.';
  } else if (subscaleMeans.Sensory_Preferences <= 3.4) {
    subscaleInterpretations.Sensory_Preferences = 'ترجیح محیط حسی متوسط: شما در حال شناسایی نیازهای حسی خود هستید.';
  } else {
    subscaleInterpretations.Sensory_Preferences = 'هماهنگی با محیط حسی: شما می‌دانید چه نوع محیط حسی برای شما مناسب است و می‌توانید آن را ایجاد کنید.';
  }

  // Social_Environment
  if (subscaleMeans.Social_Environment <= 2.4) {
    subscaleInterpretations.Social_Environment = 'عدم سازگاری با محیط اجتماعی: شما ترجیح می‌دهید در محیط‌های خلوت کار کنید و ممکن است در محیط‌های اجتماعی احساس ناراحتی کنید. این می‌تواند منجر به استرس و کاهش عملکرد شود. پیشنهاد می‌شود تست UCLA (تنهایی)، SPIN (اضطراب اجتماعی) و Attachment را انجام دهید.';
  } else if (subscaleMeans.Social_Environment <= 3.4) {
    subscaleInterpretations.Social_Environment = 'ترجیح محیط اجتماعی متوسط: شما می‌توانید در هر دو محیط اجتماعی و خلوت کار کنید.';
  } else {
    subscaleInterpretations.Social_Environment = 'هماهنگی با محیط اجتماعی: شما از کار در محیط‌های اجتماعی لذت می‌برید و در آن‌ها عملکرد بهتری دارید.';
  }

  // Structure_Predictability
  if (subscaleMeans.Structure_Predictability <= 2.4) {
    subscaleInterpretations.Structure_Predictability = 'نیاز به انعطاف بیشتر: شما به انعطاف و آزادی در محیط کار نیاز دارید و ممکن است در محیط‌های سخت‌گیر یا سخت‌ساختار احساس ناراحتی کنید. پیشنهاد می‌شود تست Adaptability و Time Management را انجام دهید.';
  } else if (subscaleMeans.Structure_Predictability <= 3.4) {
    subscaleInterpretations.Structure_Predictability = 'نیاز به ساختار متوسط: شما می‌توانید در هر دو محیط ساختاریافته و انعطاف‌پذیر کار کنید.';
  } else {
    subscaleInterpretations.Structure_Predictability = 'نیاز به ساختار و نظم: شما به محیط ساختاریافته و قابل پیش‌بینی نیاز دارید تا بهترین عملکرد را داشته باشید.';
  }

  // Stimulation_Variety
  if (subscaleMeans.Stimulation_Variety <= 2.4) {
    subscaleInterpretations.Stimulation_Variety = 'ترجیح روتین ثابت: شما ترجیح می‌دهید در محیط ثابت و قابل پیش‌بینی کار کنید و ممکن است نسبت به تغییر مقاومت داشته باشید. پیشنهاد می‌شود تست Growth Mindset و Curiosity را انجام دهید.';
  } else if (subscaleMeans.Stimulation_Variety <= 3.4) {
    subscaleInterpretations.Stimulation_Variety = 'نیاز به تنوع متوسط: شما می‌توانید در هر دو محیط ثابت و متنوع کار کنید.';
  } else {
    subscaleInterpretations.Stimulation_Variety = 'نیاز به تنوع و تغییر: شما به محیط پویا و متنوع نیاز دارید تا بهترین عملکرد را داشته باشید و از روتین ثابت خسته می‌شوید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('pss10', 'adaptability', 'work-life-balance', 'learning-style', 'psqi');
  }
  
  if (subscaleMeans.Sensory_Preferences <= 2.4) {
    recommendedTests.push('psqi', 'lifestyle-sleep-quality', 'focus-attention', 'gad7');
  }
  
  if (subscaleMeans.Social_Environment <= 2.4) {
    recommendedTests.push('spin', 'ucla', 'attachment');
  }
  
  if (subscaleMeans.Structure_Predictability <= 2.4) {
    recommendedTests.push('adaptability', 'time-management');
  }
  
  if (subscaleMeans.Stimulation_Variety <= 2.4) {
    recommendedTests.push('growth-mindset', 'curiosity');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• ترجیح حسی: ${subscaleMeans.Sensory_Preferences.toFixed(2)}/5\n`;
  interpretation += `• محیط اجتماعی: ${subscaleMeans.Social_Environment.toFixed(2)}/5\n`;
  interpretation += `• ساختار و نظم: ${subscaleMeans.Structure_Predictability.toFixed(2)}/5\n`;
  interpretation += `• تنوع و تغییر: ${subscaleMeans.Stimulation_Variety.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Sensory_Preferences: subscaleMeans.Sensory_Preferences,
      Social_Environment: subscaleMeans.Social_Environment,
      Structure_Predictability: subscaleMeans.Structure_Predictability,
      Stimulation_Variety: subscaleMeans.Stimulation_Variety,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Sensory_Preferences: subscaleInterpretations.Sensory_Preferences,
      Social_Environment: subscaleInterpretations.Social_Environment,
      Structure_Predictability: subscaleInterpretations.Structure_Predictability,
      Stimulation_Variety: subscaleInterpretations.Stimulation_Variety,
    },
  };
}

