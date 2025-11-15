/**
 * Config استاندارد برای تست Focus & Attention (تمرکز و توجه)
 * 
 * این تست بر اساس ترکیب استاندارد 4 مدل معتبر ساخته شده:
 * - Cognitive Failures Questionnaire (CFQ)
 * - Adult ADHD Self-Report (ASRS)
 * - Sustained Attention Scale (SAS)
 * - Concentration Inventory (CI)
 * 
 * تعداد سوالات: 12
 * 4 زیرمقیاس:
 * - Sustained Attention (توجه پایدار): 3 سوال
 * - Selective Attention (توجه انتخابی): 3 سوال
 * - Working Memory (حافظه فعال): 3 سوال
 * - Executive Control (کنترل اجرایی / مهار حواس‌پرتی): 3 سوال
 * 
 * مقیاس پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * 4 سوال reverse
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کل: میانگین همه 12 سوال
 * 
 * نکته: نمره بالاتر = مشکل بیشتر = تمرکز پایین‌تر
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const FOCUS_ATTENTION_SUBSCALES = {
  Sustained_Attention: [1, 5, 9], // 3 سوال
  Selective_Attention: [2, 6, 10], // 3 سوال
  Working_Memory: [3, 7, 11], // 3 سوال
  Executive_Control: [4, 8, 12], // 3 سوال
};

/**
 * لیست سوالات Reverse-Scored (4 سوال)
 * این سوالات مثبت هستند و باید معکوس شوند
 * فرمول Reverse: 6 - score
 */
export const FOCUS_ATTENTION_REVERSE_ITEMS = [5, 6, 8, 12];

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface FocusAttentionQuestionMapping {
  questionOrder: number;
  subscale: 'Sustained_Attention' | 'Selective_Attention' | 'Working_Memory' | 'Executive_Control';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createFocusAttentionQuestionMapping(): FocusAttentionQuestionMapping[] {
  const mapping: FocusAttentionQuestionMapping[] = [];
  const reverseSet = new Set(FOCUS_ATTENTION_REVERSE_ITEMS);

  // برای هر زیرمقیاس
  Object.entries(FOCUS_ATTENTION_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Sustained_Attention' | 'Selective_Attention' | 'Working_Memory' | 'Executive_Control',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد Focus & Attention
 */
export const FOCUS_ATTENTION_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس و نمره کل
  dimensions: ['Sustained_Attention', 'Selective_Attention', 'Working_Memory', 'Executive_Control'],
  reverseItems: FOCUS_ATTENTION_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Sustained_Attention',
      items: FOCUS_ATTENTION_SUBSCALES.Sustained_Attention,
    },
    {
      name: 'Selective_Attention',
      items: FOCUS_ATTENTION_SUBSCALES.Selective_Attention,
    },
    {
      name: 'Working_Memory',
      items: FOCUS_ATTENTION_SUBSCALES.Working_Memory,
    },
    {
      name: 'Executive_Control',
      items: FOCUS_ATTENTION_SUBSCALES.Executive_Control,
    },
  ],
  weighting: {
    'never': 1,        // هرگز
    'rarely': 2,       // خیلی کم
    'sometimes': 3,   // گاهی
    'often': 4,       // بیشتر اوقات
    'always': 5,      // همیشه
  },
  minScore: 1,
  maxScore: 5,
};

/**
 * Cutoff استاندارد Focus & Attention
 */
export const FOCUS_ATTENTION_CUTOFFS = {
  Focus_Total: [
    {
      min: 1.0,
      max: 2.0,
      label: 'تمرکز عالی',
      severity: undefined as const,
      percentile: '1.0-2.0',
    },
    {
      min: 2.1,
      max: 3.0,
      label: 'طبیعی / متوسط',
      severity: undefined as const,
      percentile: '2.1-3.0',
    },
    {
      min: 3.1,
      max: 3.6,
      label: 'تمرکز ضعیف',
      severity: 'mild' as const,
      percentile: '3.1-3.6',
    },
    {
      min: 3.7,
      max: 5.0,
      label: 'مشکل جدی در تمرکز',
      severity: 'moderate' as const,
      percentile: '3.7-5.0',
    },
  ],
};

/**
 * تفسیر برای هر زیرمقیاس
 */
export const FOCUS_ATTENTION_INTERPRETATIONS = {
  Sustained_Attention: 'توانایی حفظ تمرکز طولانی مدت (مثلاً هنگام مطالعه یا کار)',
  Selective_Attention: 'توانایی انتخاب یک محرک و نادیده گرفتن محرک‌های مزاحم',
  Working_Memory: 'حفظ و استفاده فوری از اطلاعات (عدد، آدرس، دستورالعمل)',
  Executive_Control: 'قدرت مدیریت حواس‌پرتی، برنامه‌ریزی، کنترل تکانه',
};

