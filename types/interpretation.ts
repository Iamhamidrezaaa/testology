/**
 * Type definitions for Interpretation Engine
 * لایه تفسیر حرفه‌ای Testology
 */

import type { ScoredResult } from "@/lib/scoring-engine-v2";

/**
 * یک chunk تفسیر - واحد اصلی متن تفسیر
 */
export interface InterpretationChunk {
  id: string;
  title?: string;
  body: string;
  priority?: "normal" | "high";
  // برای جداکردن تحلیل اصلی از پیشنهاد تست‌ها
  kind?: "analysis" | "recommendation";
}

/**
 * Handler برای تفسیر یک تست خاص
 */
export interface TestInterpretationHandler {
  (result: ScoredResult): InterpretationChunk[];
}

/**
 * قانون ترکیبی بین چند تست
 */
export interface CrossTestRule {
  id: string;
  applies: (results: ScoredResult[]) => boolean;
  build: (results: ScoredResult[]) => InterpretationChunk;
}
