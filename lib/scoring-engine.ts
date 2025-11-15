/**
 * Scoring Engine برای محاسبه نمره تست‌ها بر اساس کلید نمره‌دهی استاندارد
 * پشتیبانی از: Reverse-scored items, Subscales, Cutoffs
 */

export interface ScoringConfig {
  type: 'mbti' | 'likert' | 'sum' | 'average' | 'custom';
  dimensions?: string[]; // برای تست‌های چندبعدی مثل MBTI: ["E/I", "S/N", "T/F", "J/P"]
  reverseItems?: number[]; // شماره سوالات reverse-scored (1-indexed)
  subscales?: {
    name: string;
    items: number[]; // شماره سوالات این زیرمقیاس
  }[];
  cutoffs?: {
    [key: string]: {
      min: number;
      max: number;
      label: string;
      severity?: 'mild' | 'moderate' | 'severe';
      percentile?: string; // مثل "0-10%", "10-30%", etc.
    }[];
  };
  weighting?: {
    [key: string]: number; // وزن هر گزینه: "strongly_disagree": -2, "agree": +1, etc.
  };
  minScore?: number;
  maxScore?: number;
}

export interface TestResult {
  totalScore?: number;
  dimensions?: {
    [key: string]: number; // برای MBTI: { "E/I": 5, "S/N": -3, ... }
  };
  subscales?: {
    [key: string]: number;
  };
  interpretation?: string;
  severity?: 'mild' | 'moderate' | 'severe' | null;
  type?: string; // برای MBTI: "ENFP", "ISTJ", etc.
  metadata?: {
    style?: string; // برای Attachment: "Secure", "Anxious", "Avoidant", "Fearful"
    recommendedTests?: string[]; // تست‌های تکمیلی پیشنهادی
    [key: string]: any;
  };
}

/**
 * محاسبه نمره تست بر اساس config و پاسخ‌های کاربر
 */
export function calculateTestScore(
  testSlug: string,
  config: ScoringConfig,
  answers: Record<number, number>, // { questionOrder: selectedOptionIndex }
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // بررسی تست‌های خاص
  if (testSlug === 'neo-ffi' || testSlug === 'neo-ffi-60') {
    return calculateNEOFFIScore(config, answers, questions);
  }
  
  if (testSlug === 'bfi' || testSlug === 'big-five-inventory') {
    return calculateBFIScore(config, answers, questions);
  }
  
  if (testSlug === 'creativity' || testSlug === 'creative-thinking') {
    return calculateCreativityScore(config, answers, questions);
  }
  
  if (testSlug === 'phq9' || testSlug === 'phq-9') {
    return calculatePHQ9Score(config, answers, questions);
  }
  
  if (testSlug === 'gad7' || testSlug === 'gad-7') {
    return calculateGAD7Score(config, answers, questions);
  }
  
  if (testSlug === 'bai' || testSlug === 'beck-anxiety-inventory') {
    return calculateBAIScore(config, answers, questions);
  }
  
  if (testSlug === 'bdi2' || testSlug === 'bdi-ii' || testSlug === 'beck-depression-inventory') {
    return calculateBDI2Score(config, answers, questions);
  }
  
  if (testSlug === 'hads' || testSlug === 'hospital-anxiety-depression-scale') {
    return calculateHADSScore(config, answers, questions);
  }
  
  if (testSlug === 'stai' || testSlug === 'state-trait-anxiety-inventory') {
    return calculateSTAIScore(config, answers, questions);
  }
  
  if (testSlug === 'eq' || testSlug === 'emotional-intelligence' || testSlug === 'eq-i') {
    return calculateEQScore(config, answers, questions);
  }
  
  if (testSlug === 'rosenberg' || testSlug === 'rses' || testSlug === 'self-esteem') {
    return calculateRosenbergScore(config, answers, questions);
  }
  
  if (testSlug === 'swls' || testSlug === 'satisfaction-with-life-scale') {
    return calculateSWLSScore(config, answers, questions);
  }
  
  if (testSlug === 'panas' || testSlug === 'positive-negative-affect-schedule') {
    return calculatePANASScore(config, answers, questions);
  }
  
  if (testSlug === 'attachment' || testSlug === 'ecr-r' || testSlug === 'attachment-style') {
    return calculateAttachmentScore(config, answers, questions);
  }
  
  if (testSlug === 'ucla' || testSlug === 'ucla-loneliness' || testSlug === 'loneliness') {
    return calculateUCLALonelinessScore(config, answers, questions);
  }
  
  if (testSlug === 'focus' || testSlug === 'focus-attention' || testSlug === 'attention') {
    return calculateFocusAttentionScore(config, answers, questions);
  }
  
  if (testSlug === 'isi' || testSlug === 'insomnia-severity-index' || testSlug === 'insomnia') {
    return calculateISIScore(config, answers, questions);
  }
  
  if (testSlug === 'psqi' || testSlug === 'pittsburgh-sleep-quality-index' || testSlug === 'sleep-quality') {
    return calculatePSQIScore(config, answers, questions);
  }
  
  if (testSlug === 'maas' || testSlug === 'mindful-attention-awareness-scale' || testSlug === 'mindfulness') {
    return calculateMAASScore(config, answers, questions);
  }
  
  if (testSlug === 'time-preference' || testSlug === 'future-orientation' || testSlug === 'time-perspective') {
    return calculateTimePreferenceScore(config, answers, questions);
  }
  
  if (testSlug === 'riasec' || testSlug === 'holland' || testSlug === 'career-interest' || testSlug === 'holland-codes') {
    return calculateRIASECScore(config, answers, questions);
  }
  
  if (testSlug === 'leadership' || testSlug === 'leadership-style' || testSlug === 'leadership-assessment') {
    return calculateLeadershipScore(config, answers, questions);
  }
  
  if (testSlug === 'communication' || testSlug === 'communication-skills' || testSlug === 'interpersonal-communication') {
    return calculateCommunicationSkillsScore(config, answers, questions);
  }
  
  if (testSlug === 'teamwork' || testSlug === 'collaboration' || testSlug === 'teamwork-skills') {
    return calculateTeamworkScore(config, answers, questions);
  }
  
  if (testSlug === 'problem-solving' || testSlug === 'problem-solving-skills' || testSlug === 'problem-solving-inventory') {
    return calculateProblemSolvingScore(config, answers, questions);
  }
  
  if (testSlug === 'decision-making' || testSlug === 'decision-making-skills' || testSlug === 'decision-making-competence') {
    return calculateDecisionMakingScore(config, answers, questions);
  }
  
  if (testSlug === 'time-management' || testSlug === 'time-management-skills' || testSlug === 'time-management-behavior') {
    return calculateTimeManagementScore(config, answers, questions);
  }
  
  if (testSlug === 'work-life-balance' || testSlug === 'work-life-balance-skills' || testSlug === 'worklife-balance') {
    return calculateWorkLifeBalanceScore(config, answers, questions);
  }
  
  if (testSlug === 'cognitive-iq' || testSlug === 'iq' || testSlug === 'cognitive-intelligence' || testSlug === 'intelligence') {
    return calculateCognitiveIQScore(config, answers, questions);
  }
  
  if (testSlug === 'memory' || testSlug === 'memory-test' || testSlug === 'memory-assessment') {
    return calculateMemoryScore(config, answers, questions);
  }
  
  if (testSlug === 'spin' || testSlug === 'social-phobia-inventory' || testSlug === 'social-anxiety') {
    return calculateSPINScore(config, answers, questions);
  }
  
  if (testSlug === 'psss' || testSlug === 'perceived-social-support' || testSlug === 'mspss' || testSlug === 'social-support') {
    return calculatePSSSScore(config, answers, questions);
  }
  
  if (testSlug === 'general-health' || testSlug === 'health-assessment' || testSlug === 'physical-health') {
    return calculateGeneralHealthScore(config, answers, questions);
  }
  
  if (testSlug === 'eating-habits' || testSlug === 'eating-habits-assessment' || testSlug === 'food-habits') {
    return calculateEatingHabitsScore(config, answers, questions);
  }
  
  if (testSlug === 'physical-activity' || testSlug === 'physical-activity-assessment' || testSlug === 'exercise-habits') {
    return calculatePhysicalActivityScore(config, answers, questions);
  }
  
  if (testSlug === 'lifestyle-sleep-quality' || testSlug === 'lifestyle-sleep' || testSlug === 'sleep-quality-lifestyle') {
    return calculateLifestyleSleepQualityScore(config, answers, questions);
  }
  
  if (testSlug === 'pss10' || testSlug === 'pss-10' || testSlug === 'perceived-stress-scale' || testSlug === 'perceived-stress') {
    return calculatePSS10Score(config, answers, questions);
  }
  
  if (testSlug === 'learning-style' || testSlug === 'learning-style-assessment' || testSlug === 'study-profile' || testSlug === 'study-style') {
    return calculateLearningStyleScore(config, answers, questions);
  }
  
  if (testSlug === 'growth-mindset' || testSlug === 'growth-mindset-assessment' || testSlug === 'mindset' || testSlug === 'dweck-mindset') {
    return calculateGrowthMindsetScore(config, answers, questions);
  }
  
  if (testSlug === 'curiosity' || testSlug === 'curiosity-assessment' || testSlug === 'curiosity-openness' || testSlug === 'openness-curiosity') {
    return calculateCuriosityScore(config, answers, questions);
  }
  
  if (testSlug === 'adaptability' || testSlug === 'adaptability-assessment' || testSlug === 'flexibility' || testSlug === 'cognitive-flexibility') {
    return calculateAdaptabilityScore(config, answers, questions);
  }
  
  if (testSlug === 'innovation' || testSlug === 'innovation-assessment' || testSlug === 'creative-action' || testSlug === 'innovative-behavior') {
    return calculateInnovationScore(config, answers, questions);
  }
  
  if (testSlug === 'work-life-balance' || testSlug === 'worklife-balance' || testSlug === 'work-life-balance-assessment' || testSlug === 'wlb') {
    return calculateWorkLifeBalanceScore(config, answers, questions);
  }
  
  if (testSlug === 'hobbies-interests' || testSlug === 'hobbies' || testSlug === 'interests' || testSlug === 'hobbies-interests-profile') {
    return calculateHobbiesInterestsScore(config, answers, questions);
  }
  
  if (testSlug === 'personal-values' || testSlug === 'values' || testSlug === 'personal-values-assessment' || testSlug === 'schwartz-values') {
    return calculatePersonalValuesScore(config, answers, questions);
  }
  
  if (testSlug === 'ideal-environment' || testSlug === 'environment' || testSlug === 'ideal-environment-profile' || testSlug === 'environment-preferences') {
    return calculateIdealEnvironmentScore(config, answers, questions);
  }
  
  if (testSlug === 'lifestyle-harmony' || testSlug === 'lifestyle' || testSlug === 'lifestyle-harmony-assessment' || testSlug === 'lifestyle-profile') {
    return calculateLifestyleHarmonyScore(config, answers, questions);
  }
  
  switch (config.type) {
    case 'mbti':
      return calculateMBTIScore(config, answers, questions);
    case 'likert':
      return calculateLikertScore(config, answers, questions);
    case 'sum':
      return calculateSumScore(config, answers, questions);
    case 'average':
      return calculateAverageScore(config, answers, questions);
    default:
      return calculateCustomScore(config, answers, questions);
  }
}

/**
 * محاسبه نمره MBTI
 * MBTI از 4 بعد تشکیل شده: E/I, S/N, T/F, J/P
 */
function calculateMBTIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const dimensions: { [key: string]: number } = {};
  
  // مقداردهی اولیه ابعاد
  if (config.dimensions) {
    config.dimensions.forEach(dim => {
      dimensions[dim] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || !question.dimension) return;

    const dimension = question.dimension; // مثل "E/I"
    const [positivePole, negativePole] = dimension.split('/');
    
    // تبدیل optionIndex به نمره (فرض: 5 گزینه‌ای)
    // 0: کاملاً مخالفم (-2), 1: مخالفم (-1), 2: خنثی (0), 3: موافقم (+1), 4: کاملاً موافقم (+2)
    let score = optionIndex - 2; // تبدیل 0-4 به -2 تا +2
    
    // اگر سوال reverse است، علامت را معکوس کن
    if (question.isReverse) {
      score = -score;
    }

    // اضافه کردن به قطب مثبت یا منفی
    if (score > 0) {
      dimensions[dimension] = (dimensions[dimension] || 0) + score;
    } else if (score < 0) {
      dimensions[dimension] = (dimensions[dimension] || 0) + score; // منفی = قطب مخالف
    }
  });

  // تعیین type بر اساس ابعاد
  let type = '';
  if (config.dimensions) {
    config.dimensions.forEach(dim => {
      const [positivePole, negativePole] = dim.split('/');
      const score = dimensions[dim] || 0;
      // اگر نمره مثبت یا صفر باشد، قطب اول را انتخاب کن
      type += score >= 0 ? positivePole : negativePole;
    });
  }

  return {
    dimensions,
    type,
    interpretation: `نوع شخصیتی شما: ${type}`,
  };
}

/**
 * محاسبه نمره Likert (جمع ساده)
 */
function calculateLikertScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;
  const reverseItems = config.reverseItems || [];

  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    let score = optionIndex; // فرض: گزینه‌ها از 0 شروع می‌شوند
    
    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: اگر 5 گزینه‌ای باشد، 4 - optionIndex
      score = 4 - optionIndex; // برای 5 گزینه‌ای (0-4)
    }

    totalScore += score;
  });

  // تعیین severity بر اساس cutoffs
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      severity = cutoff.severity || null;
    }
  }

  return {
    totalScore,
    severity,
  };
}

/**
 * محاسبه نمره جمعی (Sum)
 */
function calculateSumScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  return calculateLikertScore(config, answers, questions);
}

/**
 * محاسبه نمره میانگین (Average)
 */
function calculateAverageScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const sumResult = calculateLikertScore(config, answers, questions);
  const questionCount = Object.keys(answers).length;
  
  return {
    totalScore: questionCount > 0 ? Math.round((sumResult.totalScore || 0) / questionCount) : 0,
    severity: sumResult.severity,
  };
}

/**
 * محاسبه نمره NEO-FFI
 * این تست 5 عامل دارد و هر عامل 12 سوال
 * 15 سوال reverse-scored هستند
 */
function calculateNEOFFIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  const reverseItems = config.reverseItems || [];
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-4) به نمره (0-4)
    // 0: کاملاً مخالفم → 0
    // 1: مخالفم → 1
    // 2: نه مخالف نه موافق → 2
    // 3: موافقم → 3
    // 4: کاملاً موافقم → 4
    let score = optionIndex;

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 4 - score
      score = 4 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscales[question.dimension] += score;
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscales[subscale.name] = (subscales[subscale.name] || 0) + score;
      }
    }
  });

  // تعیین severity برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([factor, score]) => {
      const factorCutoffs = config.cutoffs![factor];
      if (factorCutoffs) {
        const cutoff = factorCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[factor] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  return {
    subscales,
    interpretation: JSON.stringify(interpretations),
  };
}

/**
 * محاسبه نمره BFI
 * BFI از میانگین استفاده می‌کند نه جمع
 * هر عامل: mean(all_items_after_reverse)
 * Range: 0-4
 */
function calculateBFIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  const subscalesRaw: { [key: string]: number } = {}; // جمع خام
  const subscalesCount: { [key: string]: number } = {}; // تعداد سوالات
  const reverseItems = config.reverseItems || [];
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
      subscalesRaw[subscale.name] = 0;
      subscalesCount[subscale.name] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-4) به نمره (0-4)
    // 0: کاملاً مخالفم → 0
    // 1: مخالفم → 1
    // 2: خنثی → 2
    // 3: موافقم → 3
    // 4: کاملاً موافقم → 4
    let score = optionIndex;

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 4 - score
      score = 4 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscalesRaw[question.dimension] += score;
      subscalesCount[question.dimension] += 1;
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscalesRaw[subscale.name] = (subscalesRaw[subscale.name] || 0) + score;
        subscalesCount[subscale.name] = (subscalesCount[subscale.name] || 0) + 1;
      }
    }
  });

  // محاسبه میانگین برای هر subscale
  Object.keys(subscalesRaw).forEach(factor => {
    const count = subscalesCount[factor] || 1;
    subscales[factor] = Math.round((subscalesRaw[factor] / count) * 100) / 100; // 2 رقم اعشار
  });

  // تعیین تفسیر برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([factor, score]) => {
      const factorCutoffs = config.cutoffs![factor];
      if (factorCutoffs) {
        const cutoff = factorCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[factor] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  return {
    subscales,
    interpretation: JSON.stringify(interpretations),
  };
}

/**
 * محاسبه نمره تست خلاقیت
 * تست خلاقیت از میانگین استفاده می‌کند
 * هر بعد: mean(all_items_after_reverse)
 * Range: 0-4
 */
function calculateCreativityScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  const subscalesRaw: { [key: string]: number } = {}; // جمع خام
  const subscalesCount: { [key: string]: number } = {}; // تعداد سوالات
  const reverseItems = config.reverseItems || [];
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
      subscalesRaw[subscale.name] = 0;
      subscalesCount[subscale.name] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-4) به نمره (0-4)
    let score = optionIndex;

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 4 - score
      score = 4 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscalesRaw[question.dimension] += score;
      subscalesCount[question.dimension] += 1;
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscalesRaw[subscale.name] = (subscalesRaw[subscale.name] || 0) + score;
        subscalesCount[subscale.name] = (subscalesCount[subscale.name] || 0) + 1;
      }
    }
  });

  // محاسبه میانگین برای هر subscale
  Object.keys(subscalesRaw).forEach(factor => {
    const count = subscalesCount[factor] || 1;
    subscales[factor] = Math.round((subscalesRaw[factor] / count) * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین همه ابعاد)
  const overall = Object.values(subscales).reduce((sum, mean) => sum + mean, 0) / Object.keys(subscales).length;
  subscales['Overall'] = Math.round(overall * 100) / 100;

  // تعیین تفسیر برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([dimension, score]) => {
      const dimensionCutoffs = config.cutoffs![dimension] || config.cutoffs!['Overall'];
      if (dimensionCutoffs) {
        const cutoff = dimensionCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[dimension] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  return {
    subscales,
    interpretation: JSON.stringify(interpretations),
  };
}

/**
 * محاسبه نمره PHQ-9
 * PHQ-9 از جمع ساده استفاده می‌کند
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * Range: 0-27
 * هیچ reverse item ندارد
 */
function calculatePHQ9Score(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    // 0: اصلاً → 0
    // 1: چند روز → 1
    // 2: بیش از نصف روزها → 2
    // 3: تقریباً هر روز → 3
    // PHQ-9 هیچ reverse item ندارد
    const score = optionIndex;
    totalScore += score;
  });

  // تعیین severity بر اساس cutoffs
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  let interpretation = '';
  
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      severity = cutoff.severity || null;
      interpretation = cutoff.label;
    }
  }

  // بررسی alert برای سوال 9 (افکار خودکشی)
  const question9Score = answers[9] || 0;
  const alert = question9Score >= 1 ? {
    hasAlert: true,
    level: question9Score === 3 ? 'critical' : 'high',
    message: question9Score === 3 
      ? '⚠️ هشدار: نیاز به ارجاع فوری - لطفاً با یک متخصص سلامت روان یا خط بحران تماس بگیرید.'
      : '⚠️ هشدار: این پاسخ نیاز به توجه دارد. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
  } : null;

  return {
    totalScore,
    severity,
    interpretation: interpretation || `نمره: ${totalScore} از 27`,
    // اضافه کردن alert به interpretation اگر وجود داشته باشد
    ...(alert && { 
      interpretation: `${interpretation || `نمره: ${totalScore} از 27`}\n\n${alert.message}` 
    }),
  };
}

/**
 * محاسبه نمره GAD-7
 * GAD-7 از جمع ساده استفاده می‌کند
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * Range: 0-21
 * هیچ reverse item ندارد
 * آستانه بالینی: ≥10
 */
function calculateGAD7Score(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    // 0: اصلاً → 0
    // 1: چند روز → 1
    // 2: بیش از نصف روزها → 2
    // 3: تقریباً هر روز → 3
    // GAD-7 هیچ reverse item ندارد
    const score = optionIndex;
    totalScore += score;
  });

  // تعیین severity بر اساس cutoffs
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  let interpretation = '';
  
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      severity = cutoff.severity || null;
      interpretation = cutoff.label;
    }
  }

  // بررسی alert برای آستانه بالینی (≥10)
  const needsClinicalAssessment = totalScore >= 10;
  const clinicalAlert = needsClinicalAssessment ? {
    hasAlert: true,
    needsClinicalAssessment: true,
    message: '⚠️ آستانه بالینی: نمره شما نشان‌دهنده احتمال اختلال اضطراب قابل توجه بالینی است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
  } : null;

  // ساخت تفسیر کامل
  let fullInterpretation = interpretation || `نمره: ${totalScore} از 21`;
  
  // اضافه کردن disclaimer
  fullInterpretation += '\n\n⚠️ توجه: این تست تشخیص پزشکی نیست و اگر احساس می‌کنی حال خوبی نداری، صحبت با روان‌درمانگر یا روان‌پزشک می‌تونه قدم مهم بعدی باشه.';
  
  // اضافه کردن alert به interpretation اگر وجود داشته باشد
  if (clinicalAlert) {
    fullInterpretation = `${fullInterpretation}\n\n${clinicalAlert.message}`;
  }

  return {
    totalScore,
    severity,
    interpretation: fullInterpretation,
  };
}

/**
 * محاسبه نمره BAI
 * BAI از جمع ساده استفاده می‌کند
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * Range: 0-63
 * هیچ reverse item ندارد
 */
function calculateBAIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    // 0: اصلاً احساس نکرده‌ام → 0
    // 1: کمی احساس کرده‌ام → 1
    // 2: به میزان متوسط احساس کرده‌ام → 2
    // 3: به شدت احساس کرده‌ام → 3
    // BAI هیچ reverse item ندارد
    const score = optionIndex;
    totalScore += score;
  });

  // تعیین severity بر اساس cutoffs
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  let interpretation = '';
  
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      severity = cutoff.severity || null;
      interpretation = cutoff.label;
    }
  }

  // بررسی alert برای سوالات خاص (نمره 2 یا 3)
  const highScores = Object.entries(answers).filter(([_, score]) => score >= 2);
  const hasAlert = highScores.length > 0;
  const alertMessage = hasAlert 
    ? '⚠️ توجه: برخی پاسخ‌های شما نشان‌دهنده علائم قابل توجه اضطراب است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.'
    : '';

  // ساخت تفسیر کامل
  let fullInterpretation = interpretation || `نمره: ${totalScore} از 63`;
  
  // اضافه کردن alert به interpretation اگر وجود داشته باشد
  if (alertMessage) {
    fullInterpretation = `${fullInterpretation}\n\n${alertMessage}`;
  }

  return {
    totalScore,
    severity,
    interpretation: fullInterpretation,
  };
}

/**
 * محاسبه نمره BDI-II
 * BDI-II از جمع ساده استفاده می‌کند
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * Range: 0-63
 * هیچ reverse item ندارد
 * آستانه بالینی: ≥14
 */
function calculateBDI2Score(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    // 0: هیچ / کم → 0
    // 1: خفیف → 1
    // 2: متوسط → 2
    // 3: شدید → 3
    // BDI-II هیچ reverse item ندارد
    const score = optionIndex;
    totalScore += score;
  });

  // تعیین severity بر اساس cutoffs
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  let interpretation = '';
  
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      severity = cutoff.severity || null;
      interpretation = cutoff.label;
    }
  }

  // بررسی alert برای آستانه بالینی (≥14)
  const needsClinicalAssessment = totalScore >= 14;
  const clinicalAlert = needsClinicalAssessment ? {
    hasAlert: true,
    needsClinicalAssessment: true,
    message: '⚠️ آستانه بالینی: نمره شما نشان‌دهنده افسردگی قابل توجه بالینی است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.',
  } : null;

  // ساخت تفسیر کامل
  let fullInterpretation = interpretation || `نمره: ${totalScore} از 63`;
  
  // اضافه کردن alert به interpretation اگر وجود داشته باشد
  if (clinicalAlert) {
    fullInterpretation = `${fullInterpretation}\n\n${clinicalAlert.message}`;
  }

  return {
    totalScore,
    severity,
    interpretation: fullInterpretation,
  };
}

/**
 * محاسبه نمره HADS
 * HADS دو زیرمقیاس دارد: Anxiety و Depression
 * هر زیرمقیاس 7 سوال
 * 4 سوال reverse-scored هستند (7, 10, 11, 14)
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * Range هر زیرمقیاس: 0-21
 * آستانه بالینی: ≥11
 */
function calculateHADSScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  const reverseItems = config.reverseItems || [];
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    let score = optionIndex;

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 3 - score (HADS از 0-3 استفاده می‌کند)
      score = 3 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscales[question.dimension] += score;
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscales[subscale.name] = (subscales[subscale.name] || 0) + score;
      }
    }
  });

  // تعیین تفسیر برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([subscale, score]) => {
      const subscaleCutoffs = config.cutoffs![subscale];
      if (subscaleCutoffs) {
        const cutoff = subscaleCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[subscale] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  // بررسی alert برای آستانه بالینی (≥11)
  const anxietyScore = subscales['Anxiety'] || 0;
  const depressionScore = subscales['Depression'] || 0;
  const hasClinicalAlert = anxietyScore >= 11 || depressionScore >= 11;
  
  let alertMessage = '';
  if (hasClinicalAlert) {
    if (anxietyScore >= 11 && depressionScore >= 11) {
      alertMessage = '⚠️ آستانه بالینی: نمره اضطراب و افسردگی شما نشان‌دهنده علائم بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
    } else if (anxietyScore >= 11) {
      alertMessage = '⚠️ آستانه بالینی: نمره اضطراب شما نشان‌دهنده اضطراب بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
    } else if (depressionScore >= 11) {
      alertMessage = '⚠️ آستانه بالینی: نمره افسردگی شما نشان‌دهنده افسردگی بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
    }
  }

  return {
    subscales,
    interpretation: JSON.stringify({
      ...interpretations,
      ...(alertMessage && { alert: alertMessage }),
    }),
  };
}

/**
 * محاسبه نمره STAI
 * STAI دو زیرمقیاس دارد: State و Trait
 * هر زیرمقیاس 20 سوال
 * 20 سوال reverse-scored هستند (10 در State، 10 در Trait)
 * فرمت پاسخ: 4 گزینه‌ای (1-4) - از 1 شروع می‌شود نه 0!
 * Range هر زیرمقیاس: 20-80
 * فرمول Reverse: 5 - score (چون از 1 شروع می‌شود)
 */
function calculateSTAIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  const reverseItems = config.reverseItems || [];
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره واقعی (1-4)
    // چون STAI از 1 شروع می‌شود، باید +1 کنیم
    let score = optionIndex + 1; // تبدیل 0-3 به 1-4

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 5 - score (چون از 1 شروع می‌شود)
      score = 5 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscales[question.dimension] += score;
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscales[subscale.name] = (subscales[subscale.name] || 0) + score;
      }
    }
  });

  // تعیین تفسیر برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([subscale, score]) => {
      const subscaleCutoffs = config.cutoffs![subscale];
      if (subscaleCutoffs) {
        const cutoff = subscaleCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[subscale] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  // بررسی alert برای نمره بالای بالینی (≥45)
  const stateScore = subscales['State'] || 0;
  const traitScore = subscales['Trait'] || 0;
  const hasClinicalAlert = stateScore >= 45 || traitScore >= 45;
  
  let alertMessage = '';
  if (hasClinicalAlert) {
    if (stateScore >= 45 && traitScore >= 45) {
      alertMessage = '⚠️ نمره اضطراب حالت و صفت شما در سطح بالینی قابل توجه است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
    } else if (stateScore >= 45) {
      alertMessage = '⚠️ نمره اضطراب حالت شما در سطح بالینی قابل توجه است. این ممکن است نشان‌دهنده واکنش حاد به استرس باشد.';
    } else if (traitScore >= 45) {
      alertMessage = '⚠️ نمره اضطراب صفت شما در سطح بالینی قابل توجه است. این نشان‌دهنده الگوی پایدار نگرانی است. توصیه می‌شود با یک متخصص سلامت روان مشورت کنید.';
    }
  }

  return {
    subscales,
    interpretation: JSON.stringify({
      ...interpretations,
      ...(alertMessage && { alert: alertMessage }),
    }),
  };
}

