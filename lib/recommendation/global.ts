/**
 * سیستم پیشنهاد تست‌های تکمیلی در سطح پروفایل کلی
 * این فایل بر اساس تمام تست‌های انجام‌شده کاربر، تست‌های بعدی را پیشنهاد می‌دهد
 */

import type { TestResult } from "@prisma/client";
import {
  MBTI_RECOMMENDATIONS,
  RIASEC_RECOMMENDATIONS,
  ATTACHMENT_RECOMMENDATIONS,
  LEARNING_STYLE_RECOMMENDATIONS,
} from "@/lib/interpretation/recommendations";

// نوع خروجی نهایی برای UI
export interface GlobalRecommendationItem {
  testId: string;
  reason: string;
  source: string; // از کجا اومده: "MBTI", "RIASEC", "GAD7", ...
  priority: number; // هرچی کمتر، مهم‌تر
}

export interface GlobalRecommendationsPayload {
  items: GlobalRecommendationItem[];
}

/**
 * کمک‌تابع: آخرین نتیجه‌ی یک تست خاص رو از بین همه نتایج پیدا می‌کنه
 * (case-insensitive و با تبدیل slug به testId)
 */
function findLatestResult(
  results: TestResult[],
  testId: string
): TestResult | null {
  const normalized = testId.toLowerCase();
  const filtered = results.filter((r) => {
    const rId = (r.testId || r.testSlug || "").toLowerCase();
    return rId === normalized || rId === testId.toLowerCase();
  });
  if (filtered.length === 0) return null;
  return filtered.sort(
    (a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
  )[0];
}

/**
 * کمک‌تابع: چک کنیم کاربر فلان تست رو تا حالا زده یا نه
 * (case-insensitive و با تبدیل slug به testId)
 */
function hasTest(results: TestResult[], testId: string): boolean {
  const normalized = testId.toLowerCase();
  return results.some((r) => {
    const rId = (r.testId || r.testSlug || "").toLowerCase();
    return rId === normalized || rId === testId.toLowerCase();
  });
}

/**
 * تحلیل سطح اضطراب بر اساس GAD7
 */
function gadSeverity(
  score: number | null
): "none" | "mild" | "moderate" | "severe" {
  if (score == null) return "none";
  if (score < 5) return "none";
  if (score < 10) return "mild";
  if (score < 15) return "moderate";
  return "severe";
}

/**
 * تحلیل سطح افسردگی بر اساس PHQ9
 */
function phqSeverity(
  score: number | null
):
  | "none"
  | "mild"
  | "moderate"
  | "moderately_severe"
  | "severe" {
  if (score == null) return "none";
  if (score < 5) return "none";
  if (score < 10) return "mild";
  if (score < 15) return "moderate";
  if (score < 20) return "moderately_severe";
  return "severe";
}

/**
 * اگر TestResult زیرمقیاس‌ها را به‌صورت JSON نگه می‌دارد، این‌جا پارس می‌کنیم.
 * subscales در TestResult به صورت JSON string ذخیره می‌شود
 */
function parseSubscales(result: TestResult): { id: string; score: number }[] {
  try {
    // بررسی فیلد subscales (که در submit route به صورت JSON.stringify ذخیره می‌شود)
    const raw = (result as any).subscales;
    if (raw) {
      if (Array.isArray(raw)) {
        // اگر قبلاً parse شده
        return raw.map((s: any) => ({
          id: s.id || s.subscaleId || String(s),
          score: typeof s === "object" ? s.score || s.value || 0 : 0,
        }));
      }
      if (typeof raw === "string") {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.map((s: any) => ({
            id: s.id || s.subscaleId || String(s),
            score: typeof s === "object" ? s.score || s.value || 0 : 0,
          }));
        }
      }
    }

    return [];
  } catch (e) {
    console.warn("Error parsing subscales:", e);
    return [];
  }
}

/**
 * محاسبه تیپ MBTI از روی زیرمقیاس‌ها (همون منطقی که تو هندلر استفاده کردیم)
 */
function getMbtiTypeFromResult(result: TestResult | null): string | null {
  if (!result) return null;
  const subs = parseSubscales(result);
  const ei = subs.find((s) => s.id === "EI");
  const sn = subs.find((s) => s.id === "SN");
  const tf = subs.find((s) => s.id === "TF");
  const jp = subs.find((s) => s.id === "JP");
  if (!ei || !sn || !tf || !jp) return null;

  const midpoint = 3;
  const eOrI = ei.score >= midpoint ? "E" : "I";
  const sOrN = sn.score >= midpoint ? "S" : "N";
  const tOrF = tf.score >= midpoint ? "T" : "F";
  const jOrP = jp.score >= midpoint ? "J" : "P";
  return `${eOrI}${sOrN}${tOrF}${jOrP}`;
}

