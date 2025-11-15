/**
 * Testology Scoring + Interpretation + Recommendation Engine v1.0
 * 
 * این موتور مرکزی 3 کار اصلی انجام می‌دهد:
 * 1) اسکور دقیق (اعمال Reverse، محاسبه زیرمقیاس‌ها، Cutoff)
 * 2) تحلیل انسانی + توصیفی (بر اساس تست، زیرمقیاس‌ها، ترکیب نتایج)
 * 3) پیشنهاد تست‌های تکمیلی (بر اساس نقاط ضعف، تست‌های مرتبط، منطق ارزیابی مشترک)
 */

import { calculateTestScore } from './scoring-engine';
import type { TestResult } from './scoring-engine';

/**
 * Rule برای تفسیرهای ترکیبی
 */
export interface InterpretationRule {
  rule: string;
  conditions: {
    [key: string]: string; // "subscale_name": "<2.5" or ">3.5" or "==4.0"
  };
  message: string;
  suggestions: string[];
  priority?: number; // اولویت (بالاتر = مهم‌تر)
}

/**
 * Rule برای پیشنهاد تست‌های تکمیلی
 */
export interface RecommendationRule {
  trigger: string;
  conditions?: {
    [key: string]: string;
  };
  tests: string[];
  priority?: number;
}

/**
 * خروجی نهایی Engine
 */
export interface TestologyEngineResult {
  testId: string;
  testSlug: string;
  scores: {
    [subscale: string]: number;
    total: number;
  };
  level: string;
  severity: 'mild' | 'moderate' | 'severe' | null;
  interpretation: string;
  subscaleInterpretations?: {
    [subscale: string]: string;
  };
  recommendedTests: string[];
  metadata?: {
    cutoff?: any;
    ruleMatches?: string[];
    [key: string]: any;
  };
}

/**
 * RuleSet برای تفسیرهای ترکیبی
 */
const INTERPRETATION_RULES: InterpretationRule[] = [
  {
    rule: 'low_energy_and_low_focus',
    conditions: {
      'Energy_Mood_Regulation': '<2.5',
      'Focus_Attention': '<2.5',
    },
    message: 'سطح انرژی و تمرکز شما پایین است. این می‌تواند نشان‌دهنده خستگی مزمن، عدم تعادل خواب یا استرس باشد.',
    suggestions: ['psqi', 'lifestyle-sleep-quality', 'pss10', 'lifestyle-harmony'],
    priority: 10,
  },
  {
    rule: 'high_anxiety_low_sleep',
    conditions: {
      'Anxiety': '>10',
      'Sleep_Quality': '<2.5',
    },
    message: 'اضطراب بالا همراه با کیفیت خواب پایین می‌تواند یک چرخه منفی ایجاد کند. بهبود خواب می‌تواند به کاهش اضطراب کمک کند.',
    suggestions: ['psqi', 'lifestyle-sleep-quality', 'gad7', 'maas'],
    priority: 9,
  },
  {
    rule: 'low_openness_high_conservation',
    conditions: {
      'Openness_to_Change': '<2.5',
      'Conservation': '>3.5',
    },
    message: 'شما به ثبات و ساختار نیاز دارید اما در برابر تغییر مقاوم هستید. این می‌تواند منجر به محدودیت در رشد و انعطاف‌پذیری شود.',
    suggestions: ['growth-mindset', 'curiosity', 'adaptability'],
    priority: 8,
  },
  {
    rule: 'high_creativity_low_implementation',
    conditions: {
      'Idea_Generation': '>3.5',
      'Innovation_Implementation': '<2.5',
    },
    message: 'شما ایده‌های زیادی دارید اما در اجرای آن‌ها مشکل دارید. این می‌تواند منجر به ناامیدی و کاهش انگیزه شود.',
    suggestions: ['time-management', 'focus-attention', 'growth-mindset'],
    priority: 8,
  },
  {
    rule: 'low_social_high_loneliness',
    conditions: {
      'Social_Community_Interests': '<2.5',
      'Loneliness': '>3.5',
    },
    message: 'شما از فعالیت‌های اجتماعی دوری می‌کنید و احساس تنهایی می‌کنید. این می‌تواند منجر به انزوا و کاهش سلامت روان شود.',
    suggestions: ['ucla', 'spin', 'attachment', 'social-anxiety'],
    priority: 9,
  },
  {
    rule: 'high_stress_low_recovery',
    conditions: {
      'Stress': '>26',
      'Recovery_Rest': '<2.5',
    },
    message: 'استرس بالا همراه با ریکاوری پایین می‌تواند منجر به فرسودگی شود. بهبود ریکاوری و مدیریت استرس ضروری است.',
    suggestions: ['pss10', 'work-life-balance', 'maas', 'lifestyle-harmony'],
    priority: 10,
  },
  {
    rule: 'low_future_orientation_high_impulsivity',
    conditions: {
      'Future_Orientation': '<2.5',
      'Impulsivity_Delay_Discounting': '>3.5',
    },
    message: 'شما در برنامه‌ریزی آینده مشکل دارید و تمایل به تصمیم‌گیری تکانشی دارید. این می‌تواند منجر به مشکلات بلندمدت شود.',
    suggestions: ['time-preference', 'time-management', 'focus-attention', 'growth-mindset'],
    priority: 8,
  },
  {
    rule: 'high_work_interference_low_boundaries',
    conditions: {
      'Work_to_Life_Interference': '<2.5',
      'Boundaries_Control': '<2.5',
    },
    message: 'کار شما به زندگی شخصی آسیب می‌زند و شما نمی‌توانید مرزبندی سالم ایجاد کنید. این می‌تواند منجر به فرسودگی شود.',
    suggestions: ['work-life-balance', 'time-management', 'pss10', 'maas'],
    priority: 9,
  },
];

