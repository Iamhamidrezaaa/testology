/**
 * Config استاندارد برای تست PSQI (Pittsburgh Sleep Quality Index)
 * منبع: Buysse et al. (1989), University of Pittsburgh
 * 
 * این تست یکی از پیچیده‌ترین و معتبرترین تست‌های کیفیت خواب در دنیا است.
 * 
 * تعداد سوالات: 18 سوال اصلی
 * ساختار: 7 مؤلفه (Component)
 * نمره هر مؤلفه: 0-3
 * نمره کلی: sum(7 components) → range: 0-21
 * هیچ reverse item ندارد
 * 
 * 7 مؤلفه اصلی:
 * 1. Subjective Sleep Quality (کیفیت ادراک‌شده خواب)
 * 2. Sleep Latency (زمان به‌خواب‌رفتن) - از 2 سوال
 * 3. Sleep Duration (مدت خواب)
 * 4. Sleep Efficiency (کارایی خواب) - محاسبه از فرمول
 * 5. Sleep Disturbances (مزاحمت‌های خواب) - از 10 سوال
 * 6. Use of Sleep Medication (مصرف داروهای خواب)
 * 7. Daytime Dysfunction (اختلال عملکرد روزانه) - از 2 سوال
 */

import { ScoringConfig } from '../scoring-engine';

/**
 * لیست همه سوالات (18 سوال)
 */
export const PSQI_QUESTIONS = Array.from({ length: 18 }, (_, i) => i + 1);

/**
 * لیست سوالات Reverse-Scored
 * PSQI هیچ reverse item ندارد
 */
export const PSQI_REVERSE_ITEMS: number[] = [];

/**
 * ساختار 7 مؤلفه PSQI
 */
export const PSQI_COMPONENTS = {
  Component_1_Subjective_Quality: {
    name: 'Subjective Sleep Quality',
    questions: [1], // سوال 1: کیفیت کلی خواب
    scoring: {
      'very_good': 0,
      'fairly_good': 1,
      'fairly_bad': 2,
      'very_bad': 3,
    },
  },
  Component_2_Sleep_Latency: {
    name: 'Sleep Latency',
    questions: [2, 5], // سوال 2: زمان به خواب رفتن (دقیقه), سوال 5: مشکل در به خواب رفتن
    // نمره: round((2a_score + 2b_score) / 2)
    scoring_2a: {
      // سوال 2: چند دقیقه طول می‌کشد بخوابید؟
      '<=15': 0,
      '16-30': 1,
      '31-60': 2,
      '>=60': 3,
    },
    scoring_2b: {
      // سوال 5: مشکل در به‌خواب‌رفتن چند بار؟ (لیکرت 0-3)
      'not_during_past_month': 0,
      'less_than_once_a_week': 1,
      'once_or_twice_a_week': 2,
      'three_or_more_times_a_week': 3,
    },
  },
  Component_3_Sleep_Duration: {
    name: 'Sleep Duration',
    questions: [4], // سوال 4: مدت خواب واقعی (ساعت)
    scoring: {
      '>=7': 0,
      '6-7': 1,
      '5-6': 2,
      '<5': 3,
    },
  },
  Component_4_Sleep_Efficiency: {
    name: 'Sleep Efficiency',
    questions: [3, 4], // سوال 3: زمان رفتن به رختخواب, سوال 4: مدت خواب
    // محاسبه: Efficiency = (Total sleep time / Time in bed) * 100
    scoring: {
      '>=85': 0,
      '75-84': 1,
      '65-74': 2,
      '<65': 3,
    },
  },
  Component_5_Sleep_Disturbances: {
    name: 'Sleep Disturbances',
    questions: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14], // 10 سوال درباره مزاحمت‌ها
    // نمره: round(sum(10 items) / 10)
    scoring: {
      'not_during_past_month': 0,
      'less_than_once_a_week': 1,
      'once_or_twice_a_week': 2,
      'three_or_more_times_a_week': 3,
    },
  },
  Component_6_Sleep_Medication: {
    name: 'Use of Sleep Medication',
    questions: [15], // سوال 15: مصرف داروهای خواب
    scoring: {
      'not_during_past_month': 0,
      'less_than_once_a_week': 1,
      'once_or_twice_a_week': 2,
      'three_or_more_times_a_week': 3,
    },
  },
  Component_7_Daytime_Dysfunction: {
    name: 'Daytime Dysfunction',
    questions: [16, 17], // سوال 16: مشکل در بیداری/هوشیاری, سوال 17: مشکل در انگیزه/انرژی
    // نمره: round((Q1 + Q2) / 2)
    scoring: {
      'not_during_past_month': 0,
      'less_than_once_a_week': 1,
      'once_or_twice_a_week': 2,
      'three_or_more_times_a_week': 3,
    },
  },
};

