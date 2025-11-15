/**
 * Config استاندارد برای تست SPIN (Social Phobia Inventory)
 * 
 * مقیاس رسمی دانشگاه Duke برای اسکرینینگ و سنجش شدت اضطراب اجتماعی
 * 
 * تعداد سوالات: 17
 * 3 زیرمقیاس (اختیاری - در MVP فقط نمره کل مهم است):
 * - Fear (ترس در موقعیت‌های اجتماعی)
 * - Avoidance (اجتناب از موقعیت‌ها)
 * - Physiological Symptoms (علائم جسمی مثل لرزش، تپش قلب، سرخ شدن)
 * 
 * ⚠️ این تست با بقیه متفاوت است:
 * - فرمت پاسخ: 5 گزینه‌ای (0-4) - از 0 شروع می‌شود نه 1!
 * - هیچ سوال reverse ندارد
 * - نمره کل: مجموع 17 سوال (0-68)
 * - برای هفتهٔ اخیر پر می‌شود
 * 
 * منبع: Connor et al. (2000) - Social Phobia Inventory (SPIN)
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست سوالات هر زیرمقیاس (اختیاری - برای فاز پیشرفته)
 * در MVP فقط نمره کل محاسبه می‌شود
 */
export const SPIN_SUBSCALES = {
  Fear: [1, 2, 3, 4, 5, 6], // 6 سوال
  Avoidance: [7, 8, 9, 10, 11, 12], // 6 سوال
  Physiological: [13, 14, 15, 16, 17], // 5 سوال
};

/**
 * لیست سوالات Reverse-Scored
 * ⚠️ این تست هیچ سوال reverse ندارد
 */
export const SPIN_REVERSE_ITEMS: number[] = [];

/**
 * Mapping سوالات به زیرمقیاس‌ها
 */
export interface SPINQuestionMapping {
  questionOrder: number;
  subscale: 'Fear' | 'Avoidance' | 'Physiological';
  isReverse: boolean; // همیشه false
}

/**
 * ساخت mapping کامل برای همه 17 سوال
 */