/**
 * تیپ غالب RIASEC (مثلاً "A" یا "S")
 */
function getRiasecDominant(result: TestResult | null): string | null {
  if (!result) return null;
  const subs = parseSubscales(result);
  if (!subs.length) return null;
  const codes = ["R", "I", "A", "S", "E", "C"];
  const filtered = subs.filter((s) => codes.includes(s.id));
  if (!filtered.length) return null;
  const top = filtered.sort((a, b) => b.score - a.score)[0];
  return top.id;
}

/**
 * سبک دلبستگی غالب
 */
function getAttachmentStyle(result: TestResult | null): string | null {
  if (!result) return null;
  const subs = parseSubscales(result);
  const styles = ["secure", "anxious", "avoidant", "fearful"];
  const filtered = subs.filter((s) => styles.includes(s.id));
  if (!filtered.length) return null;
  const top = filtered.sort((a, b) => b.score - a.score)[0];
  return top.id;
}

/**
 * سبک یادگیری غالب
 */
function getLearningStyle(result: TestResult | null): string | null {
  if (!result) return null;
  const subs = parseSubscales(result);
  const styles = ["visual", "auditory", "kinesthetic", "reading_writing"];
  const filtered = subs.filter((s) => styles.includes(s.id));
  if (!filtered.length) return null;
  const top = filtered.sort((a, b) => b.score - a.score)[0];
  return top.id;
}

/**
 * تابع اصلی: از روی تمام TestResult‌های کاربر، چند تست بعدی را پیشنهاد می‌دهد.
 *
 * مهم: این تابع فقط محاسبه می‌کند؛ خودش چیزی را در DB ذخیره نمی‌کند.
 * نتیجه‌اش در API استفاده می‌شود و UI هر جایی (داشبورد، صفحه خانه) می‌تواند نشانش بدهد.
 */
