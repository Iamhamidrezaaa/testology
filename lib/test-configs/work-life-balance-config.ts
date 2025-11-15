/**
 * Config استاندارد برای تست تعادل کار–زندگی (Work–Life Balance Assessment)
 * منبع:
 * - Work–Life Balance Scale (Fisher, 2009)
 * - Work Interference with Personal Life (WIPL)
 * - Personal Life Interference with Work (PLIW)
 * - Work–Family Conflict Scale
 * 
 * این تست تعادل بین کار و زندگی شخصی را می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 1, 2, 4, 5, 6, 7, 9, 10 (8 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Work_to_Life_Interference: سوالات 1, 5, 9 (همه Reverse)
 * - Life_to_Work_Interference: سوالات 2, 6, 10 (همه Reverse)
 * - Recovery_Rest: سوالات 3, 7, 11 (Reverse: 7)
 * - Boundaries_Control: سوالات 4, 8, 12 (Reverse: 4)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Work-Life Balance
 */
export const WORK_LIFE_BALANCE_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب مشکل‌محور - هرچه بیشتر اتفاق بیفتد، تعادل بدتر است)
 */
export const WORK_LIFE_BALANCE_REVERSE_ITEMS = [1, 2, 4, 5, 6, 7, 9, 10];

/**
 * زیرمقیاس‌ها
 */
export const WORK_LIFE_BALANCE_SUBSCALES = {
  Work_to_Life_Interference: [1, 5, 9], // همه Reverse
  Life_to_Work_Interference: [2, 6, 10], // همه Reverse
  Recovery_Rest: [3, 7, 11], // Reverse: 7
  Boundaries_Control: [4, 8, 12], // Reverse: 4
};

/**
 * Mapping سوالات
 */
