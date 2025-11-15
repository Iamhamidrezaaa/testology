/**
 * Config استاندارد برای تست علایق و سرگرمی‌ها (Hobbies & Interests Profile)
 * 
 * این تست علایق و سرگرمی‌های فرد را در 4 حوزه می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 6, 7 (2 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Creative_Interests: سوالات 1, 5, 9 (بدون Reverse)
 * - Physical_Outdoor_Interests: سوالات 2, 6, 10 (Reverse: 6)
 * - Social_Community_Interests: سوالات 3, 7, 11 (Reverse: 7)
 * - Intellectual_Learning_Interests: سوالات 4, 8, 12 (بدون Reverse)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Hobbies & Interests
 */
export const HOBBIES_INTERESTS_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب مقاومت در برابر فعالیت و علایق)
 */
export const HOBBIES_INTERESTS_REVERSE_ITEMS = [6, 7];

/**
 * زیرمقیاس‌ها
 */
export const HOBBIES_INTERESTS_SUBSCALES = {
  Creative_Interests: [1, 5, 9], // بدون Reverse
  Physical_Outdoor_Interests: [2, 6, 10], // Reverse: 6
  Social_Community_Interests: [3, 7, 11], // Reverse: 7
  Intellectual_Learning_Interests: [4, 8, 12], // بدون Reverse
};

/**
 * Mapping سوالات
 */