/**
 * Mapping سوالات به مؤلفه‌ها
 */
export interface PSQIQuestionMapping {
  questionOrder: number;
  component: string;
  isReverse: boolean;
}

/**
 * ساخت mapping کامل برای همه 18 سوال
 */
export function createPSQIQuestionMapping(): PSQIQuestionMapping[] {
  const mapping: PSQIQuestionMapping[] = [];
  
  Object.entries(PSQI_COMPONENTS).forEach(([componentKey, component]) => {
    component.questions.forEach(questionOrder => {
      mapping.push({
        questionOrder,
        component: componentKey,
        isReverse: false, // PSQI هیچ reverse item ندارد
      });
    });
  });

  // مرتب‌سازی بر اساس شماره سوال
  return mapping.sort((a, b) => a.questionOrder - b.questionOrder);
}

/**
 * Config استاندارد PSQI
 */
export const PSQI_CONFIG: ScoringConfig = {
  type: 'custom', // چون نیاز به محاسبه خاص برای هر مؤلفه داریم
  reverseItems: [], // PSQI هیچ reverse item ندارد
  subscales: [
    {
      name: 'Component_1_Subjective_Quality',
      items: PSQI_COMPONENTS.Component_1_Subjective_Quality.questions,
    },
    {
      name: 'Component_2_Sleep_Latency',
      items: PSQI_COMPONENTS.Component_2_Sleep_Latency.questions,
    },
    {
      name: 'Component_3_Sleep_Duration',
      items: PSQI_COMPONENTS.Component_3_Sleep_Duration.questions,
    },
    {
      name: 'Component_4_Sleep_Efficiency',
      items: PSQI_COMPONENTS.Component_4_Sleep_Efficiency.questions,
    },
    {
      name: 'Component_5_Sleep_Disturbances',
      items: PSQI_COMPONENTS.Component_5_Sleep_Disturbances.questions,
    },
    {
      name: 'Component_6_Sleep_Medication',
      items: PSQI_COMPONENTS.Component_6_Sleep_Medication.questions,
    },
    {
      name: 'Component_7_Daytime_Dysfunction',
      items: PSQI_COMPONENTS.Component_7_Daytime_Dysfunction.questions,
    },
  ],
  minScore: 0,
  maxScore: 21,
};

/**
 * Cutoff استاندارد PSQI
 */
export const PSQI_CUTOFFS = {
  PSQI_Global: [
    {
      min: 0,
      max: 5,
      label: 'خواب خوب',
      severity: undefined as const,
      percentile: '0-5',
    },
    {
      min: 6,
      max: 10,
      label: 'مشکل متوسط در خواب',
      severity: 'mild' as const,
      percentile: '6-10',
    },
    {
      min: 11,
      max: 21,
      label: 'کیفیت خواب ضعیف (Clinically Significant Poor Sleep)',
      severity: 'moderate' as const,
      percentile: '11-21',
    },
  ],
};

/**
 * تفسیر برای هر سطح
 */
export const PSQI_INTERPRETATIONS = {
  '0-5': 'خواب خوب. خواب مؤثر، بیدار شدن با انرژی، مشکل خاصی گزارش نشده.',
  '6-10': 'خواب متوسط. چالش‌هایی مثل سخت خوابیدن، بیدار شدن در طول شب، یا خستگی صبحگاهی. بهتر است الگوی خواب روتین بررسی شود.',
  '11-21': 'خواب ضعیف. تأثیر قابل توجه روی خلق، تمرکز و انرژی روزانه. معمولاً همراه اضطراب/افسردگی/استرس. توصیه به بهبود عادات خواب + بررسی مشکلات زمینه‌ای.',
};

