/**
 * Config استاندارد برای تست ترجیح زمانی (Time Preference / Temporal Orientation)
 * منبع:
 * - Zimbardo Time Perspective Inventory (ZTPI)
 * - Future Time Orientation Scale
 * - Consideration of Future Consequences (CFC)
 * - Delay Discounting Theory
 * 
 * این تست ترجیح زمانی و نگرش نسبت به زمان را می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 4, 6, 7, 11 (4 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Future_Orientation: سوالات 1, 5, 9 (بدون Reverse)
 * - Present_Focused: سوالات 2, 6, 10 (Reverse: 6)
 * - Impulsivity_Delay_Discounting: سوالات 3, 7, 11 (Reverse: 7, 11)
 * - Past_Reflection: سوالات 4, 8, 12 (Reverse: 4)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Time Preference
 */
export const TIME_PREFERENCE_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب مشکل‌محور - تکانشگری، گیر کردن در گذشته/حال)
 */
export const TIME_PREFERENCE_REVERSE_ITEMS = [4, 6, 7, 11];

/**
 * زیرمقیاس‌ها
 */
export const TIME_PREFERENCE_SUBSCALES = {
  Future_Orientation: [1, 5, 9], // بدون Reverse
  Present_Focused: [2, 6, 10], // Reverse: 6
  Impulsivity_Delay_Discounting: [3, 7, 11], // Reverse: 7, 11
  Past_Reflection: [4, 8, 12], // Reverse: 4
};

/**
 * Mapping سوالات
 */
