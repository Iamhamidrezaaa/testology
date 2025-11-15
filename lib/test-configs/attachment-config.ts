/**
 * Config استاندارد برای تست Attachment (ECR-R - Experiences in Close Relationships–Revised)
 * منبع: Fraley, Waller, & Brennan (2000)
 * 
 * این تست مبنای اصلی تمام پژوهش‌های دلبستگی بزرگسالان است
 * 
 * تعداد سوالات: 36
 * دو زیرمقیاس:
 * - Avoidance (اجتناب دلبستگی): 18 سوال
 * - Anxiety (اضطراب دلبستگی): 18 سوال
 * 
 * مقیاس پاسخ: 7 گزینه‌ای (1-7) - از 1 شروع می‌شود نه 0!
 * نمره هر زیرمقیاس: میانگین 1-7
 * 10 سوال reverse در Avoidance
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const ATTACHMENT_SUBSCALES = {
  Avoidance: [1, 3, 5, 7, 9, 11, 12, 14, 16, 18, 19, 21, 22, 24, 26, 27, 29, 31], // 18 سوال
  Anxiety: [2, 4, 6, 8, 10, 13, 15, 17, 20, 23, 25, 28, 30, 32, 33, 34, 35, 36], // 18 سوال
};

/**
 * لیست سوالات Reverse-Scored در Avoidance (10 سوال)
 * این سوالات مثبت درباره صمیمیت هستند و باید معکوس شوند
 * فرمول Reverse: 8 - score
 */
export const ATTACHMENT_REVERSE_ITEMS = [
  { question: 1, subscale: 'Avoidance' },
  { question: 7, subscale: 'Avoidance' },
  { question: 11, subscale: 'Avoidance' },
  { question: 14, subscale: 'Avoidance' },
  { question: 18, subscale: 'Avoidance' },
  { question: 22, subscale: 'Avoidance' },
  { question: 24, subscale: 'Avoidance' },
  { question: 27, subscale: 'Avoidance' },
  { question: 29, subscale: 'Avoidance' },
  { question: 31, subscale: 'Avoidance' },
];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface AttachmentQuestionMapping {
  questionOrder: number;
  subscale: 'Avoidance' | 'Anxiety';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 36 سوال
 */
export function createAttachmentQuestionMapping(): AttachmentQuestionMapping[] {
  const mapping: AttachmentQuestionMapping[] = [];
  const reverseSet = new Set(ATTACHMENT_REVERSE_ITEMS.map(item => item.question));

  // برای هر زیرمقیاس
  Object.entries(ATTACHMENT_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Avoidance' | 'Anxiety',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Attachment
 */
export const ATTACHMENT_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه mean داریم
  dimensions: ['Avoidance', 'Anxiety'],
  reverseItems: ATTACHMENT_REVERSE_ITEMS.map(item => item.question),
  subscales: [
    {
      name: 'Avoidance',
      items: ATTACHMENT_SUBSCALES.Avoidance,
    },
    {
      name: 'Anxiety',
      items: ATTACHMENT_SUBSCALES.Anxiety,
    },
  ],
  weighting: {
    'option_1': 1,  // کاملاً مخالفم
    'option_2': 2,  // مخالفم
    'option_3': 3,  // تا حدی مخالفم
    'option_4': 4,  // نه موافق نه مخالف
    'option_5': 5,  // تا حدی موافقم
    'option_6': 6,  // موافقم
    'option_7': 7,  // کاملاً موافقم
  },
  minScore: 1,
  maxScore: 7, // هر زیرمقیاس: میانگین 1-7
};

/**
 * تعیین سبک دلبستگی بر اساس نمره Anxiety و Avoidance
 */
export type AttachmentStyle = 'Secure' | 'Anxious' | 'Avoidant' | 'Fearful';

/**
 * تعیین سبک دلبستگی
 */
export function determineAttachmentStyle(
  anxietyScore: number,
  avoidanceScore: number
): AttachmentStyle {
  const threshold = 3.5;
  
  if (anxietyScore < threshold && avoidanceScore < threshold) {
    return 'Secure';
  } else if (anxietyScore >= threshold && avoidanceScore < threshold) {
    return 'Anxious';
  } else if (anxietyScore < threshold && avoidanceScore >= threshold) {
    return 'Avoidant';
  } else {
    return 'Fearful';
  }
}

/**
 * تفسیر هر سبک دلبستگی
 */
export const ATTACHMENT_STYLE_INTERPRETATIONS = {
  Secure: 'راحت با صمیمیت، اعتماد بالا، ارتباطات سالم، احساس امنیت در روابط',
  Anxious: 'نیاز زیاد به تأیید، ترس از طرد، حساسیت زیاد به نشانه‌های بی‌توجهی، نگرانی از رها شدن',
  Avoidant: 'فاصله عاطفی، سختی نزدیک‌شدن، اعتماد پایین، خوداتکایی افراطی',
  Fearful: 'ترکیب اضطراب بالا + اجتناب بالا، هم ترس از نزدیکی، هم ترس از طرد، بی‌ثباتی هیجانی',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getAttachmentConfigJSON(): string {
  return JSON.stringify(ATTACHMENT_CONFIG);
}

/**
 * محاسبه نمره Attachment
 * Attachment از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(18 items after reverse)
 * Range: 1-7
 */
export function calculateAttachmentScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-6 که معادل 1-7 است) }
): {
  subscales: {
    Avoidance: number;
    Anxiety: number;
  };
  style: AttachmentStyle;
  interpretation: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Avoidance: [],
    Anxiety: [],
  };
  const reverseSet = new Set(ATTACHMENT_REVERSE_ITEMS.map(item => item.question));

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    // پیدا کردن زیرمقیاس
    let subscale: 'Avoidance' | 'Anxiety' | null = null;
    if (ATTACHMENT_SUBSCALES.Avoidance.includes(questionOrder)) {
      subscale = 'Avoidance';
    } else if (ATTACHMENT_SUBSCALES.Anxiety.includes(questionOrder)) {
      subscale = 'Anxiety';
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-6) به نمره واقعی (1-7)
    let score = optionIndex + 1; // تبدیل 0-6 به 1-7

    // اگر reverse است، معکوس کن: 8 - score
    if (reverseSet.has(questionOrder)) {
      score = 8 - score;
    }

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

  // تعیین سبک دلبستگی
  const style = determineAttachmentStyle(
    subscaleMeans.Anxiety,
    subscaleMeans.Avoidance
  );

  // ساخت تفسیر
  const interpretation = ATTACHMENT_STYLE_INTERPRETATIONS[style];

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (subscaleMeans.Anxiety >= 3.5) {
    recommendedTests.push('spin'); // اضطراب اجتماعی
    recommendedTests.push('rosenberg'); // Self-Esteem
    recommendedTests.push('panas'); // جزئیات هیجانی
  }
  if (subscaleMeans.Avoidance >= 3.5) {
    recommendedTests.push('communication-skills'); // مهارت‌های ارتباطی
    recommendedTests.push('eq'); // هوش هیجانی (بخصوص Interpersonal)
    recommendedTests.push('teamwork'); // کار تیمی
  }
  if (subscaleMeans.Anxiety >= 3.5 && subscaleMeans.Avoidance >= 3.5) {
    recommendedTests.push('hads'); // اضطراب و افسردگی
    recommendedTests.push('bdi2'); // جزئیات افسردگی
    recommendedTests.push('stress-management'); // مدیریت استرس
    recommendedTests.push('conflict-style'); // سبک حل تعارض
  }

  return {
    subscales: subscaleMeans as { Avoidance: number; Anxiety: number },
    style,
    interpretation,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

