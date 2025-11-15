/**
 * Config استاندارد برای تست ذهنیت رشد (Growth Mindset Assessment)
 * منبع: Carol Dweck's Theory of Mindset
 * "Mindset: The New Psychology of Success" (2006)
 * 
 * این تست ذهنیت رشد (Growth Mindset) در مقابل ذهنیت ثابت (Fixed Mindset) را می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 3, 5, 7, 8, 10 (5 آیتم)
 * 
 * زیرمقیاس‌ها (بر اساس Dweck's Theory):
 * - Effort_Beliefs: سوالات 1, 5, 9 (Reverse: 5)
 * - Learning_Orientation: سوالات 2, 6, 10 (Reverse: 10)
 * - Challenges_Persistence: سوالات 3, 7, 11 (Reverse: 3, 7)
 * - Growth_Self_View: سوالات 4, 8, 12 (Reverse: 8)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Growth Mindset
 */
export const GROWTH_MINDSET_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب ذهنیت ثابت)
 */
export const GROWTH_MINDSET_REVERSE_ITEMS = [3, 5, 7, 8, 10];

/**
 * زیرمقیاس‌ها
 */
export const GROWTH_MINDSET_SUBSCALES = {
  Effort_Beliefs: [1, 5, 9], // Reverse: 5
  Learning_Orientation: [2, 6, 10], // Reverse: 10
  Challenges_Persistence: [3, 7, 11], // Reverse: 3, 7
  Growth_Self_View: [4, 8, 12], // Reverse: 8
};

/**
 * Mapping سوالات
 */