export interface TimePreferenceQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Future_Orientation' | 'Present_Focused' | 'Impulsivity_Delay_Discounting' | 'Past_Reflection';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createTimePreferenceQuestionMapping(): TimePreferenceQuestionMapping[] {
  return TIME_PREFERENCE_QUESTIONS.map(questionOrder => {
    let subscale: 'Future_Orientation' | 'Present_Focused' | 'Impulsivity_Delay_Discounting' | 'Past_Reflection';
    
    if (TIME_PREFERENCE_SUBSCALES.Future_Orientation.includes(questionOrder)) {
      subscale = 'Future_Orientation';
    } else if (TIME_PREFERENCE_SUBSCALES.Present_Focused.includes(questionOrder)) {
      subscale = 'Present_Focused';
    } else if (TIME_PREFERENCE_SUBSCALES.Impulsivity_Delay_Discounting.includes(questionOrder)) {
      subscale = 'Impulsivity_Delay_Discounting';
    } else {
      subscale = 'Past_Reflection';
    }
    
    return {
      questionOrder,
      isReverse: TIME_PREFERENCE_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Time Preference
 */
export const TIME_PREFERENCE_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: TIME_PREFERENCE_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Future_Orientation',
      items: TIME_PREFERENCE_SUBSCALES.Future_Orientation,
    },
    {
      name: 'Present_Focused',
      items: TIME_PREFERENCE_SUBSCALES.Present_Focused,
    },
    {
      name: 'Impulsivity_Delay_Discounting',
      items: TIME_PREFERENCE_SUBSCALES.Impulsivity_Delay_Discounting,
    },
    {
      name: 'Past_Reflection',
      items: TIME_PREFERENCE_SUBSCALES.Past_Reflection,
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
 * Cutoff برای Time Preference
 */
export const TIME_PREFERENCE_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'نامتوازن / تکانشی / گیرکرده در گذشته/حال', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'متوازن و سالم', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'بسیار سالم، آینده‌نگر و کنترل‌شده', severity: null, percentile: '85-100%' },
  ],
  Future_Orientation: [
    { min: 1.0, max: 2.4, label: 'آینده‌نگری پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'آینده‌نگری متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'آینده‌نگری بالا', severity: null },
  ],
  Present_Focused: [
    { min: 1.0, max: 2.4, label: 'تمرکز بر حال پایین', severity: null },
    { min: 2.5, max: 3.4, label: 'تمرکز بر حال متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'تمرکز بر حال بالا (لذت‌محوری)', severity: 'mild' as const },
  ],
  Impulsivity_Delay_Discounting: [
    { min: 1.0, max: 2.4, label: 'تکانشگری پایین (صبر بالا)', severity: null },
    { min: 2.5, max: 3.4, label: 'تکانشگری متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'تکانشگری بالا (بی‌صبری)', severity: 'mild' as const },
  ],
  Past_Reflection: [
    { min: 1.0, max: 2.4, label: 'رابطه با گذشته منفی', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'رابطه با گذشته متعادل', severity: null },
    { min: 3.5, max: 5.0, label: 'رابطه با گذشته مثبت', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const TIME_PREFERENCE_INTERPRETATIONS = {
  1.0: 'ترجیح زمانی نامتوازن: شما در مدیریت زمان و نگرش نسبت به زمان مشکل دارید. این می‌تواند منجر به تصمیم‌گیری عجولانه، ضعف برنامه‌ریزی، رفتارهای تکانشی و کاهش رضایت شود. پیشنهاد می‌شود با تست Self-Regulated Learning، Growth Mindset، Stress و Time Management شروع کنید.',
  2.5: 'ترجیح زمانی متوسط: شما در برخی حوزه‌ها نگرش سالم دارید اما در برخی دیگر نیاز به بهبود دارید. با تمرین و آگاهی می‌توانید ترجیح زمانی خود را بهبود بخشید.',
  3.5: 'ترجیح زمانی متوازن: شما می‌توانید به خوبی بین آینده، حال و گذشته تعادل برقرار کنید. این به شما کمک می‌کند تا تصمیم‌گیری بهتری داشته باشید و رضایت بیشتری از زندگی ببرید.',
  4.3: 'ترجیح زمانی بسیار سالم: شما یک نگرش سالم و متوازن نسبت به زمان دارید. شما می‌توانید به خوبی برنامه‌ریزی کنید، در لحظه زندگی کنید و از گذشته درس بگیرید. این به شما کمک می‌کند تا زندگی هدفمند و رضایت‌بخشی داشته باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getTimePreferenceConfigJSON(): string {
  return JSON.stringify({
    ...TIME_PREFERENCE_CONFIG,
    cutoffs: TIME_PREFERENCE_CUTOFFS,
  });
}

/**
 * محاسبه نمره Time Preference
 */
export function calculateTimePreferenceScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Future_Orientation: number;
    Present_Focused: number;
    Impulsivity_Delay_Discounting: number;
    Past_Reflection: number;
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
    Future_Orientation: string;
    Present_Focused: string;
    Impulsivity_Delay_Discounting: string;
    Past_Reflection: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Future_Orientation: [],
    Present_Focused: [],
    Impulsivity_Delay_Discounting: [],
    Past_Reflection: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (TIME_PREFERENCE_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (TIME_PREFERENCE_SUBSCALES.Future_Orientation.includes(questionOrder)) {
      subscaleScores.Future_Orientation.push(score);
    } else if (TIME_PREFERENCE_SUBSCALES.Present_Focused.includes(questionOrder)) {
      subscaleScores.Present_Focused.push(score);
    } else if (TIME_PREFERENCE_SUBSCALES.Impulsivity_Delay_Discounting.includes(questionOrder)) {
      subscaleScores.Impulsivity_Delay_Discounting.push(score);
    } else if (TIME_PREFERENCE_SUBSCALES.Past_Reflection.includes(questionOrder)) {
      subscaleScores.Past_Reflection.push(score);
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
  const cutoff = TIME_PREFERENCE_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = TIME_PREFERENCE_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = TIME_PREFERENCE_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = TIME_PREFERENCE_INTERPRETATIONS[3.5];
  } else {
    interpretation = TIME_PREFERENCE_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Future_Orientation
  if (subscaleMeans.Future_Orientation <= 2.4) {
    subscaleInterpretations.Future_Orientation = 'آینده‌نگری پایین: شما در برنامه‌ریزی و پیش‌بینی پیامدهای آینده مشکل دارید. این می‌تواند منجر به تصمیم‌گیری عجولانه، ضعف برنامه‌ریزی و کاهش پیش‌بینی پیامدها شود. پیشنهاد می‌شود تست مدیریت زمان، تمرکز و انگیزش را انجام دهید.';
  } else if (subscaleMeans.Future_Orientation <= 3.4) {
    subscaleInterpretations.Future_Orientation = 'آینده‌نگری متوسط: شما در حال توسعه مهارت‌های آینده‌نگری هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Future_Orientation = 'آینده‌نگری بالا: شما می‌توانید به خوبی برنامه‌ریزی کنید و پیامدهای آینده را پیش‌بینی کنید. این به شما کمک می‌کند تا تصمیم‌گیری بهتری داشته باشید.';
  }

  // Present_Focused
  if (subscaleMeans.Present_Focused <= 2.4) {
    subscaleInterpretations.Present_Focused = 'تمرکز بر حال پایین: شما در زندگی در لحظه مشکل دارید. این می‌تواند منجر به نگرانی بیش از حد از آینده یا گذشته شود.';
  } else if (subscaleMeans.Present_Focused <= 3.4) {
    subscaleInterpretations.Present_Focused = 'تمرکز بر حال متعادل: شما می‌توانید به خوبی بین آینده و حال تعادل برقرار کنید.';
  } else {
    subscaleInterpretations.Present_Focused = 'تمرکز بر حال بالا (لذت‌محوری): شما بیش از حد روی لحظه حال و لذت‌های فوری تمرکز دارید. این می‌تواند منجر به لذت‌محوری، ضعف در حفظ نظم و احتمال رفتارهای تکانشی شود. پیشنهاد می‌شود تست MAAS (ذهن‌آگاهی)، Self-Discipline و Impulsivity را انجام دهید.';
  }

  // Impulsivity_Delay_Discounting
  if (subscaleMeans.Impulsivity_Delay_Discounting <= 2.4) {
    subscaleInterpretations.Impulsivity_Delay_Discounting = 'تکانشگری پایین (صبر بالا): شما می‌توانید به خوبی صبر کنید و برای پاداش‌های بلندمدت تلاش کنید. این به شما کمک می‌کند تا به اهداف بلندمدت برسید.';
  } else if (subscaleMeans.Impulsivity_Delay_Discounting <= 3.4) {
    subscaleInterpretations.Impulsivity_Delay_Discounting = 'تکانشگری متوسط: شما در حال توسعه مهارت‌های صبر و کنترل تکانش هستید.';
  } else {
    subscaleInterpretations.Impulsivity_Delay_Discounting = 'تکانشگری بالا (بی‌صبری): شما بی‌صبری نسبت به پاداش‌های بلندمدت دارید و تمایل به پاداش فوری دارید. این می‌تواند منجر به تصمیم‌گیری عجولانه و مشکل در دستیابی به اهداف بلندمدت شود. پیشنهاد می‌شود تست PSS، Self-Regulation و مدیریت زمان را انجام دهید.';
  }

  // Past_Reflection
  if (subscaleMeans.Past_Reflection <= 2.4) {
    subscaleInterpretations.Past_Reflection = 'رابطه با گذشته منفی: شما در گذشته گیر کرده‌اید و نمی‌توانید از آن رها شوید. این می‌تواند منجر به خودسرزنش‌گری، نوستالژی شدید یا نگاه منفی به گذشته شود. پیشنهاد می‌شود تست Self-Compassion و Attachment را انجام دهید.';
  } else if (subscaleMeans.Past_Reflection <= 3.4) {
    subscaleInterpretations.Past_Reflection = 'رابطه با گذشته متعادل: شما می‌توانید از گذشته درس بگیرید بدون اینکه در آن گیر کنید.';
  } else {
    subscaleInterpretations.Past_Reflection = 'رابطه با گذشته مثبت: شما می‌توانید از گذشته درس بگیرید و خاطرات مثبت را حفظ کنید. این به شما کمک می‌کند تا به جلو حرکت کنید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('learning-style', 'growth-mindset', 'pss10', 'maas', 'time-management');
  }
  
  if (subscaleMeans.Future_Orientation <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention');
  }
  
  if (subscaleMeans.Present_Focused >= 3.5) {
    recommendedTests.push('maas', 'focus-attention');
  }
  
  if (subscaleMeans.Impulsivity_Delay_Discounting >= 3.5) {
    recommendedTests.push('pss10', 'focus-attention', 'time-management');
  }
  
  if (subscaleMeans.Past_Reflection <= 2.4) {
    recommendedTests.push('attachment', 'rosenberg');
  }
  
  if (subscaleMeans.Impulsivity_Delay_Discounting <= 2.4) {
    recommendedTests.push('focus-attention', 'psqi', 'lifestyle-sleep-quality');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• آینده‌نگری: ${subscaleMeans.Future_Orientation.toFixed(2)}/5\n`;
  interpretation += `• تمرکز بر حال: ${subscaleMeans.Present_Focused.toFixed(2)}/5\n`;
  interpretation += `• تکانشگری: ${subscaleMeans.Impulsivity_Delay_Discounting.toFixed(2)}/5 (بالاتر = تکانشگری بیشتر)\n`;
  interpretation += `• رابطه با گذشته: ${subscaleMeans.Past_Reflection.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Future_Orientation: subscaleMeans.Future_Orientation,
      Present_Focused: subscaleMeans.Present_Focused,
      Impulsivity_Delay_Discounting: subscaleMeans.Impulsivity_Delay_Discounting,
      Past_Reflection: subscaleMeans.Past_Reflection,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Future_Orientation: subscaleInterpretations.Future_Orientation,
      Present_Focused: subscaleInterpretations.Present_Focused,
      Impulsivity_Delay_Discounting: subscaleInterpretations.Impulsivity_Delay_Discounting,
      Past_Reflection: subscaleInterpretations.Past_Reflection,
    },
  };
}
