/**
 * تفسیر تست Personal Values (ارزش‌های شخصی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const PERSONAL_VALUES_INTERPRETATION: TestInterpretationConfig = {
  testId: "PersonalValues",
  byLevel: {
    low: (r) => ({
      id: "values_low",
      title: "ارزش‌های شخصی",
      body: "نمره پایین یعنی ارزش‌های شخصی‌ات در حال حاضر کمتر مشخص یا پررنگ هستند.",
      testId: "PersonalValues",
    }),
    medium: (r) => ({
      id: "values_medium",
      title: "ارزش‌های شخصی متوسط",
      body: "نمره متوسط یعنی بعضی ارزش‌ها در زندگی‌ات پررنگ هستند و بعضی دیگر کمتر.",
      testId: "PersonalValues",
    }),
    high: (r) => ({
      id: "values_high",
      title: "ارزش‌های شخصی خوب",
      body: "نمره بالا یعنی ارزش‌های شخصی‌ات نسبتاً مشخص و پررنگ هستند.",
      testId: "PersonalValues",
    }),
    very_high: (r) => ({
      id: "values_very_high",
      title: "ارزش‌های شخصی عالی",
      body: "نمره بسیار بالا نشان می‌دهد که ارزش‌های شخصی‌ات بسیار مشخص و قوی هستند.",
      testId: "PersonalValues",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    const selfEnhancement = result.subscales.find(s => s.id === "self_enhancement");
    if (selfEnhancement && selfEnhancement.score >= 3.5) {
      chunks.push({
        id: "values_se_high",
        title: "پیشرفت فردی",
        body: "برای تو پیشرفت فردی، موفقیت و دیده‌شدن ارزش مهمی است و انرژی قابل‌توجهی برای رسیدن به اهدافت صرف می‌کنی.",
        testId: "PersonalValues",
      });
    }

    const selfTranscendence = result.subscales.find(s => s.id === "self_transcendence");
    if (selfTranscendence && selfTranscendence.score >= 3.5) {
      chunks.push({
        id: "values_st_high",
        title: "دیگرگرایی",
        body: "کمک به دیگران، معنا، اخلاق و اثر مثبت روی اطرافیان برایت ارزش برجسته‌ای است.",
        testId: "PersonalValues",
      });
    }

    const openness = result.subscales.find(s => s.id === "openness_to_change");
    if (openness && openness.score >= 3.5) {
      chunks.push({
        id: "values_openness_high",
        title: "گشودگی به تغییر",
        body: "آزادی، تجربه‌های جدید، سفر، یادگیری و تغییر برایت جذاب و باانرژی است.",
        testId: "PersonalValues",
      });
    }

    const conservation = result.subscales.find(s => s.id === "conservation");
    if (conservation && conservation.score >= 3.5) {
      chunks.push({
        id: "values_conservation_high",
        title: "ثبات و امنیت",
        body: "ثبات، امنیت، قابل‌پیش‌بینی بودن و نظم برایت ارزش‌های کلیدی هستند و به تو احساس آرامش می‌دهند.",
        testId: "PersonalValues",
      });
    }

    return chunks;
  },
};