export interface HobbiesInterestsQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Creative_Interests' | 'Physical_Outdoor_Interests' | 'Social_Community_Interests' | 'Intellectual_Learning_Interests';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createHobbiesInterestsQuestionMapping(): HobbiesInterestsQuestionMapping[] {
  return HOBBIES_INTERESTS_QUESTIONS.map(questionOrder => {
    let subscale: 'Creative_Interests' | 'Physical_Outdoor_Interests' | 'Social_Community_Interests' | 'Intellectual_Learning_Interests';
    
    if (HOBBIES_INTERESTS_SUBSCALES.Creative_Interests.includes(questionOrder)) {
      subscale = 'Creative_Interests';
    } else if (HOBBIES_INTERESTS_SUBSCALES.Physical_Outdoor_Interests.includes(questionOrder)) {
      subscale = 'Physical_Outdoor_Interests';
    } else if (HOBBIES_INTERESTS_SUBSCALES.Social_Community_Interests.includes(questionOrder)) {
      subscale = 'Social_Community_Interests';
    } else {
      subscale = 'Intellectual_Learning_Interests';
    }
    
    return {
      questionOrder,
      isReverse: HOBBIES_INTERESTS_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Hobbies & Interests
 */
export const HOBBIES_INTERESTS_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: HOBBIES_INTERESTS_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Creative_Interests',
      items: HOBBIES_INTERESTS_SUBSCALES.Creative_Interests,
    },
    {
      name: 'Physical_Outdoor_Interests',
      items: HOBBIES_INTERESTS_SUBSCALES.Physical_Outdoor_Interests,
    },
    {
      name: 'Social_Community_Interests',
      items: HOBBIES_INTERESTS_SUBSCALES.Social_Community_Interests,
    },
    {
      name: 'Intellectual_Learning_Interests',
      items: HOBBIES_INTERESTS_SUBSCALES.Intellectual_Learning_Interests,
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
 * Cutoff برای Hobbies & Interests
 */
export const HOBBIES_INTERESTS_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'پایین / محدود / کم‌فعالیت', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'فعال / دارای علایق مشخص', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'بسیار فعال / غنی و متنوع', severity: null, percentile: '85-100%' },
  ],
  Creative_Interests: [
    { min: 1.0, max: 2.4, label: 'علایق خلاقانه پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'علایق خلاقانه متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'علایق خلاقانه بالا', severity: null },
  ],
  Physical_Outdoor_Interests: [
    { min: 1.0, max: 2.4, label: 'علایق بدنی/بیرونی پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'علایق بدنی/بیرونی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'علایق بدنی/بیرونی بالا', severity: null },
  ],
  Social_Community_Interests: [
    { min: 1.0, max: 2.4, label: 'علایق اجتماعی پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'علایق اجتماعی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'علایق اجتماعی بالا', severity: null },
  ],
  Intellectual_Learning_Interests: [
    { min: 1.0, max: 2.4, label: 'علایق فکری/یادگیری پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'علایق فکری/یادگیری متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'علایق فکری/یادگیری بالا', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const HOBBIES_INTERESTS_INTERPRETATIONS = {
  1.0: 'علایق و سرگرمی‌ها محدود: شما در فعالیت‌های تفریحی و علایق خود محدود هستید. این می‌تواند منجر به کاهش شادکامی، خستگی ذهنی و کاهش انرژی شود. پیشنهاد می‌شود با تست Creativity، Curiosity و Physical Activity شروع کنید.',
  2.5: 'علایق و سرگرمی‌ها متوسط: شما در برخی حوزه‌ها علایق دارید اما در برخی دیگر نیاز به توسعه دارید. با کشف فعالیت‌های جدید می‌توانید علایق خود را گسترش دهید.',
  3.5: 'علایق و سرگرمی‌ها فعال: شما در چند حوزه علایق مشخص دارید و از فعالیت‌های تفریحی لذت می‌برید. این به شما کمک می‌کند تا شادکامی و انرژی خود را حفظ کنید.',
  4.3: 'علایق و سرگرمی‌ها غنی و متنوع: شما یک فرد بسیار فعال با علایق متنوع هستید. شما از فعالیت‌های خلاقانه، بدنی، اجتماعی و فکری لذت می‌برید. این به شما کمک می‌کند تا زندگی پربار و شادی داشته باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getHobbiesInterestsConfigJSON(): string {
  return JSON.stringify({
    ...HOBBIES_INTERESTS_CONFIG,
    cutoffs: HOBBIES_INTERESTS_CUTOFFS,
  });
}

/**
 * محاسبه نمره Hobbies & Interests
 */
export function calculateHobbiesInterestsScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Creative_Interests: number;
    Physical_Outdoor_Interests: number;
    Social_Community_Interests: number;
    Intellectual_Learning_Interests: number;
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
    Creative_Interests: string;
    Physical_Outdoor_Interests: string;
    Social_Community_Interests: string;
    Intellectual_Learning_Interests: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Creative_Interests: [],
    Physical_Outdoor_Interests: [],
    Social_Community_Interests: [],
    Intellectual_Learning_Interests: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (HOBBIES_INTERESTS_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (HOBBIES_INTERESTS_SUBSCALES.Creative_Interests.includes(questionOrder)) {
      subscaleScores.Creative_Interests.push(score);
    } else if (HOBBIES_INTERESTS_SUBSCALES.Physical_Outdoor_Interests.includes(questionOrder)) {
      subscaleScores.Physical_Outdoor_Interests.push(score);
    } else if (HOBBIES_INTERESTS_SUBSCALES.Social_Community_Interests.includes(questionOrder)) {
      subscaleScores.Social_Community_Interests.push(score);
    } else if (HOBBIES_INTERESTS_SUBSCALES.Intellectual_Learning_Interests.includes(questionOrder)) {
      subscaleScores.Intellectual_Learning_Interests.push(score);
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
  const cutoff = HOBBIES_INTERESTS_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = HOBBIES_INTERESTS_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = HOBBIES_INTERESTS_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = HOBBIES_INTERESTS_INTERPRETATIONS[3.5];
  } else {
    interpretation = HOBBIES_INTERESTS_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Creative_Interests
  if (subscaleMeans.Creative_Interests <= 2.4) {
    subscaleInterpretations.Creative_Interests = 'علایق خلاقانه پایین: شما از فعالیت‌های خلاقانه مثل هنر، موسیقی یا نوشتن لذت کمی می‌برید. این می‌تواند منجر به کاهش لذت از هنر/نوشتن و احتمال خستگی ذهنی شود. پیشنهاد می‌شود تست Creativity، Curiosity و Innovation را انجام دهید.';
  } else if (subscaleMeans.Creative_Interests <= 3.4) {
    subscaleInterpretations.Creative_Interests = 'علایق خلاقانه متوسط: شما در حال توسعه علایق خلاقانه هستید. با تمرین می‌توانید این علایق را تقویت کنید.';
  } else {
    subscaleInterpretations.Creative_Interests = 'علایق خلاقانه بالا: شما از فعالیت‌های خلاقانه لذت زیادی می‌برید. این به شما کمک می‌کند تا خلاقیت و شادکامی خود را حفظ کنید.';
  }

  // Physical_Outdoor_Interests
  if (subscaleMeans.Physical_Outdoor_Interests <= 2.4) {
    subscaleInterpretations.Physical_Outdoor_Interests = 'علایق بدنی/بیرونی پایین: شما از فعالیت‌های بدنی و بیرونی لذت کمی می‌برید. این می‌تواند منجر به کم‌تحرکی و کاهش انرژی شود. پیشنهاد می‌شود تست Physical Activity، Sleep و Stress را انجام دهید.';
  } else if (subscaleMeans.Physical_Outdoor_Interests <= 3.4) {
    subscaleInterpretations.Physical_Outdoor_Interests = 'علایق بدنی/بیرونی متوسط: شما در حال توسعه علایق بدنی هستید. با تمرین می‌توانید این علایق را تقویت کنید.';
  } else {
    subscaleInterpretations.Physical_Outdoor_Interests = 'علایق بدنی/بیرونی بالا: شما از فعالیت‌های بدنی و بیرونی لذت زیادی می‌برید. این به شما کمک می‌کند تا انرژی و سلامت خود را حفظ کنید.';
  }

  // Social_Community_Interests
  if (subscaleMeans.Social_Community_Interests <= 2.4) {
    subscaleInterpretations.Social_Community_Interests = 'علایق اجتماعی پایین: شما از فعالیت‌های اجتماعی و گروهی لذت کمی می‌برید. این می‌تواند منجر به انزوا و تمایل محدود به جمع شود. پیشنهاد می‌شود تست UCLA (تنهایی)، SPIN (اضطراب اجتماعی) و Emotional Wellbeing را انجام دهید.';
  } else if (subscaleMeans.Social_Community_Interests <= 3.4) {
    subscaleInterpretations.Social_Community_Interests = 'علایق اجتماعی متوسط: شما در حال توسعه علایق اجتماعی هستید. با تمرین می‌توانید این علایق را تقویت کنید.';
  } else {
    subscaleInterpretations.Social_Community_Interests = 'علایق اجتماعی بالا: شما از فعالیت‌های اجتماعی و گروهی لذت زیادی می‌برید. این به شما کمک می‌کند تا روابط خود را تقویت کنید.';
  }

  // Intellectual_Learning_Interests
  if (subscaleMeans.Intellectual_Learning_Interests <= 2.4) {
    subscaleInterpretations.Intellectual_Learning_Interests = 'علایق فکری/یادگیری پایین: شما از فعالیت‌های فکری و یادگیری لذت کمی می‌برید. این می‌تواند منجر به انگیزه کم برای یادگیری شود. پیشنهاد می‌شود تست Growth Mindset، Learning Style و Curiosity را انجام دهید.';
  } else if (subscaleMeans.Intellectual_Learning_Interests <= 3.4) {
    subscaleInterpretations.Intellectual_Learning_Interests = 'علایق فکری/یادگیری متوسط: شما در حال توسعه علایق فکری هستید. با تمرین می‌توانید این علایق را تقویت کنید.';
  } else {
    subscaleInterpretations.Intellectual_Learning_Interests = 'علایق فکری/یادگیری بالا: شما از فعالیت‌های فکری و یادگیری لذت زیادی می‌برید. این به شما کمک می‌کند تا به طور مداوم رشد کنید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Physical_Outdoor_Interests <= 2.4) {
    recommendedTests.push('physical-activity', 'psqi', 'lifestyle-sleep-quality', 'pss10');
  }
  
  if (subscaleMeans.Creative_Interests <= 2.4) {
    recommendedTests.push('creativity', 'innovation', 'curiosity');
  }
  
  if (subscaleMeans.Social_Community_Interests <= 2.4) {
    recommendedTests.push('ucla', 'spin', 'attachment');
  }
  
  if (subscaleMeans.Intellectual_Learning_Interests <= 2.4) {
    recommendedTests.push('growth-mindset', 'learning-style', 'curiosity');
  }
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('creativity', 'curiosity', 'physical-activity');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• علایق خلاقانه: ${subscaleMeans.Creative_Interests.toFixed(2)}/5\n`;
  interpretation += `• علایق بدنی/بیرونی: ${subscaleMeans.Physical_Outdoor_Interests.toFixed(2)}/5\n`;
  interpretation += `• علایق اجتماعی: ${subscaleMeans.Social_Community_Interests.toFixed(2)}/5\n`;
  interpretation += `• علایق فکری/یادگیری: ${subscaleMeans.Intellectual_Learning_Interests.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Creative_Interests: subscaleMeans.Creative_Interests,
      Physical_Outdoor_Interests: subscaleMeans.Physical_Outdoor_Interests,
      Social_Community_Interests: subscaleMeans.Social_Community_Interests,
      Intellectual_Learning_Interests: subscaleMeans.Intellectual_Learning_Interests,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Creative_Interests: subscaleInterpretations.Creative_Interests,
      Physical_Outdoor_Interests: subscaleInterpretations.Physical_Outdoor_Interests,
      Social_Community_Interests: subscaleInterpretations.Social_Community_Interests,
      Intellectual_Learning_Interests: subscaleInterpretations.Intellectual_Learning_Interests,
    },
  };
}

