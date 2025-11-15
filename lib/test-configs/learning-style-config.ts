/**
 * Config استاندارد برای تست سبک یادگیری (Learning Style Assessment)
 * 
 * این تست بر اساس مدل‌های علمی معتبر طراحی شده:
 * - Reflective vs Active Learning (Kolb, Honey & Mumford)
 * - Analytical vs Practical Processing
 * - Self-Regulated Learning (Zimmerman)
 * - Environment Preference
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 3, 5, 7, 10
 * 
 * زیرمقیاس‌ها:
 * - Reflective_Active: سوالات 1, 5, 9 (Reverse: 5)
 * - Analytical_Practical: سوالات 2, 6, 10 (Reverse: 10)
 * - Self_Regulated: سوالات 3, 7, 11 (Reverse: 3, 7)
 * - Environment: سوالات 4, 8, 12 (بدون Reverse)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Learning Style
 */
export const LEARNING_STYLE_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse
 */
export const LEARNING_STYLE_REVERSE_ITEMS = [3, 5, 7, 10];

/**
 * زیرمقیاس‌ها
 */
export const LEARNING_STYLE_SUBSCALES = {
  Reflective_Active: [1, 5, 9], // Reverse: 5
  Analytical_Practical: [2, 6, 10], // Reverse: 10
  Self_Regulated: [3, 7, 11], // Reverse: 3, 7
  Environment: [4, 8, 12], // بدون Reverse
};

/**
 * Mapping سوالات
 */
