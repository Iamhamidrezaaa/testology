/**
 * Config استاندارد برای تست PSSS (Perceived Social Support Scale)
 * 
 * مقیاس حمایت اجتماعی ادراک‌شده - یکی از قوی‌ترین فاکتورهای محافظت‌کننده
 * در برابر افسردگی، اضطراب، تنهایی و حتی مشکلات فیزیولوژیک
 * 
 * نسخه 12 سوالی (Zimet et al., 1988) - معروف به MSPSS
 * 
 * تعداد سوالات: 12
 * 3 زیرمقیاس (هر کدام 4 سوال):
 * - Family Support (حمایت خانواده): 4 سوال
 * - Friends Support (حمایت دوستان): 4 سوال
 * - Significant Other Support (حمایت فرد مهم / شریک زندگی): 4 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * بدون reverse (تمام سوالات مستقیم‌اند)
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 12 سوال (1-5)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس (کلید رسمی MSPSS)
 */
export const PSSS_SUBSCALES = {
  Family: [3, 4, 8, 11], // 4 سوال
  Friends: [6, 7, 9, 12], // 4 سوال
  Significant_Other: [1, 2, 5, 10], // 4 سوال
};

/**
 * لیست سوالات Reverse-Scored
 * ⚠️ این تست هیچ سوال reverse ندارد
 */
export const PSSS_REVERSE_ITEMS: number[] = [];

/**
 * Mapping سوالات به زیرمقیاس‌ها
 */