/**
 * تفسیر کلی برای نمره کل
 */
export const FOCUS_ATTENTION_TOTAL_INTERPRETATIONS = {
  '1.0-2.0': 'تمرکز قوی. توانایی حفظ توجه و مدیریت حواس‌پرتی در سطح عالی.',
  '2.1-3.0': 'تمرکز در محدوده طبیعی. عملکرد شناختی مناسب برای فعالیت‌های روزمره.',
  '3.1-3.6': 'تمرکز ضعیف. نیاز به بهبود در حفظ توجه و کاهش حواس‌پرتی.',
  '3.7-5.0': 'مشکل جدی در تمرکز. احتمال نیاز به بررسی بیشتر و استراتژی‌های بهبود تمرکز.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getFocusAttentionConfigJSON(): string {
  return JSON.stringify(FOCUS_ATTENTION_CONFIG);
}

/**
 * محاسبه نمره Focus & Attention
 * Focus از میانگین استفاده می‌کند
 * هر زیرمقیاس: mean(3 items after reverse)
 * نمره کل: mean(all 12 items after reverse)
 * Range: 1-5
 * نکته: نمره بالاتر = مشکل بیشتر = تمرکز پایین‌تر
 */
export function calculateFocusAttentionScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که معادل 1-5 است) }
): {
  subscales: {
    Sustained_Attention: number;
    Selective_Attention: number;
    Working_Memory: number;
    Executive_Control: number;
  };
  totalScore: number;
  interpretation: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number[] } = {
    Sustained_Attention: [],
    Selective_Attention: [],
    Working_Memory: [],
    Executive_Control: [],
  };
  const reverseSet = new Set(FOCUS_ATTENTION_REVERSE_ITEMS);
  const allScores: number[] = [];

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // پیدا کردن زیرمقیاس
    let subscale: 'Sustained_Attention' | 'Selective_Attention' | 'Working_Memory' | 'Executive_Control' | null = null;
    if (FOCUS_ATTENTION_SUBSCALES.Sustained_Attention.includes(questionOrder)) {
      subscale = 'Sustained_Attention';
    } else if (FOCUS_ATTENTION_SUBSCALES.Selective_Attention.includes(questionOrder)) {
      subscale = 'Selective_Attention';
    } else if (FOCUS_ATTENTION_SUBSCALES.Working_Memory.includes(questionOrder)) {
      subscale = 'Working_Memory';
    } else if (FOCUS_ATTENTION_SUBSCALES.Executive_Control.includes(questionOrder)) {
      subscale = 'Executive_Control';
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به لیست نمرات زیرمقیاس و نمرات کل
    subscaleScores[subscale].push(score);
    allScores.push(score);
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کل (میانگین همه 12 سوال)
  const totalSum = allScores.reduce((acc, score) => acc + score, 0);
  const totalScore = allScores.length > 0 ? Math.round((totalSum / allScores.length) * 100) / 100 : 0;

  // تعیین cutoff و تفسیر
  let interpretation = '';
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  
  if (totalScore >= 1.0 && totalScore <= 2.0) {
    interpretation = FOCUS_ATTENTION_TOTAL_INTERPRETATIONS['1.0-2.0'];
  } else if (totalScore >= 2.1 && totalScore <= 3.0) {
    interpretation = FOCUS_ATTENTION_TOTAL_INTERPRETATIONS['2.1-3.0'];
  } else if (totalScore >= 3.1 && totalScore <= 3.6) {
    interpretation = FOCUS_ATTENTION_TOTAL_INTERPRETATIONS['3.1-3.6'];
    severity = 'mild';
  } else if (totalScore >= 3.7 && totalScore <= 5.0) {
    interpretation = FOCUS_ATTENTION_TOTAL_INTERPRETATIONS['3.7-5.0'];
    severity = 'moderate';
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScore >= 3.6) {
    recommendedTests.push('asrs'); // ADHD screening
    recommendedTests.push('working-memory'); // Memory Test
    recommendedTests.push('pss'); // Stress
    recommendedTests.push('psqi'); // Sleep
    recommendedTests.push('isi'); // Insomnia
  }
  
  if (subscaleMeans.Working_Memory >= 3.5) {
    recommendedTests.push('iq'); // Cognitive Processing
    recommendedTests.push('problem-solving'); // Problem-Solving
  }
  
  if (subscaleMeans.Executive_Control >= 3.5) {
    recommendedTests.push('emotion-regulation'); // Emotion Regulation
    recommendedTests.push('impulse-control'); // Impulse Control
  }

  return {
    subscales: subscaleMeans as {
      Sustained_Attention: number;
      Selective_Attention: number;
      Working_Memory: number;
      Executive_Control: number;
    },
    totalScore,
    interpretation,
    severity,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

