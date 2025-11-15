/**
 * Scoring Engine v2.0 - موتور مرکزی نمره‌دهی Testology
 * ساختار ساده، قابل نگهداری و یکپارچه برای تمام 49 تست
 */

import { TestConfig, SubscaleConfig, CutoffBand, RecommendationRule } from "@/types/test-scoring";

// Import configهای تست‌ها از index
import { TEST_CONFIGS as IMPORTED_CONFIGS } from "@/config/tests";

const TEST_CONFIGS: Record<string, TestConfig> = IMPORTED_CONFIGS;

export interface AnswerInput {
  questionId: number;
  value: number; // مقدار خامی که از UI می‌گیری (0–3 یا 1–5 و ...)
}

export interface SubscaleScore {
  id: string;
  label: string;
  score: number;
}

export interface ScoredResult {
  testId: string;
  title: string;
  totalScore: number;
  totalLevelId: string | null;
  totalLevelLabel: string | null;
  interpretation: string | null;
  subscales: SubscaleScore[];
  rawAnswers: AnswerInput[];
  recommendedTests: string[];
  recommendationMessages: string[];
}

/**
 * اعمال Reverse scoring
 */
function applyReverse(
  value: number,
  questionId: number,
  config: TestConfig
): number {
  if (!config.reverseItems.includes(questionId)) return value;

  // فرمول کلی: min + max - value
  // برای 0–3 → 0+3 - v = 3-v
  // برای 1–5 → 1+5 - v = 6-v
  return config.scaleMin + config.scaleMax - value;
}

/**
 * محاسبه نمره یک زیرمقیاس
 */
function scoreSubscale(
  answers: AnswerInput[],
  subscale: SubscaleConfig,
  config: TestConfig
): number {
  const relevant = subscale.items
    .map((qId) => answers.find((a) => a.questionId === qId))
    .filter((a): a is AnswerInput => !!a);

  if (relevant.length === 0) return NaN;

  const scored = relevant.map((ans) =>
    applyReverse(ans.value, ans.questionId, config)
  );

  const sum = scored.reduce((s, v) => s + v, 0);

  return config.scoringType === "sum" ? sum : sum / scored.length;
}

/**
 * پیدا کردن Level بر اساس Cutoff
 */
function findLevel(
  cutoffs: CutoffBand[],
  total: number
): { id: string | null; label: string | null } {
  for (const band of cutoffs) {
    if (total >= band.min && total <= band.max) {
      return { id: band.id, label: band.label };
    }
  }
  return { id: null, label: null };
}

/**
 * ارزیابی Recommendation Rules
 */
function evaluateRecommendations(
  config: TestConfig,
  totalScore: number,
  subscales: SubscaleScore[]
): { tests: string[]; messages: string[] } {
  if (!config.recommendations) return { tests: [], messages: [] };

  const tests = new Set<string>();
  const messages: string[] = [];

  for (const rule of config.recommendations) {
    let ok = true;
    for (const cond of rule.conditions) {
      let val: number;
      if (cond.target === "total") {
        val = totalScore;
      } else {
        const ss = subscales.find((s) => s.id === cond.subscaleId);
        if (!ss) {
          ok = false;
          break;
        }
        val = ss.score;
      }

      switch (cond.comparator) {
        case "lt":
          if (!(val < cond.value)) ok = false;
          break;
        case "lte":
          if (!(val <= cond.value)) ok = false;
          break;
        case "gt":
          if (!(val > cond.value)) ok = false;
          break;
        case "gte":
          if (!(val >= cond.value)) ok = false;
          break;
      }
      if (!ok) break;
    }

    if (ok) {
      rule.recommendTests.forEach((t) => tests.add(t));
      if (rule.message) messages.push(rule.message);
    }
  }

  return { tests: Array.from(tests), messages };
}

/**
 * تابع اصلی نمره‌دهی
 */
export function scoreTest(
  testId: string,
  answers: AnswerInput[]
): ScoredResult {
  const config = TEST_CONFIGS[testId];
  if (!config) {
    throw new Error(`Unknown testId: ${testId}`);
  }

  // 1) زیرمقیاس‌ها
  const subscales: SubscaleScore[] = config.subscales.map((s) => ({
    id: s.id,
    label: s.label,
    score: scoreSubscale(answers, s, config),
  }));

  // 2) نمره کلی
  let totalScore: number;
  if (config.scoringType === "sum") {
    const allItems = config.subscales.flatMap((s) => s.items);
    const uniqueItems = Array.from(new Set(allItems));

    const relevant = uniqueItems
      .map((qId) => answers.find((a) => a.questionId === qId))
      .filter((a): a is AnswerInput => !!a);

    const scored = relevant.map((ans) =>
      applyReverse(ans.value, ans.questionId, config)
    );
    totalScore = scored.reduce((s, v) => s + v, 0);
  } else {
    const valid = subscales.filter((s) => !Number.isNaN(s.score));
    const sum = valid.reduce((s, v) => s + v.score, 0);
    totalScore = valid.length ? sum / valid.length : NaN;
  }

  // 3) level
  const { id: levelId, label: levelLabel } = findLevel(
    config.cutoffs,
    totalScore
  );

  // 4) تفسیر
  const interpretation = levelId && config.interpretationByLevel
    ? config.interpretationByLevel[levelId] || null
    : null;

  // 5) توصیه‌ها
  const { tests, messages } = evaluateRecommendations(
    config,
    totalScore,
    subscales
  );

  return {
    testId: config.id,
    title: config.title,
    totalScore: Math.round(totalScore * 100) / 100, // 2 رقم اعشار
    totalLevelId: levelId,
    totalLevelLabel: levelLabel,
    interpretation,
    subscales: subscales.map(s => ({
      ...s,
      score: Math.round(s.score * 100) / 100,
    })),
    rawAnswers: answers,
    recommendedTests: tests,
    recommendationMessages: messages,
  };
}

