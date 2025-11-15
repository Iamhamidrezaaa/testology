/**
 * تفسیر تست ISI (Insomnia Severity Index)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const ISI_INTERPRETATION: TestInterpretationConfig = {
  testId: "ISI",
  byLevel: {
    no_insomnia: (r) => ({
      id: "isi_no_insomnia",
      title: "بی‌خوابی",
      body: "نمرهٔ پایین نشان می‌دهد مشکل خواب از نوع بی‌خوابی (سخت به خواب رفتن، بیدارشدن مکرر، بیدارشدن زودهنگام) در حال حاضر چندان پررنگ نیست.",
      testId: "ISI",
    }),
    subthreshold: (r) => ({
      id: "isi_subthreshold",
      title: "بی‌خوابی زیرآستانه",
      body: "نمرهٔ متوسط یعنی بی‌خوابی گاهی مهمان شب‌های تو می‌شود؛ نه آن‌قدر که همه‌چیز را به‌هم بریزد، اما آن‌قدر که خستگی و تمرکزت را تحت‌تأثیر قرار دهد.",
      testId: "ISI",
    }),
    moderate: (r) => ({
      id: "isi_moderate",
      title: "بی‌خوابی متوسط",
      body: "نمرهٔ متوسط یعنی بی‌خوابی گاهی مهمان شب‌های تو می‌شود؛ نه آن‌قدر که همه‌چیز را به‌هم بریزد، اما آن‌قدر که خستگی و تمرکزت را تحت‌تأثیر قرار دهد.",
      testId: "ISI",
    }),
    severe: (r) => ({
      id: "isi_severe",
      title: "بی‌خوابی شدید",
      priority: "high",
      body: "نمرهٔ بالا یعنی خواب یکی از محورهای اصلی فشار است؛ سخت به خواب می‌روی، زیاد بیدار می‌شوی یا صبح احساس سرحال‌بودن نمی‌کنی. این وضعیت هم روی بدن، هم روی خلق و هم روی کارکرد روزانه اثر می‌گذارد.",
      testId: "ISI",
    }),
  },
};