/**
 * RuleSet برای پیشنهاد تست‌های تکمیلی
 */
const RECOMMENDATION_RULES: RecommendationRule[] = [
  {
    trigger: 'low_openness',
    conditions: {
      'Openness_to_Change': '<2.5',
    },
    tests: ['growth-mindset', 'curiosity', 'innovation', 'adaptability'],
    priority: 8,
  },
  {
    trigger: 'high_anxiety',
    conditions: {
      'Anxiety': '>10',
    },
    tests: ['gad7', 'psqi', 'lifestyle-sleep-quality', 'maas', 'lifestyle-harmony'],
    priority: 10,
  },
  {
    trigger: 'low_creativity',
    conditions: {
      'Creativity': '<2.5',
    },
    tests: ['curiosity', 'innovation', 'growth-mindset', 'learning-style'],
    priority: 7,
  },
  {
    trigger: 'low_sleep_quality',
    conditions: {
      'Sleep_Quality': '<2.5',
    },
    tests: ['psqi', 'lifestyle-sleep-quality', 'pss10', 'lifestyle-harmony'],
    priority: 9,
  },
  {
    trigger: 'high_stress',
    conditions: {
      'Stress': '>26',
    },
    tests: ['pss10', 'work-life-balance', 'maas', 'lifestyle-harmony', 'adaptability'],
    priority: 10,
  },
  {
    trigger: 'low_energy',
    conditions: {
      'Energy_Mood_Regulation': '<2.5',
    },
    tests: ['psqi', 'lifestyle-sleep-quality', 'pss10', 'phq9', 'lifestyle-harmony'],
    priority: 9,
  },
  {
    trigger: 'low_social',
    conditions: {
      'Social_Community_Interests': '<2.5',
    },
    tests: ['ucla', 'spin', 'attachment', 'social-anxiety'],
    priority: 8,
  },
  {
    trigger: 'low_time_management',
    conditions: {
      'Routine_Productivity': '<2.5',
    },
    tests: ['time-management', 'focus-attention', 'time-preference'],
    priority: 8,
  },
  {
    trigger: 'low_work_life_balance',
    conditions: {
      'Work_to_Life_Interference': '<2.5',
      'Life_to_Work_Interference': '<2.5',
    },
    tests: ['work-life-balance', 'pss10', 'maas', 'lifestyle-harmony'],
    priority: 9,
  },
  {
    trigger: 'low_growth_mindset',
    conditions: {
      'Growth_Mindset': '<2.5',
    },
    tests: ['growth-mindset', 'curiosity', 'learning-style', 'time-preference'],
    priority: 8,
  },
];

/**
 * بررسی شرایط یک Rule
 */