/**
 * دریافت لیست تمام تست‌های موجود
 */
export function getAvailableTests(): string[] {
  return Object.keys(TEST_CONFIGS);
}

/**
 * دریافت Config یک تست
 */
export function getTestConfig(testId: string): TestConfig | null {
  return TEST_CONFIGS[testId] || null;
}

/**
 * Debug Interface برای نمایش جزئیات نمره‌دهی
 */
export interface DebugItem {
  questionId: number;
  text?: string;
  raw: number;
  reverse: boolean;
  normalized: number;
  weight: number;
  weighted: number;
  subscale?: string;
}

export interface DebugResult {
  testId: string;
  config: {
    scaleMin: number;
    scaleMax: number;
    scoringType: "sum" | "average";
    reverseItems: number[];
  };
  items: DebugItem[];
  subscales: {
    id: string;
    label: string;
    items: number[];
    score: number;
  }[];
  totalScore: number;
  totalLevelId: string | null;
  totalLevelLabel: string | null;
}

/**
 * محاسبه نمره با جزئیات Debug
 */
export function scoreTestWithDebug(
  testId: string,
  answers: AnswerInput[],
  questionTexts?: Record<number, string>
): { result: ScoredResult; debug: DebugResult } {
  const config = TEST_CONFIGS[testId];
  if (!config) {
    throw new Error(`Unknown testId: ${testId}`);
  }

  const debugItems: DebugItem[] = [];
  const reverseSet = new Set(config.reverseItems);

  // محاسبه نمره هر سوال با جزئیات
  const allItems = config.subscales.flatMap((s) => s.items);
  const uniqueItems = Array.from(new Set(allItems));

  for (const qId of uniqueItems) {
    const answer = answers.find((a) => a.questionId === qId);
    if (!answer) continue;

    const raw = answer.value;
    const reverse = reverseSet.has(qId);
    const normalized = reverse
      ? config.scaleMin + config.scaleMax - raw
      : raw;
    const weight = 1; // فعلاً همه وزن‌ها 1 هستند، می‌توان بعداً اضافه کرد
    const weighted = normalized * weight;

    // پیدا کردن subscale مربوطه
    const subscale = config.subscales.find((s) => s.items.includes(qId));

    debugItems.push({
      questionId: qId,
      text: questionTexts?.[qId],
      raw,
      reverse,
      normalized,
      weight,
      weighted,
      subscale: subscale?.id,
    });
  }

  // محاسبه subscales
  const subscales: SubscaleScore[] = config.subscales.map((s) => ({
    id: s.id,
    label: s.label,
    score: scoreSubscale(answers, s, config),
  }));

  // محاسبه نمره کلی
  let totalScore: number;
  if (config.scoringType === "sum") {
    const relevant = uniqueItems
      .map((qId) => answers.find((a) => a.questionId === qId))
      .filter((a): a is AnswerInput => !!a);

    const scored = relevant.map((ans) =>
      applyReverse(ans.value, ans.questionId, config)
    );
    totalScore = scored.reduce((s, v) => s + v, 0);
  } else {
    const valid = subscales.filter((s) => !Number.isNaN(s.score));
    const sum = valid.reduce((s, v) => s + v.score, 0);
    totalScore = valid.length ? sum / valid.length : NaN;
  }

  // پیدا کردن level
  const { id: levelId, label: levelLabel } = findLevel(
    config.cutoffs,
    totalScore
  );

  // تفسیر
  const interpretation = levelId && config.interpretationByLevel
    ? config.interpretationByLevel[levelId] || null
    : null;

  // توصیه‌ها
  const { tests, messages } = evaluateRecommendations(
    config,
    totalScore,
    subscales
  );

  const result: ScoredResult = {
    testId: config.id,
    title: config.title,
    totalScore: Math.round(totalScore * 100) / 100,
    totalLevelId: levelId,
    totalLevelLabel: levelLabel,
    interpretation,
    subscales: subscales.map(s => ({
      ...s,
      score: Math.round(s.score * 100) / 100,
    })),
    rawAnswers: answers,
    recommendedTests: tests,
    recommendationMessages: messages,
  };

  const debug: DebugResult = {
    testId: config.id,
    config: {
      scaleMin: config.scaleMin,
      scaleMax: config.scaleMax,
      scoringType: config.scoringType,
      reverseItems: config.reverseItems,
    },
    items: debugItems,
    subscales: subscales.map((s, idx) => ({
      id: s.id,
      label: s.label,
      items: config.subscales[idx].items,
      score: s.score,
    })),
    totalScore: Math.round(totalScore * 100) / 100,
    totalLevelId: levelId,
    totalLevelLabel: levelLabel,
  };

  return { result, debug };
}

