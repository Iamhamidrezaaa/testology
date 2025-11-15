/**
 * Config استاندارد برای تست ISI (Insomnia Severity Index)
 * منبع: Bastien et al. (2001) – Validation of the Insomnia Severity Index
 * 
 * این تست یکی از استانداردترین، دقیق‌ترین و الزامی‌ترین تست‌های مربوط به خواب است.
 * 
 * تعداد سوالات: 7
 * هیچ زیرمقیاس رسمی ندارد → یک نمره کلی
 * مقیاس پاسخ: 5 گزینه‌ای (0-4) - از 0 شروع می‌شود!
 * هیچ reverse item ندارد
 * نمره کل: sum(7 items) → range: 0-28
 * 
 * ISI شامل این محورهاست:
 * - مشکل در به‌خواب رفتن (sleep onset)
 * - مشکل در ادامه خواب (sleep maintenance)
 * - بیدار شدن زودهنگام (early awakening)
 * - رضایت از الگوی خواب
 * - تداخل با عملکرد روزانه
 * - قابل‌توجه بودن مشکل برای دیگران
 * - درگیری ذهنی/نگرانی از خواب
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست همه سوالات (7 سوال)
 */
export const ISI_QUESTIONS = Array.from({ length: 7 }, (_, i) => i + 1);

/**
 * لیست سوالات Reverse-Scored
 * ISI هیچ reverse item ندارد
 */
export const ISI_REVERSE_ITEMS: number[] = [];

/**
 * Mapping سوالات به reverse status
 */
export interface ISIQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 7 سوال
 */
export function createISIQuestionMapping(): ISIQuestionMapping[] {
  return ISI_QUESTIONS.map(questionOrder => ({
    questionOrder,
    isReverse: false, // ISI هیچ reverse item ندارد
  }));
}

/**
 * Config استاندارد ISI
 */
export const ISI_CONFIG: ScoringConfig = {
  type: 'sum', // جمع همه سوالات
  reverseItems: [], // ISI هیچ reverse item ندارد
  subscales: [
    {
      name: 'Insomnia_Severity',
      items: ISI_QUESTIONS,
    },
  ],
  weighting: {
    'none': 0,           // هیچ
    'mild': 1,          // خفیف
    'moderate': 2,      // متوسط
    'severe': 3,       // شدید
    'very_severe': 4,  // بسیار شدید
  },
  minScore: 0,
  maxScore: 28,
};

/**
 * Cutoff استاندارد ISI
 */
export const ISI_CUTOFFS = {
  Insomnia_Severity: [
    {
      min: 0,
      max: 7,
      label: 'طبیعی / بدون بی‌خوابی',
      severity: undefined as const,
      percentile: '0-7',
    },
    {
      min: 8,
      max: 14,
      label: 'بی‌خوابی خفیف',
      severity: 'mild' as const,
      percentile: '8-14',
    },
    {
      min: 15,
      max: 21,
      label: 'بی‌خوابی متوسط',
      severity: 'moderate' as const,
      percentile: '15-21',
    },
    {
      min: 22,
      max: 28,
      label: 'بی‌خوابی شدید',
      severity: 'severe' as const,
      percentile: '22-28',
    },
  ],
};

/**
 * تفسیر برای هر سطح
 */
export const ISI_INTERPRETATIONS = {
  '0-7': 'خواب طبیعی. نوسانات معمول، بدون اختلال قابل توجه.',
  '8-14': 'بی‌خوابی خفیف. مشکلات گه‌گاهی، تحت تأثیر استرس یا سبک زندگی.',
  '15-21': 'بی‌خوابی متوسط. تداخل با انرژی و تمرکز، تأثیر روی خلق و عملکرد روزانه. توصیه به بررسی الگوها و روتین خواب.',
  '22-28': 'بی‌خوابی شدید. اثر شدید بر کارکرد روزانه، معمولاً همراه با اضطراب/افسردگی. توصیه به ارزیابی تخصصی یا اصلاح جدی سبک زندگی.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getISIConfigJSON(): string {
  return JSON.stringify(ISI_CONFIG);
}

/**
 * محاسبه نمره ISI
 * ISI از sum استفاده می‌کند
 * Total = sum(7 items)
 * Range: 0-28
 * هیچ reverse item ندارد
 */
export function calculateISIScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 0-4 است) }
): {
  totalScore: number;
  interpretation: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
  alert?: string; // هشدار برای نمره بالا
} {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 7) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (0-4)
    // ISI از 0 شروع می‌شود، پس نیازی به +1 نیست
    const score = optionIndex; // 0-4 مستقیماً

    totalScore += score;
  });

  // تعیین cutoff و تفسیر
  let interpretation = '';
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  let alert: string | undefined = undefined;
  
  if (totalScore >= 0 && totalScore <= 7) {
    interpretation = ISI_INTERPRETATIONS['0-7'];
  } else if (totalScore >= 8 && totalScore <= 14) {
    interpretation = ISI_INTERPRETATIONS['8-14'];
    severity = 'mild';
  } else if (totalScore >= 15 && totalScore <= 21) {
    interpretation = ISI_INTERPRETATIONS['15-21'];
    severity = 'moderate';
  } else if (totalScore >= 22 && totalScore <= 28) {
    interpretation = ISI_INTERPRETATIONS['22-28'];
    severity = 'severe';
    alert = 'شدت مشکل خواب زیاد است و می‌تواند بر سلامت عاطفی و تمرکز روزانه اثرگذار باشد. توصیه می‌شود با یک متخصص سلامت روان یا پزشک مشورت کنید.';
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScore >= 15) {
    recommendedTests.push('psqi'); // کیفیت خواب
    recommendedTests.push('gad7'); // اضطراب
    recommendedTests.push('phq9'); // افسردگی
    recommendedTests.push('bdi2'); // جزئیات افسردگی
    recommendedTests.push('pss'); // استرس
  }

  return {
    totalScore,
    interpretation,
    severity,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    alert,
  };
}