function checkRuleConditions(
  conditions: { [key: string]: string },
  scores: { [key: string]: number }
): boolean {
  for (const [key, condition] of Object.entries(conditions)) {
    const score = scores[key];
    if (score === undefined) return false;

    // Parse condition (e.g., "<2.5", ">3.5", "==4.0")
    if (condition.startsWith('<')) {
      const threshold = parseFloat(condition.substring(1));
      if (score >= threshold) return false;
    } else if (condition.startsWith('>')) {
      const threshold = parseFloat(condition.substring(1));
      if (score <= threshold) return false;
    } else if (condition.startsWith('==')) {
      const threshold = parseFloat(condition.substring(2));
      if (Math.abs(score - threshold) > 0.1) return false;
    } else if (condition.startsWith('>=')) {
      const threshold = parseFloat(condition.substring(2));
      if (score < threshold) return false;
    } else if (condition.startsWith('<=')) {
      const threshold = parseFloat(condition.substring(2));
      if (score > threshold) return false;
    }
  }
  return true;
}

/**
 * پیدا کردن Rules تطبیق‌یافته
 */
function findMatchingRules(
  rules: InterpretationRule[],
  scores: { [key: string]: number }
): InterpretationRule[] {
  return rules
    .filter(rule => checkRuleConditions(rule.conditions, scores))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * پیدا کردن Recommendation Rules تطبیق‌یافته
 */
function findMatchingRecommendations(
  rules: RecommendationRule[],
  scores: { [key: string]: number }
): RecommendationRule[] {
  return rules
    .filter(rule => {
      if (!rule.conditions) return true;
      return checkRuleConditions(rule.conditions, scores);
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * موتور مرکزی Testology
 * 
 * این تابع تمام مراحل را انجام می‌دهد:
 * 1. محاسبه نمره (از scoring-engine)
 * 2. تفسیر هوشمند (از rules)
 * 3. پیشنهاد تست‌های تکمیلی (از recommendation rules)
 */
export async function runTestologyEngine(
  testSlug: string,
  answers: Record<number, number>,
  config: any, // ScoringConfig
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>,
  allTestResults?: { [testSlug: string]: TestResult } // نتایج تست‌های قبلی برای تحلیل ترکیبی
): Promise<TestologyEngineResult> {
  // مرحله 1: محاسبه نمره از scoring-engine
  const testResult = calculateTestScore(
    testSlug,
    config,
    answers,
    questions
  );

  // ساخت scores object
  const scores: { [key: string]: number } = {
    total: testResult.totalScore,
    ...(testResult.subscales || {}),
  };

  // مرحله 2: تفسیر هوشمند
  // ترکیب تفسیر از scoring-engine با rules
  let interpretation = testResult.interpretation || '';
  
  // اگر نتایج تست‌های قبلی داریم، از آن‌ها برای تحلیل ترکیبی استفاده می‌کنیم
  if (allTestResults) {
    const combinedScores: { [key: string]: number } = { ...scores };
    
    // اضافه کردن نمرات تست‌های قبلی
    Object.entries(allTestResults).forEach(([slug, result]) => {
      if (result.subscales) {
        Object.entries(result.subscales).forEach(([subscale, score]) => {
          combinedScores[`${slug}_${subscale}`] = score;
        });
      }
      combinedScores[`${slug}_total`] = result.totalScore;
    });

    // پیدا کردن matching rules
    const matchingRules = findMatchingRules(INTERPRETATION_RULES, combinedScores);
    
    if (matchingRules.length > 0) {
      interpretation += '\n\n🔍 تحلیل ترکیبی:\n';
      matchingRules.slice(0, 3).forEach((rule, index) => {
        interpretation += `${index + 1}. ${rule.message}\n`;
      });
    }
  }

  // مرحله 3: پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  // از metadata تست (اگر وجود داشته باشد)
  if (testResult.metadata?.recommendedTests) {
    recommendedTests.push(...testResult.metadata.recommendedTests);
  }

  // از recommendation rules
  const combinedScoresForRecommendation: { [key: string]: number } = { ...scores };
  if (allTestResults) {
    Object.entries(allTestResults).forEach(([slug, result]) => {
      if (result.subscales) {
        Object.entries(result.subscales).forEach(([subscale, score]) => {
          combinedScoresForRecommendation[`${slug}_${subscale}`] = score;
        });
      }
      combinedScoresForRecommendation[`${slug}_total`] = result.totalScore;
    });
  }

  const matchingRecommendations = findMatchingRecommendations(
    RECOMMENDATION_RULES,
    combinedScoresForRecommendation
  );

  matchingRecommendations.forEach(rule => {
    rule.tests.forEach(test => {
      if (!recommendedTests.includes(test)) {
        recommendedTests.push(test);
      }
    });
  });

  // محدود کردن به 5-7 تست پیشنهادی
  const finalRecommendedTests = recommendedTests.slice(0, 7);

  // تعیین level و severity
  const level = testResult.metadata?.cutoff?.label || 'Unknown';
  const severity = testResult.severity || testResult.metadata?.cutoff?.severity || null;

  return {
    testId: testSlug,
    testSlug,
    scores,
    level,
    severity,
    interpretation,
    subscaleInterpretations: testResult.metadata?.subscaleInterpretations,
    recommendedTests: finalRecommendedTests,
    metadata: {
      cutoff: testResult.metadata?.cutoff,
      ruleMatches: matchingRules.map(r => r.rule),
      ...testResult.metadata,
    },
  };
}

/**
 * تابع کمکی برای اجرای Engine با config مستقیم
 */
export function runTestologyEngineWithConfig(
  testSlug: string,
  answers: Record<number, number>,
  config: any,
  allTestResults?: { [testSlug: string]: TestResult }
): TestologyEngineResult {
  // محاسبه نمره
  const testResult = calculateTestScore(testSlug, answers, config);

  // ساخت scores object
  const scores: { [key: string]: number } = {
    total: testResult.totalScore,
    ...(testResult.subscales || {}),
  };

  // تفسیر
  let interpretation = testResult.interpretation || '';

  // تحلیل ترکیبی
  if (allTestResults) {
    const combinedScores: { [key: string]: number } = { ...scores };
    
    Object.entries(allTestResults).forEach(([slug, result]) => {
      if (result.subscales) {
        Object.entries(result.subscales).forEach(([subscale, score]) => {
          combinedScores[`${slug}_${subscale}`] = score;
        });
      }
      combinedScores[`${slug}_total`] = result.totalScore;
    });

    const matchingRules = findMatchingRules(INTERPRETATION_RULES, combinedScores);
    
    if (matchingRules.length > 0) {
      interpretation += '\n\n🔍 تحلیل ترکیبی:\n';
      matchingRules.slice(0, 3).forEach((rule, index) => {
        interpretation += `${index + 1}. ${rule.message}\n`;
      });
    }
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (testResult.metadata?.recommendedTests) {
    recommendedTests.push(...testResult.metadata.recommendedTests);
  }

  const combinedScoresForRecommendation: { [key: string]: number } = { ...scores };
  if (allTestResults) {
    Object.entries(allTestResults).forEach(([slug, result]) => {
      if (result.subscales) {
        Object.entries(result.subscales).forEach(([subscale, score]) => {
          combinedScoresForRecommendation[`${slug}_${subscale}`] = score;
        });
      }
      combinedScoresForRecommendation[`${slug}_total`] = result.totalScore;
    });
  }

  const matchingRecommendations = findMatchingRecommendations(
    RECOMMENDATION_RULES,
    combinedScoresForRecommendation
  );

  matchingRecommendations.forEach(rule => {
    rule.tests.forEach(test => {
      if (!recommendedTests.includes(test)) {
        recommendedTests.push(test);
      }
    });
  });

  const finalRecommendedTests = recommendedTests.slice(0, 7);

  const level = testResult.metadata?.cutoff?.label || 'Unknown';
  const severity = testResult.severity || testResult.metadata?.cutoff?.severity || null;

  return {
    testId: testSlug,
    testSlug,
    scores,
    level,
    severity,
    interpretation,
    subscaleInterpretations: testResult.metadata?.subscaleInterpretations,
    recommendedTests: finalRecommendedTests,
    metadata: {
      cutoff: testResult.metadata?.cutoff,
      ruleMatches: findMatchingRules(INTERPRETATION_RULES, combinedScoresForRecommendation).map(r => r.rule),
      ...testResult.metadata,
    },
  };
}

/**
 * Export Rules برای استفاده در جاهای دیگر
 */
export { INTERPRETATION_RULES, RECOMMENDATION_RULES };

