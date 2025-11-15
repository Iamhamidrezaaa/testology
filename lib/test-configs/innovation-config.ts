/**
 * Config استاندارد برای تست نوآوری (Innovation & Creative Action Assessment)
 * منبع:
 * - Innovative Behavior Scale (Janssen)
 * - Creative Self-Efficacy Scale
 * - Innovation Potential Inventory
 * - Proactive Personality Scale
 * 
 * این تست نوآوری و عمل خلاقانه را می‌سنجد
 * 
 * تعداد سوالات: 12
 * فرمت پاسخ: Likert 5 گزینه‌ای (1-5)
 * Reverse items: 2, 7, 8, 12 (4 آیتم)
 * 
 * زیرمقیاس‌ها:
 * - Idea_Generation: سوالات 1, 5, 9 (بدون Reverse)
 * - Creative_Confidence: سوالات 2, 6, 10 (Reverse: 2)
 * - Innovation_Implementation: سوالات 3, 7, 11 (Reverse: 7)
 * - Risk_Taking_Experimentation: سوالات 4, 8, 12 (Reverse: 8, 12)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات Innovation
 */
export const INNOVATION_QUESTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * سوالات Reverse (بازتاب ترس از ریسک یا تردید در توان خلاقیت)
 */
export const INNOVATION_REVERSE_ITEMS = [2, 7, 8, 12];

/**
 * زیرمقیاس‌ها
 */
export const INNOVATION_SUBSCALES = {
  Idea_Generation: [1, 5, 9], // بدون Reverse
  Creative_Confidence: [2, 6, 10], // Reverse: 2
  Innovation_Implementation: [3, 7, 11], // Reverse: 7
  Risk_Taking_Experimentation: [4, 8, 12], // Reverse: 8, 12
};

/**
 * Mapping سوالات
 */
export interface InnovationQuestionMapping {
  questionOrder: number;
  isReverse: boolean;
  subscale: 'Idea_Generation' | 'Creative_Confidence' | 'Innovation_Implementation' | 'Risk_Taking_Experimentation';
}

/**
 * ساخت mapping کامل برای همه 12 سوال
 */
export function createInnovationQuestionMapping(): InnovationQuestionMapping[] {
  return INNOVATION_QUESTIONS.map(questionOrder => {
    let subscale: 'Idea_Generation' | 'Creative_Confidence' | 'Innovation_Implementation' | 'Risk_Taking_Experimentation';
    
    if (INNOVATION_SUBSCALES.Idea_Generation.includes(questionOrder)) {
      subscale = 'Idea_Generation';
    } else if (INNOVATION_SUBSCALES.Creative_Confidence.includes(questionOrder)) {
      subscale = 'Creative_Confidence';
    } else if (INNOVATION_SUBSCALES.Innovation_Implementation.includes(questionOrder)) {
      subscale = 'Innovation_Implementation';
    } else {
      subscale = 'Risk_Taking_Experimentation';
    }
    
    return {
      questionOrder,
      isReverse: INNOVATION_REVERSE_ITEMS.includes(questionOrder),
      subscale,
    };
  });
}

/**
 * Config استاندارد Innovation
 */