export function createSPINQuestionMapping(): SPINQuestionMapping[] {
  const mapping: SPINQuestionMapping[] = [];

  // برای هر زیرمقیاس
  Object.entries(SPIN_SUBSCALES).forEach(([subscale, questions]) => {
    questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        subscale: subscale as 'Fear' | 'Avoidance' | 'Physiological',
        isReverse: false, // هیچ سوال reverse ندارد
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد SPIN
 * ⚠️ این تست از نوع sum است (نه average)
 */
export const SPIN_CONFIG: ScoringConfig = {
  type: 'sum', // مجموع برای نمره کل
  dimensions: ['Fear', 'Avoidance', 'Physiological'],
  reverseItems: [], // هیچ سوال reverse ندارد
  subscales: [
    {
      name: 'Fear',
      items: SPIN_SUBSCALES.Fear,
    },
    {
      name: 'Avoidance',
      items: SPIN_SUBSCALES.Avoidance,
    },
    {
      name: 'Physiological',
      items: SPIN_SUBSCALES.Physiological,
    },
  ],
  weighting: {
    'not_at_all': 0,      // اصلاً
    'a_little_bit': 1,    // کمی
    'somewhat': 2,        // تا حدی
    'very_much': 3,       // خیلی زیاد
    'extremely': 4,       // بشدت / فوق‌العاده
  },
  minScore: 0,
  maxScore: 68, // 17 سوال × 4 نمره = 68
};

/**
 * Cutoff استاندارد SPIN
 * بر اساس مقاله اصلی Connor و فرم‌های بالینی رایج
 */
export const SPIN_CUTOFFS = {
  total: [
    {
      min: 0,
      max: 18,
      label: 'در محدوده نرمال',
      severity: undefined as const,
      percentile: '0-18',
    },
    {
      min: 19,
      max: 20,
      label: 'احتمال اضطراب اجتماعی',
      severity: undefined as const,
      percentile: '19-20',
    },
    {
      min: 21,
      max: 30,
      label: 'خفیف',
      severity: 'mild' as const,
      percentile: '21-30',
    },
    {
      min: 31,
      max: 40,
      label: 'متوسط',
      severity: 'moderate' as const,
      percentile: '31-40',
    },
    {
      min: 41,
      max: 50,
      label: 'شدید',
      severity: 'severe' as const,
      percentile: '41-50',
    },
    {
      min: 51,
      max: 68,
      label: 'بسیار شدید',
      severity: 'severe' as const,
      percentile: '51-68',
    },
  ],
};

/**
 * تفسیر برای هر سطح
 */
export const SPIN_INTERPRETATIONS = {
  normal: 'در این تست، الگوی پاسخ‌های تو نشون می‌ده که در حال حاضر نشانه‌های شدیدی از اضطراب اجتماعی نداری. با این حال اگر خودت احساس ناراحتی یا محدودیت می‌کنی، حتماً تجربه‌ی شخصی‌ات از عدد مهم‌تره.',
  possible: 'ممکنه اضطراب اجتماعی مؤثر روی زندگی‌ات داشته باشی. نیاز به دقت بیشتر.',
  mild: 'بعضی موقعیت‌های اجتماعی احتمالاً برات استرس‌زا هستن و ممکنه روی روابط یا عملکردت تأثیر بذارن. این سطح از اضطراب، هم قابل درکه و هم معمولاً با چند مداخلهٔ ساده (تمرین، کتاب، یا چند جلسه مشاوره) قابل مدیریت شدنه.',
  moderate: 'اضطراب اجتماعی احتمالاً بخش قابل توجهی از زندگی روزمره‌ات رو تحت تأثیر قرار داده. ممکنه از موقعیت‌ها اجتناب کنی یا خیلی درگیر قضاوت دیگران باشی. اینجا معمولاً صحبت با متخصص می‌تونه خیلی کمک‌کننده باشه.',
  severe: 'به‌نظر می‌رسه اضطراب اجتماعی برایت جدی و فرساینده شده و احتمالاً روی شغل، تحصیل، یا روابط اثر گذاشته. این سطح از نمره معمولاً ارزش این رو داره که جدی‌تر به گزینه‌هایی مثل روان‌درمانی (به‌خصوص CBT) فکر کنی.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getSPINConfigJSON(): string {
  return JSON.stringify(SPIN_CONFIG);
}

/**
 * محاسبه نمره SPIN
 * SPIN از مجموع استفاده می‌کند
 * نمره کل: مجموع 17 سوال (0-68)
 * ⚠️ این تست از 0 شروع می‌شود نه 1!
 * 
 * @param answers - { questionOrder: selectedOptionIndex }
 *                  در این تست، selectedOptionIndex مستقیماً نمره است (0-4)
 */
export function calculateSPINScore(
  answers: Record<number, number> // { questionOrder: selectedOptionIndex (0-4 که مستقیماً نمره است) }
): {
  totalScore: number;
  interpretation: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  level: string;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  // محاسبه نمره کل (مجموع 17 سوال)
  let totalScore = 0;
  
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    
    if (questionOrder < 1 || questionOrder > 17) return;

    // در SPIN، optionIndex مستقیماً نمره است (0-4)
    // چون از 0 شروع می‌شود نه 1
    const score = optionIndex >= 0 && optionIndex <= 4 ? optionIndex : 0;
    totalScore += score;
  });

  // تعیین سطح بر اساس نمره کل
  let level: string;
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  let interpretation: string;

  if (totalScore <= 18) {
    level = 'در محدوده نرمال';
    interpretation = SPIN_INTERPRETATIONS.normal;
  } else if (totalScore <= 20) {
    level = 'احتمال اضطراب اجتماعی';
    interpretation = SPIN_INTERPRETATIONS.possible;
  } else if (totalScore <= 30) {
    level = 'خفیف';
    severity = 'mild';
    interpretation = SPIN_INTERPRETATIONS.mild;
  } else if (totalScore <= 40) {
    level = 'متوسط';
    severity = 'moderate';
    interpretation = SPIN_INTERPRETATIONS.moderate;
  } else {
    level = totalScore <= 50 ? 'شدید' : 'بسیار شدید';
    severity = 'severe';
    interpretation = SPIN_INTERPRETATIONS.severe;
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScore >= 19) {
    // SPIN بالا
    recommendedTests.push('gad7'); // GAD-7 (احتمال همراهی اضطراب عمومی)
    recommendedTests.push('phq9'); // PHQ-9 (احتمال همراهی افسردگی)
    recommendedTests.push('ucla-loneliness'); // UCLA Loneliness (تنهایی اجتماعی)
    recommendedTests.push('communication-skills'); // Communication Skills (مهارت‌های ارتباطی)
    recommendedTests.push('teamwork'); // Teamwork
    recommendedTests.push('rosenberg'); // Self-Esteem (Rosenberg)
    recommendedTests.push('attachment'); // Attachment
  }

  return {
    totalScore,
    interpretation,
    severity,
    level,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