export function buildGlobalRecommendations(
  results: TestResult[],
  limit: number = 6
): GlobalRecommendationsPayload {
  const recommendations: GlobalRecommendationItem[] = [];

  // ۱) قواعد تیپ‌محور: MBTI
  const mbtiResult = findLatestResult(results, "MBTI");
  const mbtiType = getMbtiTypeFromResult(mbtiResult);
  if (mbtiType && MBTI_RECOMMENDATIONS[mbtiType]) {
    const config = MBTI_RECOMMENDATIONS[mbtiType];
    config.items.forEach((item, index) => {
      if (!hasTest(results, item.testId)) {
        recommendations.push({
          testId: item.testId,
          reason: item.message,
          source: `MBTI (${mbtiType})`,
          priority: 10 + index,
        });
      }
    });
  }

  // ۲) قواعد تیپ‌محور: RIASEC
  const riasecResult = findLatestResult(results, "RIASEC");
  const riasecCode = getRiasecDominant(riasecResult);
  if (riasecCode && RIASEC_RECOMMENDATIONS[riasecCode]) {
    const config = RIASEC_RECOMMENDATIONS[riasecCode];
    config.items.forEach((item, index) => {
      if (!hasTest(results, item.testId)) {
        recommendations.push({
          testId: item.testId,
          reason: item.message,
          source: `RIASEC (${riasecCode})`,
          priority: 20 + index,
        });
      }
    });
  }

  // ۳) قواعد تیپ‌محور: Attachment
  const attachmentResult = findLatestResult(results, "Attachment");
  const attachmentStyle = getAttachmentStyle(attachmentResult);
  if (attachmentStyle && ATTACHMENT_RECOMMENDATIONS[attachmentStyle]) {
    const config = ATTACHMENT_RECOMMENDATIONS[attachmentStyle];
    config.items.forEach((item, index) => {
      if (item.testId && !hasTest(results, item.testId)) {
        recommendations.push({
          testId: item.testId,
          reason: item.message,
          source: `Attachment (${attachmentStyle})`,
          priority: 30 + index,
        });
      }
    });
  }

  // ۴) قواعد تیپ‌محور: Learning Style
  const lsResult = findLatestResult(results, "LearningStyle");
  const ls = getLearningStyle(lsResult);
  if (ls && LEARNING_STYLE_RECOMMENDATIONS[ls]) {
    const config = LEARNING_STYLE_RECOMMENDATIONS[ls];
    config.items.forEach((item, index) => {
      if (item.testId && !hasTest(results, item.testId)) {
        recommendations.push({
          testId: item.testId,
          reason: item.message,
          source: `LearningStyle (${ls})`,
          priority: 40 + index,
        });
      }
    });
  }

  // ۵) قواعد شدت علائم: اضطراب و افسردگی، مستقل از تیپ
  const gadResult = findLatestResult(results, "GAD7");
  const phqResult = findLatestResult(results, "PHQ9");
  const gad = gadSeverity(gadResult?.score ?? null);
  const phq = phqSeverity(phqResult?.score ?? null);

  if (
    (gad === "moderate" || gad === "severe") &&
    !hasTest(results, "PSS10")
  ) {
    recommendations.push({
      testId: "PSS10",
      reason:
        "سطح اضطراب در تست GAD-7 در محدوده‌ی متوسط یا شدید بوده؛ تست استرس کمک می‌کند تصویر دقیق‌تری از فشار کلی زندگیت داشته باشی.",
      source: "GAD7",
      priority: 5,
    });
  }

  if (
    (phq === "moderate" ||
      phq === "moderately_severe" ||
      phq === "severe") &&
    !hasTest(results, "SWLS")
  ) {
    recommendations.push({
      testId: "SWLS",
      reason:
        "در تست افسردگی PHQ-9 خلق پایین یا کاهش لذت دیده شده؛ تست رضایت از زندگی کمک می‌کند ببینی کدام بخش‌های زندگی بیشتر نیاز به توجه دارند.",
      source: "PHQ9",
      priority: 6,
    });
  }

  // ۶) اگر تعداد زیادی تست سلامت روان زده ولی Lifestyle نزده
  const mentalHealthTests = [
    "GAD7",
    "PHQ9",
    "HADS",
    "BAI",
    "DepressionBDI",
    "PSS10",
  ];
  const lifestyleTests = [
    "LifestyleHarmony",
    "PSQI",
    "LifestyleSleepQuality",
    "PhysicalActivity",
    "WorkLifeBalance",
  ];
  const mentalCount = results.filter((r) =>
    r.testId && mentalHealthTests.includes(r.testId)
  ).length;
  const lifestyleCount = results.filter((r) =>
    r.testId && lifestyleTests.includes(r.testId)
  ).length;

  if (mentalCount >= 2 && lifestyleCount === 0) {
    if (!hasTest(results, "LifestyleHarmony")) {
      recommendations.push({
        testId: "LifestyleHarmony",
        reason:
          "تا الان بیشتر روی سلامت روان تمرکز کرده‌ای؛ این تست کمک می‌کند تصویر کلی‌تری از تعادل سبک زندگیت (خواب، تغذیه، حرکت، کار و…) داشته باشی.",
        source: "Cross: Mental vs Lifestyle",
        priority: 15,
      });
    }
  }

  // ۷) اگر استرس بالا باشد ولی Work-Life Balance نزده
  const pssResult = findLatestResult(results, "PSS10");
  if (
    pssResult &&
    pssResult.score !== null &&
    pssResult.score >= 27 &&
    !hasTest(results, "WorkLifeBalance")
  ) {
    recommendations.push({
      testId: "WorkLifeBalance",
      reason:
        "سطح استرس در تست PSS-10 بالا است؛ تست تعادل کار-زندگی کمک می‌کند ببینی آیا فشار کاری یا عدم تعادل در زندگی باعث این استرس شده.",
      source: "PSS10",
      priority: 7,
    });
  }

  // ۸) اگر خواب بد باشد ولی Lifestyle Harmony نزده
  const psqiResult = findLatestResult(results, "PSQI");
  if (
    psqiResult &&
    psqiResult.score !== null &&
    psqiResult.score >= 8 &&
    !hasTest(results, "LifestyleHarmony")
  ) {
    recommendations.push({
      testId: "LifestyleHarmony",
      reason:
        "کیفیت خواب در تست PSQI پایین است؛ تست سبک زندگی کلی کمک می‌کند ببینی آیا عوامل دیگری (استرس، تغذیه، فعالیت) روی خوابت اثر گذاشته.",
      source: "PSQI",
      priority: 8,
    });
  }

  // حذف تست‌های تکراری با testId یکسان، نگه داشتن بالاترین اولویت
  const uniqueMap = new Map<string, GlobalRecommendationItem>();
  for (const rec of recommendations) {
    const exists = uniqueMap.get(rec.testId);
    if (!exists || rec.priority < exists.priority) {
      uniqueMap.set(rec.testId, rec);
    }
  }

  const uniqueList = Array.from(uniqueMap.values()).sort(
    (a, b) => a.priority - b.priority
  );

  return {
    items: uniqueList.slice(0, limit),
  };
}

