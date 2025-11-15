/**
 * Config استاندارد برای تست ارزش‌های شخصی (Personal Values Assessment)
 * منبع: Schwartz Value Theory (1992)
 * "Universals in the content and structure of values: Theoretical advances and empirical tests"
 * 
 * این تست ارزش‌های شخصی را بر اساس نظریه 10 ارزش جهانی شوارتز می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 4, 6, 7 (3 آیتم)
 * 
 * زیرمقیاس‌ها (بر اساس Schwartz Value Theory):
 * - Self_Enhancement: سوالات 1, 5, 9 (بدون Reverse)
 * - Self_Transcendence: سوالات 2, 6, 10 (Reverse: 6)
 * - Openness_to_Change: سوالات 3, 7, 11 (Reverse: 7)
 * - Conservation: سوالات 4, 8, 12 (Reverse: 4)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Personal Values
 */
export const PERSONAL_VALUES_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب مقاومت یا بی‌اهمیتی نسبت به ارزش خاص)
 */
export const PERSONAL_VALUES_REVERSE_ITEMS = [4, 6, 7];

/**
 * زیرمقیاس‌ها
 */
export const PERSONAL_VALUES_SUBSCALES = {
  Self_Enhancement: [1, 5, 9], // بدون Reverse
  Self_Transcendence: [2, 6, 10], // Reverse: 6
  Openness_to_Change: [3, 7, 11], // Reverse: 7
  Conservation: [4, 8, 12], // Reverse: 4
};

/**
 * Mapping سوالات
 */