export interface LearningStyleQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Reflective_Active' | 'Analytical_Practical' | 'Self_Regulated' | 'Environment';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createLearningStyleQuestionMapping(): LearningStyleQuestionMapping[] {
  return LEARNING_STYLE_QUESTIONS.map(questionOrder => {
    let subscale: 'Reflective_Active' | 'Analytical_Practical' | 'Self_Regulated' | 'Environment';
    
    if (LEARNING_STYLE_SUBSCALES.Reflective_Active.includes(questionOrder)) {
      subscale = 'Reflective_Active';
    } else if (LEARNING_STYLE_SUBSCALES.Analytical_Practical.includes(questionOrder)) {
      subscale = 'Analytical_Practical';
    } else if (LEARNING_STYLE_SUBSCALES.Self_Regulated.includes(questionOrder)) {
      subscale = 'Self_Regulated';
    } else {
      subscale = 'Environment';
    }
    
    return {
      questionOrder,
      isReverse: LEARNING_STYLE_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Learning Style
 */
export const LEARNING_STYLE_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: LEARNING_STYLE_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Reflective_Active',
      items: LEARNING_STYLE_SUBSCALES.Reflective_Active,
    },
    {
      name: 'Analytical_Practical',
      items: LEARNING_STYLE_SUBSCALES.Analytical_Practical,
    },
    {
      name: 'Self_Regulated',
      items: LEARNING_STYLE_SUBSCALES.Self_Regulated,
    },
    {
      name: 'Environment',
      items: LEARNING_STYLE_SUBSCALES.Environment,
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
 * Cutoff برای Learning Style
 */
export const LEARNING_STYLE_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'غیرسازگار / بی‌نظم / نیازمند راهنمایی', severity: null, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / نیازمند اصلاح سبک مطالعه', severity: 'mild' as const, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'یادگیرنده مؤثر', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'یادگیرنده بسیار مؤثر و خودتنظیم', severity: null, percentile: '85-100%' },
  ],
  Reflective_Active: [
    { min: 1.0, max: 2.4, label: 'یادگیرنده فعال (ترجیح تجربه مستقیم)', severity: null },
    { min: 2.5, max: 3.4, label: 'ترکیبی', severity: null },
    { min: 3.5, max: 5.0, label: 'یادگیرنده تأمل‌گرا (ترجیح تحلیل و مرور)', severity: null },
  ],
  Analytical_Practical: [
    { min: 1.0, max: 2.4, label: 'یادگیرنده عملی (ترجیح تجربه و عمل)', severity: null },
    { min: 2.5, max: 3.4, label: 'ترکیبی', severity: null },
    { min: 3.5, max: 5.0, label: 'یادگیرنده تحلیلی (ترجیح ساختار و منطق)', severity: null },
  ],
  Self_Regulated: [
    { min: 1.0, max: 2.4, label: 'بی‌نظم / نیازمند راهنمایی', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: null },
    { min: 3.5, max: 4.2, label: 'خوب', severity: null },
    { min: 4.3, max: 5.0, label: 'خودتنظیم و منظم', severity: null },
  ],
  Environment: [
    { min: 1.0, max: 2.4, label: 'نیازمند محیط خاص', severity: null },
    { min: 2.5, max: 3.4, label: 'انعطاف‌پذیر متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'انعطاف‌پذیر و سازگار', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const LEARNING_STYLE_INTERPRETATIONS = {
  1.0: 'پروفایل یادگیری شما نشان می‌دهد که در حال حاضر نیازمند راهنمایی و ساختار بیشتر هستید. پیشنهاد می‌شود با تمرین‌های مدیریت زمان و تمرکز شروع کنید.',
  2.5: 'سبک یادگیری شما در حال توسعه است. با اصلاح عادات مطالعه و استفاده از تکنیک‌های مؤثر می‌توانید پیشرفت قابل توجهی داشته باشید.',
  3.5: 'شما یک یادگیرنده مؤثر هستید. سبک یادگیری شما به خوبی توسعه یافته و می‌توانید از آن برای یادگیری بهتر استفاده کنید.',
  4.3: 'شما یک یادگیرنده بسیار مؤثر و خودتنظیم هستید. سبک یادگیری شما بهینه است و می‌توانید به طور مستقل و مؤثر یاد بگیرید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getLearningStyleConfigJSON(): string {
  return JSON.stringify({
    ...LEARNING_STYLE_CONFIG,
    cutoffs: LEARNING_STYLE_CUTOFFS,
  });
}

/**
 * محاسبه نمره Learning Style
 */
export function calculateLearningStyleScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Reflective_Active: number;
    Analytical_Practical: number;
    Self_Regulated: number;
    Environment: number;
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
    Reflective_Active: string;
    Analytical_Practical: string;
    Self_Regulated: string;
    Environment: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Reflective_Active: [],
    Analytical_Practical: [],
    Self_Regulated: [],
    Environment: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (LEARNING_STYLE_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (LEARNING_STYLE_SUBSCALES.Reflective_Active.includes(questionOrder)) {
      subscaleScores.Reflective_Active.push(score);
    } else if (LEARNING_STYLE_SUBSCALES.Analytical_Practical.includes(questionOrder)) {
      subscaleScores.Analytical_Practical.push(score);
    } else if (LEARNING_STYLE_SUBSCALES.Self_Regulated.includes(questionOrder)) {
      subscaleScores.Self_Regulated.push(score);
    } else if (LEARNING_STYLE_SUBSCALES.Environment.includes(questionOrder)) {
      subscaleScores.Environment.push(score);
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
  const cutoff = LEARNING_STYLE_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = LEARNING_STYLE_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = LEARNING_STYLE_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = LEARNING_STYLE_INTERPRETATIONS[3.5];
  } else {
    interpretation = LEARNING_STYLE_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Reflective_Active
  if (subscaleMeans.Reflective_Active <= 2.4) {
    subscaleInterpretations.Reflective_Active = 'یادگیرنده فعال: شما ترجیح می‌دهید از طریق تجربه مستقیم و عمل یاد بگیرید. پروژه‌محوری، ویدئو و تمرین برای شما مناسب‌تر است.';
  } else if (subscaleMeans.Reflective_Active >= 3.5) {
    subscaleInterpretations.Reflective_Active = 'یادگیرنده تأمل‌گرا: شما نیاز به مرور، یادداشت‌برداری و تحلیل دارید. مطالعه عمیق و ساختارمند برای شما مناسب‌تر است.';
  } else {
    subscaleInterpretations.Reflective_Active = 'ترکیبی: شما می‌توانید از هر دو سبک فعال و تأمل‌گرا بهره ببرید.';
  }

  // Analytical_Practical
  if (subscaleMeans.Analytical_Practical <= 2.4) {
    subscaleInterpretations.Analytical_Practical = 'یادگیرنده عملی: شما ترجیح می‌دهید از طریق تجربه و عمل یاد بگیرید. کارآموزی، پروژه‌های عملی و هنر برای شما مناسب‌تر است.';
  } else if (subscaleMeans.Analytical_Practical >= 3.5) {
    subscaleInterpretations.Analytical_Practical = 'یادگیرنده تحلیلی: شما تفکر تحلیلی و ساختارمند دارید. علوم، مهندسی و منطق برای شما مناسب‌تر است.';
  } else {
    subscaleInterpretations.Analytical_Practical = 'ترکیبی: شما می‌توانید از هر دو سبک تحلیلی و عملی بهره ببرید.';
  }

  // Self_Regulated
  if (subscaleMeans.Self_Regulated <= 2.4) {
    subscaleInterpretations.Self_Regulated = 'بی‌نظم و نیازمند راهنمایی: شما در برنامه‌ریزی و نظم مطالعه نیاز به بهبود دارید. پیشنهاد می‌شود تست‌های مدیریت زمان، تمرکز و انگیزش را انجام دهید.';
  } else if (subscaleMeans.Self_Regulated <= 3.4) {
    subscaleInterpretations.Self_Regulated = 'متوسط: مهارت‌های خودتنظیمی شما در حال توسعه است. با تمرین می‌توانید بهبود یابید.';
  } else if (subscaleMeans.Self_Regulated <= 4.2) {
    subscaleInterpretations.Self_Regulated = 'خوب: شما مهارت‌های خودتنظیمی مناسبی دارید و می‌توانید به طور مؤثر یاد بگیرید.';
  } else {
    subscaleInterpretations.Self_Regulated = 'خودتنظیم و منظم: شما مهارت‌های عالی در برنامه‌ریزی و نظم مطالعه دارید.';
  }

  // Environment
  if (subscaleMeans.Environment <= 2.4) {
    subscaleInterpretations.Environment = 'نیازمند محیط خاص: شما در محیط‌های خاص بهتر یاد می‌گیرید. بهتر است محیط یادگیری خود را شناسایی و بهینه کنید.';
  } else if (subscaleMeans.Environment <= 3.4) {
    subscaleInterpretations.Environment = 'انعطاف‌پذیر متوسط: شما می‌توانید در محیط‌های مختلف یاد بگیرید اما ترجیحات مشخصی دارید.';
  } else {
    subscaleInterpretations.Environment = 'انعطاف‌پذیر و سازگار: شما می‌توانید در محیط‌های مختلف به خوبی یاد بگیرید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Self_Regulated <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention', 'maas');
  }
  
  if (subscaleMeans.Analytical_Practical <= 2.4 && subscaleMeans.Reflective_Active <= 2.4) {
    recommendedTests.push('mbti', 'bfi');
  }
  
  if (subscaleMeans.Environment <= 2.4) {
    recommendedTests.push('psqi', 'isi', 'focus-attention');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• فعال/تأمل‌گرا: ${subscaleMeans.Reflective_Active.toFixed(2)}/5\n`;
  interpretation += `• تحلیلی/عملی: ${subscaleMeans.Analytical_Practical.toFixed(2)}/5\n`;
  interpretation += `• خودتنظیمی: ${subscaleMeans.Self_Regulated.toFixed(2)}/5\n`;
  interpretation += `• ترجیح محیط: ${subscaleMeans.Environment.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Reflective_Active: subscaleMeans.Reflective_Active,
      Analytical_Practical: subscaleMeans.Analytical_Practical,
      Self_Regulated: subscaleMeans.Self_Regulated,
      Environment: subscaleMeans.Environment,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Reflective_Active: subscaleInterpretations.Reflective_Active,
      Analytical_Practical: subscaleInterpretations.Analytical_Practical,
      Self_Regulated: subscaleInterpretations.Self_Regulated,
      Environment: subscaleInterpretations.Environment,
    },
  };
}