export const INNOVATION_CONFIG: ScoringConfig = {
  type: 'average', // میانگین برای هر زیرمقیاس
  reverseItems: INNOVATION_REVERSE_ITEMS,
  subscales: [
    {
      name: 'Idea_Generation',
      items: INNOVATION_SUBSCALES.Idea_Generation,
    },
    {
      name: 'Creative_Confidence',
      items: INNOVATION_SUBSCALES.Creative_Confidence,
    },
    {
      name: 'Innovation_Implementation',
      items: INNOVATION_SUBSCALES.Innovation_Implementation,
    },
    {
      name: 'Risk_Taking_Experimentation',
      items: INNOVATION_SUBSCALES.Risk_Taking_Experimentation,
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
 * Cutoff برای Innovation
 */
export const INNOVATION_CUTOFFS = {
  total: [
    { min: 1.0, max: 2.4, label: 'پایین / محتاط / نیازمند رشد', severity: 'mild' as const, percentile: '0-30%' },
    { min: 2.5, max: 3.4, label: 'متوسط / نوسانی', severity: null, percentile: '30-60%' },
    { min: 3.5, max: 4.2, label: 'نوآور فعال', severity: null, percentile: '60-85%' },
    { min: 4.3, max: 5.0, label: 'بسیار نوآور و خلاق', severity: null, percentile: '85-100%' },
  ],
  Idea_Generation: [
    { min: 1.0, max: 2.4, label: 'ایده‌پردازی پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'ایده‌پردازی متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'ایده‌پردازی بالا', severity: null },
  ],
  Creative_Confidence: [
    { min: 1.0, max: 2.4, label: 'اعتمادبه‌نفس خلاقانه پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'اعتمادبه‌نفس خلاقانه متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'اعتمادبه‌نفس خلاقانه بالا', severity: null },
  ],
  Innovation_Implementation: [
    { min: 1.0, max: 2.4, label: 'اجرای ایده‌ها پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'اجرای ایده‌ها متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'اجرای ایده‌ها بالا', severity: null },
  ],
  Risk_Taking_Experimentation: [
    { min: 1.0, max: 2.4, label: 'ریسک‌پذیری پایین', severity: 'mild' as const },
    { min: 2.5, max: 3.4, label: 'ریسک‌پذیری متوسط', severity: null },
    { min: 3.5, max: 5.0, label: 'ریسک‌پذیری بالا', severity: null },
  ],
};

/**
 * تفسیر بر اساس نمره کل
 */
export const INNOVATION_INTERPRETATIONS = {
  1.0: 'نوآوری پایین: شما در تولید ایده‌های جدید، اعتمادبه‌نفس خلاقانه و اجرای نوآوری‌ها مشکل دارید. این می‌تواند منجر به تفکر تکراری، کمبود خلاقیت و محدودیت در پیشرفت شود. پیشنهاد می‌شود با تست Creativity، Growth Mindset و Curiosity شروع کنید.',
  2.5: 'نوآوری متوسط: شما در برخی حوزه‌ها نوآور هستید اما در برخی دیگر نیاز به تقویت دارید. با تمرین و آگاهی می‌توانید نوآوری خود را بهبود بخشید.',
  3.5: 'نوآور فعال: شما می‌توانید ایده‌های جدید تولید کنید، آن‌ها را به عمل تبدیل کنید و از ریسک‌های حساب‌شده استقبال کنید. این به شما کمک می‌کند تا در کار و زندگی نوآور باشید.',
  4.3: 'بسیار نوآور و خلاق: شما یک فرد بسیار نوآور و خلاق هستید. شما می‌توانید به طور مداوم ایده‌های جدید تولید کنید، آن‌ها را اجرا کنید و از تجربه چیزهای جدید لذت ببرید. این به شما کمک می‌کند تا در رهبری، کارآفرینی و حل مسائل موفق باشید.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getInnovationConfigJSON(): string {
  return JSON.stringify({
    ...INNOVATION_CONFIG,
    cutoffs: INNOVATION_CUTOFFS,
  });
}

/**
 * محاسبه نمره Innovation
 */
export function calculateInnovationScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4) }
): {
  totalScore: number;
  subscales: {
    Idea_Generation: number;
    Creative_Confidence: number;
    Innovation_Implementation: number;
    Risk_Taking_Experimentation: number;
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
    Idea_Generation: string;
    Creative_Confidence: string;
    Innovation_Implementation: string;
    Risk_Taking_Experimentation: string;
  };
} {
  // محاسبه نمره هر زیرمقیاس
  const subscaleScores: { [key: string]: number[] } = {
    Idea_Generation: [],
    Creative_Confidence: [],
    Innovation_Implementation: [],
    Risk_Taking_Experimentation: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره (1-5)
    let score = optionIndex + 1;

    // اگر reverse است، معکوس کن: 6 - score
    if (INNOVATION_REVERSE_ITEMS.includes(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (INNOVATION_SUBSCALES.Idea_Generation.includes(questionOrder)) {
      subscaleScores.Idea_Generation.push(score);
    } else if (INNOVATION_SUBSCALES.Creative_Confidence.includes(questionOrder)) {
      subscaleScores.Creative_Confidence.push(score);
    } else if (INNOVATION_SUBSCALES.Innovation_Implementation.includes(questionOrder)) {
      subscaleScores.Innovation_Implementation.push(score);
    } else if (INNOVATION_SUBSCALES.Risk_Taking_Experimentation.includes(questionOrder)) {
      subscaleScores.Risk_Taking_Experimentation.push(score);
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
  const cutoff = INNOVATION_CUTOFFS.total.find(
    c => totalScoreRounded >= c.min && totalScoreRounded <= c.max
  ) || null;

  // ساخت تفسیر
  let interpretation = '';
  if (totalScoreRounded <= 2.4) {
    interpretation = INNOVATION_INTERPRETATIONS[1.0];
  } else if (totalScoreRounded <= 3.4) {
    interpretation = INNOVATION_INTERPRETATIONS[2.5];
  } else if (totalScoreRounded <= 4.2) {
    interpretation = INNOVATION_INTERPRETATIONS[3.5];
  } else {
    interpretation = INNOVATION_INTERPRETATIONS[4.3];
  }

  // تفسیر زیرمقیاس‌ها
  const subscaleInterpretations: { [key: string]: string } = {};

  // Idea_Generation
  if (subscaleMeans.Idea_Generation <= 2.4) {
    subscaleInterpretations.Idea_Generation = 'ایده‌پردازی پایین: شما در تولید ایده‌های جدید مشکل دارید. این می‌تواند منجر به تفکر تکراری، کمبود خلاقیت و محدودیت در نوآوری شود. پیشنهاد می‌شود تست Creativity و Curiosity را انجام دهید.';
  } else if (subscaleMeans.Idea_Generation <= 3.4) {
    subscaleInterpretations.Idea_Generation = 'ایده‌پردازی متوسط: شما در حال توسعه مهارت‌های ایده‌پردازی هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Idea_Generation = 'ایده‌پردازی بالا: شما می‌توانید به طور مداوم ایده‌های جدید و خلاقانه تولید کنید. این به شما کمک می‌کند تا نوآور باشید.';
  }

  // Creative_Confidence
  if (subscaleMeans.Creative_Confidence <= 2.4) {
    subscaleInterpretations.Creative_Confidence = 'اعتمادبه‌نفس خلاقانه پایین: شما به توانایی خلاقانه خود شک دارید. این می‌تواند منجر به ترس از ایده‌دادن، تردید در توانایی و محدودیت در نوآوری شود. پیشنهاد می‌شود تست Growth Mindset و Self-Esteem را انجام دهید.';
  } else if (subscaleMeans.Creative_Confidence <= 3.4) {
    subscaleInterpretations.Creative_Confidence = 'اعتمادبه‌نفس خلاقانه متوسط: شما در حال توسعه اعتمادبه‌نفس خلاقانه هستید. با تمرین می‌توانید این اعتمادبه‌نفس را تقویت کنید.';
  } else {
    subscaleInterpretations.Creative_Confidence = 'اعتمادبه‌نفس خلاقانه بالا: شما به توانایی خلاقانه خود اعتماد دارید. این به شما کمک می‌کند تا ایده‌های خود را با اطمینان ارائه دهید.';
  }

  // Innovation_Implementation
  if (subscaleMeans.Innovation_Implementation <= 2.4) {
    subscaleInterpretations.Innovation_Implementation = 'اجرای ایده‌ها پایین: شما در تبدیل ایده‌ها به عمل مشکل دارید. این می‌تواند منجر به ایده زیاد و عمل کم، مشکل در شروع و محدودیت در پیشرفت شود. پیشنهاد می‌شود تست Time Management، Self-Regulation و Motivation را انجام دهید.';
  } else if (subscaleMeans.Innovation_Implementation <= 3.4) {
    subscaleInterpretations.Innovation_Implementation = 'اجرای ایده‌ها متوسط: شما در حال توسعه مهارت‌های اجرایی هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Innovation_Implementation = 'اجرای ایده‌ها بالا: شما می‌توانید به خوبی ایده‌های خود را به عمل تبدیل کنید. این به شما کمک می‌کند تا نوآوری‌های خود را عملی کنید.';
  }

  // Risk_Taking_Experimentation
  if (subscaleMeans.Risk_Taking_Experimentation <= 2.4) {
    subscaleInterpretations.Risk_Taking_Experimentation = 'ریسک‌پذیری پایین: شما از ریسک کردن و امتحان چیزهای جدید می‌ترسید. این می‌تواند منجر به احتیاط بیش از حد، ترس از شکست و فشار ذهنی بالا در موقعیت‌های جدید شود. پیشنهاد می‌شود تست Growth Mindset و Adaptability را انجام دهید.';
  } else if (subscaleMeans.Risk_Taking_Experimentation <= 3.4) {
    subscaleInterpretations.Risk_Taking_Experimentation = 'ریسک‌پذیری متوسط: شما در حال توسعه ریسک‌پذیری هستید. با تمرین می‌توانید این مهارت را تقویت کنید.';
  } else {
    subscaleInterpretations.Risk_Taking_Experimentation = 'ریسک‌پذیری بالا: شما از ریسک‌های حساب‌شده استقبال می‌کنید و از تجربه چیزهای جدید لذت می‌برید. این به شما کمک می‌کند تا نوآور باشید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('creativity', 'growth-mindset', 'curiosity', 'adaptability', 'problem-solving');
  }
  
  if (subscaleMeans.Idea_Generation <= 2.4) {
    recommendedTests.push('creativity', 'curiosity');
  }
  
  if (subscaleMeans.Creative_Confidence <= 2.4) {
    recommendedTests.push('growth-mindset', 'rosenberg');
  }
  
  if (subscaleMeans.Innovation_Implementation <= 2.4) {
    recommendedTests.push('time-management', 'focus-attention');
  }
  
  if (subscaleMeans.Risk_Taking_Experimentation <= 2.4) {
    recommendedTests.push('growth-mindset', 'adaptability');
  }

  // اضافه کردن تفسیر زیرمقیاس‌ها به تفسیر اصلی
  interpretation += `\n\n📊 تحلیل زیرمقیاس‌ها:\n`;
  interpretation += `• ایده‌پردازی: ${subscaleMeans.Idea_Generation.toFixed(2)}/5\n`;
  interpretation += `• اعتمادبه‌نفس خلاقانه: ${subscaleMeans.Creative_Confidence.toFixed(2)}/5\n`;
  interpretation += `• اجرای ایده‌ها: ${subscaleMeans.Innovation_Implementation.toFixed(2)}/5\n`;
  interpretation += `• ریسک‌پذیری: ${subscaleMeans.Risk_Taking_Experimentation.toFixed(2)}/5\n`;

  return {
    totalScore: totalScoreRounded,
    subscales: {
      Idea_Generation: subscaleMeans.Idea_Generation,
      Creative_Confidence: subscaleMeans.Creative_Confidence,
      Innovation_Implementation: subscaleMeans.Innovation_Implementation,
      Risk_Taking_Experimentation: subscaleMeans.Risk_Taking_Experimentation,
    },
    interpretation,
    cutoff,
    ...(recommendedTests.length > 0 && { recommendedTests }),
    subscaleInterpretations: {
      Idea_Generation: subscaleInterpretations.Idea_Generation,
      Creative_Confidence: subscaleInterpretations.Creative_Confidence,
      Innovation_Implementation: subscaleInterpretations.Innovation_Implementation,
      Risk_Taking_Experimentation: subscaleInterpretations.Risk_Taking_Experimentation,
    },
  };
}