/**
 * محاسبه نمره EQ
 * EQ از میانگین استفاده می‌کند
 * 5 زیرمقیاس: Intrapersonal, Interpersonal, StressManagement, Adaptability, GeneralMood
 * هر زیرمقیاس 6 سوال
 * 8 سوال reverse-scored هستند
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود
 * Range هر زیرمقیاس: 1-5
 * فرمول Reverse: 6 - score (چون از 1 شروع می‌شود)
 */
function calculateEQScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  const subscalesRaw: { [key: string]: number[] } = {}; // لیست نمرات برای محاسبه میانگین
  const reverseItems = config.reverseItems || [];
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
      subscalesRaw[subscale.name] = [];
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    // چون EQ از 1 شروع می‌شود، باید +1 کنیم
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 6 - score (چون از 1 شروع می‌شود)
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscalesRaw.hasOwnProperty(question.dimension)) {
      subscalesRaw[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscalesRaw[subscale.name] = (subscalesRaw[subscale.name] || []).concat(score);
      }
    }
  });

  // محاسبه میانگین برای هر subscale
  Object.keys(subscalesRaw).forEach(subscale => {
    const scores = subscalesRaw[subscale];
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscales[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین همه زیرمقیاس‌ها)
  const overall = Object.values(subscales).reduce((sum, mean) => sum + mean, 0) / Object.keys(subscales).length;
  subscales['Overall'] = Math.round(overall * 100) / 100;

  // تعیین تفسیر برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([subscale, score]) => {
      const subscaleCutoffs = config.cutoffs![subscale] || config.cutoffs!['Overall'];
      if (subscaleCutoffs) {
        const cutoff = subscaleCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[subscale] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  return {
    subscales,
    interpretation: JSON.stringify(interpretations),
  };
}

/**
 * محاسبه نمره RSES
 * RSES از جمع ساده استفاده می‌کند
 * فرمت پاسخ: 4 گزینه‌ای (0-3)
 * Range: 0-30
 * 5 سوال reverse-scored هستند (3, 5, 8, 9, 10)
 * فرمول Reverse: 3 - score
 */
function calculateRosenbergScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;
  const reverseItems = config.reverseItems || [];

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-3) به نمره (0-3)
    // 0: کاملاً مخالفم → 0
    // 1: مخالفم → 1
    // 2: موافقم → 2
    // 3: کاملاً موافقم → 3
    let score = optionIndex;

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 3 - score
      score = 3 - score;
    }

    totalScore += score;
  });

  // تعیین cutoff
  let interpretation = '';
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      interpretation = cutoff.label;
    }
  }

  return {
    totalScore,
    interpretation: interpretation || `نمره: ${totalScore} از 30`,
  };
}

/**
 * محاسبه نمره SWLS
 * SWLS از جمع ساده استفاده می‌کند
 * فرمت پاسخ: 7 گزینه‌ای (1-7) - از 1 شروع می‌شود نه 0!
 * Range: 5-35
 * هیچ reverse item ندارد
 */
function calculateSWLSScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-6) به نمره واقعی (1-7)
    // چون SWLS از 1 شروع می‌شود، باید +1 کنیم
    // 0: کاملاً مخالفم → 1
    // 1: مخالفم → 2
    // 2: تا حدی مخالفم → 3
    // 3: نه موافق نه مخالف → 4
    // 4: تا حدی موافقم → 5
    // 5: موافقم → 6
    // 6: کاملاً موافقم → 7
    // SWLS هیچ reverse item ندارد
    const score = optionIndex + 1;
    totalScore += score;
  });

  // تعیین cutoff
  let interpretation = '';
  if (config.cutoffs && config.cutoffs['total']) {
    const cutoff = config.cutoffs['total'].find(
      c => totalScore >= c.min && totalScore <= c.max
    );
    if (cutoff) {
      interpretation = cutoff.label;
    }
  }

  return {
    totalScore,
    interpretation: interpretation || `نمره: ${totalScore} از 35`,
  };
}

/**
 * محاسبه نمره PANAS
 * PANAS دو زیرمقیاس دارد: Positive Affect و Negative Affect
 * هر زیرمقیاس 10 سوال
 * هیچ reverse item ندارد
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * Range هر زیرمقیاس: 10-50
 */
function calculatePANASScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number } = {};
  
  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
    });
  }

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    // چون PANAS از 1 شروع می‌شود، باید +1 کنیم
    // 0: خیلی کم / اصلاً → 1
    // 1: کمی → 2
    // 2: متوسط → 3
    // 3: زیاد → 4
    // 4: خیلی زیاد → 5
    // PANAS هیچ reverse item ندارد
    const score = optionIndex + 1;

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscales[question.dimension] += score;
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscales[subscale.name] = (subscales[subscale.name] || 0) + score;
      }
    }
  });

  // تعیین تفسیر برای هر subscale بر اساس cutoffs
  const interpretations: { [key: string]: string } = {};
  if (config.cutoffs) {
    Object.entries(subscales).forEach(([subscale, score]) => {
      const subscaleCutoffs = config.cutoffs![subscale];
      if (subscaleCutoffs) {
        const cutoff = subscaleCutoffs.find(
          c => score >= c.min && score <= c.max
        );
        if (cutoff) {
          interpretations[subscale] = `${cutoff.label} (${cutoff.percentile || ''})`;
        }
      }
    });
  }

  return {
    subscales,
    interpretation: JSON.stringify(interpretations),
  };
}

/**
 * محاسبه نمره Attachment (ECR-R)
 * Attachment دو زیرمقیاس دارد: Avoidance و Anxiety
 * هر زیرمقیاس 18 سوال
 * 10 سوال reverse در Avoidance (فرمول: 8 - score)
 * Anxiety تقریباً هیچ reverse ندارد
 * فرمت پاسخ: 7 گزینه‌ای (1-7) - از 1 شروع می‌شود نه 0!
 * نمره هر زیرمقیاس: میانگین 1-7
 * تعیین سبک بر اساس cutoff: Anxiety < 3.5 و Avoidance < 3.5 = Secure
 */
function calculateAttachmentScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscales: { [key: string]: number[] } = {
    Avoidance: [],
    Anxiety: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // تبدیل optionIndex (0-6) به نمره واقعی (1-7)
    let score = optionIndex + 1; // تبدیل 0-6 به 1-7

    // اگر reverse است، معکوس کن: 8 - score
    if (question.isReverse) {
      score = 8 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Avoidance' || question.dimension === 'Anxiety') {
      subscales[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (subscale.name === 'Avoidance' || subscale.name === 'Anxiety')) {
        subscales[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscales).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // تعیین سبک دلبستگی
  const threshold = 3.5;
  const anxietyScore = subscaleMeans.Anxiety || 0;
  const avoidanceScore = subscaleMeans.Avoidance || 0;
  
  let style = 'Secure';
  if (anxietyScore >= threshold && avoidanceScore < threshold) {
    style = 'Anxious';
  } else if (anxietyScore < threshold && avoidanceScore >= threshold) {
    style = 'Avoidant';
  } else if (anxietyScore >= threshold && avoidanceScore >= threshold) {
    style = 'Fearful';
  }

  // ساخت تفسیر
  const styleInterpretations: { [key: string]: string } = {
    Secure: 'راحت با صمیمیت، اعتماد بالا، ارتباطات سالم، احساس امنیت در روابط',
    Anxious: 'نیاز زیاد به تأیید، ترس از طرد، حساسیت زیاد به نشانه‌های بی‌توجهی، نگرانی از رها شدن',
    Avoidant: 'فاصله عاطفی، سختی نزدیک‌شدن، اعتماد پایین، خوداتکایی افراطی',
    Fearful: 'ترکیب اضطراب بالا + اجتناب بالا، هم ترس از نزدیکی، هم ترس از طرد، بی‌ثباتی هیجانی',
  };

  const interpretation = styleInterpretations[style] || '';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  if (anxietyScore >= threshold) {
    recommendedTests.push('spin', 'rosenberg', 'panas');
  }
  if (avoidanceScore >= threshold) {
    recommendedTests.push('communication-skills', 'eq', 'teamwork');
  }
  if (anxietyScore >= threshold && avoidanceScore >= threshold) {
    recommendedTests.push('hads', 'bdi2', 'stress-management', 'conflict-style');
  }

  return {
    subscales: subscaleMeans,
    interpretation: `${style}: ${interpretation}`,
    metadata: {
      style,
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره UCLA Loneliness Scale (v3)
 * UCLA 20 سوال دارد
 * هیچ زیرمقیاس رسمی ندارد → یک نمره کلی
 * 9 سوال reverse (1, 5, 6, 9, 10, 15, 16, 19, 20)
 * فرمت پاسخ: 4 گزینه‌ای (1-4) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 5 - score
 * نمره کل: sum(20 items after reverse) → range: 20-80
 */
function calculateUCLALonelinessScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const reverseSet = new Set(config.reverseItems || []);
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 20) return;

    // تبدیل optionIndex (0-3) به نمره واقعی (1-4)
    let score = optionIndex + 1; // تبدیل 0-3 به 1-4

    // اگر reverse است، معکوس کن: 5 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 5 - score;
    }

    totalScore += score;
  });

  // تعیین cutoff و تفسیر
  let interpretation = '';
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  
  if (totalScore >= 20 && totalScore <= 34) {
    interpretation = 'احساس تنهایی پایین. روابط کافی، حس پذیرش، شبکه اجتماعی مناسب.';
  } else if (totalScore >= 35 && totalScore <= 49) {
    interpretation = 'احساس تنهایی متوسط. گه‌گاهی احساس عدم تعلق، نوسانات در روابط، نیاز به بهبود کیفیت ارتباطات.';
  } else if (totalScore >= 50 && totalScore <= 64) {
    interpretation = 'تنهایی بالا. احساس فاصله از دیگران، کمبود همراهی، کاهش اعتماد اجتماعی، احتمال همراهی با اضطراب/افسردگی.';
    severity = 'moderate';
  } else if (totalScore >= 65 && totalScore <= 80) {
    interpretation = 'تنهایی شدید. احساس انزوا، تجربهٔ معنادار از دل‌زدگی اجتماعی، احتمال شدید همراهی با افسردگی و ریسک‌های هیجانی.';
    severity = 'severe';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScore >= 50) {
    recommendedTests.push('phq9', 'gad7', 'psss', 'attachment');
  }
  
  if (totalScore >= 35 && totalScore < 50) {
    recommendedTests.push('communication-skills', 'eq', 'mbti');
  }
  
  if (totalScore >= 65) {
    recommendedTests.push('bdi2', 'hads', 'psqi');
  }

  return {
    totalScore,
    interpretation,
    severity,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Focus & Attention
 * Focus 12 سوال دارد
 * 4 زیرمقیاس: Sustained Attention, Selective Attention, Working Memory, Executive Control
 * هر زیرمقیاس 3 سوال
 * 4 سوال reverse (5, 6, 8, 12)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کل: میانگین همه 12 سوال
 * نکته: نمره بالاتر = مشکل بیشتر = تمرکز پایین‌تر
 */
function calculateFocusAttentionScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Sustained_Attention: [],
    Selective_Attention: [],
    Working_Memory: [],
    Executive_Control: [],
  };
  const reverseSet = new Set(config.reverseItems || []);
  const allScores: number[] = [];

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Sustained_Attention' || 
        question.dimension === 'Selective_Attention' || 
        question.dimension === 'Working_Memory' || 
        question.dimension === 'Executive_Control') {
      subscaleScores[question.dimension].push(score);
      allScores.push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Sustained_Attention' || 
        subscale.name === 'Selective_Attention' || 
        subscale.name === 'Working_Memory' || 
        subscale.name === 'Executive_Control'
      )) {
        subscaleScores[subscale.name].push(score);
        allScores.push(score);
      }
    }
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
    interpretation = 'تمرکز قوی. توانایی حفظ توجه و مدیریت حواس‌پرتی در سطح عالی.';
  } else if (totalScore >= 2.1 && totalScore <= 3.0) {
    interpretation = 'تمرکز در محدوده طبیعی. عملکرد شناختی مناسب برای فعالیت‌های روزمره.';
  } else if (totalScore >= 3.1 && totalScore <= 3.6) {
    interpretation = 'تمرکز ضعیف. نیاز به بهبود در حفظ توجه و کاهش حواس‌پرتی.';
    severity = 'mild';
  } else if (totalScore >= 3.7 && totalScore <= 5.0) {
    interpretation = 'مشکل جدی در تمرکز. احتمال نیاز به بررسی بیشتر و استراتژی‌های بهبود تمرکز.';
    severity = 'moderate';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScore >= 3.6) {
    recommendedTests.push('asrs', 'working-memory', 'pss', 'psqi', 'isi');
  }
  
  if (subscaleMeans.Working_Memory >= 3.5) {
    recommendedTests.push('iq', 'problem-solving');
  }
  
  if (subscaleMeans.Executive_Control >= 3.5) {
    recommendedTests.push('emotion-regulation', 'impulse-control');
  }

  return {
    totalScore,
    subscales: subscaleMeans,
    interpretation,
    severity,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره ISI (Insomnia Severity Index)
 * ISI 7 سوال دارد
 * هیچ زیرمقیاس رسمی ندارد → یک نمره کلی
 * هیچ reverse item ندارد
 * فرمت پاسخ: 5 گزینه‌ای (0-4) - از 0 شروع می‌شود!
 * نمره کل: sum(7 items) → range: 0-28
 */
function calculateISIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  let totalScore = 0;

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 7) return;

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
    interpretation = 'خواب طبیعی. نوسانات معمول، بدون اختلال قابل توجه.';
  } else if (totalScore >= 8 && totalScore <= 14) {
    interpretation = 'بی‌خوابی خفیف. مشکلات گه‌گاهی، تحت تأثیر استرس یا سبک زندگی.';
    severity = 'mild';
  } else if (totalScore >= 15 && totalScore <= 21) {
    interpretation = 'بی‌خوابی متوسط. تداخل با انرژی و تمرکز، تأثیر روی خلق و عملکرد روزانه. توصیه به بررسی الگوها و روتین خواب.';
    severity = 'moderate';
  } else if (totalScore >= 22 && totalScore <= 28) {
    interpretation = 'بی‌خوابی شدید. اثر شدید بر کارکرد روزانه، معمولاً همراه با اضطراب/افسردگی. توصیه به ارزیابی تخصصی یا اصلاح جدی سبک زندگی.';
    severity = 'severe';
    alert = 'شدت مشکل خواب زیاد است و می‌تواند بر سلامت عاطفی و تمرکز روزانه اثرگذار باشد. توصیه می‌شود با یک متخصص سلامت روان یا پزشک مشورت کنید.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScore >= 15) {
    recommendedTests.push('psqi', 'gad7', 'phq9', 'bdi2', 'pss');
  }

  return {
    totalScore,
    interpretation,
    severity,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
      alert,
    },
  };
}

