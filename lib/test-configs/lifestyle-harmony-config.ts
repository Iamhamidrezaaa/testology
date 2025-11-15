/**
 * Config استاندارد برای تست سبک زندگی کلی (Lifestyle Harmony Assessment)
 * منبع:
 * - WHO Healthy Lifestyle Index
 * - Lifestyle Behavior Checklist
 * - Wellness Self-Assessment
 * - PERMA-Lifestyle
 * - Sleep/Activity/Habits Research
 * 
 * این تست یک جمع‌بندی از تمام دسته‌های سبک زندگی است:
 * استرس، خواب، فعالیت بدنی، تغذیه، تعادل زندگی، انرژی روزانه، روتین‌ها، سلامت احساسی، مدیریت وقت، کیفیت محیط زندگی
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 2, 4, 5, 6, 7 (5 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Healthy_Habits: سوالات 1, 5, 9 (Reverse: 5)
 * - Daily_Balance_Stress: سوالات 2, 6, 10 (Reverse: 2, 6)
 * - Energy_Mood_Regulation: سوالات 3, 7, 11 (Reverse: 7)
 * - Routine_Productivity: سوالات 4, 8, 12 (Reverse: 4)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Lifestyle Harmony
 */
export const LIFESTYLE_HARMONY_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب سبک زندگی ناسالم)
 */
export const LIFESTYLE_HARMONY_REVERSE_ITEMS = [2, 4, 5, 6, 7];

/**
 * زیرمقیاس‌ها
 */
export const LIFESTYLE_HARMONY_SUBSCALES = {
  Healthy_Habits: [1, 5, 9], // Reverse: 5
  Daily_Balance_Stress: [2, 6, 10], // Reverse: 2, 6
  Energy_Mood_Regulation: [3, 7, 11], // Reverse: 7
  Routine_Productivity: [4, 8, 12], // Reverse: 4
};

/**
 * Mapping سوالات
 */
