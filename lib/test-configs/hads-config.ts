/**
 * Config استاندارد برای تست HADS (Hospital Anxiety and Depression Scale)
 * منبع: Zigmond & Snaith (1983)
 * 
 * یکی از دقیق‌ترین تست‌های تشخیص افتراقی اضطراب و افسردگی
 * برای محیط‌های پزشکی، درمانگاهی و آنلاین بسیار استفاده می‌شود
 * 
 * تعداد سوالات: 14
 * دو زیرمقیاس:
 * - HADS-A (اضطراب): 7 سوال
 * - HADS-D (افسردگی): 7 سوال
 * 
 * دامنه هر زیرمقیاس: 0-21
 * هیچ سوال جسمانی ندارد
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس
 */
export const HADS_SUBSCALES = {
  Anxiety: [1, 3, 5, 7, 9, 11, 13],  // HADS-A (اضطراب)
  Depression: [2, 4, 6, 8, 10, 12, 14], // HADS-D (افسردگی)
};

/**
 * لیست سوالات Reverse-Scored (4 سوال)
 * این سوالات باید معکوس نمره‌دهی شوند: reverse_score = 3 - original_score
 */
export const HADS_REVERSE_ITEMS = [
  { question: 7, subscale: 'Anxiety' },   // HADS-A
  { question: 10, subscale: 'Depression' }, // HADS-D
  { question: 11, subscale: 'Anxiety' },   // HADS-A
  { question: 14, subscale: 'Depression' }, // HADS-D
];

/**
 * آستانه بالینی (Clinical Threshold)
 * نمره ≥11 نشان‌دهنده اضطراب/افسردگی بالینی است
 */
export const HADS_CLINICAL_THRESHOLD = 11;

/**
 * Mapping سوالات به زیرمقیاس‌ها و reverse status
 */
