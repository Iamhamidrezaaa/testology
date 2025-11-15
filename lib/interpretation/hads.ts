/**
 * تفسیر تست HADS (Hospital Anxiety and Depression Scale)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const HADS_INTERPRETATION: TestInterpretationConfig = {
  testId: "HADS",
  byLevel: {
    normal: (r) => ({
      id: "hads_normal",
      title: "وضعیت طبیعی",
      body: "در این بخش، نشانه‌های اضطراب و افسردگی در حدی نیست که به‌عنوان یک مشکل عمده دیده شود. ممکن است تحت فشار زندگی، گاهی بالا و پایین شوی، اما الگوی مزمن یا شدید دیده نمی‌شود.",
      testId: "HADS",
    }),
    mild: (r) => ({
      id: "hads_mild",
      title: "نشانه‌های خفیف",
      body: "در این بخش، نشانه‌های اضطراب یا افسردگی در حد قابل توجهی حضور دارند و می‌توانند روی انرژی، خواب، تمرکز یا لذت‌بردن از زندگی اثر بگذارند. این سطح نیازمند توجه و مراقبت بیشتر از خودت است.",
      testId: "HADS",
    }),
    moderate: (r) => ({
      id: "hads_moderate",
      title: "نشانه‌های متوسط",
      body: "در این بخش، نشانه‌های اضطراب یا افسردگی در حد قابل توجهی حضور دارند و می‌توانند روی انرژی، خواب، تمرکز یا لذت‌بردن از زندگی اثر بگذارند. این سطح نیازمند توجه و مراقبت بیشتر از خودت است.",
      testId: "HADS",
    }),
    severe: (r) => ({
      id: "hads_severe",
      title: "نشانه‌های شدید",
      priority: "high",
      body: "در این زیرمقیاس، نشانه‌ها در سطح بالایی قرار دارند؛ چیزی که معمولاً با رنج قابل توجه همراه است. اگر چنین تجربه‌ای داری، حق‌ات است که کمک بگیری و تنها نمانی.",
      testId: "HADS",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    const anxiety = result.subscales.find(s => s.id === "anxiety");
    if (anxiety) {
      if (anxiety.score <= 7) {
        chunks.push({
          id: "hads_anxiety_low",
          title: "اضطراب",
          body: "در این بخش، نشانه‌های اضطراب در حدی نیست که به‌عنوان یک مشکل عمده دیده شود.",
          testId: "HADS",
        });
      } else if (anxiety.score <= 10) {
        chunks.push({
          id: "hads_anxiety_medium",
          title: "اضطراب",
          body: "در این بخش، نشانه‌های اضطراب در حد قابل توجهی حضور دارند و می‌توانند روی انرژی، خواب، تمرکز یا لذت‌بردن از زندگی اثر بگذارند.",
          testId: "HADS",
        });
      } else {
        chunks.push({
          id: "hads_anxiety_high",
          title: "اضطراب",
          priority: "high",
          body: "در این زیرمقیاس، نشانه‌های اضطراب در سطح بالایی قرار دارند؛ چیزی که معمولاً با رنج قابل توجه همراه است.",
          testId: "HADS",
        });
      }
    }

    const depression = result.subscales.find(s => s.id === "depression");
    if (depression) {
      if (depression.score <= 7) {
        chunks.push({
          id: "hads_depression_low",
          title: "افسردگی",
          body: "در این بخش، نشانه‌های افسردگی در حدی نیست که به‌عنوان یک مشکل عمده دیده شود.",
          testId: "HADS",
        });
      } else if (depression.score <= 10) {
        chunks.push({
          id: "hads_depression_medium",
          title: "افسردگی",
          body: "در این بخش، نشانه‌های افسردگی در حد قابل توجهی حضور دارند و می‌توانند روی انرژی، خواب، تمرکز یا لذت‌بردن از زندگی اثر بگذارند.",
          testId: "HADS",
        });
      } else {
        chunks.push({
          id: "hads_depression_high",
          title: "افسردگی",
          priority: "high",
          body: "در این زیرمقیاس، نشانه‌های افسردگی در سطح بالایی قرار دارند؛ چیزی که معمولاً با رنج قابل توجه همراه است.",
          testId: "HADS",
        });
      }
    }

    return chunks;
  },
};