export interface LifestyleHarmonyQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Healthy_Habits' | 'Daily_Balance_Stress' | 'Energy_Mood_Regulation' | 'Routine_Productivity';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createLifestyleHarmonyQuestionMapping(): LifestyleHarmonyQuestionMapping[] {
  return LIFESTYLE_HARMONY_QUESTIONS.map(questionOrder => {
    let subscale: 'Healthy_Habits' | 'Daily_Balance_Stress' | 'Energy_Mood_Regulation' | 'Routine_Productivity';
    
    if (LIFESTYLE_HARMONY_SUBSCALES.Healthy_Habits.includes(questionOrder)) {
      subscale = 'Healthy_Habits';
    } else if (LIFESTYLE_HARMONY_SUBSCALES.Daily_Balance_Stress.includes(questionOrder)) {
      subscale = 'Daily_Balance_Stress';
    } else if (LIFESTYLE_HARMONY_SUBSCALES.Energy_Mood_Regulation.includes(questionOrder)) {
      subscale = 'Energy_Mood_Regulation';
    } else {
      subscale = 'Routine_Productivity';
    }
    
    return {
      questionOrder,
      isReverse: LIFESTYLE_HARMONY_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Lifestyle Harmony
 */
export const LIFESTYLE_HARMONY_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: LIFESTYLE_HARMONY_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Healthy_Habits',
      items: LIFESTYLE_HARMONY_SUBSCALES.Healthy_Habits,
    },
    {
      name: 'Daily_Balance_Stress',
      items: LIFESTYLE_HARMONY_SUBSCALES.Daily_Balance_Stress,
    },
    {
      name: 'Energy_Mood_Regulation',
      items: LIFESTYLE_HARMONY_SUBSCALES.Energy_Mood_Regulation,
    },
    {
      name: 'Routine_Productivity',
      items: LIFESTYLE_HARMONY_SUBSCALES.Routine_Productivity,
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
 * Cutoff برای Lifestyle Harmony
 */
export const LIFESTYLE_HARMONY_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'سبک زندگی ناسالم / فرسایشی', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / در معرض فشار', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'سالم و پایدار', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'عالی، پایدار، هماهنگ', severity: null, percentile: '85-100%' },
  ],
  Healthy_Habits: [
    { min: 1.0, max: 2.4, label: 'عادت‌های ناسالم', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'عادت‌های متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'عادت‌های سالم', severity: null },
  ],
  Daily_Balance_Stress: [
    { min: 1.0, max: 2.4, label: 'تعادل ضعیف / استرس بالا', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'تعادل متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'تعادل خوب', severity: null },
  ],
  Energy_Mood_Regulation: [
    { min: 1.0, max: 2.4, label: 'انرژی پایین / نوسان خلق', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'انرژی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'انرژی خوب / خلق پایدار', severity: null },
  ],
  Routine_Productivity: [
    { min: 1.0, max: 2.4, label: 'روتین ضعیف / بهره‌وری پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'روتین متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'روتین خوب / بهره‌وری بالا', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const LIFESTYLE_HARMONY_INTERPRETATIONS = {
  1.0: 'سبک زندگی ناسالم: شما در چند حوزه سبک زندگی مشکل دارید. این می‌تواند منجر به فرسایش، کاهش انرژی، استرس مزمن و کاهش کیفیت زندگی شود. پیشنهاد می‌شود با تست‌های Sleep Quality (PSQI)، Work-Life Balance، Stress (PSS)، Activity Level و Nutrition شروع کنید.',
  2.5: 'سبک زندگی متوسط: شما در برخی حوزه‌ها سبک زندگی سالم دارید اما در برخی دیگر نیاز به بهبود دارید. با تمرین و آگاهی می‌توانید سبک زندگی خود را بهبود بخشید.',
  3.5: 'سبک زندگی سالم: شما در بیشتر موارد سبک زندگی سالم و پایدار دارید. این به شما کمک می‌کند تا انرژی، سلامت و رضایت بیشتری از زندگی داشته باشید.',
  4.3: 'سبک زندگی عالی: شما یک سبک زندگی بسیار سالم، پایدار و هماهنگ دارید. شما می‌توانید به خوبی بین کار، زندگی، سلامت و روتین‌ها تعادل برقرار کنید. این به شما کمک می‌کند تا زندگی پربار و رضایت‌بخشی داشته باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getLifestyleHarmonyConfigJSON(): string {
  return JSON.stringify({
    ...LIFESTYLE_HARMONY_CONFIG,
    cutoffs: LIFESTYLE_HARMONY_CUTOFFS,
  });
}

/**
 * محاسبه نمره Lifestyle Harmony
 */
export function calculateLifestyleHarmonyScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Healthy_Habits: number;
    Daily_Balance_Stress: number;
    Energy_Mood_Regulation: number;
    Routine_Productivity: number;
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
    Healthy_Habits: string;
    Daily_Balance_Stress: string;
    Energy_Mood_Regulation: string;
    Routine_Productivity: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Healthy_Habits: [],
    Daily_Balance_Stress: [],
    Energy_Mood_Regulation: [],
    Routine_Productivity: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (LIFESTYLE_HARMONY_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (LIFESTYLE_HARMONY_SUBSCALES.Healthy_Habits.includes(questionOrder)) {
      subscaleScores.Healthy_Habits.push(score);
    } else if (LIFESTYLE_HARMONY_SUBSCALES.Daily_Balance_Stress.includes(questionOrder)) {
      subscaleScores.Daily_Balance_Stress.push(score);
    } else if (LIFESTYLE_HARMONY_SUBSCALES.Energy_Mood_Regulation.includes(questionOrder)) {
      subscaleScores.Energy_Mood_Regulation.push(score);
    } else if (LIFESTYLE_HARMONY_SUBSCALES.Routine_Productivity.includes(questionOrder)) {
      subscaleScores.Routine_Productivity.push(score);
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
  const cutoff = LIFESTYLE_HARMONY_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = LIFESTYLE_HARMONY_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = LIFESTYLE_HARMONY_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = LIFESTYLE_HARMONY_INTERPRETATIONS[3.5];
  } else {
    interpretation = LIFESTYLE_HARMONY_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Healthy_Habits
  if (subscaleMeans.Healthy_Habits <= 2.4) {
    subscaleInterpretations.Healthy_Habits = 'عادت‌های ناسالم: شما در تغذیه، خواب یا فعالیت بدنی مشکل دارید. این می‌تواند منجر به کم‌خوابی، تغذیه نامنظم، کم‌تحرکی و کاهش سلامت کلی شود. پیشنهاد می‌شود تست‌های PSQI (خواب)، Lifestyle Sleep Quality، Physical Activity و Nutrition را انجام دهید.';
  } else if (subscaleMeans.Healthy_Habits <= 3.4) {
    subscaleInterpretations.Healthy_Habits = 'عادت‌های متوسط: شما در حال توسعه عادت‌های سالم هستید. با تمرین می‌توانید این عادت‌ها را تقویت کنید.';
  } else {
    subscaleInterpretations.Healthy_Habits = 'عادت‌های سالم: شما تغذیه مناسب، خواب کافی و فعالیت بدنی منظم دارید. این به شما کمک می‌کند تا سلامت کلی خود را حفظ کنید.';
  }

  // Daily_Balance_Stress
  if (subscaleMeans.Daily_Balance_Stress <= 2.4) {
    subscaleInterpretations.Daily_Balance_Stress = 'تعادل ضعیف / استرس بالا: شما در تعادل کار–زندگی مشکل دارید و استرس زیادی را تجربه می‌کنید. این می‌تواند منجر به فرسودگی، کاهش کیفیت زندگی و استرس مزمن شود. پیشنهاد می‌شود تست‌های Work-Life Balance، PSS-10 (استرس) و MAAS (ذهن‌آگاهی) را انجام دهید.';
  } else if (subscaleMeans.Daily_Balance_Stress <= 3.4) {
    subscaleInterpretations.Daily_Balance_Stress = 'تعادل متوسط: شما در حال توسعه تعادل کار–زندگی هستید. با تمرین می‌توانید این تعادل را بهبود بخشید.';
  } else {
    subscaleInterpretations.Daily_Balance_Stress = 'تعادل خوب: شما می‌توانید به خوبی بین کار و زندگی تعادل برقرار کنید و استرس خود را مدیریت کنید.';
  }

  // Energy_Mood_Regulation
  if (subscaleMeans.Energy_Mood_Regulation <= 2.4) {
    subscaleInterpretations.Energy_Mood_Regulation = 'انرژی پایین / نوسان خلق: شما انرژی پایینی دارید یا نوسانات خلق را تجربه می‌کنید. این می‌تواند منجر به خستگی پنهان، کاهش عملکرد و مشکل در ریکاوری شود. پیشنهاد می‌شود تست‌های PHQ-9 (افسردگی)، GAD-7 (اضطراب)، PSS-10 (استرس)، PSQI (خواب) و Physical Activity را انجام دهید.';
  } else if (subscaleMeans.Energy_Mood_Regulation <= 3.4) {
    subscaleInterpretations.Energy_Mood_Regulation = 'انرژی متوسط: شما در حال توسعه مهارت‌های مدیریت انرژی و خلق هستید.';
  } else {
    subscaleInterpretations.Energy_Mood_Regulation = 'انرژی خوب / خلق پایدار: شما انرژی کافی دارید و خلق شما پایدار است. این به شما کمک می‌کند تا عملکرد بهتری داشته باشید.';
  }

  // Routine_Productivity
  if (subscaleMeans.Routine_Productivity <= 2.4) {
    subscaleInterpretations.Routine_Productivity = 'روتین ضعیف / بهره‌وری پایین: شما در روتین‌های روزمره و مدیریت زمان مشکل دارید. این می‌تواند منجر به تداخل برنامه، عدم بهره‌وری و کاهش عملکرد شود. پیشنهاد می‌شود تست‌های Time Management، Focus Attention و Time Preference را انجام دهید.';
  } else if (subscaleMeans.Routine_Productivity <= 3.4) {
    subscaleInterpretations.Routine_Productivity = 'روتین متوسط: شما در حال توسعه روتین‌های سالم هستید.';
  } else {
    subscaleInterpretations.Routine_Productivity = 'روتین خوب / بهره‌وری بالا: شما روتین‌های سالم دارید و می‌توانید به خوبی زمان خود را مدیریت کنید. این به شما کمک می‌کند تا بهره‌وری بالایی داشته باشید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('psqi', 'lifestyle-sleep-quality', 'work-life-balance', 'pss10', 'physical-activity', 'time-management', 'focus-attention');
  }
  
  if (subscaleMeans.Healthy_Habits <= 2.4) {
    recommendedTests.push('psqi', 'lifestyle-sleep-quality', 'physical-activity');
  }
  
  if (subscaleMeans.Daily_Balance_Stress <= 2.4) {
    recommendedTests.push('work-life-balance', 'pss10', 'maas');
  }
  
  if (subscaleMeans.Energy_Mood_Regulation <= 2.4) {
    recommendedTests.push('phq9', 'gad7', 'pss10', 'psqi', 'physical-activity');
  }
  
  if (subscaleMeans.Routine_Productivity <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention', 'time-preference');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• عادت‌های سالم: ${subscaleMeans.Healthy_Habits.toFixed(2)}/5\n`;
  interpretation += `• تعادل و استرس: ${subscaleMeans.Daily_Balance_Stress.toFixed(2)}/5\n`;
  interpretation += `• انرژی و خلق: ${subscaleMeans.Energy_Mood_Regulation.toFixed(2)}/5\n`;
  interpretation += `• روتین و بهره‌وری: ${subscaleMeans.Routine_Productivity.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Healthy_Habits: subscaleMeans.Healthy_Habits,
      Daily_Balance_Stress: subscaleMeans.Daily_Balance_Stress,
      Energy_Mood_Regulation: subscaleMeans.Energy_Mood_Regulation,
      Routine_Productivity: subscaleMeans.Routine_Productivity,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Healthy_Habits: subscaleInterpretations.Healthy_Habits,
      Daily_Balance_Stress: subscaleInterpretations.Daily_Balance_Stress,
      Energy_Mood_Regulation: subscaleInterpretations.Energy_Mood_Regulation,
      Routine_Productivity: subscaleInterpretations.Routine_Productivity,
    },
  };
}

