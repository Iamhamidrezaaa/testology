/**
 * Config استاندارد برای تست STAI (State-Trait Anxiety Inventory - Form Y)
 * منبع: Spielberger, 1983
 * 
 * State = اضطراب حالت (همین الآن)
 * Trait = اضطراب صفت (الگوی پایدار شخص)
 * 
 * تعداد سوالات: 40
 * دو زیرمقیاس:
 * - State Anxiety (S-Anxiety): 20 سوال (1-20)
 * - Trait Anxiety (T-Anxiety): 20 سوال (21-40)
 * 
 * مقیاس نمره‌دهی: 1-4 (نه 0-3!)
 * Range هر زیرمقیاس: 20-80
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const STAI_SUBSCALES = {
  State: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], // S-Anxiety
  Trait: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40], // T-Anxiety
};

/**
 * لیست سوالات Reverse-Scored
 * State Anxiety: 10 سوال reverse
 * Trait Anxiety: 10 سوال reverse
 * فرمول Reverse: reverse_score = 5 - original_score
 */
export const STAI_REVERSE_ITEMS = {
  State: [3, 4, 6, 7, 9, 12, 13, 14, 17, 18], // 10 سوال reverse در State
  Trait: [23, 24, 26, 27, 30, 33, 36, 38, 39, 40], // 10 سوال reverse در Trait
};

/**
 * همه سوالات reverse (برای استفاده در config)
 */
export const STAI_ALL_REVERSE_ITEMS = [
  ...STAI_REVERSE_ITEMS.State,
  ...STAI_REVERSE_ITEMS.Trait,
];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface STAIQuestionMapping {
  questionOrder: number;
  subscale: 'State' | 'Trait';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 40 سوال
 */
export function createSTAIQuestionMapping(): STAIQuestionMapping[] {
  const mapping: STAIQuestionMapping[] = [];
  const stateReverseSet = new Set(STAI_REVERSE_ITEMS.State);
  const traitReverseSet = new Set(STAI_REVERSE_ITEMS.Trait);

  // State Anxiety (1-20)
  STAI_SUBSCALES.State.forEach(questionOrder => {
    mapping.push({
      questionOrder,
      subscale: 'State',
      isReverse: stateReverseSet.has(questionOrder),
    });
  });

  // Trait Anxiety (21-40)
  STAI_SUBSCALES.Trait.forEach(questionOrder => {
    mapping.push({
      questionOrder,
      subscale: 'Trait',
      isReverse: traitReverseSet.has(questionOrder),
    });
  });

  return mapping;
}

/**
 * Config استاندارد STAI
 */
export const STAI_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه subscales داریم
  dimensions: ['State', 'Trait'],
  reverseItems: STAI_ALL_REVERSE_ITEMS,
  subscales: [
    {
      name: 'State',
      items: STAI_SUBSCALES.State,
    },
    {
      name: 'Trait',
      items: STAI_SUBSCALES.Trait,
    },
  ],
  weighting: {
    'option_1': 1,  // اصلاً / خیلی کم
    'option_2': 2,  // کمی
    'option_3': 3,  // متوسط
    'option_4': 4,  // خیلی زیاد
  },
  minScore: 20, // هر زیرمقیاس: 20 سوال × 1 = 20
  maxScore: 80, // هر زیرمقیاس: 20 سوال × 4 = 80
};

/**
 * Cutoff استاندارد STAI (استاندارد جهانی)
 */
