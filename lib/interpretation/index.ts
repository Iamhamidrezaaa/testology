/**
 * موتور اصلی Interpretation چندلایه Testology
 * 
 * این فایل تمام تفسیرهای تک‌تست و ترکیبی را جمع می‌کند
 * و یک گزارش انسانی و چندلایه می‌سازد
 */

import type { ScoredResult } from "@/lib/scoring-engine-v2";
import type { InterpretationChunk } from "@/types/interpretation";
import { TEST_INTERPRETATION_HANDLERS, fallbackInterpretation } from "./handlers";
import { CROSS_RULES } from "./cross-rules";

export interface InterpretationResult {
  chunks: InterpretationChunk[];
  summary?: string;
}

/**
 * ساخت Interpretation چندلایه از نتایج تست‌ها
 * 
 * @param results آرایه نتایج تست‌های انجام شده
 * @returns InterpretationResult شامل chunks تفسیر
 */
export function buildInterpretation(results: ScoredResult[]): InterpretationResult {
  const chunks: InterpretationChunk[] = [];

  // ۱) تفسیر تک‌تستی
  for (const r of results) {
    const handler = TEST_INTERPRETATION_HANDLERS[r.testId] || fallbackInterpretation;
    const localChunks = handler(r);
    chunks.push(...localChunks);
  }

  // ۲) تفسیر ترکیبی (Cross-test Rules)
  for (const rule of CROSS_RULES) {
    if (rule.applies(results)) {
      chunks.push(rule.build(results));
    }
  }

  // ۳) مرتب‌سازی براساس priority (high بیاد بالاتر)
  const sortedChunks = chunks.sort((a, b) => {
    const ap = a.priority === "high" ? 1 : 0;
    const bp = b.priority === "high" ? 1 : 0;
    return bp - ap;
  });

  return {
    chunks: sortedChunks,
    summary: buildSummary(sortedChunks),
  };
}

/**
 * ساخت خلاصه از Interpretation
 * (اختیاری - برای استفاده در UI)
 */
export function buildSummary(chunks: InterpretationChunk[]): string {
  const highPriorityChunks = chunks.filter((c) => c.priority === "high");
  
  if (highPriorityChunks.length > 0) {
    return `بر اساس نتایج تست‌ها، ${highPriorityChunks.length} مورد مهم نیاز به توجه دارد.`;
  }
  
  return `نتایج تست‌ها نشان می‌دهد که در برخی حوزه‌ها نیاز به توجه و بهبود وجود دارد.`;
}

/**
 * Export helper برای استفاده در API
 */
export { TEST_INTERPRETATION_HANDLERS } from "./handlers";
export { CROSS_RULES } from "./cross-rules";