/**
 * محاسبه نمره PSQI (Pittsburgh Sleep Quality Index)
 * PSQI 18 سوال دارد
 * ساختار: 7 مؤلفه (Component)
 * هر مؤلفه نمره 0-3 دارد
 * نمره کلی = sum(7 components) → range: 0-21
 * هیچ reverse item ندارد
 * 
 * مؤلفه‌های خاص:
 * - Component 2: از 2 سوال میانگین می‌گیرد
 * - Component 4: از فرمول Sleep Efficiency محاسبه می‌شود
 * - Component 5: از 10 سوال میانگین می‌گیرد
 * - Component 7: از 2 سوال میانگین می‌گیرد
 */
function calculatePSQIScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه PSQI از config (dynamic import برای جلوگیری از circular dependency)
  // در runtime، این تابع از psqi-config import می‌شود
  // برای حالا، منطق محاسبه رو مستقیماً اینجا می‌نویسیم
  
  const components: { [key: string]: number } = {};
  
  // Component 1: Subjective Sleep Quality (سوال 1) - 0-3
  const q1 = answers[1] || 0;
  components.Component_1_Subjective_Quality = Math.min(Math.max(q1, 0), 3);

  // Component 2: Sleep Latency (سوال 2 و 5)
  // سوال 2: زمان به خواب رفتن (دقیقه)
  const latencyMinutes = answers[2] || 0;
  let score2a = 0;
  if (latencyMinutes <= 15) score2a = 0;
  else if (latencyMinutes >= 16 && latencyMinutes <= 30) score2a = 1;
  else if (latencyMinutes >= 31 && latencyMinutes <= 60) score2a = 2;
  else if (latencyMinutes >= 60) score2a = 3;
  
  // سوال 5: مشکل در به‌خواب‌رفتن (0-3)
  const score2b = Math.min(Math.max(answers[5] || 0, 0), 3);
  components.Component_2_Sleep_Latency = Math.round((score2a + score2b) / 2);

  // Component 3: Sleep Duration (سوال 4) - ساعت خواب
  const sleepDuration = answers[4] || 0;
  let component3 = 0;
  if (sleepDuration >= 7) component3 = 0;
  else if (sleepDuration >= 6 && sleepDuration < 7) component3 = 1;
  else if (sleepDuration >= 5 && sleepDuration < 6) component3 = 2;
  else component3 = 3;
  components.Component_3_Sleep_Duration = component3;

  // Component 4: Sleep Efficiency (سوال 3 و 4)
  // Efficiency = (Total sleep time / Time in bed) * 100
  const timeInBed = answers[3] || 0;
  let component4 = 0;
  if (timeInBed > 0) {
    const efficiency = (sleepDuration / timeInBed) * 100;
    if (efficiency >= 85) component4 = 0;
    else if (efficiency >= 75 && efficiency < 85) component4 = 1;
    else if (efficiency >= 65 && efficiency < 75) component4 = 2;
    else component4 = 3;
  } else {
    component4 = 3; // اگر timeInBed 0 باشد
  }
  components.Component_4_Sleep_Efficiency = component4;

  // Component 5: Sleep Disturbances (سوال 5-14) - 10 سوال
  const disturbanceScores: number[] = [];
  for (let i = 5; i <= 14; i++) {
    const score = Math.min(Math.max(answers[i] || 0, 0), 3);
    disturbanceScores.push(score);
  }
  const sum5 = disturbanceScores.reduce((acc, score) => acc + score, 0);
  components.Component_5_Sleep_Disturbances = disturbanceScores.length > 0 ? Math.round(sum5 / disturbanceScores.length) : 0;

  // Component 6: Use of Sleep Medication (سوال 15) - 0-3
  components.Component_6_Sleep_Medication = Math.min(Math.max(answers[15] || 0, 0), 3);

  // Component 7: Daytime Dysfunction (سوال 16 و 17)
  const alertness = Math.min(Math.max(answers[16] || 0, 0), 3);
  const motivation = Math.min(Math.max(answers[17] || 0, 0), 3);
  components.Component_7_Daytime_Dysfunction = Math.round((alertness + motivation) / 2);

  // محاسبه نمره کلی
  const totalScore = Object.values(components).reduce((sum, score) => sum + score, 0);

  // تعیین cutoff و تفسیر
  let interpretation = '';
  let severity: 'mild' | 'moderate' | 'severe' | null = null;
  
  if (totalScore >= 0 && totalScore <= 5) {
    interpretation = 'خواب خوب. خواب مؤثر، بیدار شدن با انرژی، مشکل خاصی گزارش نشده.';
  } else if (totalScore >= 6 && totalScore <= 10) {
    interpretation = 'خواب متوسط. چالش‌هایی مثل سخت خوابیدن، بیدار شدن در طول شب، یا خستگی صبحگاهی. بهتر است الگوی خواب روتین بررسی شود.';
    severity = 'mild';
  } else if (totalScore >= 11 && totalScore <= 21) {
    interpretation = 'خواب ضعیف. تأثیر قابل توجه روی خلق، تمرکز و انرژی روزانه. معمولاً همراه اضطراب/افسردگی/استرس. توصیه به بهبود عادات خواب + بررسی مشکلات زمینه‌ای.';
    severity = 'moderate';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScore >= 10) {
    recommendedTests.push('isi', 'gad7', 'phq9', 'pss', 'focus');
  }
  
  // اگر کارایی خواب < 75% (component4 >= 2)
  if (components.Component_4_Sleep_Efficiency >= 2) {
    recommendedTests.push('sleep-hygiene', 'daily-routine', 'gad7', 'anxiety');
  }

  return {
    totalScore,
    subscales: components,
    interpretation,
    severity,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره MAAS (Mindful Attention Awareness Scale)
 * MAAS 15 سوال دارد
 * یک زیرمقیاس واحد: Mindfulness
 * همه 15 سوال Reverse هستند!
 * فرمت پاسخ: 6 گزینه‌ای (1-6) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 7 - score
 * نمره نهایی: mean(15 reverse_scored_items) → range: 1-6
 * نمره بالاتر = ذهن‌آگاهی بیشتر
 */
function calculateMAASScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const scores: number[] = [];
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 15) return;

    // تبدیل optionIndex (0-5) به نمره واقعی (1-6)
    let score = optionIndex + 1; // تبدیل 0-5 به 1-6

    // همه سوالات MAAS Reverse هستند: 7 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 7 - score;
    }

    scores.push(score);
  });

  // محاسبه میانگین
  const sum = scores.reduce((acc, score) => acc + score, 0);
  const totalScore = scores.length > 0 ? Math.round((sum / scores.length) * 100) / 100 : 0;

  // تعیین cutoff و تفسیر
  let interpretation = '';
  
  if (totalScore >= 1.0 && totalScore <= 2.9) {
    interpretation = 'ذهن‌آگاهی پایین. زندگی اتوماتیک، سختی در حضور ذهن، افزایش استرس و واکنش‌های هیجانی، بیشتر تحت تأثیر افکار مزاحم.';
  } else if (totalScore >= 3.0 && totalScore <= 4.0) {
    interpretation = 'ذهن‌آگاهی متوسط. حضور ذهن مناسب، نوسان در توجه، گه‌گاهی اسیر حواس‌پرتی.';
  } else if (totalScore >= 4.1 && totalScore <= 5.0) {
    interpretation = 'ذهن‌آگاهی خوب. توانایی بالا در توجه به لحظه، کنترل خوب روی افکار، واکنش‌پذیری کمتر، مدیریت بهتر استرس.';
  } else if (totalScore >= 5.1 && totalScore <= 6.0) {
    interpretation = 'ذهن‌آگاهی بسیار بالا. تمرکز بالا، آگاهی عمیق از ذهن و بدن، خودتنظیمی عالی، آرامش پایدار و کیفیت بالای عملکرد.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScore <= 3.0) {
    recommendedTests.push('pss', 'focus', 'isi', 'psqi', 'gad7', 'ders');
  } else if (totalScore >= 3.0 && totalScore <= 5.0) {
    recommendedTests.push('growth-mindset', 'curiosity', 'eq');
  } else if (totalScore >= 5.1) {
    recommendedTests.push('values', 'life-purpose', 'time-preference');
  }

  return {
    totalScore,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Time Preference (Future Orientation / Time Preference)
 * Time Preference 12 سوال دارد
 * 3 زیرمقیاس: Future Orientation, Present-Hedonistic, Present-Fatalistic
 * هر زیرمقیاس 4 سوال
 * 3 سوال reverse (3, 7, 12)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateTimePreferenceScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/time-preference-config');
    calculateFromConfig = configModule.calculateTimePreferenceScore;
  } catch (e) {
    // اگر فایل وجود نداشت، از محاسبه ساده استفاده کن
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره RIASEC (Holland Career Interest Inventory)
 * RIASEC 30 سوال دارد
 * 6 زیرمقیاس: Realistic, Investigative, Artistic, Social, Enterprising, Conventional
 * هر زیرمقیاس 5 سوال
 * بدون reverse item
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * نمره هر زیرمقیاس: میانگین 1-5
 * پروفایل نهایی: سه حرف اول بر اساس نمرات مرتب شده (مثلاً IAS)
 */
function calculateRIASECScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Realistic: [],
    Investigative: [],
    Artistic: [],
    Social: [],
    Enterprising: [],
    Conventional: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 30) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    // RIASEC هیچ reverse item ندارد
    const score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Realistic' || 
        question.dimension === 'Investigative' || 
        question.dimension === 'Artistic' || 
        question.dimension === 'Social' || 
        question.dimension === 'Enterprising' || 
        question.dimension === 'Conventional') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Realistic' || 
        subscale.name === 'Investigative' || 
        subscale.name === 'Artistic' || 
        subscale.name === 'Social' || 
        subscale.name === 'Enterprising' || 
        subscale.name === 'Conventional'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // تعیین کد RIASEC (سه حرف اول بر اساس نمرات مرتب شده)
  const sorted = Object.entries(subscaleMeans)
    .map(([type, score]) => ({ type, score }))
    .sort((a, b) => b.score - a.score);

  const code = sorted
    .slice(0, 3)
    .map(item => {
      const typeMap: { [key: string]: string } = {
        Realistic: 'R',
        Investigative: 'I',
        Artistic: 'A',
        Social: 'S',
        Enterprising: 'E',
        Conventional: 'C',
      };
      return typeMap[item.type] || item.type[0];
    })
    .join('');

  // ساخت تفسیر
  const interpretations: { [key: string]: string } = {
    Realistic: 'دوست‌دار کارهای عملی، فنی، ساخت‌وساز، مکانیکی',
    Investigative: 'تحلیل، تحقیق، مسائل پیچیده، داده، علوم',
    Artistic: 'خلاقیت، طراحی، نوآوری، نوشتن، موسیقی',
    Social: 'کمک به دیگران، آموزش، درمانگری، مشاوره',
    Enterprising: 'رهبری، فروش، مدیریت، راه‌اندازی کسب‌وکار',
    Conventional: 'کار دقیق، منظم، حسابداری، بانک، امور اداری',
  };

  const codeTypes = code.split('').map(letter => {
    const typeMap: { [key: string]: string } = {
      'R': 'Realistic',
      'I': 'Investigative',
      'A': 'Artistic',
      'S': 'Social',
      'E': 'Enterprising',
      'C': 'Conventional',
    };
    return typeMap[letter] || '';
  });

  const interpretationParts = codeTypes
    .filter(type => type)
    .map(type => interpretations[type])
    .join(' | ');

  const interpretation = `کد شما: ${code}. ${interpretationParts}`;

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  const topTypes = codeTypes.slice(0, 2);

  if (topTypes.includes('Investigative')) {
    recommendedTests.push('problem-solving', 'iq');
  }
  if (topTypes.includes('Artistic')) {
    recommendedTests.push('creativity', 'communication-skills');
  }
  if (topTypes.includes('Social')) {
    recommendedTests.push('eq', 'attachment');
  }
  if (topTypes.includes('Enterprising')) {
    recommendedTests.push('leadership', 'decision-making');
  }
  if (topTypes.includes('Conventional')) {
    recommendedTests.push('time-management', 'detail-orientation');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    type: code, // ذخیره کد در فیلد type
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Leadership (Leadership Assessment)
 * Leadership 12 سوال دارد
 * 4 زیرمقیاس: Transformational, Transactional, Decision-Making, Emotional
 * هر زیرمقیاس 3 سوال
 * 2 سوال reverse (5 و 7)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateLeadershipScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Transformational: [],
    Transactional: [],
    Decision_Making: [],
    Emotional: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Transformational' || 
        question.dimension === 'Transactional' || 
        question.dimension === 'Decision_Making' || 
        question.dimension === 'Emotional') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Transformational' || 
        subscale.name === 'Transactional' || 
        subscale.name === 'Decision_Making' || 
        subscale.name === 'Emotional'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Transformational >= 3.5) {
    interpretations.push('رهبری تحول‌گرا بالا: الهام‌بخش، انگیزه‌بخش، توانایی ایجاد چشم‌انداز. مناسب تیم‌سازی و استارتاپ‌ها.');
  } else if (subscaleMeans.Transformational <= 2.4) {
    interpretations.push('رهبری تحول‌گرا پایین: تمرکز بر وظایف روزمره، کمتر الهام‌بخش، نیاز به توسعه مهارت‌های رهبری تحول‌گرا.');
  }
  
  if (subscaleMeans.Transactional >= 3.5) {
    interpretations.push('رهبری مراوده‌ای بالا: شفافیت قوانین، عملکردمحور، مدیریت ساختاری. مناسب محیط‌های رسمی و پروژه‌محور.');
  } else if (subscaleMeans.Transactional <= 2.4) {
    interpretations.push('رهبری مراوده‌ای پایین: کمتر ساختاریافته، نیاز به شفافیت بیشتر در قوانین و انتظارات.');
  }
  
  if (subscaleMeans.Decision_Making >= 3.5) {
    interpretations.push('تصمیم‌گیری و مسئولیت‌پذیری بالا: قاطعیت، مسئولیت‌پذیری، مدیریت بحران، اعتمادسازی.');
  } else if (subscaleMeans.Decision_Making <= 2.4) {
    interpretations.push('تصمیم‌گیری و مسئولیت‌پذیری پایین: مشکل در تصمیم‌گیری، نیاز به توسعه قاطعیت و مسئولیت‌پذیری.');
  }
  
  if (subscaleMeans.Emotional >= 3.5) {
    interpretations.push('رهبری عاطفی بالا: مهارت‌های بین‌فردی، درک نیازهای افراد، مدیریت تعارض. مناسب تیم‌های انسانی و کارآفرینی.');
  } else if (subscaleMeans.Emotional <= 2.4) {
    interpretations.push('رهبری عاطفی پایین: نیاز به توسعه مهارت‌های بین‌فردی و همدلی.');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'پروفایل رهبری متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Transformational >= 3.5) {
    recommendedTests.push('creativity', 'riasec', 'mbti');
  }
  
  if (subscaleMeans.Transactional >= 3.5) {
    recommendedTests.push('time-management', 'detail-orientation', 'riasec');
  }
  
  if (subscaleMeans.Decision_Making <= 2.4) {
    recommendedTests.push('problem-solving', 'executive-function', 'focus');
  }
  
  if (subscaleMeans.Emotional <= 2.4) {
    recommendedTests.push('eq', 'attachment', 'interpersonal-skills');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Communication Skills
 * Communication Skills 12 سوال دارد
 * 4 زیرمقیاس: Expressiveness, Active Listening, Assertiveness, Social Awareness
 * هر زیرمقیاس 3 سوال
 * 3 سوال reverse (6, 9, 12)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateCommunicationSkillsScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Expressiveness: [],
    Active_Listening: [],
    Assertiveness: [],
    Social_Awareness: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Expressiveness' || 
        question.dimension === 'Active_Listening' || 
        question.dimension === 'Assertiveness' || 
        question.dimension === 'Social_Awareness') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Expressiveness' || 
        subscale.name === 'Active_Listening' || 
        subscale.name === 'Assertiveness' || 
        subscale.name === 'Social_Awareness'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Expressiveness >= 3.5) {
    interpretations.push('بیان‌گری بالا: توان بیان شفاف و جذاب، انتقال پیام مؤثر، راحتی در گفت‌وگو');
  } else if (subscaleMeans.Expressiveness <= 2.4) {
    interpretations.push('بیان‌گری پایین: مشکل در بیان افکار و احساسات، نیاز به توسعه مهارت‌های بیان');
  }
  
  if (subscaleMeans.Active_Listening >= 3.5) {
    interpretations.push('گوش‌دادن فعال بالا: تمرکز کامل روی مخاطب، فهم دقیق پیام‌ها، مدیریت مکالمه مؤثر');
  } else if (subscaleMeans.Active_Listening <= 2.4) {
    interpretations.push('گوش‌دادن فعال پایین: مشکل در گوش‌دادن فعال، نیاز به بهبود تمرکز و درک در مکالمات');
  }
  
  if (subscaleMeans.Assertiveness >= 3.5) {
    interpretations.push('قاطعیت بالا: توان گفتن «نه»، بیان نیازها بدون پرخاشگری، احترام متقابل در گفت‌وگو');
  } else if (subscaleMeans.Assertiveness <= 2.4) {
    interpretations.push('قاطعیت پایین: مشکل در قاطعیت، نیاز به توسعه مهارت‌های ابراز نیاز و مرزبندی');
  }
  
  if (subscaleMeans.Social_Awareness >= 3.5) {
    interpretations.push('آگاهی اجتماعی بالا: درک احساسات دیگران، شناخت موقعیت اجتماعی، خواندن زبان بدن');
  } else if (subscaleMeans.Social_Awareness <= 2.4) {
    interpretations.push('آگاهی اجتماعی پایین: مشکل در درک دیگران، نیاز به توسعه همدلی و آگاهی اجتماعی');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های ارتباطی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Expressiveness <= 2.4) {
    recommendedTests.push('eq', 'riasec', 'rosenberg');
  }
  
  if (subscaleMeans.Active_Listening <= 2.4) {
    recommendedTests.push('focus', 'ucla', 'eq');
  }
  
  if (subscaleMeans.Assertiveness <= 2.4) {
    recommendedTests.push('ders', 'decision-making', 'spin');
  }
  
  if (subscaleMeans.Social_Awareness <= 2.4) {
    recommendedTests.push('attachment', 'empathy', 'eq');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Teamwork (Teamwork / Collaboration)
 * Teamwork 12 سوال دارد
 * 4 زیرمقیاس: Cooperation, Communication, Responsibility, Conflict Resolution
 * هر زیرمقیاس 3 سوال
 * 4 سوال reverse (4, 6, 9, 12)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateTeamworkScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Cooperation: [],
    Communication: [],
    Responsibility: [],
    Conflict_Resolution: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Cooperation' || 
        question.dimension === 'Communication' || 
        question.dimension === 'Responsibility' || 
        question.dimension === 'Conflict_Resolution') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Cooperation' || 
        subscale.name === 'Communication' || 
        subscale.name === 'Responsibility' || 
        subscale.name === 'Conflict_Resolution'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Cooperation >= 3.5) {
    interpretations.push('همکاری بالا: کمک به دیگران، هماهنگی در پروژه‌ها، روحیه تیمی');
  } else if (subscaleMeans.Cooperation <= 2.4) {
    interpretations.push('همکاری پایین: مشکل در همکاری، نیاز به توسعه روحیه تیمی و مشارکت');
  }
  
  if (subscaleMeans.Communication >= 3.5) {
    interpretations.push('ارتباطات تیمی بالا: شنیدن و فهم دقیق پیام‌ها، انتقال واضح اطلاعات، جلوگیری از سوءتفاهم');
  } else if (subscaleMeans.Communication <= 2.4) {
    interpretations.push('ارتباطات تیمی پایین: مشکل در ارتباطات تیمی، نیاز به بهبود انتقال و دریافت پیام');
  }
  
  if (subscaleMeans.Responsibility >= 3.5) {
    interpretations.push('مسئولیت‌پذیری بالا: انجام کار در زمان مشخص، اعتماد تیم به فرد، ثبات عملکرد');
  } else if (subscaleMeans.Responsibility <= 2.4) {
    interpretations.push('مسئولیت‌پذیری پایین: مشکل در مسئولیت‌پذیری، نیاز به توسعه قابلیت اعتماد و ثبات');
  }
  
  if (subscaleMeans.Conflict_Resolution >= 3.5) {
    interpretations.push('حل تعارض بالا: مدیریت اختلاف، آرام‌سازی تیم، یافتن راه‌حل مشترک');
  } else if (subscaleMeans.Conflict_Resolution <= 2.4) {
    interpretations.push('حل تعارض پایین: مشکل در حل تعارض، نیاز به توسعه مهارت‌های مدیریت اختلاف');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های کار تیمی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Communication <= 2.4) {
    recommendedTests.push('communication-skills', 'eq', 'active-listening');
  }
  
  if (subscaleMeans.Responsibility <= 2.4) {
    recommendedTests.push('time-management', 'decision-making', 'executive-function');
  }
  
  if (subscaleMeans.Conflict_Resolution <= 2.4) {
    recommendedTests.push('ders', 'stress-management', 'leadership');
  }
  
  if (subscaleMeans.Cooperation <= 2.4) {
    recommendedTests.push('attachment', 'social-awareness', 'mbti');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Problem Solving
 * Problem Solving 12 سوال دارد
 * 4 زیرمقیاس: Problem Identification, Generating Solutions, Decision-Making, Execution & Evaluation
 * هر زیرمقیاس 3 سوال
 * 3 سوال reverse (5, 10, 8)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateProblemSolvingScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Problem_Identification: [],
    Generating_Solutions: [],
    Decision_Making: [],
    Execution_Evaluation: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Problem_Identification' || 
        question.dimension === 'Generating_Solutions' || 
        question.dimension === 'Decision_Making' || 
        question.dimension === 'Execution_Evaluation') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Problem_Identification' || 
        subscale.name === 'Generating_Solutions' || 
        subscale.name === 'Decision_Making' || 
        subscale.name === 'Execution_Evaluation'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Problem_Identification >= 3.5) {
    interpretations.push('تشخیص مسئله بالا: توانایی دیدن ریشهٔ مشکل، تحلیل اولیه، تشخیص درست شرایط');
  } else if (subscaleMeans.Problem_Identification <= 2.4) {
    interpretations.push('تشخیص مسئله پایین: مشکل در تشخیص مسئله، نیاز به توسعه مهارت‌های تحلیل و مشاهده');
  }
  
  if (subscaleMeans.Generating_Solutions >= 3.5) {
    interpretations.push('تولید راه‌حل بالا: تعداد راه‌حل‌های ممکن، خلاقیت در باز کردن مسئله، توانایی فکر کردن خارج از چارچوب');
  } else if (subscaleMeans.Generating_Solutions <= 2.4) {
    interpretations.push('تولید راه‌حل پایین: مشکل در تولید راه‌حل، نیاز به توسعه خلاقیت و تفکر انعطاف‌پذیر');
  }
  
  if (subscaleMeans.Decision_Making >= 3.5) {
    interpretations.push('تصمیم‌گیری بالا: انتخاب مناسب‌ترین گزینه، قاطعیت، ارزیابی ریسک');
  } else if (subscaleMeans.Decision_Making <= 2.4) {
    interpretations.push('تصمیم‌گیری پایین: مشکل در تصمیم‌گیری، نیاز به توسعه قاطعیت و ارزیابی گزینه‌ها');
  }
  
  if (subscaleMeans.Execution_Evaluation >= 3.5) {
    interpretations.push('اجرا و ارزیابی بالا: اجرای راه‌حل، بازبینی نتیجه، اصلاح مسیر در صورت نیاز');
  } else if (subscaleMeans.Execution_Evaluation <= 2.4) {
    interpretations.push('اجرا و ارزیابی پایین: مشکل در اجرا و ارزیابی، نیاز به توسعه مهارت‌های پیگیری و بازبینی');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های حل مسئله متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Problem_Identification <= 2.4) {
    recommendedTests.push('focus', 'maas', 'cognitive-skills');
  }
  
  if (subscaleMeans.Generating_Solutions <= 2.4) {
    recommendedTests.push('creativity', 'eq');
  }
  
  if (subscaleMeans.Decision_Making <= 2.4) {
    recommendedTests.push('time-preference', 'leadership');
  }
  
  if (subscaleMeans.Execution_Evaluation <= 2.4) {
    recommendedTests.push('time-management', 'executive-function', 'stress-management');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Decision Making
 * Decision Making 12 سوال دارد
 * 4 زیرمقیاس: Rational Analysis, Intuitive, Risk Evaluation, Decisiveness
 * هر زیرمقیاس 3 سوال
 * 3 سوال reverse (6, 7, 8)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateDecisionMakingScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Rational_Analysis: [],
    Intuitive: [],
    Risk_Evaluation: [],
    Decisiveness: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Rational_Analysis' || 
        question.dimension === 'Intuitive' || 
        question.dimension === 'Risk_Evaluation' || 
        question.dimension === 'Decisiveness') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Rational_Analysis' || 
        subscale.name === 'Intuitive' || 
        subscale.name === 'Risk_Evaluation' || 
        subscale.name === 'Decisiveness'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Rational_Analysis >= 3.5) {
    interpretations.push('تحلیل منطقی بالا: تحلیل داده، منطق، مقایسه گزینه‌ها، تفکر ساختاری');
  } else if (subscaleMeans.Rational_Analysis <= 2.4) {
    interpretations.push('تحلیل منطقی پایین: مشکل در تحلیل منطقی، نیاز به توسعه مهارت‌های تفکر ساختاری');
  }
  
  if (subscaleMeans.Intuitive >= 3.5) {
    interpretations.push('تصمیم‌گیری شهودی بالا: تصمیم‌گیری سریع با تکیه بر تجربه، حس درونی، پردازش ناخودآگاه');
  } else if (subscaleMeans.Intuitive <= 2.4) {
    interpretations.push('تصمیم‌گیری شهودی پایین: کمتر تکیه بر شهود، نیاز به توسعه اعتماد به تجربه');
  }
  
  if (subscaleMeans.Risk_Evaluation >= 3.5) {
    interpretations.push('ارزیابی ریسک بالا: درک خطرات، ارزیابی پیامدها، تفکر پیشگیرانه');
  } else if (subscaleMeans.Risk_Evaluation <= 2.4) {
    interpretations.push('ارزیابی ریسک پایین: مشکل در ارزیابی ریسک، نیاز به توسعه تفکر پیشگیرانه');
  }
  
  if (subscaleMeans.Decisiveness >= 3.5) {
    interpretations.push('قاطعیت بالا: سرعت تصمیم‌گیری، قاطعیت، جلوگیری از تعلل');
  } else if (subscaleMeans.Decisiveness <= 2.4) {
    interpretations.push('قاطعیت پایین: مشکل در قاطعیت، نیاز به توسعه سرعت و قطعیت در تصمیم‌گیری');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های تصمیم‌گیری متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Rational_Analysis <= 2.4) {
    recommendedTests.push('problem-solving', 'cognitive-skills', 'focus');
  }
  
  if (subscaleMeans.Intuitive >= 3.8) {
    recommendedTests.push('risk-management', 'time-preference', 'stress-management');
  }
  
  if (subscaleMeans.Risk_Evaluation <= 2.4) {
    recommendedTests.push('gad7', 'time-preference', 'leadership');
  }
  
  if (subscaleMeans.Decisiveness <= 2.4) {
    recommendedTests.push('procrastination', 'time-management', 'executive-function');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Time Management
 * Time Management 12 سوال دارد
 * 4 زیرمقیاس: Planning, Prioritization, Discipline, Procrastination Control
 * هر زیرمقیاس 3 سوال
 * 4 سوال reverse (4, 6, 7, 11)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateTimeManagementScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Planning: [],
    Prioritization: [],
    Discipline: [],
    Procrastination_Control: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Planning' || 
        question.dimension === 'Prioritization' || 
        question.dimension === 'Discipline' || 
        question.dimension === 'Procrastination_Control') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Planning' || 
        subscale.name === 'Prioritization' || 
        subscale.name === 'Discipline' || 
        subscale.name === 'Procrastination_Control'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Planning >= 3.5) {
    interpretations.push('برنامه‌ریزی بالا: هدف‌گذاری دقیق، تقسیم کار، برنامه‌ریزی روزانه/هفتگی');
  } else if (subscaleMeans.Planning <= 2.4) {
    interpretations.push('برنامه‌ریزی پایین: مشکل در برنامه‌ریزی، نیاز به توسعه مهارت‌های هدف‌گذاری و تقسیم کار');
  }
  
  if (subscaleMeans.Prioritization >= 3.5) {
    interpretations.push('اولویت‌بندی بالا: شناخت کارهای مهم، مدیریت انرژی، جلوگیری از اتلاف وقت');
  } else if (subscaleMeans.Prioritization <= 2.4) {
    interpretations.push('اولویت‌بندی پایین: مشکل در اولویت‌بندی، نیاز به توسعه مهارت‌های تشخیص کارهای مهم');
  }
  
  if (subscaleMeans.Discipline >= 3.5) {
    interpretations.push('نظم و انضباط بالا: اجرای برنامه، پایبندی به زمان‌بندی، نظم در کار');
  } else if (subscaleMeans.Discipline <= 2.4) {
    interpretations.push('نظم و انضباط پایین: مشکل در نظم و انضباط، نیاز به توسعه مهارت‌های پایبندی به برنامه');
  }
  
  if (subscaleMeans.Procrastination_Control >= 3.5) {
    interpretations.push('کنترل تعلل بالا: مدیریت تعلل، شروع به‌موقع کار، کنترل «اجتناب» ذهنی');
  } else if (subscaleMeans.Procrastination_Control <= 2.4) {
    interpretations.push('کنترل تعلل پایین: مشکل در کنترل تعلل، نیاز به توسعه مهارت‌های شروع به‌موقع و مدیریت اجتناب');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'مهارت‌های مدیریت زمان متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Planning <= 2.4) {
    recommendedTests.push('time-preference', 'problem-solving', 'executive-function');
  }
  
  if (subscaleMeans.Prioritization <= 2.4) {
    recommendedTests.push('focus', 'stress-management', 'eq');
  }
  
  if (subscaleMeans.Discipline <= 2.4) {
    recommendedTests.push('habit-formation', 'productivity-skills', 'gad7');
  }
  
  if (subscaleMeans.Procrastination_Control <= 2.4) {
    recommendedTests.push('ders', 'maas', 'motivation-profile');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Work-Life Balance
 * Work-Life Balance 12 سوال دارد
 * 4 زیرمقیاس: WorkLife Harmony, Work Overload, Boundary Control, Wellbeing & Recovery
 * هر زیرمقیاس 3 سوال
 * 4 سوال reverse (2, 7, 8, 10)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 */
function calculateWorkLifeBalanceScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    WorkLife_Harmony: [],
    Work_Overload: [],
    Boundary_Control: [],
    Wellbeing_Recovery: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'WorkLife_Harmony' || 
        question.dimension === 'Work_Overload' || 
        question.dimension === 'Boundary_Control' || 
        question.dimension === 'Wellbeing_Recovery') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'WorkLife_Harmony' || 
        subscale.name === 'Work_Overload' || 
        subscale.name === 'Boundary_Control' || 
        subscale.name === 'Wellbeing_Recovery'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.WorkLife_Harmony >= 3.5) {
    interpretations.push('هماهنگی کار-زندگی بالا: هماهنگی بین نقش‌های زندگی، احساس رضایت، حس "تعادل"');
  } else if (subscaleMeans.WorkLife_Harmony <= 2.4) {
    interpretations.push('هماهنگی کار-زندگی پایین: مشکل در تعادل کار و زندگی، نیاز به بهبود هماهنگی نقش‌ها');
  }
  
  if (subscaleMeans.Work_Overload >= 3.5) {
    interpretations.push('فشار کاری بالا: حجم کار زیاد، ناکافی بودن زمان، احتمال فرسودگی');
  } else if (subscaleMeans.Work_Overload <= 2.4) {
    interpretations.push('فشار کاری متعادل: حجم کار متعادل، مدیریت زمان مناسب');
  }
  
  if (subscaleMeans.Boundary_Control >= 3.5) {
    interpretations.push('کنترل مرز بالا: توانایی قطع ارتباط کاری، جداسازی خانه از کار، ذهن آرام بعد از ساعات کاری');
  } else if (subscaleMeans.Boundary_Control <= 2.4) {
    interpretations.push('کنترل مرز پایین: مشکل در جداسازی کار و زندگی، نیاز به بهبود کنترل مرزها');
  }
  
  if (subscaleMeans.Wellbeing_Recovery >= 3.5) {
    interpretations.push('بهزیستی و ریکاوری بالا: انرژی روانی، خواب خوب، ریکاوری ذهنی درست');
  } else if (subscaleMeans.Wellbeing_Recovery <= 2.4) {
    interpretations.push('بهزیستی و ریکاوری پایین: مشکل در ریکاوری، نیاز به بهبود استراحت و بهزیستی');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'تعادل کار-زندگی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.WorkLife_Harmony <= 2.4) {
    recommendedTests.push('stress-scale', 'time-management', 'maas');
  }
  
  if (subscaleMeans.Work_Overload >= 3.5) {
    recommendedTests.push('burnout-screening', 'psqi', 'stress-anxiety');
  }
  
  if (subscaleMeans.Boundary_Control <= 2.4) {
    recommendedTests.push('focus', 'communication-skills');
  }
  
  if (subscaleMeans.Wellbeing_Recovery <= 2.4) {
    recommendedTests.push('phq9', 'gad7', 'physical-health');
  }

  return {
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Cognitive IQ
 * ⚠️ این تست متفاوت است: هر سوال فقط 0 یا 1 نمره دارد (درست/غلط)
 * Cognitive IQ 12 سوال دارد
 * 3 زیرمقیاس: Fluid Reasoning, Verbal Reasoning, Quantitative Reasoning
 * هر زیرمقیاس 4 سوال
 * بدون reverse
 * فرمت پاسخ: هر سوال 0 (غلط) یا 1 (درست)
 * نمره هر زیرمقیاس: مجموع 0-4
 * نمره کل: مجموع 0-12
 * Cutoff: 0-3 پایین، 4-6 متوسط، 7-9 خوب، 10-12 بسیار بالا
 */
function calculateCognitiveIQScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Fluid_Reasoning: [],
    Verbal_Reasoning: [],
    Quantitative_Reasoning: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // ⚠️ در این تست، optionIndex باید 0 (غلط) یا 1 (درست) باشد
    // یا می‌تواند index گزینه صحیح باشد که باید با correctAnswer مقایسه شود
    // برای سادگی، فرض می‌کنیم optionIndex = 1 یعنی درست، 0 یعنی غلط
    // یا می‌تواند index گزینه انتخاب شده باشد که باید با correctAnswer مقایسه شود
    
    // اگر config.correctAnswers وجود دارد، مقایسه کن
    let score = 0;
    if ((config as any).correctAnswers && (config as any).correctAnswers[questionOrder] !== undefined) {
      const correctOptionIndex = (config as any).correctAnswers[questionOrder];
      if (optionIndex === correctOptionIndex) {
        score = 1; // پاسخ درست
      } else {
        score = 0; // پاسخ غلط
      }
    } else {
      // اگر correctAnswers وجود ندارد، فرض کن optionIndex = 1 یعنی درست
      score = optionIndex === 1 ? 1 : 0;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Fluid_Reasoning' || 
        question.dimension === 'Verbal_Reasoning' || 
        question.dimension === 'Quantitative_Reasoning') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Fluid_Reasoning' || 
        subscale.name === 'Verbal_Reasoning' || 
        subscale.name === 'Quantitative_Reasoning'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه مجموع برای هر زیرمقیاس
  const subscaleSums: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    subscaleSums[subscale] = sum; // 0-4 برای هر زیرمقیاس
  });

  // محاسبه نمره کل
  const totalScore = Object.values(subscaleSums).reduce((acc, sum) => acc + sum, 0); // 0-12

  // تعیین سطح بر اساس نمره کل
  let level: string;
  if (totalScore >= 10) {
    level = 'بسیار بالا';
  } else if (totalScore >= 7) {
    level = 'خوب';
  } else if (totalScore >= 4) {
    level = 'متوسط';
  } else {
    level = 'پایین';
  }

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleSums.Fluid_Reasoning >= 3) {
    interpretations.push('استدلال سیال بالا: تشخیص الگو، منطق تصویری، استدلال سریع');
  } else if (subscaleSums.Fluid_Reasoning <= 1) {
    interpretations.push('استدلال سیال پایین: مشکل در تشخیص الگوها، نیاز به بهبود استدلال سیال');
  }
  
  if (subscaleSums.Verbal_Reasoning >= 3) {
    interpretations.push('استدلال کلامی بالا: تحلیل مفهومی، طبقه‌بندی معنایی، قدرت درک واژه‌ها');
  } else if (subscaleSums.Verbal_Reasoning <= 1) {
    interpretations.push('استدلال کلامی پایین: مشکل در تحلیل کلامی، نیاز به بهبود استدلال کلامی');
  }
  
  if (subscaleSums.Quantitative_Reasoning >= 3) {
    interpretations.push('استدلال عددی بالا: درک اعداد، توالی‌ها، تعمیم عددی');
  } else if (subscaleSums.Quantitative_Reasoning <= 1) {
    interpretations.push('استدلال عددی پایین: مشکل در استدلال عددی، نیاز به بهبود درک کمی');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : `سطح شناخت: ${level}`;

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleSums.Fluid_Reasoning <= 1) {
    recommendedTests.push('problem-solving', 'focus', 'creativity');
  }
  
  if (subscaleSums.Verbal_Reasoning <= 1) {
    recommendedTests.push('communication-skills', 'learning-style', 'memory');
  }
  
  if (subscaleSums.Quantitative_Reasoning <= 1) {
    recommendedTests.push('time-preference', 'analytical-skills');
  }

  return {
    totalScore,
    subscales: subscaleSums,
    interpretation,
    metadata: {
      level,
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Memory
 * Memory 12 سوال دارد
 * 4 زیرمقیاس: Working Memory, Short-Term Memory, Long-Term Memory, Prospective Memory
 * هر زیرمقیاس 3 سوال
 * 4 سوال reverse (4, 5, 7, 10)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس
 */
function calculateMemoryScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Working_Memory: [],
    Short_Term_Memory: [],
    Long_Term_Memory: [],
    Prospective_Memory: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Working_Memory' || 
        question.dimension === 'Short_Term_Memory' || 
        question.dimension === 'Long_Term_Memory' || 
        question.dimension === 'Prospective_Memory') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Working_Memory' || 
        subscale.name === 'Short_Term_Memory' || 
        subscale.name === 'Long_Term_Memory' || 
        subscale.name === 'Prospective_Memory'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 4 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 4;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Working_Memory >= 3.5) {
    interpretations.push('حافظه فعال بالا: توانایی خوب در نگه داشتن چند چیز همزمان، حل مسائل پیچیده');
  } else if (subscaleMeans.Working_Memory <= 2.4) {
    interpretations.push('حافظه فعال پایین: سختی در نگه داشتن چند چیز همزمان، سختی در حل مسأله‌های پیچیده، بیشتر در تمرکز و حل مسأله خودش را نشان می‌دهد');
  }
  
  if (subscaleMeans.Short_Term_Memory >= 3.5) {
    interpretations.push('حافظه کوتاه‌مدت بالا: یادآوری خوب چیزهای روزمره، به خاطر سپردن آنچه گفته شده');
  } else if (subscaleMeans.Short_Term_Memory <= 2.4) {
    interpretations.push('حافظه کوتاه‌مدت پایین: فراموش‌کاری‌های روزمره، یادش می‌رود کسی چی گفت، یا چی باید بیاره، "چی داشتم می‌گفتم؟" زیاد تکرار می‌شود');
  }
  
  if (subscaleMeans.Long_Term_Memory >= 3.5) {
    interpretations.push('حافظه بلندمدت بالا: یادآوری خوب جزئیات رویدادها، تاریخ‌ها، قرارهای مهم');
  } else if (subscaleMeans.Long_Term_Memory <= 2.4) {
    interpretations.push('حافظه بلندمدت پایین: یادآوری ضعیف جزئیات رویدادها، تاریخ‌ها، قرارهای مهم، احساس «خاطره‌ها تار شده‌اند»');
  }
  
  if (subscaleMeans.Prospective_Memory >= 3.5) {
    interpretations.push('حافظه آینده‌نگر بالا: یادآوری خوب کارهای آینده، قرارها، taskهای ساده');
  } else if (subscaleMeans.Prospective_Memory <= 2.4) {
    interpretations.push('حافظه آینده‌نگر پایین: یادش می‌رود کاری را بعداً انجام دهد، قرارهای آینده، خوردن دارو، taskهای ساده');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'پروفایل حافظه متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    // اگر نمره کلی پایین باشد
    recommendedTests.push('focus', 'maas', 'psqi', 'gad7', 'phq9');
  }
  
  if (subscaleMeans.Working_Memory <= 2.4) {
    recommendedTests.push('cognitive-iq', 'problem-solving');
  }
  
  if (subscaleMeans.Prospective_Memory <= 2.4) {
    recommendedTests.push('time-management', 'decision-making');
  }

  return {
    totalScore: totalScoreRounded,
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره SPIN (Social Phobia Inventory)
 * ⚠️ این تست متفاوت است: از 0 شروع می‌شود نه 1!
 * SPIN 17 سوال دارد
 * 3 زیرمقیاس (اختیاری): Fear, Avoidance, Physiological
 * بدون reverse
 * فرمت پاسخ: 5 گزینه‌ای (0-4) - از 0 شروع می‌شود!
 * نمره کل: مجموع 17 سوال (0-68)
 * Cutoff: 0-18 نرمال، 19-20 احتمال، 21-30 خفیف، 31-40 متوسط، 41-50 شدید، 51-68 بسیار شدید
 */
function calculateSPINScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // محاسبه نمره کل (مجموع 17 سوال)
  let totalScore = 0;
  
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 17) return;

    // ⚠️ در SPIN، optionIndex مستقیماً نمره است (0-4)
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
    interpretation = 'در این تست، الگوی پاسخ‌های تو نشون می‌ده که در حال حاضر نشانه‌های شدیدی از اضطراب اجتماعی نداری. با این حال اگر خودت احساس ناراحتی یا محدودیت می‌کنی، حتماً تجربه‌ی شخصی‌ات از عدد مهم‌تره.';
  } else if (totalScore <= 20) {
    level = 'احتمال اضطراب اجتماعی';
    interpretation = 'ممکنه اضطراب اجتماعی مؤثر روی زندگی‌ات داشته باشی. نیاز به دقت بیشتر.';
  } else if (totalScore <= 30) {
    level = 'خفیف';
    severity = 'mild';
    interpretation = 'بعضی موقعیت‌های اجتماعی احتمالاً برات استرس‌زا هستن و ممکنه روی روابط یا عملکردت تأثیر بذارن. این سطح از اضطراب، هم قابل درکه و هم معمولاً با چند مداخلهٔ ساده (تمرین، کتاب، یا چند جلسه مشاوره) قابل مدیریت شدنه.';
  } else if (totalScore <= 40) {
    level = 'متوسط';
    severity = 'moderate';
    interpretation = 'اضطراب اجتماعی احتمالاً بخش قابل توجهی از زندگی روزمره‌ات رو تحت تأثیر قرار داده. ممکنه از موقعیت‌ها اجتناب کنی یا خیلی درگیر قضاوت دیگران باشی. اینجا معمولاً صحبت با متخصص می‌تونه خیلی کمک‌کننده باشه.';
  } else {
    level = totalScore <= 50 ? 'شدید' : 'بسیار شدید';
    severity = 'severe';
    interpretation = 'به‌نظر می‌رسه اضطراب اجتماعی برایت جدی و فرساینده شده و احتمالاً روی شغل، تحصیل، یا روابط اثر گذاشته. این سطح از نمره معمولاً ارزش این رو داره که جدی‌تر به گزینه‌هایی مثل روان‌درمانی (به‌خصوص CBT) فکر کنی.';
  }

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScore >= 19) {
    // SPIN بالا
    recommendedTests.push('gad7', 'phq9', 'ucla-loneliness', 'communication-skills', 'teamwork', 'rosenberg', 'attachment');
  }

  return {
    totalScore,
    interpretation,
    severity,
    metadata: {
      level,
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره PSSS (Perceived Social Support Scale)
 * PSSS 12 سوال دارد
 * 3 زیرمقیاس: Family, Friends, Significant Other
 * هر زیرمقیاس 4 سوال
 * بدون reverse
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 12 سوال (1-5)
 */
function calculatePSSSScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Family: [],
    Friends: [],
    Significant_Other: [],
  };

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    const score = optionIndex + 1; // تبدیل 0-4 به 1-5
    // هیچ reverse ندارد

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Family' || 
        question.dimension === 'Friends' || 
        question.dimension === 'Significant_Other') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Family' || 
        subscale.name === 'Friends' || 
        subscale.name === 'Significant_Other'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 3 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 3;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Family >= 3.5) {
    interpretations.push('حمایت خانوادگی بالا: وجود پشتوانه خانوادگی، احساس تعلق، رابطه با والدین / خواهر و برادر');
  } else if (subscaleMeans.Family <= 2.4) {
    interpretations.push('حمایت خانوادگی پایین: کمبود حمایت خانوادگی، احساس فاصله از خانواده');
  }
  
  if (subscaleMeans.Friends >= 3.5) {
    interpretations.push('حمایت دوستان بالا: کیفیت روابط دوستانه، صمیمیت، دسترسی احساسی در مواقع نیاز');
  } else if (subscaleMeans.Friends <= 2.4) {
    interpretations.push('حمایت دوستان پایین: کمبود روابط دوستانه صمیمی، احساس تنهایی در روابط اجتماعی');
  }
  
  if (subscaleMeans.Significant_Other >= 3.5) {
    interpretations.push('حمایت شریک زندگی بالا: همسر / شریک زندگی / فرد مهم، احساس امنیت، توجه و صمیمیت، حمایت عاطفی مستقیم');
  } else if (subscaleMeans.Significant_Other <= 2.4) {
    interpretations.push('حمایت شریک زندگی پایین: کمبود حمایت از شریک زندگی یا فرد مهم، احساس تنهایی در رابطه');
  }

  // تفسیر نمره کلی
  if (totalScoreRounded >= 4.3) {
    interpretations.push('حمایت اجتماعی بسیار بالا: تاب‌آوری بیشتر، سلامت روان بهتر، سازگاری اجتماعی بالاتر');
  } else if (totalScoreRounded <= 2.4) {
    interpretations.push('حمایت اجتماعی پایین: احساس تنها بودن، ریسک بیشتر افسردگی/اضطراب، تمایل به انزوا');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'حمایت اجتماعی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('ucla-loneliness', 'attachment', 'communication-skills', 'phq9', 'gad7');
  }
  
  // بررسی اختلاف شدید بین زیرمقیاس‌ها
  const subscaleValues = [subscaleMeans.Family, subscaleMeans.Friends, subscaleMeans.Significant_Other];
  const maxSubscale = Math.max(...subscaleValues);
  const minSubscale = Math.min(...subscaleValues);
  const difference = maxSubscale - minSubscale;
  
  if (difference >= 1.5) {
    if (subscaleMeans.Family >= 3.5 && subscaleMeans.Friends <= 2.4) {
      recommendedTests.push('communication-skills', 'teamwork');
    }
    
    if (subscaleMeans.Significant_Other <= 2.4 && (subscaleMeans.Family >= 3.5 || subscaleMeans.Friends >= 3.5)) {
      recommendedTests.push('attachment', 'intimacy-skills');
    }
  }

  return {
    totalScore: totalScoreRounded,
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره General Health
 * General Health 12 سوال دارد
 * 4 زیرمقیاس: Physical Energy & Fatigue, Sleep Quality, Pain & Physical Discomfort, Daily Functioning
 * هر زیرمقیاس 3 سوال
 * 4 سوال reverse (5, 6, 7, 10)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 */
function calculateGeneralHealthScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Physical_Energy_Fatigue: [],
    Sleep_Quality: [],
    Pain_Physical_Discomfort: [],
    Daily_Functioning: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Physical_Energy_Fatigue' || 
        question.dimension === 'Sleep_Quality' || 
        question.dimension === 'Pain_Physical_Discomfort' || 
        question.dimension === 'Daily_Functioning') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Physical_Energy_Fatigue' || 
        subscale.name === 'Sleep_Quality' || 
        subscale.name === 'Pain_Physical_Discomfort' || 
        subscale.name === 'Daily_Functioning'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 4 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 4;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Physical_Energy_Fatigue >= 3.5) {
    interpretations.push('انرژی و خستگی خوب: انرژی کافی، احساس سرزندگی، عملکرد فیزیکی مناسب');
  } else if (subscaleMeans.Physical_Energy_Fatigue <= 2.4) {
    interpretations.push('انرژی و خستگی پایین: خستگی مداوم، افت تمرکز، کاهش عملکرد');
  }
  
  if (subscaleMeans.Sleep_Quality >= 3.5) {
    interpretations.push('کیفیت خواب خوب: خواب باکیفیت، استراحت کافی، بیداری سرحال');
  } else if (subscaleMeans.Sleep_Quality <= 2.4) {
    interpretations.push('کیفیت خواب پایین: خواب سبک، بیداری‌های مکرر، خواب ناکافی');
  }
  
  if (subscaleMeans.Pain_Physical_Discomfort >= 3.5) {
    interpretations.push('درد و ناراحتی جسمی کم: بدون درد یا ناراحتی جسمی، احساس راحتی فیزیکی');
  } else if (subscaleMeans.Pain_Physical_Discomfort <= 2.4) {
    interpretations.push('درد و ناراحتی جسمی بالا: سردرد، درد عضلانی، ناراحتی جسمی مزمن');
  }
  
  if (subscaleMeans.Daily_Functioning >= 3.5) {
    interpretations.push('عملکرد روزانه خوب: عملکرد روزانه مناسب، انرژی صبحگاهی خوب، بهره‌وری بالا');
  } else if (subscaleMeans.Daily_Functioning <= 2.4) {
    interpretations.push('عملکرد روزانه پایین: سختی در انجام کارهای روزمره، انرژی صبحگاهی پایین، بهره‌وری کم');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'سلامت کلی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Sleep_Quality <= 2.4) {
    recommendedTests.push('isi', 'psqi', 'stress-scale', 'maas');
  }
  
  if (subscaleMeans.Pain_Physical_Discomfort <= 2.4) {
    recommendedTests.push('stress-scale', 'gad7', 'psqi');
  }
  
  if (subscaleMeans.Physical_Energy_Fatigue <= 2.4) {
    recommendedTests.push('phq9', 'gad7', 'burnout-screening', 'psqi', 'maas');
  }
  
  if (subscaleMeans.Daily_Functioning <= 2.4) {
    recommendedTests.push('time-management', 'stress-scale', 'phq9');
  }

  return {
    totalScore: totalScoreRounded,
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Eating Habits
 * Eating Habits 12 سوال دارد
 * 4 زیرمقیاس: Meal Regularity, Healthy Food Choices, Emotional Eating, Portion Control
 * هر زیرمقیاس 3 سوال
 * 5 سوال reverse (3, 7, 8, 10, 11)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 */
function calculateEatingHabitsScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Meal_Regularity: [],
    Healthy_Food_Choices: [],
    Emotional_Eating: [],
    Portion_Control: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Meal_Regularity' || 
        question.dimension === 'Healthy_Food_Choices' || 
        question.dimension === 'Emotional_Eating' || 
        question.dimension === 'Portion_Control') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Meal_Regularity' || 
        subscale.name === 'Healthy_Food_Choices' || 
        subscale.name === 'Emotional_Eating' || 
        subscale.name === 'Portion_Control'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 4 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 4;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Meal_Regularity >= 3.5) {
    interpretations.push('نظم وعده‌های غذایی خوب: نظم وعده‌های غذایی، خوردن منظم صبحانه، زمان‌بندی مناسب');
  } else if (subscaleMeans.Meal_Regularity <= 2.4) {
    interpretations.push('نظم وعده‌های غذایی پایین: حذف صبحانه، دیر غذا خوردن، احتمال کاهش انرژی/تمرکز');
  }
  
  if (subscaleMeans.Healthy_Food_Choices >= 3.5) {
    interpretations.push('انتخاب غذای سالم خوب: انتخاب غذاهای سالم، مصرف میوه و سبزیجات، پرهیز از غذاهای فراوری‌شده');
  } else if (subscaleMeans.Healthy_Food_Choices <= 2.4) {
    interpretations.push('انتخاب غذای سالم پایین: مصرف زیاد غذاهای فراوری‌شده، قند زیاد، چربی‌های ناسالم');
  }
  
  if (subscaleMeans.Emotional_Eating >= 3.5) {
    interpretations.push('کنترل غذا خوردن احساسی خوب: کنترل احساسی غذا خوردن، عدم وابستگی غذا به احساسات');
  } else if (subscaleMeans.Emotional_Eating <= 2.4) {
    interpretations.push('غذا خوردن احساسی بالا: غذا خوردن برای فرار از احساسات، رابطهٔ احساسی-غذایی، ریسک اضافه‌وزن/استرس');
  }
  
  if (subscaleMeans.Portion_Control >= 3.5) {
    interpretations.push('کنترل حجم غذا خوب: کنترل حجم غذا، آگاهی از مقدار مصرف، تعادل در خوردن');
  } else if (subscaleMeans.Portion_Control <= 2.4) {
    interpretations.push('کنترل حجم غذا پایین: حجم زیاد، خوردن بدون آگاهی، ریسک چاقی/پرخوری');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'عادات غذایی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (subscaleMeans.Emotional_Eating <= 2.4) {
    recommendedTests.push('stress-scale', 'gad7', 'phq9');
  }
  
  if (subscaleMeans.Meal_Regularity <= 2.4) {
    recommendedTests.push('psqi', 'isi', 'time-management', 'general-health');
  }
  
  if (subscaleMeans.Healthy_Food_Choices <= 2.4) {
    recommendedTests.push('general-health', 'physical-activity');
  }

  return {
    totalScore: totalScoreRounded,
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Physical Activity
 * Physical Activity 12 سوال دارد
 * 4 زیرمقیاس: Activity Frequency, Activity Intensity, Sedentary Behavior, Strength & Mobility
 * هر زیرمقیاس 3 سوال
 * 5 سوال reverse (3, 6, 7, 8, 11)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 */
function calculatePhysicalActivityScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Activity_Frequency: [],
    Activity_Intensity: [],
    Sedentary_Behavior: [],
    Strength_Mobility: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Activity_Frequency' || 
        question.dimension === 'Activity_Intensity' || 
        question.dimension === 'Sedentary_Behavior' || 
        question.dimension === 'Strength_Mobility') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Activity_Frequency' || 
        subscale.name === 'Activity_Intensity' || 
        subscale.name === 'Sedentary_Behavior' || 
        subscale.name === 'Strength_Mobility'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 4 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 4;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Activity_Frequency >= 3.5) {
    interpretations.push('تعداد دفعات فعالیت خوب: فعالیت بدنی منظم، چند بار در هفته ورزش، سبک زندگی فعال');
  } else if (subscaleMeans.Activity_Frequency <= 2.4) {
    interpretations.push('تعداد دفعات فعالیت پایین: کمتر از ۲ بار ورزش در هفته، احتمال کاهش انرژی و افزایش استرس');
  }
  
  if (subscaleMeans.Activity_Intensity >= 3.5) {
    interpretations.push('شدت فعالیت خوب: فعالیت بدنی شدید، افزایش ضربان قلب، چالش فیزیکی مناسب');
  } else if (subscaleMeans.Activity_Intensity <= 2.4) {
    interpretations.push('شدت فعالیت پایین: ورزش سبک یا بدون چالش، نیاز به افزایش ضربان قلب/قدرت');
  }
  
  if (subscaleMeans.Sedentary_Behavior >= 3.5) {
    interpretations.push('کم‌تحرکی کم: کم‌تحرکی کم، نشستن محدود، سبک زندگی فعال');
  } else if (subscaleMeans.Sedentary_Behavior <= 2.4) {
    interpretations.push('کم‌تحرکی بالا: نشستن طولانی، ریسک چاقی، افسردگی، خستگی');
  }
  
  if (subscaleMeans.Strength_Mobility >= 3.5) {
    interpretations.push('قدرت و انعطاف خوب: قدرت بدنی خوب، انعطاف مناسب، توان انجام فعالیت‌ها');
  } else if (subscaleMeans.Strength_Mobility <= 2.4) {
    interpretations.push('قدرت و انعطاف پایین: ضعف بدنی، خشکی عضلانی، مشکل در فعالیت‌ها');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'فعالیت بدنی متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('isi', 'psqi', 'stress-scale', 'general-health', 'eating-habits');
  }
  
  if (subscaleMeans.Sedentary_Behavior <= 2.4) {
    recommendedTests.push('time-management', 'maas');
  }
  
  if (subscaleMeans.Activity_Intensity <= 2.4) {
    recommendedTests.push('health-motivation', 'self-discipline');
  }

  return {
    totalScore: totalScoreRounded,
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره Lifestyle Sleep Quality
 * Lifestyle Sleep Quality 12 سوال دارد
 * 4 زیرمقیاس: Sleep Duration, Sleep Depth & Restfulness, Sleep Routine & Habits, Daytime Sleepiness
 * هر زیرمقیاس 3 سوال
 * 7 سوال reverse (4, 5, 6, 7, 8, 10, 12)
 * فرمت پاسخ: 5 گزینه‌ای (1-5) - از 1 شروع می‌شود نه 0!
 * فرمول reverse: 6 - score
 * نمره هر زیرمقیاس: میانگین 1-5
 * نمره کلی: میانگین 4 زیرمقیاس (1-5)
 */
function calculateLifestyleSleepQualityScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  const subscaleScores: { [key: string]: number[] } = {
    Sleep_Duration: [],
    Sleep_Depth_Restfulness: [],
    Sleep_Routine_Habits: [],
    Daytime_Sleepiness: [],
  };
  const reverseSet = new Set(config.reverseItems || []);

  // محاسبه نمره هر سوال
  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question || questionOrder < 1 || questionOrder > 12) return;

    // تبدیل optionIndex (0-4) به نمره واقعی (1-5)
    let score = optionIndex + 1; // تبدیل 0-4 به 1-5

    // اگر reverse است، معکوس کن: 6 - score
    if (question.isReverse || reverseSet.has(questionOrder)) {
      score = 6 - score;
    }

    // اضافه کردن به subscale مربوطه
    if (question.dimension === 'Sleep_Duration' || 
        question.dimension === 'Sleep_Depth_Restfulness' || 
        question.dimension === 'Sleep_Routine_Habits' || 
        question.dimension === 'Daytime_Sleepiness') {
      subscaleScores[question.dimension].push(score);
    } else if (config.subscales) {
      // پیدا کردن subscale بر اساس questionOrder
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale && (
        subscale.name === 'Sleep_Duration' || 
        subscale.name === 'Sleep_Depth_Restfulness' || 
        subscale.name === 'Sleep_Routine_Habits' || 
        subscale.name === 'Daytime_Sleepiness'
      )) {
        subscaleScores[subscale.name].push(score);
      }
    }
  });

  // محاسبه میانگین برای هر زیرمقیاس
  const subscaleMeans: { [key: string]: number } = {};
  
  Object.entries(subscaleScores).forEach(([subscale, scores]) => {
    const sum = scores.reduce((acc, score) => acc + score, 0);
    const mean = scores.length > 0 ? sum / scores.length : 0;
    subscaleMeans[subscale] = Math.round(mean * 100) / 100; // 2 رقم اعشار
  });

  // محاسبه نمره کلی (میانگین 4 زیرمقیاس)
  const totalScore = Object.values(subscaleMeans).reduce((acc, mean) => acc + mean, 0) / 4;
  const totalScoreRounded = Math.round(totalScore * 100) / 100;

  // ساخت تفسیر بر اساس نمرات
  const interpretations: string[] = [];
  
  if (subscaleMeans.Sleep_Duration >= 3.5) {
    interpretations.push('مدت خواب خوب: مدت خواب کافی، استراحت مناسب، انرژی کافی');
  } else if (subscaleMeans.Sleep_Duration <= 2.4) {
    interpretations.push('مدت خواب پایین: خواب کم، خستگی مزمن، کاهش تمرکز');
  }
  
  if (subscaleMeans.Sleep_Depth_Restfulness >= 3.5) {
    interpretations.push('عمق خواب خوب: خواب عمیق، ریکاوری خوب، بیداری سرحال');
  } else if (subscaleMeans.Sleep_Depth_Restfulness <= 2.4) {
    interpretations.push('عمق خواب پایین: خواب سبک، بیدار شدن‌های مکرر، بی‌کیفیتی خواب');
  }
  
  if (subscaleMeans.Sleep_Routine_Habits >= 3.5) {
    interpretations.push('نظم خواب خوب: نظم خواب، ساعت خواب منظم، ریتم خواب سالم');
  } else if (subscaleMeans.Sleep_Routine_Habits <= 2.4) {
    interpretations.push('نظم خواب پایین: ساعت خواب نامنظم، شب بیداری، ریتم خواب به‌هم‌ریخته');
  }
  
  if (subscaleMeans.Daytime_Sleepiness >= 3.5) {
    interpretations.push('هوشیاری روزانه خوب: هوشیاری روزانه، انرژی کافی، بهره‌وری مناسب');
  } else if (subscaleMeans.Daytime_Sleepiness <= 2.4) {
    interpretations.push('خواب‌آلودگی روزانه بالا: خواب‌آلودگی شدید، کاهش بهره‌وری، نشانه قطعی اختلال خواب');
  }

  const interpretation = interpretations.length > 0 
    ? interpretations.join(' | ') 
    : 'کیفیت خواب متعادل';

  // پیشنهاد تست‌های تکمیلی
  const recommendedTests: string[] = [];
  
  if (totalScoreRounded <= 2.4) {
    recommendedTests.push('psqi', 'isi', 'stress-scale', 'phq9', 'gad7', 'physical-activity');
  }
  
  if (subscaleMeans.Daytime_Sleepiness <= 2.4) {
    recommendedTests.push('focus', 'general-health', 'work-life-balance', 'eating-habits');
  }

  return {
    totalScore: totalScoreRounded,
    subscales: subscaleMeans,
    interpretation,
    metadata: {
      recommendedTests: recommendedTests.length > 0 ? recommendedTests : undefined,
    },
  };
}

