/**
 * تفسیر تست PANAS (Positive and Negative Affect Schedule)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const PANAS_INTERPRETATION: TestInterpretationConfig = {
  testId: "PANAS",
  byLevel: {
    low: (r) => ({
      id: "panas_low",
      title: "عاطفه",
      body: "در این بازه زمانی، احساسات مثبت و منفی در سطح پایینی قرار دارند.",
      testId: "PANAS",
    }),
    medium: (r) => ({
      id: "panas_medium",
      title: "عاطفه",
      body: "در این بازه زمانی، ترکیبی از احساسات مثبت و منفی را تجربه می‌کنی.",
      testId: "PANAS",
    }),
    high: (r) => ({
      id: "panas_high",
      title: "عاطفه",
      body: "در این بازه زمانی، احساسات قوی و شدیدی را تجربه می‌کنی.",
      testId: "PANAS",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    const positiveAffect = result.subscales.find(s => s.id === "positive_affect");
    if (positiveAffect) {
      if (positiveAffect.score <= 20) {
        chunks.push({
          id: "panas_pa_low",
          title: "عاطفه مثبت",
          body: "نمره پایین در عاطفه مثبت یعنی در این بازهٔ زمانی کمتر احساس شوق، لذت، هیجان مثبت یا انگیزه را تجربه کرده‌ای. این می‌تواند به خستگی، فشار یا شرایط محیطی هم مربوط باشد.",
          testId: "PANAS",
        });
      } else if (positiveAffect.score <= 35) {
        chunks.push({
          id: "panas_pa_medium",
          title: "عاطفه مثبت",
          body: "نمره متوسط یعنی ترکیبی از لحظات خوب و خنثی/سرد را تجربه می‌کنی، بدون این‌که هیچ‌کدام خیلی غالب باشند.",
          testId: "PANAS",
        });
      } else {
        chunks.push({
          id: "panas_pa_high",
          title: "عاطفه مثبت",
          body: "نمره بالا یعنی زندگی‌ات در این دوره پر از لحظات مثبت، انگیزه، علاقه و درگیرشدن با فعالیت‌های معنادار بوده است.",
          testId: "PANAS",
        });
      }
    }

    const negativeAffect = result.subscales.find(s => s.id === "negative_affect");
    if (negativeAffect) {
      if (negativeAffect.score <= 20) {
        chunks.push({
          id: "panas_na_low",
          title: "عاطفه منفی",
          body: "سطح عاطفه منفی پایین است؛ یعنی احساس‌هایی مثل خشم، شرم، ترس یا غم شدید در این دوره کمتر غالب بوده‌اند.",
          testId: "PANAS",
        });
      } else if (negativeAffect.score <= 35) {
        chunks.push({
          id: "panas_na_medium",
          title: "عاطفه منفی",
          body: "مقداری عاطفه منفی حضور دارد، اما نه در حدی که کاملاً فضا را قبضه کند.",
          testId: "PANAS",
        });
      } else {
        chunks.push({
          id: "panas_na_high",
          title: "عاطفه منفی",
          priority: "high",
          body: "عاطفه منفی بالا یعنی احساس‌های ناخوشایند، سهم قابل توجهی از فضای روانی‌ات را گرفته‌اند. این لزوماً به معنی بیماری نیست؛ اما نشانه‌ای است که فشارها، تعارض‌ها یا کمبود ریکاوری را جدی‌تر ببینی.",
          testId: "PANAS",
        });
      }
    }

    return chunks;
  },
};

