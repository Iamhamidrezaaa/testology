/**
 * Config استاندارد برای تست کنجکاوی (Curiosity & Openness Assessment)
 * منبع: Curiosity and Exploration Inventory-II (CEI-II) - Kashdan et al. (2009)
 * "The Curiosity and Exploration Inventory-II: Development, Factor Structure, and Psychometrics"
 * 
 * این تست کنجکاوی و گشودگی به تجارب جدید را می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 3, 8, 10, 12 (4 آیتم)
 * 
 * زیرمقیاس‌ها (بر اساس CEI-II + Openness):
 * - Joyous_Exploration: سوالات 1, 5, 9 (بدون Reverse)
 * - Deprivation_Sensitivity: سوالات 2, 6, 10 (Reverse: 10)
 * - Openness_New_Experiences: سوالات 3, 7, 11 (Reverse: 3)
 * - Risk_Tolerance: سوالات 4, 8, 12 (Reverse: 8, 12)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Curiosity
 */
export const CURIOSITY_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب مقاومت نسبت به تجربه جدید یا ترس از کشف)
 */
export const CURIOSITY_REVERSE_ITEMS = [3, 8, 10, 12];

/**
 * زیرمقیاس‌ها
 */
export const CURIOSITY_SUBSCALES = {
  Joyous_Exploration: [1, 5, 9], // بدون Reverse
  Deprivation_Sensitivity: [2, 6, 10], // Reverse: 10
  Openness_New_Experiences: [3, 7, 11], // Reverse: 3
  Risk_Tolerance: [4, 8, 12], // Reverse: 8, 12
};

/**
 * Mapping سوالات
 */