/**
 * تبدیل config به JSON string برای ذخیره در دیتابیس
 */
export function getPSQIConfigJSON(): string {
  return JSON.stringify(PSQI_CONFIG);
}

/**
 * محاسبه نمره مؤلفه 2 (Sleep Latency)
 * از 2 سوال: زمان به خواب رفتن (دقیقه) و مشکل در به خواب رفتن
 */
function calculateComponent2(
  latencyMinutes: number, // سوال 2: چند دقیقه طول می‌کشد بخوابید؟
  difficultyFrequency: number // سوال 5: مشکل در به‌خواب‌رفتن چند بار؟ (0-3)
): number {
  // نمره سوال 2a بر اساس دقیقه
  let score2a = 0;
  if (latencyMinutes <= 15) {
    score2a = 0;
  } else if (latencyMinutes >= 16 && latencyMinutes <= 30) {
    score2a = 1;
  } else if (latencyMinutes >= 31 && latencyMinutes <= 60) {
    score2a = 2;
  } else if (latencyMinutes >= 60) {
    score2a = 3;
  }

  // نمره سوال 2b (مشکل در به‌خواب‌رفتن) - مستقیماً از پاسخ (0-3)
  const score2b = difficultyFrequency;

  // نمره مؤلفه 2: round((2a_score + 2b_score) / 2)
  return Math.round((score2a + score2b) / 2);
}

/**
 * محاسبه نمره مؤلفه 4 (Sleep Efficiency)
 * از فرمول: Efficiency = (Total sleep time / Time in bed) * 100
 */
function calculateComponent4(
  timeInBed: number, // زمان رفتن به رختخواب (ساعت)
  totalSleepTime: number // مدت خواب واقعی (ساعت)
): number {
  if (timeInBed === 0) return 3; // اگر زمان در رختخواب 0 باشد، کارایی 0 است

  const efficiency = (totalSleepTime / timeInBed) * 100;

  if (efficiency >= 85) return 0;
  if (efficiency >= 75 && efficiency < 85) return 1;
  if (efficiency >= 65 && efficiency < 75) return 2;
  return 3; // < 65
}

/**
 * محاسبه نمره مؤلفه 5 (Sleep Disturbances)
 * از 10 سوال: round(sum(10 items) / 10)
 */
function calculateComponent5(disturbanceScores: number[]): number {
  if (disturbanceScores.length === 0) return 0;
  const sum = disturbanceScores.reduce((acc, score) => acc + score, 0);
  return Math.round(sum / disturbanceScores.length);
}

/**
 * محاسبه نمره مؤلفه 7 (Daytime Dysfunction)
 * از 2 سوال: round((Q1 + Q2) / 2)
 */
function calculateComponent7(alertnessScore: number, motivationScore: number): number {
  return Math.round((alertnessScore + motivationScore) / 2);
}

/**
 * محاسبه نمره PSQI
 * PSQI از 7 مؤلفه تشکیل شده که هر کدام نمره 0-3 دارند
 * نمره کلی = sum(7 components) → range: 0-21
 */
