// lib/tests/dedupeQuestions.ts

export interface BaseQuestion {
  id?: number | string;
  question?: string;
  text?: string;
  title?: string;
  [key: string]: any;
}

// نرمال‌سازی متن سوال برای مقایسه
function normalizeQuestionText(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .toLowerCase()
    .replace(/\s+/g, " ")        // چند فاصله → یکی
    .replace(/[؟?!.،,:؛]/g, "")  // حذف علائم رایج
    .replace(/می‌/gi, "می")      // نرمال‌سازی "می‌" و "می"
    .replace(/می /gi, "می")
    .replace(/ها/gi, "ه")        // جمع و مفرد را یکسان می‌کنیم
    .replace(/ترجیح می‌دهید/gi, "ترجیح می‌دهی")  // نرمال‌سازی فعل
    .replace(/ترجیح می‌دهی/gi, "ترجیح می‌دهی")
    .trim();
}

// حذف سوال‌های تکراری بر اساس متن
export function dedupeQuestions<T extends BaseQuestion>(questions: T[]): T[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    return questions;
  }

  const seen = new Set<string>();
  const result: T[] = [];
  let duplicatesCount = 0;

  for (const q of questions) {
    const rawText =
      q.text || q.question || q.title || "";

    if (!rawText || typeof rawText !== "string") {
      // اگر سوال متن نداره، بی‌خیالش نمی‌شیم؛ می‌ذاریم بمونه
      result.push(q);
      continue;
    }

    const key = normalizeQuestionText(rawText);

    if (seen.has(key)) {
      // یعنی همین سوال (با همین متن) قبلاً بوده → حذفش کن
      duplicatesCount++;
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        console.log(`[DEDUPE] حذف سوال تکراری: "${rawText.substring(0, 50)}..."`);
      }
      continue;
    }

    seen.add(key);
    result.push(q);
  }

  if (duplicatesCount > 0 && typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    console.log(`[DEDUPE] ${duplicatesCount} سوال تکراری حذف شد از ${questions.length} سوال`);
  }

  return result;
}