export const STAI_CUTOFFS = {
  State: [
    { min: 20, max: 37, label: 'پایین', severity: null, percentile: '0-21%' },
    { min: 38, max: 44, label: 'متوسط', severity: 'mild' as const, percentile: '21-30%' },
    { min: 45, max: 80, label: 'بالا (clinically significant)', severity: 'moderate' as const, percentile: '30-100%' },
  ],
  Trait: [
    { min: 20, max: 37, label: 'پایین', severity: null, percentile: '0-21%' },
    { min: 38, max: 44, label: 'متوسط', severity: 'mild' as const, percentile: '21-30%' },
    { min: 45, max: 80, label: 'بالا (clinically significant)', severity: 'moderate' as const, percentile: '30-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const STAI_INTERPRETATIONS = {
  State: {
    20: 'آرام، بدون تهدید فوری',
    38: 'تنش متوسط، وضعیت‌های فشارزا',
    45: 'اضطراب بالا؛ واکنش حاد یا تجربه استرس شدید',
  },
  Trait: {
    20: 'شخصیت آرام، استرس‌پذیری پایین',
    38: 'نگرانی مزمن خفیف',
    45: 'اضطراب زمینه‌ای بالا؛ الگوی پایدار نگرانی',
  },
};

/**
 * Alert برای نمره بالای بالینی (≥45)
 */
export interface STAIClinicalAlert {
  hasAlert: boolean;
  stateAlert: boolean;
  traitAlert: boolean;
  message: string;
}

/**
 * بررسی alert برای نمره بالای بالینی
 */
export function checkSTAIClinicalAlert(stateScore: number, traitScore: number): STAIClinicalAlert {
  const stateAlert = stateScore >= 45;
  const traitAlert = traitScore >= 45;
  const hasAlert = stateAlert || traitAlert;

  let message = '';
  if (stateAlert && traitAlert) {
    message = '⚠️ نمره اضطراب حالت و صفت شما در سطح بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
  } else if (stateAlert) {
    message = '⚠️ نمره اضطراب حالت شما در سطح بالینی قابل توجه است. این ممکن است نشان‌دهنده واکنش حاد به استرس باشد.';
  } else if (traitAlert) {
    message = '⚠️ نمره اضطراب صفت شما در سطح بالینی قابل توجه است. این نشان‌دهنده الگوی پایدار نگرانی است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
  }

  return {
    hasAlert,
    stateAlert,
    traitAlert,
    message,
  };
}

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getSTAIConfigJSON(): string {
  return JSON.stringify({
    ...STAI_CONFIG,
    cutoffs: STAI_CUTOFFS,
  });
}

/**
 * محاسبه نمره STAI
 * نکته مهم: فرمت پاسخ از 1 شروع می‌شود نه 0!
 */
export function calculateSTAIScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3 که معادل 1-4 است) }
): {
  subscales: {
    State: number;
    Trait: number;
  };
  interpretations: {
    State: string;
    Trait: string;
  };
  clinicalAlert: STAIClinicalAlert;
  cutoffs: {
    State: {
      min: number;
      max: number;
      label: string;
      severity: 'mild' | 'moderate' | 'severe' | null;
    } | null;
    Trait: {
      min: number;
      max: number;
      label: string;
      severity: 'mild' | 'moderate' | 'severe' | null;
    } | null;
  };
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number } = {
    State: 0,
    Trait: 0,
  };
  const stateReverseSet = new Set(STAI_REVERSE_ITEMS.State);
  const traitReverseSet = new Set(STAI_REVERSE_ITEMS.Trait);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    // پیدا کردن زیرمقیاس
    let subscale: 'State' | 'Trait' | null = null;
    let isReverse = false;
    
    if (STAI_SUBSCALES.State.includes(questionOrder)) {
      subscale = 'State';
      isReverse = stateReverseSet.has(questionOrder);
    } else if (STAI_SUBSCALES.Trait.includes(questionOrder)) {
      subscale = 'Trait';
      isReverse = traitReverseSet.has(questionOrder);
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-3) به نمره واقعی (1-4)
    // چون UI معمولاً 0-3 استفاده می‌کند، باید +1 کنیم
    let score = optionIndex + 1; // تبدیل 0-3 به 1-4

    // اگر reverse است، معکوس کن: 5 - score
    if (isReverse) {
      score = 5 - score;
    }

    // اضافه کردن به نمره زیرمقیاس
    subscaleScores[subscale] += score;
  });

  // تعیین cutoff برای هر زیرمقیاس
  const cutoffs: {
    State: { min: number; max: number; label: string; severity: 'mild' | 'moderate' | 'severe' | null } | null;
    Trait: { min: number; max: number; label: string; severity: 'mild' | 'moderate' | 'severe' | null } | null;
  } = {
    State: null,
    Trait: null,
  };

  Object.entries(subscaleScores).forEach(([subscale, score]) => {
    const cutoff = STAI_CUTOFFS[subscale as keyof typeof STAI_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    if (cutoff) {
      cutoffs[subscale as keyof typeof cutoffs] = cutoff;
    }
  });

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(subscaleScores).forEach(([subscale, score]) => {
    const interpretation = STAI_INTERPRETATIONS[subscale as keyof typeof STAI_INTERPRETATIONS];
    if (score <= 37) {
      interpretations[subscale] = interpretation[20];
    } else if (score <= 44) {
      interpretations[subscale] = interpretation[38];
    } else {
      interpretations[subscale] = interpretation[45];
    }
  });

  // بررسی alert برای نمره بالای بالینی
  const clinicalAlert = checkSTAIClinicalAlert(
    subscaleScores.State,
    subscaleScores.Trait
  );

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (subscaleScores.State >= 45) {
    recommendedTests.push('gad7'); // برای اضطراب تعمیم‌یافته
    recommendedTests.push('bai'); // اضطراب بدنی
    recommendedTests.push('isi', 'psqi'); // اگر اشاره به مشکل خواب باشد
  }
  if (subscaleScores.Trait >= 45) {
    recommendedTests.push('hads'); // اضطراب بلندمدت + افسردگی
    recommendedTests.push('phq9'); // هم‌پوشانی افسردگی مزمن
  }

  return {
    subscales: subscaleScores as { State: number; Trait: number },
    interpretations: interpretations as { State: string; Trait: string },
    clinicalAlert,
    cutoffs,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