export interface PersonalValuesQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Self_Enhancement' | 'Self_Transcendence' | 'Openness_to_Change' | 'Conservation';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createPersonalValuesQuestionMapping(): PersonalValuesQuestionMapping[] {
  return PERSONAL_VALUES_QUESTIONS.map(questionOrder => {
    let subscale: 'Self_Enhancement' | 'Self_Transcendence' | 'Openness_to_Change' | 'Conservation';
    
    if (PERSONAL_VALUES_SUBSCALES.Self_Enhancement.includes(questionOrder)) {
      subscale = 'Self_Enhancement';
    } else if (PERSONAL_VALUES_SUBSCALES.Self_Transcendence.includes(questionOrder)) {
      subscale = 'Self_Transcendence';
    } else if (PERSONAL_VALUES_SUBSCALES.Openness_to_Change.includes(questionOrder)) {
      subscale = 'Openness_to_Change';
    } else {
      subscale = 'Conservation';
    }
    
    return {
      questionOrder,
      isReverse: PERSONAL_VALUES_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Personal Values
 */
export const PERSONAL_VALUES_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: PERSONAL_VALUES_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Self_Enhancement',
      items: PERSONAL_VALUES_SUBSCALES.Self_Enhancement,
    },
    {
      name: 'Self_Transcendence',
      items: PERSONAL_VALUES_SUBSCALES.Self_Transcendence,
    },
    {
      name: 'Openness_to_Change',
      items: PERSONAL_VALUES_SUBSCALES.Openness_to_Change,
    },
    {
      name: 'Conservation',
      items: PERSONAL_VALUES_SUBSCALES.Conservation,
    },
  ],
  weighting: {
    'not_important': 1,
    'slightly_important': 2,
    'moderately_important': 3,
    'important': 4,
    'very_important': 5,
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff برای Personal Values
 */
export const PERSONAL_VALUES_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'ارزش‌های کم‌رنگ / نامشخص', severity: null, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / پراکنده', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'ارزش‌های پایدار', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'ارزش‌های قوی و مشخص', severity: null, percentile: '85-100%' },
  ],
  Self_Enhancement: [
    { min: 1.0, max: 2.4, label: 'اهمیت پایین', severity: null },
    { min: 2.5, max: 3.4, label: 'اهمیت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'اهمیت بالا', severity: null },
  ],
  Self_Transcendence: [
    { min: 1.0, max: 2.4, label: 'اهمیت پایین', severity: null },
    { min: 2.5, max: 3.4, label: 'اهمیت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'اهمیت بالا', severity: null },
  ],
  Openness_to_Change: [
    { min: 1.0, max: 2.4, label: 'اهمیت پایین', severity: null },
    { min: 2.5, max: 3.4, label: 'اهمیت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'اهمیت بالا', severity: null },
  ],
  Conservation: [
    { min: 1.0, max: 2.4, label: 'اهمیت پایین', severity: null },
    { min: 2.5, max: 3.4, label: 'اهمیت متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'اهمیت بالا', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const PERSONAL_VALUES_INTERPRETATIONS = {
  1.0: 'ارزش‌های کم‌رنگ: ارزش‌های شخصی شما نامشخص یا کم‌رنگ هستند. این می‌تواند منجر به چالش در تصمیم‌گیری، کاهش انگیزه و عدم رضایت شود. پیشنهاد می‌شود با خودشناسی و تفکر درباره آنچه برای شما مهم است شروع کنید.',
  2.5: 'ارزش‌های متوسط: شما در برخی حوزه‌ها ارزش‌های مشخص دارید اما در برخی دیگر نیاز به وضوح دارید. با تمرین و آگاهی می‌توانید ارزش‌های خود را بهتر شناسایی کنید.',
  3.5: 'ارزش‌های پایدار: شما ارزش‌های مشخص و پایدار دارید که به تصمیم‌گیری و انگیزه شما کمک می‌کند. این به شما کمک می‌کند تا در مسیر درست حرکت کنید.',
  4.3: 'ارزش‌های قوی و مشخص: شما ارزش‌های قوی و بسیار مشخص دارید که به شدت روی تصمیم‌گیری، انگیزه و سبک زندگی شما تأثیر می‌گذارد. این به شما کمک می‌کند تا زندگی هدفمند و رضایت‌بخش داشته باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getPersonalValuesConfigJSON(): string {
  return JSON.stringify({
    ...PERSONAL_VALUES_CONFIG,
    cutoffs: PERSONAL_VALUES_CUTOFFS,
  });
}

/**
 * محاسبه نمره Personal Values
 */
export function calculatePersonalValuesScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Self_Enhancement: number;
    Self_Transcendence: number;
    Openness_to_Change: number;
    Conservation: number;
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
    Self_Enhancement: string;
    Self_Transcendence: string;
    Openness_to_Change: string;
    Conservation: string;
  };
  valueProfile?: {
    dominant: string;
    secondary: string;
    description: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Self_Enhancement: [],
    Self_Transcendence: [],
    Openness_to_Change: [],
    Conservation: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (PERSONAL_VALUES_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (PERSONAL_VALUES_SUBSCALES.Self_Enhancement.includes(questionOrder)) {
      subscaleScores.Self_Enhancement.push(score);
    } else if (PERSONAL_VALUES_SUBSCALES.Self_Transcendence.includes(questionOrder)) {
      subscaleScores.Self_Transcendence.push(score);
    } else if (PERSONAL_VALUES_SUBSCALES.Openness_to_Change.includes(questionOrder)) {
      subscaleScores.Openness_to_Change.push(score);
    } else if (PERSONAL_VALUES_SUBSCALES.Conservation.includes(questionOrder)) {
      subscaleScores.Conservation.push(score);
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
  const cutoff = PERSONAL_VALUES_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = PERSONAL_VALUES_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = PERSONAL_VALUES_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = PERSONAL_VALUES_INTERPRETATIONS[3.5];
  } else {
    interpretation = PERSONAL_VALUES_INTERPRETATIONS[4.3];
  }

  // تعیین پروفایل ارزش‌ها (ارزش غالب و ثانویه)
  const sortedValues = Object.entries(subscaleMeans)
    .sort(([, a], [, b]) => b - a)
    .map(([key]) => key);
  
  const dominant = sortedValues[0];
  const secondary = sortedValues[1];
  
  const valueProfileDescriptions: { [key: string]: string } = {
    Self_Enhancement: 'پیشرفت فردی و موفقیت',
    Self_Transcendence: 'کمک به دیگران و اخلاق',
    Openness_to_Change: 'آزادی و نوآوری',
    Conservation: 'امنیت و ثبات',
  };
  
  const valueProfile = {
    dominant: valueProfileDescriptions[dominant] || '',
    secondary: valueProfileDescriptions[secondary] || '',
    description: `ارزش غالب شما: ${valueProfileDescriptions[dominant] || dominant}. ارزش ثانویه: ${valueProfileDescriptions[secondary] || secondary}.`,
  };

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Self_Enhancement
  if (subscaleMeans.Self_Enhancement >= 3.5) {
    subscaleInterpretations.Self_Enhancement = 'ارزش بالا برای پیشرفت فردی: شما روی پیشرفت، موفقیت، استقلال مالی و رشد فردی تأکید دارید. این ارزش‌ها شما را به سمت مسیرهای شغلی رهبری، کارآفرینی و محیط‌های رقابتی هدایت می‌کند. پیشنهاد می‌شود تست رهبری، مدیریت زمان و مسیر شغلی را انجام دهید.';
  } else if (subscaleMeans.Self_Enhancement <= 2.4) {
    subscaleInterpretations.Self_Enhancement = 'اهمیت پایین برای پیشرفت فردی: پیشرفت و موفقیت شخصی برای شما اولویت کمتری دارد. شما ممکن است روی ارزش‌های دیگر مثل کمک به دیگران یا امنیت تمرکز کنید.';
  } else {
    subscaleInterpretations.Self_Enhancement = 'اهمیت متوسط برای پیشرفت فردی: شما در حال توسعه ارزش‌های پیشرفت فردی هستید.';
  }

  // Self_Transcendence
  if (subscaleMeans.Self_Transcendence >= 3.5) {
    subscaleInterpretations.Self_Transcendence = 'ارزش بالا برای دیگرگرایی: باارزش‌ترین چیز برای شما کمک به دیگران، ارتباط انسانی، اخلاق و اثر اجتماعی است. این ارزش‌ها شما را به سمت درمانگری، آموزش، خدمات اجتماعی و کار تیمی هدایت می‌کند. پیشنهاد می‌شود تست دلبستگی، روابط اجتماعی و همدلی را انجام دهید.';
  } else if (subscaleMeans.Self_Transcendence <= 2.4) {
    subscaleInterpretations.Self_Transcendence = 'اهمیت پایین برای دیگرگرایی: کمک به دیگران و اخلاق برای شما اولویت کمتری دارد. شما ممکن است روی ارزش‌های دیگر مثل پیشرفت فردی یا آزادی تمرکز کنید.';
  } else {
    subscaleInterpretations.Self_Transcendence = 'اهمیت متوسط برای دیگرگرایی: شما در حال توسعه ارزش‌های دیگرگرایی هستید.';
  }

  // Openness_to_Change
  if (subscaleMeans.Openness_to_Change >= 3.5) {
    subscaleInterpretations.Openness_to_Change = 'ارزش بالا برای گشودگی: شما عاشق آزادی، تجربه‌گرایی، تغییر، سفر و انعطاف هستید. این ارزش‌ها شما را به سمت خلاقیت، استارتاپ، هنر و یادگیری آزاد هدایت می‌کند. پیشنهاد می‌شود تست کنجکاوی، خلاقیت، نوآوری و سبک یادگیری را انجام دهید.';
  } else if (subscaleMeans.Openness_to_Change <= 2.4) {
    subscaleInterpretations.Openness_to_Change = 'اهمیت پایین برای گشودگی: آزادی و تغییر برای شما اولویت کمتری دارد. شما ممکن است روی ارزش‌های دیگر مثل امنیت و ثبات تمرکز کنید.';
  } else {
    subscaleInterpretations.Openness_to_Change = 'اهمیت متوسط برای گشودگی: شما در حال توسعه ارزش‌های گشودگی هستید.';
  }

  // Conservation
  if (subscaleMeans.Conservation >= 3.5) {
    subscaleInterpretations.Conservation = 'ارزش بالا برای ثبات: شما نیاز به امنیت، ساختار، ثبات و برنامه‌ریزی دارید. این ارزش‌ها شما را به سمت مشاغل اداری، مالی، تحلیلی و ساختاریافته هدایت می‌کند. پیشنهاد می‌شود تست شخصیتی BFI (عامل وظیفه‌شناسی)، مدیریت استرس و Adaptability را انجام دهید.';
  } else if (subscaleMeans.Conservation <= 2.4) {
    subscaleInterpretations.Conservation = 'اهمیت پایین برای ثبات: امنیت و ساختار برای شما اولویت کمتری دارد. شما ممکن است روی ارزش‌های دیگر مثل آزادی و نوآوری تمرکز کنید.';
  } else {
    subscaleInterpretations.Conservation = 'اهمیت متوسط برای ثبات: شما در حال توسعه ارزش‌های ثبات هستید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Self_Enhancement >= 3.5) {
    recommendedTests.push('leadership', 'time-management', 'riasec');
  }
  
  if (subscaleMeans.Self_Transcendence >= 3.5) {
    recommendedTests.push('attachment', 'ucla', 'communication-skills');
  }
  
  if (subscaleMeans.Openness_to_Change >= 3.5) {
    recommendedTests.push('curiosity', 'creativity', 'innovation', 'learning-style');
  }
  
  if (subscaleMeans.Conservation >= 3.5) {
    recommendedTests.push('bfi', 'neo-ffi', 'pss10', 'adaptability');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها و پروفایل ارزش‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• پیشرفت فردی: ${subscaleMeans.Self_Enhancement.toFixed(2)}/5\n`;
  interpretation += `• دیگرگرایی: ${subscaleMeans.Self_Transcendence.toFixed(2)}/5\n`;
  interpretation += `• گشودگی به تغییر: ${subscaleMeans.Openness_to_Change.toFixed(2)}/5\n`;
  interpretation += `• ثبات و امنیت: ${subscaleMeans.Conservation.toFixed(2)}/5\n`;
  interpretation += `\n🎯 پروفایل ارزش‌های شما:\n`;
  interpretation += valueProfile.description;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Self_Enhancement: subscaleMeans.Self_Enhancement,
      Self_Transcendence: subscaleMeans.Self_Transcendence,
      Openness_to_Change: subscaleMeans.Openness_to_Change,
      Conservation: subscaleMeans.Conservation,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Self_Enhancement: subscaleInterpretations.Self_Enhancement,
      Self_Transcendence: subscaleInterpretations.Self_Transcendence,
      Openness_to_Change: subscaleInterpretations.Openness_to_Change,
      Conservation: subscaleInterpretations.Conservation,
    },
    valueProfile,
  };
}