export interface CuriosityQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Joyous_Exploration' | 'Deprivation_Sensitivity' | 'Openness_New_Experiences' | 'Risk_Tolerance';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createCuriosityQuestionMapping(): CuriosityQuestionMapping[] {
  return CURIOSITY_QUESTIONS.map(questionOrder => {
    let subscale: 'Joyous_Exploration' | 'Deprivation_Sensitivity' | 'Openness_New_Experiences' | 'Risk_Tolerance';
    
    if (CURIOSITY_SUBSCALES.Joyous_Exploration.includes(questionOrder)) {
      subscale = 'Joyous_Exploration';
    } else if (CURIOSITY_SUBSCALES.Deprivation_Sensitivity.includes(questionOrder)) {
      subscale = 'Deprivation_Sensitivity';
    } else if (CURIOSITY_SUBSCALES.Openness_New_Experiences.includes(questionOrder)) {
      subscale = 'Openness_New_Experiences';
    } else {
      subscale = 'Risk_Tolerance';
    }
    
    return {
      questionOrder,
      isReverse: CURIOSITY_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Curiosity
 */
export const CURIOSITY_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: CURIOSITY_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Joyous_Exploration',
      items: CURIOSITY_SUBSCALES.Joyous_Exploration,
    },
    {
      name: 'Deprivation_Sensitivity',
      items: CURIOSITY_SUBSCALES.Deprivation_Sensitivity,
    },
    {
      name: 'Openness_New_Experiences',
      items: CURIOSITY_SUBSCALES.Openness_New_Experiences,
    },
    {
      name: 'Risk_Tolerance',
      items: CURIOSITY_SUBSCALES.Risk_Tolerance,
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
 * Cutoff برای Curiosity
 */
export const CURIOSITY_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'پایین / بسته / نیازمند رشد', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'کنجکاوی سالم', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'کنجکاوی بالا و فعال', severity: null, percentile: '85-100%' },
  ],
  Joyous_Exploration: [
    { min: 1.0, max: 2.4, label: 'لذت پایین از کشف', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'لذت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'لذت بالا از کشف و یادگیری', severity: null },
  ],
  Deprivation_Sensitivity: [
    { min: 1.0, max: 2.4, label: 'کنجکاوی پایین برای دانستن', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'کنجکاوی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'نیاز شدید به دانستن و فهمیدن', severity: null },
  ],
  Openness_New_Experiences: [
    { min: 1.0, max: 2.4, label: 'مقاومت در برابر تجارب جدید', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'گشودگی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'گشودگی بالا به تجارب جدید', severity: null },
  ],
  Risk_Tolerance: [
    { min: 1.0, max: 2.4, label: 'ترس از تجربه و کاوش', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'جسارت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'جسارت بالا در کاوش', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const CURIOSITY_INTERPRETATIONS = {
  1.0: 'کنجکاوی پایین: شما تمایل کمی به کشف و یادگیری دارید. این می‌تواند منجر به کاهش انگیزه یادگیری، محدودیت خلاقیت و کاهش درگیرشدن در فعالیت‌های جدید شود. پیشنهاد می‌شود با تست Growth Mindset و Learning Style شروع کنید.',
  2.5: 'کنجکاوی متوسط: شما در برخی حوزه‌ها کنجکاو هستید اما در برخی دیگر کمتر. با تمرین و آگاهی می‌توانید کنجکاوی خود را در همه حوزه‌ها تقویت کنید.',
  3.5: 'کنجکاوی سالم: شما از کشف و یادگیری لذت می‌برید و به تجارب جدید گشوده هستید. این کنجکاوی به شما کمک می‌کند تا به طور مداوم رشد کنید و خلاقیت خود را توسعه دهید.',
  4.3: 'کنجکاوی بالا و فعال: شما یک فرد بسیار کنجکاو و جستجوگر هستید. شما از کشف، یادگیری و تجربه چیزهای جدید لذت می‌برید. این کنجکاوی به شما کمک می‌کند تا در زندگی و کار نوآور باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getCuriosityConfigJSON(): string {
  return JSON.stringify({
    ...CURIOSITY_CONFIG,
    cutoffs: CURIOSITY_CUTOFFS,
  });
}

/**
 * محاسبه نمره Curiosity
 */
export function calculateCuriosityScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Joyous_Exploration: number;
    Deprivation_Sensitivity: number;
    Openness_New_Experiences: number;
    Risk_Tolerance: number;
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
    Joyous_Exploration: string;
    Deprivation_Sensitivity: string;
    Openness_New_Experiences: string;
    Risk_Tolerance: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Joyous_Exploration: [],
    Deprivation_Sensitivity: [],
    Openness_New_Experiences: [],
    Risk_Tolerance: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (CURIOSITY_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (CURIOSITY_SUBSCALES.Joyous_Exploration.includes(questionOrder)) {
      subscaleScores.Joyous_Exploration.push(score);
    } else if (CURIOSITY_SUBSCALES.Deprivation_Sensitivity.includes(questionOrder)) {
      subscaleScores.Deprivation_Sensitivity.push(score);
    } else if (CURIOSITY_SUBSCALES.Openness_New_Experiences.includes(questionOrder)) {
      subscaleScores.Openness_New_Experiences.push(score);
    } else if (CURIOSITY_SUBSCALES.Risk_Tolerance.includes(questionOrder)) {
      subscaleScores.Risk_Tolerance.push(score);
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
  const cutoff = CURIOSITY_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = CURIOSITY_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = CURIOSITY_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = CURIOSITY_INTERPRETATIONS[3.5];
  } else {
    interpretation = CURIOSITY_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Joyous_Exploration
  if (subscaleMeans.Joyous_Exploration <= 2.4) {
    subscaleInterpretations.Joyous_Exploration = 'لذت پایین از کشف: شما از کشف و یادگیری چیزهای جدید لذت کمی می‌برید. این می‌تواند منجر به کاهش انگیزه یادگیری، محدودیت خلاقیت و کاهش درگیرشدن در فعالیت‌های جدید شود.';
  } else if (subscaleMeans.Joyous_Exploration <= 3.4) {
    subscaleInterpretations.Joyous_Exploration = 'لذت متوسط از کشف: شما در حال توسعه لذت از کشف هستید. با تمرین می‌توانید این لذت را تقویت کنید.';
  } else {
    subscaleInterpretations.Joyous_Exploration = 'لذت بالا از کشف: شما از کشف و یادگیری چیزهای جدید لذت زیادی می‌برید. این به شما کمک می‌کند تا به طور مداوم رشد کنید.';
  }

  // Deprivation_Sensitivity
  if (subscaleMeans.Deprivation_Sensitivity <= 2.4) {
    subscaleInterpretations.Deprivation_Sensitivity = 'کنجکاوی پایین برای دانستن: شما تمایل کمی به ریشه‌یابی و فهمیدن حقیقت دارید. این می‌تواند منجر به عدم پشتکار در حل مسائل و کاهش رشد شناختی شود.';
  } else if (subscaleMeans.Deprivation_Sensitivity <= 3.4) {
    subscaleInterpretations.Deprivation_Sensitivity = 'کنجکاوی متوسط: شما در حال توسعه کنجکاوی برای دانستن هستید. با تمرین می‌توانید این کنجکاوی را تقویت کنید.';
  } else {
    subscaleInterpretations.Deprivation_Sensitivity = 'نیاز شدید به دانستن: شما یک نیاز قوی به فهمیدن و ریشه‌یابی دارید. این به شما کمک می‌کند تا مسائل را به طور عمیق حل کنید.';
  }

  // Openness_New_Experiences
  if (subscaleMeans.Openness_New_Experiences <= 2.4) {
    subscaleInterpretations.Openness_New_Experiences = 'مقاومت در برابر تجارب جدید: شما در برابر ایده‌ها و تجارب جدید مقاومت می‌کنید. این می‌تواند منجر به گیر افتادن در روتین‌های تکراری شود. پیشنهاد می‌شود تست خلاقیت ذهنی را انجام دهید.';
  } else if (subscaleMeans.Openness_New_Experiences <= 3.4) {
    subscaleInterpretations.Openness_New_Experiences = 'گشودگی متوسط: شما در حال توسعه گشودگی به تجارب جدید هستید. با تمرین می‌توانید این گشودگی را تقویت کنید.';
  } else {
    subscaleInterpretations.Openness_New_Experiences = 'گشودگی بالا: شما به تجارب و ایده‌های جدید بسیار گشوده هستید. این به شما کمک می‌کند تا نوآور باشید.';
  }

  // Risk_Tolerance
  if (subscaleMeans.Risk_Tolerance <= 2.4) {
    subscaleInterpretations.Risk_Tolerance = 'ترس از تجربه و کاوش: شما از تجربه چیزهای جدید و کاوش می‌ترسید. این می‌تواند منجر به ترس از شکست، احتیاط زیاد و خودداری از تجربه‌های جدید شود. پیشنهاد می‌شود تست مدیریت استرس، اعتمادبه‌نفس و دلبستگی را انجام دهید.';
  } else if (subscaleMeans.Risk_Tolerance <= 3.4) {
    subscaleInterpretations.Risk_Tolerance = 'جسارت متوسط: شما در حال توسعه جسارت در کاوش هستید. با تمرین می‌توانید این جسارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Risk_Tolerance = 'جسارت بالا: شما جسارت زیادی در کاوش و تجربه چیزهای جدید دارید. این به شما کمک می‌کند تا نوآور باشید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('growth-mindset', 'learning-style', 'bfi', 'neo-ffi');
  }
  
  if (subscaleMeans.Risk_Tolerance <= 2.4) {
    recommendedTests.push('pss10', 'rosenberg', 'attachment');
  }
  
  if (subscaleMeans.Openness_New_Experiences <= 2.4) {
    recommendedTests.push('creativity');
  }
  
  if (subscaleMeans.Joyous_Exploration <= 2.4) {
    recommendedTests.push('growth-mindset', 'self-regulated-learning');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• لذت از کشف: ${subscaleMeans.Joyous_Exploration.toFixed(2)}/5\n`;
  interpretation += `• نیاز به دانستن: ${subscaleMeans.Deprivation_Sensitivity.toFixed(2)}/5\n`;
  interpretation += `• گشودگی به تجارب جدید: ${subscaleMeans.Openness_New_Experiences.toFixed(2)}/5\n`;
  interpretation += `• جسارت در کاوش: ${subscaleMeans.Risk_Tolerance.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Joyous_Exploration: subscaleMeans.Joyous_Exploration,
      Deprivation_Sensitivity: subscaleMeans.Deprivation_Sensitivity,
      Openness_New_Experiences: subscaleMeans.Openness_New_Experiences,
      Risk_Tolerance: subscaleMeans.Risk_Tolerance,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Joyous_Exploration: subscaleInterpretations.Joyous_Exploration,
      Deprivation_Sensitivity: subscaleInterpretations.Deprivation_Sensitivity,
      Openness_New_Experiences: subscaleInterpretations.Openness_New_Experiences,
      Risk_Tolerance: subscaleInterpretations.Risk_Tolerance,
    },
  };
}

