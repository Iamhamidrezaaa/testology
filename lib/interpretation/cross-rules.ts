/**
 * قوانین تفسیری چندتستی (Cross-Test Rules)
 * این قوانین الگوهای ترکیبی بین چند تست را شناسایی می‌کنند
 * و تفسیرهای هوشمند و انسانی ارائه می‌دهند
 */

import type { CrossTestRule, InterpretationChunk } from "@/types/interpretation";
import type { ScoredResult } from "@/lib/scoring-engine-v2";

function getResult(testId: string, results: ScoredResult[]) {
  return results.find((r) => r.testId === testId);
}

export const CROSS_RULES: CrossTestRule[] = [
  {
    id: "anxiety_depression_stress_sleep_lifestyle",
    applies: (results) => {
      const gad = getResult("GAD7", results);
      const phq = getResult("PHQ9", results);
      const pss = getResult("PSS", results) || getResult("StressPSS", results) || getResult("PSS10", results);
      const sleep = getResult("LifestyleSleep", results) || getResult("LifestyleSleepQuality", results);
      const lifestyle = getResult("LifestyleHarmony", results);

      if (!gad || !phq || !pss || !sleep || !lifestyle) return false;

      const gadMidHigh =
        gad.totalLevelId === "moderate" || gad.totalLevelId === "severe";

      const phqMidHigh =
        phq.totalLevelId === "moderate" ||
        phq.totalLevelId === "moderately_severe" ||
        phq.totalLevelId === "severe";

      const stressMidHigh =
        pss.totalLevelId === "medium" || pss.totalLevelId === "high";

      const sleepLow = sleep.totalLevelId === "low";
      const lifestyleNotHigh =
        lifestyle.totalLevelId === "low" || lifestyle.totalLevelId === "medium";

      return gadMidHigh && phqMidHigh && stressMidHigh && sleepLow && lifestyleNotHigh;
    },
    build: (results): InterpretationChunk => ({
      id: "combo_emotional_load",
      title: "فشار چندلایه روی ذهن و بدن",
      priority: "high",
      body:
        "ترکیب نتایج اضطراب، افسردگی، استرس، خواب و سبک زندگی نشان می‌دهد که ذهن و بدن تو مدت‌هاست زیر یک فشار چندلایه کار می‌کنند. " +
        "این فقط «یک تست بالا» نیست؛ بیشتر شبیه وضعیتی است که در آن به‌سختی می‌توانی به‌طور کامل خاموش شوی و فرصت ریکاوری عمیق پیدا کنی. " +
        "اگر مدام احساس خستگی، بی‌حوصلگی، نگرانی یا بی‌خوابی داری، این تست‌ها دقیقاً همین داستان را تأیید می‌کنند. " +
        "این وضعیت قابل تغییر است، ولی معمولاً به ترکیبی از چند کار هم‌زمان نیاز دارد: بهبود خواب، سبک زندگی، مدیریت استرس و اگر امکانش را داری صحبت با یک متخصص.",
    }),
  },
  {
    id: "work_life_stress",
    applies: (results) => {
      const wlb = getResult("WorkLifeBalance", results);
      const lifestyle = getResult("LifestyleHarmony", results);
      const pss = getResult("PSS", results) || getResult("StressPSS", results) || getResult("PSS10", results);
      if (!wlb || !lifestyle || !pss) return false;

      const wlbLow = wlb.totalLevelId === "low";

      const lifestyleNotHigh =
        lifestyle.totalLevelId === "low" || lifestyle.totalLevelId === "medium";
      const stressMidHigh =
        pss.totalLevelId === "medium" || pss.totalLevelId === "high";

      return wlbLow && lifestyleNotHigh && stressMidHigh;
    },
    build: (): InterpretationChunk => ({
      id: "combo_work_life_stress",
      title: "شغل، استرس و سبک زندگی",
      body:
        "نتایج نشان می‌دهد که رابطه‌ی بین کار و زندگی شخصی‌ات یکی از منابع اصلی فشار است. " +
        "این فقط «استرس کاری» نیست؛ احتمالاً کار، زمان و انرژی‌ای را مصرف می‌کند که باید برای استراحت، رابطه‌ها و خودت کنار گذاشته می‌شد. " +
        "اگر مدام احساس می‌کنی یا عقب‌مانده‌ای، یا خسته‌ای، یا در حال جبران هستی، این الگو با نتایج تست‌ها هم‌خوانی دارد. " +
        "مرزبندی نرم با کار، اضافه‌کردن زمان‌های استراحت واقعی و نه‌گفتن به بعضی توقع‌ها، می‌تواند کم‌کم این چرخه را تغییر دهد.",
    }),
  },
];