/**
 * محاسبه نمره PSS-10 (Perceived Stress Scale - 10 Items)
 */
function calculatePSS10Score(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/pss10-config');
    calculateFromConfig = configModule.calculatePSS10Score;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    severity: result.severity,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Learning Style Assessment
 */
function calculateLearningStyleScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/learning-style-config');
    calculateFromConfig = configModule.calculateLearningStyleScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Growth Mindset Assessment
 */
function calculateGrowthMindsetScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/growth-mindset-config');
    calculateFromConfig = configModule.calculateGrowthMindsetScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Curiosity & Openness Assessment
 */
function calculateCuriosityScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/curiosity-config');
    calculateFromConfig = configModule.calculateCuriosityScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Adaptability Assessment
 */
function calculateAdaptabilityScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/adaptability-config');
    calculateFromConfig = configModule.calculateAdaptabilityScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Innovation & Creative Action Assessment
 */
function calculateInnovationScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/innovation-config');
    calculateFromConfig = configModule.calculateInnovationScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Hobbies & Interests Profile
 */
function calculateHobbiesInterestsScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/hobbies-interests-config');
    calculateFromConfig = configModule.calculateHobbiesInterestsScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Personal Values Assessment
 */
function calculatePersonalValuesScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/personal-values-config');
    calculateFromConfig = configModule.calculatePersonalValuesScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      valueProfile: result.valueProfile,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Ideal Environment Profile
 */
function calculateIdealEnvironmentScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/ideal-environment-config');
    calculateFromConfig = configModule.calculateIdealEnvironmentScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره Lifestyle Harmony Assessment
 */
function calculateLifestyleHarmonyScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // Import تابع محاسبه از config
  let calculateFromConfig: any;
  try {
    const configModule = require('../test-configs/lifestyle-harmony-config');
    calculateFromConfig = configModule.calculateLifestyleHarmonyScore;
  } catch (e) {
    return calculateCustomScore(config, answers, questions);
  }
  
  if (!calculateFromConfig) {
    return calculateCustomScore(config, answers, questions);
  }
  
  // محاسبه نمره
  const result = calculateFromConfig(answers);
  
  // تبدیل به فرمت TestResult
  return {
    totalScore: result.totalScore,
    subscales: result.subscales,
    interpretation: result.interpretation,
    metadata: {
      cutoff: result.cutoff,
      subscaleInterpretations: result.subscaleInterpretations,
      ...(result.recommendedTests && { recommendedTests: result.recommendedTests }),
    },
  };
}