export interface GrowthMindsetQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Effort_Beliefs' | 'Learning_Orientation' | 'Challenges_Persistence' | 'Growth_Self_View';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createGrowthMindsetQuestionMapping(): GrowthMindsetQuestionMapping[] {
  return GROWTH_MINDSET_QUESTIONS.map(questionOrder => {
    let subscale: 'Effort_Beliefs' | 'Learning_Orientation' | 'Challenges_Persistence' | 'Growth_Self_View';
    
    if (GROWTH_MINDSET_SUBSCALES.Effort_Beliefs.includes(questionOrder)) {
      subscale = 'Effort_Beliefs';
    } else if (GROWTH_MINDSET_SUBSCALES.Learning_Orientation.includes(questionOrder)) {
      subscale = 'Learning_Orientation';
    } else if (GROWTH_MINDSET_SUBSCALES.Challenges_Persistence.includes(questionOrder)) {
      subscale = 'Challenges_Persistence';
    } else {
      subscale = 'Growth_Self_View';
    }
    
    return {
      questionOrder,
      isReverse: GROWTH_MINDSET_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Growth Mindset
 */
export const GROWTH_MINDSET_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: GROWTH_MINDSET_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Effort_Beliefs',
      items: GROWTH_MINDSET_SUBSCALES.Effort_Beliefs,
    },
    {
      name: 'Learning_Orientation',
      items: GROWTH_MINDSET_SUBSCALES.Learning_Orientation,
    },
    {
      name: 'Challenges_Persistence',
      items: GROWTH_MINDSET_SUBSCALES.Challenges_Persistence,
    },
    {
      name: 'Growth_Self_View',
      items: GROWTH_MINDSET_SUBSCALES.Growth_Self_View,
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
 * Cutoff برای Growth Mindset
 */
export const GROWTH_MINDSET_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'ذهنیت ثابت (Fixed Mindset)', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'ترکیبی / نوسانی', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'ذهنیت رشد سالم', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'ذهنیت رشد قدرتمند و پایدار', severity: null, percentile: '85-100%' },
  ],
  Effort_Beliefs: [
    { min: 1.0, max: 2.4, label: 'باور پایین به اثربخشی تلاش', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'باور متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'باور قوی به تلاش', severity: null },
  ],
  Learning_Orientation: [
    { min: 1.0, max: 2.4, label: 'ترس از بازخورد و یادگیری', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'گرایش متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'گرایش قوی به یادگیری', severity: null },
  ],
  Challenges_Persistence: [
    { min: 1.0, max: 2.4, label: 'اجتناب از چالش و زودخسته‌شدن', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'مقاومت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'چالش‌پذیری و پافشاری قوی', severity: null },
  ],
  Growth_Self_View: [
    { min: 1.0, max: 2.4, label: 'خودانگاره ثابت', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'خودانگاره ترکیبی', severity: null },
    { min: 3.5, max: 5.0, label: 'خودانگاره رشدی', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const GROWTH_MINDSET_INTERPRETATIONS = {
  1.0: 'ذهنیت ثابت: شما باور دارید که توانایی‌ها و هوش ثابت هستند و تغییر چندانی نمی‌کنند. این می‌تواند منجر به ناامیدی، تعویق و اجتناب از چالش‌ها شود. پیشنهاد می‌شود با تمرین‌های بازسازی شناختی و پذیرش بازخورد شروع کنید.',
  2.5: 'ذهنیت ترکیبی: شما در برخی حوزه‌ها ذهنیت رشد دارید و در برخی دیگر ذهنیت ثابت. با تمرین و آگاهی می‌توانید ذهنیت رشد را در همه حوزه‌ها تقویت کنید.',
  3.5: 'ذهنیت رشد سالم: شما باور دارید که توانایی‌ها قابل توسعه هستند و از چالش‌ها و یادگیری لذت می‌برید. این ذهنیت به شما کمک می‌کند تا در مواجهه با مشکلات مقاومت کنید و پیشرفت کنید.',
  4.3: 'ذهنیت رشد قدرتمند: شما یک ذهنیت رشد پایدار و قوی دارید. شما باور دارید که تلاش، یادگیری و پافشاری کلید موفقیت هستند. این ذهنیت به شما کمک می‌کند تا در بلندمدت به اهداف خود برسید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getGrowthMindsetConfigJSON(): string {
  return JSON.stringify({
    ...GROWTH_MINDSET_CONFIG,
    cutoffs: GROWTH_MINDSET_CUTOFFS,
  });
}

/**
 * محاسبه نمره Growth Mindset
 */
export function calculateGrowthMindsetScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Effort_Beliefs: number;
    Learning_Orientation: number;
    Challenges_Persistence: number;
    Growth_Self_View: number;
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
    Effort_Beliefs: string;
    Learning_Orientation: string;
    Challenges_Persistence: string;
    Growth_Self_View: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Effort_Beliefs: [],
    Learning_Orientation: [],
    Challenges_Persistence: [],
    Growth_Self_View: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (GROWTH_MINDSET_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (GROWTH_MINDSET_SUBSCALES.Effort_Beliefs.includes(questionOrder)) {
      subscaleScores.Effort_Beliefs.push(score);
    } else if (GROWTH_MINDSET_SUBSCALES.Learning_Orientation.includes(questionOrder)) {
      subscaleScores.Learning_Orientation.push(score);
    } else if (GROWTH_MINDSET_SUBSCALES.Challenges_Persistence.includes(questionOrder)) {
      subscaleScores.Challenges_Persistence.push(score);
    } else if (GROWTH_MINDSET_SUBSCALES.Growth_Self_View.includes(questionOrder)) {
      subscaleScores.Growth_Self_View.push(score);
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
  const cutoff = GROWTH_MINDSET_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = GROWTH_MINDSET_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = GROWTH_MINDSET_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = GROWTH_MINDSET_INTERPRETATIONS[3.5];
  } else {
    interpretation = GROWTH_MINDSET_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Effort_Beliefs
  if (subscaleMeans.Effort_Beliefs <= 2.4) {
    subscaleInterpretations.Effort_Beliefs = 'باور پایین به اثربخشی تلاش: شما باور دارید که تلاش نتیجه زیادی ندارد. این می‌تواند منجر به ناامیدی، drop-out و تعویق شود. پیشنهاد می‌شود با تمرین‌های انگیزشی و بازسازی شناختی شروع کنید.';
  } else if (subscaleMeans.Effort_Beliefs <= 3.4) {
    subscaleInterpretations.Effort_Beliefs = 'باور متوسط به تلاش: شما در حال توسعه باور به اثربخشی تلاش هستید. با تمرین می‌توانید این باور را تقویت کنید.';
  } else {
    subscaleInterpretations.Effort_Beliefs = 'باور قوی به تلاش: شما باور دارید که تلاش کلید موفقیت است. این باور به شما کمک می‌کند تا در مواجهه با مشکلات مقاومت کنید.';
  }

  // Learning_Orientation
  if (subscaleMeans.Learning_Orientation <= 2.4) {
    subscaleInterpretations.Learning_Orientation = 'ترس از بازخورد و یادگیری: شما از بازخورد و اشتباه کردن می‌ترسید. این می‌تواند رشد شما را محدود کند. پیشنهاد می‌شود تست مهارت‌های ارتباطی یا فیدبک‌پذیری را انجام دهید.';
  } else if (subscaleMeans.Learning_Orientation <= 3.4) {
    subscaleInterpretations.Learning_Orientation = 'گرایش متوسط به یادگیری: شما در حال توسعه گرایش به یادگیری هستید. با پذیرش بازخورد می‌توانید پیشرفت کنید.';
  } else {
    subscaleInterpretations.Learning_Orientation = 'گرایش قوی به یادگیری: شما از یادگیری و بازخورد لذت می‌برید. این به شما کمک می‌کند تا به طور مداوم پیشرفت کنید.';
  }

  // Challenges_Persistence
  if (subscaleMeans.Challenges_Persistence <= 2.4) {
    subscaleInterpretations.Challenges_Persistence = 'اجتناب از چالش و زودخسته‌شدن: شما از وظایف سخت فرار می‌کنید و زود خسته می‌شوید. این می‌تواند انگیزش بلندمدت شما را تضعیف کند. پیشنهاد می‌شود تست‌های انگیزش و خودتنظیمی را انجام دهید.';
  } else if (subscaleMeans.Challenges_Persistence <= 3.4) {
    subscaleInterpretations.Challenges_Persistence = 'مقاومت متوسط: شما در حال توسعه مقاومت در برابر چالش‌ها هستید. با تمرین می‌توانید پافشاری خود را تقویت کنید.';
  } else {
    subscaleInterpretations.Challenges_Persistence = 'چالش‌پذیری و پافشاری قوی: شما از چالش‌ها استقبال می‌کنید و در مواجهه با مشکلات مقاومت می‌کنید. این به شما کمک می‌کند تا به اهداف بلندمدت خود برسید.';
  }

  // Growth_Self_View
  if (subscaleMeans.Growth_Self_View <= 2.4) {
    subscaleInterpretations.Growth_Self_View = 'خودانگاره ثابت: شما باور دارید که هوش و توانایی ثابت هستند. این می‌تواند منجر به ترس از شکست و کاهش انعطاف روانی شود. پیشنهاد می‌شود تست Self-Esteem و Self-Compassion را انجام دهید.';
  } else if (subscaleMeans.Growth_Self_View <= 3.4) {
    subscaleInterpretations.Growth_Self_View = 'خودانگاره ترکیبی: شما در برخی حوزه‌ها خودانگاره رشدی دارید و در برخی دیگر ثابت. با تمرین می‌توانید خودانگاره رشدی را در همه حوزه‌ها تقویت کنید.';
  } else {
    subscaleInterpretations.Growth_Self_View = 'خودانگاره رشدی: شما باور دارید که توانایی‌ها قابل توسعه هستند. این باور به شما کمک می‌کند تا در مواجهه با چالش‌ها انعطاف‌پذیر باشید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('rosenberg', 'pss10', 'learning-style');
  }
  
  if (subscaleMeans.Effort_Beliefs >= 3.5 && subscaleMeans.Growth_Self_View <= 2.4) {
    recommendedTests.push('attachment', 'self-compassion');
  }
  
  if (subscaleMeans.Learning_Orientation <= 2.4) {
    recommendedTests.push('communication-skills');
  }
  
  if (subscaleMeans.Challenges_Persistence <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• باور به تلاش: ${subscaleMeans.Effort_Beliefs.toFixed(2)}/5\n`;
  interpretation += `• گرایش به یادگیری: ${subscaleMeans.Learning_Orientation.toFixed(2)}/5\n`;
  interpretation += `• چالش‌پذیری: ${subscaleMeans.Challenges_Persistence.toFixed(2)}/5\n`;
  interpretation += `• خودانگاره رشدی: ${subscaleMeans.Growth_Self_View.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Effort_Beliefs: subscaleMeans.Effort_Beliefs,
      Learning_Orientation: subscaleMeans.Learning_Orientation,
      Challenges_Persistence: subscaleMeans.Challenges_Persistence,
      Growth_Self_View: subscaleMeans.Growth_Self_View,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Effort_Beliefs: subscaleInterpretations.Effort_Beliefs,
      Learning_Orientation: subscaleInterpretations.Learning_Orientation,
      Challenges_Persistence: subscaleInterpretations.Challenges_Persistence,
      Growth_Self_View: subscaleInterpretations.Growth_Self_View,
    },
  };
}