export interface PSSSQuestionMapping {
  questionOrder: number;
  subscale: 'Family' | 'Friends' | 'Significant_Other';
  isReverse: boolean; // همیشه false
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createPSSSQuestionMapping(): PSSSQuestionMapping[] {
  const mapping: PSSSQuestionMapping[] = [];

  // برای هر زیرمقیاس
  Object.entries(PSSS_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Family' | 'Friends' | 'Significant_Other',
        isReverse: false, // هیچ سوال reverse ندارد
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد PSSS
 */
export const PSSS_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کلی
  dimensions: ['Family', 'Friends', 'Significant_Other'],
  reverseItems: [], // هیچ سوال reverse ندارد
  subscales: [
    {
      name: 'Family',
      items: PSSS_SUBSCALES.Family,
    },
    {
      name: 'Friends',
      items: PSSS_SUBSCALES.Friends,
    },
    {
      name: 'Significant_Other',
      items: PSSS_SUBSCALES.Significant_Other,
    },
  ],
  weighting: {
    'strongly_disagree': 1,  // کاملاً مخالفم
    'disagree': 2,           // مخالفم
    'neutral': 3,            // نه موافق نه مخالف
    'agree': 4,              // موافقم
    'strongly_agree': 5,     // کاملاً موافقم
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد PSSS
 */
export const PSSS_CUTOFFS = {
  Family: [
    {
      min: 1.0,
      max: 2.4,
      label: 'پایین',
      severity: undefined as const,
      percentile: '1.0-2.4',
    },
    {
      min: 2.5,
      max: 3.4,
      label: 'متوسط',
      severity: undefined as const,
      percentile: '2.5-3.4',
    },
    {
      min: 3.5,
      max: 4.2,
      label: 'خوب',
      severity: undefined as const,
      percentile: '3.5-4.2',
    },
    {
      min: 4.3,
      max: 5.0,
      label: 'بسیار بالا',
      severity: undefined as const,
      percentile: '4.3-5.0',
    },
  ],
  // همین cutoff برای همه 3 زیرمقیاس و نمره کلی
  Friends: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  Significant_Other: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', severity: undefined as const, percentile: '4.3-5.0' },
  ],
  total: [
    { min: 1.0, max: 2.4, label: 'پایین', severity: undefined as const, percentile: '1.0-2.4' },
    { min: 2.5, max: 3.4, label: 'متوسط', severity: undefined as const, percentile: '2.5-3.4' },
    { min: 3.5, max: 4.2, label: 'خوب', severity: undefined as const, percentile: '3.5-4.2' },
    { min: 4.3, max: 5.0, label: 'بسیار بالا', severity: undefined as const, percentile: '4.3-5.0' },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const PSSS_INTERPRETATIONS = {
  Family: {
    high: 'وجود پشتوانه خانوادگی، احساس تعلق، رابطه با والدین / خواهر و برادر',
    low: 'کمبود حمایت خانوادگی، احساس فاصله از خانواده',
  },
  Friends: {
    high: 'کیفیت روابط دوستانه، صمیمیت، دسترسی احساسی در مواقع نیاز',
    low: 'کمبود روابط دوستانه صمیمی، احساس تنهایی در روابط اجتماعی',
  },
  Significant_Other: {
    high: 'همسر / شریک زندگی / فرد مهم، احساس امنیت، توجه و صمیمیت، حمایت عاطفی مستقیم',
    low: 'کمبود حمایت از شریک زندگی یا فرد مهم، احساس تنهایی در رابطه',
  },
  total: {
    high: 'تاب‌آوری بیشتر، سلامت روان بهتر، سازگاری اجتماعی بالاتر',
    low: 'احساس تنها بودن، ریسک بیشتر افسردگی/اضطراب، تمایل به انزوا',
  },
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getPSSSConfigJSON(): string {
  return JSON.stringify(PSSS_CONFIG);
}

/**
 * محاسبه نمره PSSS
 * PSSS از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(4 items)
 * نمره کلی: mean(12 items)
 * Range: 1-5
 */
export function calculatePSSSScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Family: number;
    Friends: number;
    Significant_Other: number;
  };
  totalScore: number;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Family: [],
    Friends: [],
    Significant_Other: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Family' | 'Friends' | 'Significant_Other' | null = null;
    if (PSSS_SUBSCALES.Family.includes(questionOrder)) {
      subscale = 'Family';
    } else if (PSSS_SUBSCALES.Friends.includes(questionOrder)) {
      subscale = 'Friends';
    } else if (PSSS_SUBSCALES.Significant_Other.includes(questionOrder)) {
      subscale = 'Significant_Other';
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    const score = optionIndex + 1; // تبدیل 0-4 به 1-5
    // هیچ reverse ندارد

    // اضافه کردن به لیست نمرات زیرمقیاس
    subscaleScores[subscale].push(score);
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 12 سوال)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 3;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Family >= 3.5) {
    interpretations.push(`حمایت خانوادگی بالا: ${PSSS_INTERPRETATIONS.Family.high}`);
  } else if (subscaleMeans.Family <= 2.4) {
    interpretations.push(`حمایت خانوادگی پایین: ${PSSS_INTERPRETATIONS.Family.low}`);
  }
  
  if (subscaleMeans.Friends >= 3.5) {
    interpretations.push(`حمایت دوستان بالا: ${PSSS_INTERPRETATIONS.Friends.high}`);
  } else if (subscaleMeans.Friends <= 2.4) {
    interpretations.push(`حمایت دوستان پایین: ${PSSS_INTERPRETATIONS.Friends.low}`);
  }
  
  if (subscaleMeans.Significant_Other >= 3.5) {
    interpretations.push(`حمایت شریک زندگی بالا: ${PSSS_INTERPRETATIONS.Significant_Other.high}`);
  } else if (subscaleMeans.Significant_Other <= 2.4) {
    interpretations.push(`حمایت شریک زندگی پایین: ${PSSS_INTERPRETATIONS.Significant_Other.low}`);
  }

  // تفسیر نمره کلی
  if (totalScoreRounded >= 4.3) {
    interpretations.push(`حمایت اجتماعی بسیار بالا: ${PSSS_INTERPRETATIONS.total.high}`);
  } else if (totalScoreRounded <= 2.4) {
    interpretations.push(`حمایت اجتماعی پایین: ${PSSS_INTERPRETATIONS.total.low}`);
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'حمایت اجتماعی متعادل';

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    // اگر نمره کلی پایین باشد
    recommendedTests.push('ucla-loneliness'); // UCLA (تنهایی)
    recommendedTests.push('attachment'); // Attachment (سبک دلبستگی)
    recommendedTests.push('communication-skills'); // Communication Skills
    recommendedTests.push('emotional-support-skills'); // Emotional Support Skills
    recommendedTests.push('phq9'); // Depression/Anxiety (اگر علامت‌های همزمان هست)
    recommendedTests.push('gad7'); // Anxiety
  }
  
  // بررسی اختلاف شدید بین زیرمقیاس‌ها
  const subscaleValues = [subscaleMeans.Family, subscaleMeans.Friends, subscaleMeans.Significant_Other];
  const maxSubscale = Math.max(...subscaleValues);
  const minSubscale = Math.min(...subscaleValues);
  const difference = maxSubscale - minSubscale;
  
  if (difference >= 1.5) {
    // اختلاف شدید بین زیرمقیاس‌ها
    if (subscaleMeans.Family >= 3.5 && subscaleMeans.Friends <= 2.4) {
      // Family بالا، Friends پایین
      recommendedTests.push('communication-skills'); // تست‌های مهارت اجتماعی/ارتباطات
      recommendedTests.push('teamwork');
    }
    
    if (subscaleMeans.Significant_Other <= 2.4 && (subscaleMeans.Family >= 3.5 || subscaleMeans.Friends >= 3.5)) {
      // Significant پایین ولی Family/Friends بالا
      recommendedTests.push('attachment'); // Attachment / Intimacy
      recommendedTests.push('intimacy-skills');
    }
  }

  return {
    subscales: subscaleMeans as {
      Family: number;
      Friends: number;
      Significant_Other: number;
    },
    totalScore: totalScoreRounded,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