/**
 * محاسبه نمره سفارشی
 */
function calculateCustomScore(
  config: ScoringConfig,
  answers: Record<number, number>,
  questions: Array<{ order: number; dimension?: string | null; isReverse?: boolean }>
): TestResult {
  // برای تست‌های سفارشی، از weighting استفاده می‌کنیم
  let totalScore = 0;
  const subscales: { [key: string]: number } = {};
  const reverseItems = config.reverseItems || [];

  // مقداردهی اولیه subscales
  if (config.subscales) {
    config.subscales.forEach(subscale => {
      subscales[subscale.name] = 0;
    });
  }

  Object.entries(answers).forEach(([questionOrderStr, optionIndex]) => {
    const questionOrder = parseInt(questionOrderStr);
    const question = questions.find(q => q.order === questionOrder);
    
    if (!question) return;

    // استفاده از weighting اگر موجود باشد
    let score = optionIndex;
    
    if (config.weighting) {
      const optionKeys = ['strongly_disagree', 'disagree', 'neutral', 'agree', 'strongly_agree'];
      const optionKey = optionKeys[optionIndex];
      const weight = config.weighting[optionKey] || 0;
      score = weight;
    }

    // اگر سوال reverse است یا در لیست reverse items است
    if (question.isReverse || reverseItems.includes(questionOrder)) {
      // معکوس کردن: 4 - score
      score = 4 - score;
    }

    totalScore += score;

    // اضافه کردن به subscale مربوطه
    if (question.dimension && subscales.hasOwnProperty(question.dimension)) {
      subscales[question.dimension] = (subscales[question.dimension] || 0) + score;
    } else if (config.subscales) {
      const subscale = config.subscales.find(s => s.items.includes(questionOrder));
      if (subscale) {
        subscales[subscale.name] = (subscales[subscale.name] || 0) + score;
      }
    }
  });

  return {
    totalScore,
    subscales: Object.keys(subscales).length > 0 ? subscales : undefined,
  };
}

/**
 * ساخت config استاندارد برای MBTI
 */
export function createMBTIConfig(): ScoringConfig {
  return {
    type: 'mbti',
    dimensions: ['E/I', 'S/N', 'T/F', 'J/P'],
    weighting: {
      'strongly_disagree': -2,
      'disagree': -1,
      'neutral': 0,
      'agree': +1,
      'strongly_agree': +2,
    },
  };
}

