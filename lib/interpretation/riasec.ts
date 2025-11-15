/**
 * تفسیر تست RIASEC (علایق شغلی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const RIASEC_INTERPRETATION: TestInterpretationConfig = {
  testId: "RIASEC",
  byLevel: {
    // RIASEC نوع‌محور است، اما برای compatibility یک تفسیر کلی می‌دهیم
    general: (r) => {
      // پیدا کردن بالاترین زیرمقیاس
      const topSubscale = r.subscales.reduce((max, s) => 
        s.score > (max?.score || 0) ? s : max
      );
      
      const typeDescriptions: Record<string, string> = {
        realistic: "نشان می‌دهد که درونی عمل‌گرا، فنی و علاقه‌مند به کار با دست‌ها و ابزار داری و معمولاً در محیط‌هایی که اجازهٔ ساختن و تعمیر می‌دهند، زنده‌تر می‌شوی.",
        investigative: "نشان می‌دهد که درونی تحلیلی، پژوهشی و علاقه‌مند به کشف و فهمیدن داری و معمولاً در محیط‌های علمی یا تحقیقاتی، زنده‌تر می‌شوی.",
        artistic: "نشان می‌دهد که درونی خلاق، بیانگر و جست‌وجوگر در هنر، ایده و زیبایی داری و معمولاً در محیط‌هایی که اجازهٔ بیان و ساختن می‌دهند، زنده‌تر می‌شوی.",
        social: "نشان می‌دهد که درونی کمک‌محور، آموزشی و علاقه‌مند به ارتباط با دیگران داری و معمولاً در محیط‌هایی که اجازهٔ حمایت و رشد دیگران می‌دهند، زنده‌تر می‌شوی.",
        enterprising: "نشان می‌دهد که درونی رهبری‌محور، کارآفرین و علاقه‌مند به تأثیرگذاری و مدیریت داری و معمولاً در محیط‌هایی که اجازهٔ رهبری و نوآوری می‌دهند، زنده‌تر می‌شوی.",
        conventional: "نشان می‌دهد که درونی منظم، ساختارمند و علاقه‌مند به کار با داده‌ها و سیستم‌ها داری و معمولاً در محیط‌هایی که اجازهٔ سازماندهی و نظم می‌دهند، زنده‌تر می‌شوی.",
      };
      
      const description = typeDescriptions[topSubscale?.id || ""] || 
        "نشان می‌دهد که علایق شغلی‌ات در این حوزه پررنگ است.";
      
      return {
        id: "riasec_general",
        title: "علایق شغلی",
        body: description,
        testId: "RIASEC",
      };
    },
  },
};

