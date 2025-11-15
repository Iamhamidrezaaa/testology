/**
 * Helper functions برای کار با Interpretation
 */

import { ScoredResult } from "@/lib/scoring-engine-v2";
import { InterpretationChunk } from "@/types/interpretation";

/**
 * تبدیل Interpretation chunks به HTML (برای استفاده در PDF یا نمایش)
 */
export function chunksToHTML(chunks: InterpretationChunk[]): string {
  return chunks
    .map((chunk) => {
      const priorityClass = chunk.priority === "high" ? "high-priority" : "normal";
      const titleHTML = chunk.title ? `<h3 class="${priorityClass}">${chunk.title}</h3>` : "";
      return `
        <div class="interpretation-chunk ${priorityClass}" id="${chunk.id}">
          ${titleHTML}
          <p>${chunk.body}</p>
        </div>
      `;
    })
    .join("\n");
}

/**
 * تبدیل Interpretation chunks به Markdown
 */
export function chunksToMarkdown(chunks: InterpretationChunk[]): string {
  return chunks
    .map((chunk) => {
      const priority = chunk.priority === "high" ? "⚠️ " : "";
      const title = chunk.title ? `## ${priority}${chunk.title}\n\n` : "";
      return `${title}${chunk.body}\n\n---\n\n`;
    })
    .join("\n");
}

/**
 * فیلتر کردن chunks بر اساس testId
 */
export function filterByTestId(
  chunks: InterpretationChunk[],
  testId: string
): InterpretationChunk[] {
  return chunks.filter((chunk) => chunk.testId === testId);
}

/**
 * فیلتر کردن chunks با priority بالا
 */
export function getHighPriorityChunks(chunks: InterpretationChunk[]): InterpretationChunk[] {
  return chunks.filter((chunk) => chunk.priority === "high");
}

/**
 * گروه‌بندی chunks بر اساس testId
 */
export function groupByTestId(
  chunks: InterpretationChunk[]
): Record<string, InterpretationChunk[]> {
  const grouped: Record<string, InterpretationChunk[]> = {};
  
  for (const chunk of chunks) {
    if (!chunk.testId) continue;
    if (!grouped[chunk.testId]) {
      grouped[chunk.testId] = [];
    }
    grouped[chunk.testId].push(chunk);
  }
  
  return grouped;
}

/**
 * پیدا کردن chunks ترکیبی (cross-test)
 */
export function getCrossTestChunks(chunks: InterpretationChunk[]): InterpretationChunk[] {
  return chunks.filter((chunk) => chunk.id.startsWith("combo_"));
}

