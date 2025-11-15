/**
 * تفسیر تست BFI (Big Five Inventory)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const BFI_INTERPRETATION: TestInterpretationConfig = {
  testId: "BFI",
  byLevel: {
    low: (r) => ({
      id: "bfi_low",
      title: "نمره پایین",
      body: "نمره پایین در این عامل شخصیت نشان می‌دهد که در این بُعد، الگوی رفتاری‌ات در محدوده پایین‌تر از میانگین قرار دارد.",
      testId: "BFI",
    }),
    medium: (r) => ({
      id: "bfi_medium",
      title: "نمره متوسط",
      body: "نمره متوسط در این عامل شخصیت نشان می‌دهد که در این بُعد، الگوی رفتاری‌ات در محدوده میانگین قرار دارد.",
      testId: "BFI",
    }),
    high: (r) => ({
      id: "bfi_high",
      title: "نمره بالا",
      body: "نمره بالا در این عامل شخصیت نشان می‌دهد که این ویژگی در شخصیت تو پررنگ است.",
      testId: "BFI",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    // استفاده از همان منطق NEO-FFI برای BFI
    const neuroticism = result.subscales.find(s => s.id === "neuroticism");
    if (neuroticism) {
      if (neuroticism.score <= 2.4) {
        chunks.push({
          id: "bfi_neuroticism_low",
          title: "ثبات هیجانی",
          body: "نمره پایین در این عامل یعنی معمولاً در برابر فشارها و بالا‌پایین‌های روزمره، ثبات احساسی خوبی داری و کمتر دچار نوسان‌های شدید خلقی می‌شوی.",
          testId: "BFI",
        });
      } else if (neuroticism.score <= 3.4) {
        chunks.push({
          id: "bfi_neuroticism_medium",
          title: "ثبات هیجانی",
          body: "نمره متوسط یعنی گاهی تحت فشار هیجانی قرار می‌گیری، اما معمولاً می‌توانی دوباره خودت را جمع کنی.",
          testId: "BFI",
        });
      } else {
        chunks.push({
          id: "bfi_neuroticism_high",
          title: "ثبات هیجانی",
          body: "نمره بالا در این عامل یعنی هیجان‌ها را شدیدتر تجربه می‌کنی؛ نگرانی، دل‌شوره، غم یا خشم ممکن است زودتر فعال شوند و دیرتر فروکش کنند.",
          testId: "BFI",
        });
      }
    }

    // بقیه عوامل به همین شکل...
    return chunks;
  },
};