export interface WorkLifeBalanceQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Work_to_Life_Interference' | 'Life_to_Work_Interference' | 'Recovery_Rest' | 'Boundaries_Control';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createWorkLifeBalanceQuestionMapping(): WorkLifeBalanceQuestionMapping[] {
  return WORK_LIFE_BALANCE_QUESTIONS.map(questionOrder => {
    let subscale: 'Work_to_Life_Interference' | 'Life_to_Work_Interference' | 'Recovery_Rest' | 'Boundaries_Control';
    
    if (WORK_LIFE_BALANCE_SUBSCALES.Work_to_Life_Interference.includes(questionOrder)) {
      subscale = 'Work_to_Life_Interference';
    } else if (WORK_LIFE_BALANCE_SUBSCALES.Life_to_Work_Interference.includes(questionOrder)) {
      subscale = 'Life_to_Work_Interference';
    } else if (WORK_LIFE_BALANCE_SUBSCALES.Recovery_Rest.includes(questionOrder)) {
      subscale = 'Recovery_Rest';
    } else {
      subscale = 'Boundaries_Control';
    }
    
    return {
      questionOrder,
      isReverse: WORK_LIFE_BALANCE_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Work-Life Balance
 */
export const WORK_LIFE_BALANCE_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: WORK_LIFE_BALANCE_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Work_to_Life_Interference',
      items: WORK_LIFE_BALANCE_SUBSCALES.Work_to_Life_Interference,
    },
    {
      name: 'Life_to_Work_Interference',
      items: WORK_LIFE_BALANCE_SUBSCALES.Life_to_Work_Interference,
    },
    {
      name: 'Recovery_Rest',
      items: WORK_LIFE_BALANCE_SUBSCALES.Recovery_Rest,
    },
    {
      name: 'Boundaries_Control',
      items: WORK_LIFE_BALANCE_SUBSCALES.Boundaries_Control,
    },
  ],
  weighting: {
    'never': 1,
    'rarely': 2,
    'sometimes': 3,
    'often': 4,
    'always': 5,
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff برای Work-Life Balance
 */
export const WORK_LIFE_BALANCE_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'ضعیف / فرسودگی در خطر', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / ناپایدار', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'عالی و پایدار', severity: null, percentile: '85-100%' },
  ],
  Work_to_Life_Interference: [
    { min: 1.0, max: 2.4, label: 'مزاحمت بالا (کار به زندگی آسیب می‌زند)', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'مزاحمت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'مزاحمت کم (تعادل خوب)', severity: null },
  ],
  Life_to_Work_Interference: [
    { min: 1.0, max: 2.4, label: 'مزاحمت بالا (زندگی به کار آسیب می‌زند)', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'مزاحمت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'مزاحمت کم (تعادل خوب)', severity: null },
  ],
  Recovery_Rest: [
    { min: 1.0, max: 2.4, label: 'ریکاوری پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'ریکاوری متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'ریکاوری خوب', severity: null },
  ],
  Boundaries_Control: [
    { min: 1.0, max: 2.4, label: 'مرزبندی ضعیف', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'مرزبندی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'مرزبندی خوب', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const WORK_LIFE_BALANCE_INTERPRETATIONS = {
  1.0: 'تعادل کار–زندگی ضعیف: شما در تعادل بین کار و زندگی شخصی مشکل دارید. این می‌تواند منجر به فرسودگی، استرس مزمن، خواب بد و کاهش عملکرد شود. پیشنهاد می‌شود با تست Stress، Sleep و Time Management شروع کنید.',
  2.5: 'تعادل کار–زندگی متوسط: شما در برخی حوزه‌ها تعادل دارید اما در برخی دیگر نیاز به بهبود دارید. با تمرین و آگاهی می‌توانید تعادل خود را بهبود بخشید.',
  3.5: 'تعادل کار–زندگی خوب: شما می‌توانید به خوبی بین کار و زندگی شخصی تعادل برقرار کنید. این به شما کمک می‌کند تا از فرسودگی جلوگیری کنید و عملکرد بهتری داشته باشید.',
  4.3: 'تعادل کار–زندگی عالی: شما یک تعادل پایدار و سالم بین کار و زندگی شخصی دارید. شما می‌توانید به خوبی مرزبندی کنید، استراحت کنید و از هر دو حوزه لذت ببرید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getWorkLifeBalanceConfigJSON(): string {
  return JSON.stringify({
    ...WORK_LIFE_BALANCE_CONFIG,
    cutoffs: WORK_LIFE_BALANCE_CUTOFFS,
  });
}

/**
 * محاسبه نمره Work-Life Balance
 */
export function calculateWorkLifeBalanceScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Work_to_Life_Interference: number;
    Life_to_Work_Interference: number;
    Recovery_Rest: number;
    Boundaries_Control: number;
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
    Work_to_Life_Interference: string;
    Life_to_Work_Interference: string;
    Recovery_Rest: string;
    Boundaries_Control: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Work_to_Life_Interference: [],
    Life_to_Work_Interference: [],
    Recovery_Rest: [],
    Boundaries_Control: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (WORK_LIFE_BALANCE_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (WORK_LIFE_BALANCE_SUBSCALES.Work_to_Life_Interference.includes(questionOrder)) {
      subscaleScores.Work_to_Life_Interference.push(score);
    } else if (WORK_LIFE_BALANCE_SUBSCALES.Life_to_Work_Interference.includes(questionOrder)) {
      subscaleScores.Life_to_Work_Interference.push(score);
    } else if (WORK_LIFE_BALANCE_SUBSCALES.Recovery_Rest.includes(questionOrder)) {
      subscaleScores.Recovery_Rest.push(score);
    } else if (WORK_LIFE_BALANCE_SUBSCALES.Boundaries_Control.includes(questionOrder)) {
      subscaleScores.Boundaries_Control.push(score);
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
  const cutoff = WORK_LIFE_BALANCE_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = WORK_LIFE_BALANCE_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = WORK_LIFE_BALANCE_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = WORK_LIFE_BALANCE_INTERPRETATIONS[3.5];
  } else {
    interpretation = WORK_LIFE_BALANCE_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Work_to_Life_Interference
  if (subscaleMeans.Work_to_Life_Interference <= 2.4) {
    subscaleInterpretations.Work_to_Life_Interference = 'مزاحمت کار برای زندگی بالا: کار شما به زمان شخصی آسیب می‌زند. این می‌تواند منجر به فرسودگی، کاهش کیفیت زندگی و استرس مزمن شود. پیشنهاد می‌شود مرزبندی سالم و مدیریت زمان را تمرین کنید.';
  } else if (subscaleMeans.Work_to_Life_Interference <= 3.4) {
    subscaleInterpretations.Work_to_Life_Interference = 'مزاحمت کار برای زندگی متوسط: شما در حال توسعه تعادل هستید. با تمرین می‌توانید این تعادل را بهبود بخشید.';
  } else {
    subscaleInterpretations.Work_to_Life_Interference = 'مزاحمت کار برای زندگی کم: شما می‌توانید به خوبی بین کار و زندگی شخصی مرزبندی کنید. این به شما کمک می‌کند تا از فرسودگی جلوگیری کنید.';
  }

  // Life_to_Work_Interference
  if (subscaleMeans.Life_to_Work_Interference <= 2.4) {
    subscaleInterpretations.Life_to_Work_Interference = 'مزاحمت زندگی برای کار بالا: مسئولیت‌های خانواده و زندگی شخصی باعث کاهش تمرکز در کار می‌شود. این می‌تواند منجر به استرس دوطرفه و کاهش عملکرد شغلی شود. پیشنهاد می‌شود مدیریت منابع و زمان را تمرین کنید.';
  } else if (subscaleMeans.Life_to_Work_Interference <= 3.4) {
    subscaleInterpretations.Life_to_Work_Interference = 'مزاحمت زندگی برای کار متوسط: شما در حال توسعه تعادل هستید. با تمرین می‌توانید این تعادل را بهبود بخشید.';
  } else {
    subscaleInterpretations.Life_to_Work_Interference = 'مزاحمت زندگی برای کار کم: شما می‌توانید به خوبی بین مسئولیت‌های شخصی و شغلی تعادل برقرار کنید.';
  }

  // Recovery_Rest
  if (subscaleMeans.Recovery_Rest <= 2.4) {
    subscaleInterpretations.Recovery_Rest = 'ریکاوری پایین: شما نمی‌توانید به درستی استراحت کنید و مغزتان خاموش نمی‌شود. این می‌تواند منجر به خواب بد، تنش مزمن و کاهش عملکرد شود. پیشنهاد می‌شود تست Mindfulness، Sleep Quality و Stress را انجام دهید.';
  } else if (subscaleMeans.Recovery_Rest <= 3.4) {
    subscaleInterpretations.Recovery_Rest = 'ریکاوری متوسط: شما در حال توسعه مهارت‌های ریکاوری هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Recovery_Rest = 'ریکاوری خوب: شما می‌توانید به خوبی استراحت کنید و از کار جدا شوید. این به شما کمک می‌کند تا انرژی خود را بازیابی کنید.';
  }

  // Boundaries_Control
  if (subscaleMeans.Boundaries_Control <= 2.4) {
    subscaleInterpretations.Boundaries_Control = 'مرزبندی ضعیف: شما نمی‌توانید بین کار و زندگی مرزی بگذارید. این می‌تواند منجر به بی‌نظمی شغلی، کار در تمام طول روز و فشار روانی بالا شود. پیشنهاد می‌شود تست Self-Regulation و Time Management را انجام دهید.';
  } else if (subscaleMeans.Boundaries_Control <= 3.4) {
    subscaleInterpretations.Boundaries_Control = 'مرزبندی متوسط: شما در حال توسعه مهارت‌های مرزبندی هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Boundaries_Control = 'مرزبندی خوب: شما می‌توانید به خوبی بین کار و زندگی مرزبندی کنید و کنترل زمان خود را در دست دارید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('pss10', 'psqi', 'lifestyle-sleep-quality', 'adaptability', 'maas');
  }
  
  if (subscaleMeans.Recovery_Rest <= 2.4) {
    recommendedTests.push('maas', 'psqi', 'lifestyle-sleep-quality', 'pss10');
  }
  
  if (subscaleMeans.Boundaries_Control <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention', 'problem-solving');
  }
  
  if (subscaleMeans.Work_to_Life_Interference <= 2.4 || subscaleMeans.Life_to_Work_Interference <= 2.4) {
    recommendedTests.push('pss10', 'adaptability');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• مزاحمت کار→زندگی: ${subscaleMeans.Work_to_Life_Interference.toFixed(2)}/5 (بالاتر = بهتر)\n`;
  interpretation += `• مزاحمت زندگی→کار: ${subscaleMeans.Life_to_Work_Interference.toFixed(2)}/5 (بالاتر = بهتر)\n`;
  interpretation += `• ریکاوری و استراحت: ${subscaleMeans.Recovery_Rest.toFixed(2)}/5\n`;
  interpretation += `• مرزبندی و کنترل: ${subscaleMeans.Boundaries_Control.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Work_to_Life_Interference: subscaleMeans.Work_to_Life_Interference,
      Life_to_Work_Interference: subscaleMeans.Life_to_Work_Interference,
      Recovery_Rest: subscaleMeans.Recovery_Rest,
      Boundaries_Control: subscaleMeans.Boundaries_Control,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Work_to_Life_Interference: subscaleInterpretations.Work_to_Life_Interference,
      Life_to_Work_Interference: subscaleInterpretations.Life_to_Work_Interference,
      Recovery_Rest: subscaleInterpretations.Recovery_Rest,
      Boundaries_Control: subscaleInterpretations.Boundaries_Control,
    },
  };
}