export interface HADSQuestionMapping {
  questionOrder: number;
  subscale: 'Anxiety' | 'Depression';
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 14 سوال
 */
export function createHADSQuestionMapping(): HADSQuestionMapping[] {
  const mapping: HADSQuestionMapping[] = [];
  const reverseSet = new Set(HADS_REVERSE_ITEMS.map(item => item.question));

  // برای هر زیرمقیاس
  Object.entries(HADS_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Anxiety' | 'Depression',
        isReverse: reverseSet.has(questionOrder),
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد HADS
 */
export const HADS_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه subscales داریم
  dimensions: ['Anxiety', 'Depression'],
  reverseItems: HADS_REVERSE_ITEMS.map(item => item.question),
  subscales: [
    {
      name: 'Anxiety',
      items: HADS_SUBSCALES.Anxiety,
    },
    {
      name: 'Depression',
      items: HADS_SUBSCALES.Depression,
    },
  ],
  weighting: {
    'option_0': 0,  // در بیشتر موارد نه / اصلاً
    'option_1': 1,  // گه‌گاهی / کمی
    'option_2': 2,  // بیشتر وقت‌ها / متوسط
    'option_3': 3,  // تقریباً همیشه / شدید
  },
  minScore: 0,
  maxScore: 21, // هر زیرمقیاس: 7 سوال × 3 = 21
};

/**
 * Cutoff رسمی HADS (استاندارد جهانی)
 */
export const HADS_CUTOFFS = {
  Anxiety: [
    { min: 0, max: 7, label: 'طبیعی', severity: null, percentile: '0-33%' },
    { min: 8, max: 10, label: 'مرزی / قابل توجه', severity: 'mild' as const, percentile: '33-48%' },
    { min: 11, max: 21, label: 'بالینی', severity: 'moderate' as const, percentile: '48-100%' },
  ],
  Depression: [
    { min: 0, max: 7, label: 'طبیعی', severity: null, percentile: '0-33%' },
    { min: 8, max: 10, label: 'مرزی / قابل توجه', severity: 'mild' as const, percentile: '33-48%' },
    { min: 11, max: 21, label: 'بالینی', severity: 'moderate' as const, percentile: '48-100%' },
  ],
};

/**
 * تفسیر بر اساس نمره
 */
export const HADS_INTERPRETATIONS = {
  Anxiety: {
    0: 'اضطراب در محدوده کنترل‌شده؛ تنش‌های روزمره طبیعی‌اند.',
    8: 'علائم اضطرابی وجود دارد اما شدت بالینی نیست؛ نیازمند توجه.',
    11: 'اضطراب قابل توجه؛ توصیه به گفت‌وگو با درمانگر.',
  },
  Depression: {
    0: 'خلق پایدار، انرژی کافی.',
    8: 'کاهش خفیف لذت، کاهش انرژی.',
    11: 'علامت‌های افسردگی قابل توجه؛ تمرکز، انگیزه و خلق ممکن است تحت تأثیر باشند.',
  },
};

/**
 * Alert برای آستانه بالینی (≥11)
 */
export interface HADSClinicalAlert {
  hasAlert: boolean;
  anxietyAlert: boolean;
  depressionAlert: boolean;
  message: string;
}

/**
 * بررسی alert برای آستانه بالینی
 */
export function checkHADSClinicalAlert(anxietyScore: number, depressionScore: number): HADSClinicalAlert {
  const anxietyAlert = anxietyScore >= HADS_CLINICAL_THRESHOLD;
  const depressionAlert = depressionScore >= HADS_CLINICAL_THRESHOLD;
  const hasAlert = anxietyAlert || depressionAlert;

  let message = '';
  if (anxietyAlert && depressionAlert) {
    message = '⚠️ آستانه بالینی: نمره اضطراب و افسردگی شما نشان‌دهنده علائم بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
  } else if (anxietyAlert) {
    message = '⚠️ آستانه بالینی: نمره اضطراب شما نشان‌دهنده اضطراب بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
  } else if (depressionAlert) {
    message = '⚠️ آستانه بالینی: نمره افسردگی شما نشان‌دهنده افسردگی بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
  }

  return {
    hasAlert,
    anxietyAlert,
    depressionAlert,
    message,
  };
}

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getHADSConfigJSON(): string {
  return JSON.stringify({
    ...HADS_CONFIG,
    cutoffs: HADS_CUTOFFS,
  });
}

/**
 * محاسبه نمره HADS
 */
export function calculateHADSScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-3) }
): {
  subscales: {
    Anxiety: number;
    Depression: number;
  };
  interpretations: {
    Anxiety: string;
    Depression: string;
  };
  clinicalAlert: HADSClinicalAlert;
  cutoffs: {
    Anxiety: {
      min: number;
      max: number;
      label: string;
      severity: 'mild' | 'moderate' | 'severe' | null;
    } | null;
    Depression: {
      min: number;
      max: number;
      label: string;
      severity: 'mild' | 'moderate' | 'severe' | null;
    } | null;
  };
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const subscaleScores: { [key: string]: number } = {
    Anxiety: 0,
    Depression: 0,
  };
  const reverseSet = new Set(HADS_REVERSE_ITEMS.map(item => item.question));

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    // پیدا کردن زیرمقیاس
    let subscale: 'Anxiety' | 'Depression' | null = null;
    if (HADS_SUBSCALES.Anxiety.includes(questionOrder)) {
      subscale = 'Anxiety';
    } else if (HADS_SUBSCALES.Depression.includes(questionOrder)) {
      subscale = 'Depression';
    }
    
    if (!subscale) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    let score = optionIndex;

    // اگر reverse است، معکوس کن: 3 - score
    if (reverseSet.has(questionOrder)) {
      score = 3 - score;
    }

    // اضافه کردن به نمره زیرمقیاس
    subscaleScores[subscale] += score;
  });

  // تعیین cutoff برای هر زیرمقیاس
  const cutoffs: {
    Anxiety: { min: number; max: number; label: string; severity: 'mild' | 'moderate' | 'severe' | null } | null;
    Depression: { min: number; max: number; label: string; severity: 'mild' | 'moderate' | 'severe' | null } | null;
  } = {
    Anxiety: null,
    Depression: null,
  };

  Object.entries(subscaleScores).forEach(([subscale, score]) => {
    const cutoff = HADS_CUTOFFS[subscale as keyof typeof HADS_CUTOFFS].find(
      c => score >= c.min && score <= c.max
    );
    if (cutoff) {
      cutoffs[subscale as keyof typeof cutoffs] = cutoff;
    }
  });

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {};
  Object.entries(subscaleScores).forEach(([subscale, score]) => {
    const interpretation = HADS_INTERPRETATIONS[subscale as keyof typeof HADS_INTERPRETATIONS];
    if (score <= 7) {
      interpretations[subscale] = interpretation[0];
    } else if (score <= 10) {
      interpretations[subscale] = interpretation[8];
    } else {
      interpretations[subscale] = interpretation[11];
    }
  });

  // بررسی alert برای آستانه بالینی
  const clinicalAlert = checkHADSClinicalAlert(
    subscaleScores.Anxiety,
    subscaleScores.Depression
  );

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  if (subscaleScores.Anxiety >= 11) {
    recommendedTests.push('gad7'); // برای اضطراب تعمیم‌یافته
    recommendedTests.push('bai'); // برای ارزیابی اضطراب بدنی
    recommendedTests.push('isi', 'psqi'); // اگر مشکل خواب ذکر شد
  }
  if (subscaleScores.Depression >= 11) {
    recommendedTests.push('phq9'); // برای شدت افسردگی
    recommendedTests.push('bdi2'); // برای جزئیات شناختی/هیجانی
    recommendedTests.push('panas'); // برای عاطفه مثبت/منفی
  }

  return {
    subscales: subscaleScores as { Anxiety: number; Depression: number },
    interpretations: interpretations as { Anxiety: string; Depression: string },
    clinicalAlert,
    cutoffs,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