export function calculatePSQIScore(
  answers: Record<number, number | string> // { questionOrder: answer (می‌تواند عدد یا رشته باشد) }
): {
  components: {
    Component_1_Subjective_Quality: number;
    Component_2_Sleep_Latency: number;
    Component_3_Sleep_Duration: number;
    Component_4_Sleep_Efficiency: number;
    Component_5_Sleep_Disturbances: number;
    Component_6_Sleep_Medication: number;
    Component_7_Daytime_Dysfunction: number;
  };
  totalScore: number;
  interpretation: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
} {
  const components: { [key: string]: number } = {};

  // Component 1: Subjective Sleep Quality (سوال 1)
  const q1 = typeof answers[1] === 'number' ? answers[1] : parseInt(String(answers[1])) || 0;
  components.Component_1_Subjective_Quality = Math.min(Math.max(q1, 0), 3);

  // Component 2: Sleep Latency (سوال 2 و 5)
  const latencyMinutes = typeof answers[2] === 'number' ? answers[2] : parseFloat(String(answers[2])) || 0;
  const difficultyFrequency = typeof answers[5] === 'number' ? answers[5] : parseInt(String(answers[5])) || 0;
  components.Component_2_Sleep_Latency = calculateComponent2(latencyMinutes, Math.min(Math.max(difficultyFrequency, 0), 3));

  // Component 3: Sleep Duration (سوال 4)
  const sleepDuration = typeof answers[4] === 'number' ? answers[4] : parseFloat(String(answers[4])) || 0;
  let component3 = 0;
  if (sleepDuration >= 7) component3 = 0;
  else if (sleepDuration >= 6 && sleepDuration < 7) component3 = 1;
  else if (sleepDuration >= 5 && sleepDuration < 6) component3 = 2;
  else component3 = 3;
  components.Component_3_Sleep_Duration = component3;

  // Component 4: Sleep Efficiency (سوال 3 و 4)
  const timeInBed = typeof answers[3] === 'number' ? answers[3] : parseFloat(String(answers[3])) || 0;
  components.Component_4_Sleep_Efficiency = calculateComponent4(timeInBed, sleepDuration);

  // Component 5: Sleep Disturbances (سوال 5-14)
  const disturbanceScores: number[] = [];
  for (let i = 5; i <= 14; i++) {
    const score = typeof answers[i] === 'number' ? answers[i] : parseInt(String(answers[i])) || 0;
    disturbanceScores.push(Math.min(Math.max(score, 0), 3));
  }
  components.Component_5_Sleep_Disturbances = calculateComponent5(disturbanceScores);

  // Component 6: Use of Sleep Medication (سوال 15)
  const medication = typeof answers[15] === 'number' ? answers[15] : parseInt(String(answers[15])) || 0;
  components.Component_6_Sleep_Medication = Math.min(Math.max(medication, 0), 3);

  // Component 7: Daytime Dysfunction (سوال 16 و 17)
  const alertness = typeof answers[16] === 'number' ? answers[16] : parseInt(String(answers[16])) || 0;
  const motivation = typeof answers[17] === 'number' ? answers[17] : parseInt(String(answers[17])) || 0;
  components.Component_7_Daytime_Dysfunction = calculateComponent7(
    Math.min(Math.max(alertness, 0), 3),
    Math.min(Math.max(motivation, 0), 3)
  );

  // محاسبه نمره کلی
  const totalScore = Object.values(components).reduce((sum, score) => sum + score, 0);

  // تعیین cutoff و تفسیر
  let interpretation = '';
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  
  if (totalScore >= 0 && totalScore <= 5) {
    interpretation = PSQI_INTERPRETATIONS['0-5'];
  } else if (totalScore >= 6 && totalScore <= 10) {
    interpretation = PSQI_INTERPRETATIONS['6-10'];
    severity = 'mild';
  } else if (totalScore >= 11 && totalScore <= 21) {
    interpretation = PSQI_INTERPRETATIONS['11-21'];
    severity = 'moderate';
  }

  // پیشنهاد تست‌های تکمیلی بر اساس نمره
  const recommendedTests: string[] = [];
  
  if (totalScore >= 10) {
    recommendedTests.push('isi'); // بی‌خوابی
    recommendedTests.push('gad7'); // اضطراب
    recommendedTests.push('phq9'); // افسردگی
    recommendedTests.push('pss'); // استرس
    recommendedTests.push('focus'); // تمرکز
  }
  
  // اگر کارایی خواب < 70%
  const efficiency = components.Component_4_Sleep_Efficiency;
  if (efficiency >= 2) { // efficiency score 2 یا 3 یعنی < 75%
    recommendedTests.push('sleep-hygiene'); // بهداشت خواب
    recommendedTests.push('daily-routine'); // روتین روزانه
    recommendedTests.push('gad7'); // اضطراب
    recommendedTests.push('anxiety'); // نگرانی
  }

  return {
    components: components as {
      Component_1_Subjective_Quality: number;
      Component_2_Sleep_Latency: number;
      Component_3_Sleep_Duration: number;
      Component_4_Sleep_Efficiency: number;
      Component_5_Sleep_Disturbances: number;
      Component_6_Sleep_Medication: number;
      Component_7_Daytime_Dysfunction: number;
    },
    totalScore,
    interpretation,
    severity,
    recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
  };
}

