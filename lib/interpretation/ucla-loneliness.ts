/**
 * تفسیر تست UCLA (احساس تنهایی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const UCLA_LONELINESS_INTERPRETATION: TestInterpretationConfig = {
  testId: "UCLA",
  byLevel: {
    low: (r) => ({
      id: "ucla_low",
      title: "احساس تنهایی",
      body: "نمرهٔ پایین یعنی احساس تنهایی مزمن یا پریشان‌کننده در تو در این دوره غالب نیست. ممکن است گاهی تنها باشی، اما این تنهایی بیشتر از جنس انتخاب یا فرصت است تا رنج شدید.",
      testId: "UCLA",
    }),
    medium: (r) => ({
      id: "ucla_medium",
      title: "احساس تنهایی متوسط",
      body: "نمرهٔ متوسط یعنی گاهی احساس می‌کنی از نظر عاطفی «کم‌پشت» شده‌ای؛ شاید آدم‌هایی دور و برت باشند، اما همیشه احساس نمی‌کنی واقعاً دیده و فهمیده می‌شوی.",
      testId: "UCLA",
    }),
    high: (r) => ({
      id: "ucla_high",
      title: "احساس تنهایی بالا",
      priority: "high",
      body: "نمرهٔ بالا یعنی تنهایی – چه به شکل تنهایی بیرونی، چه به شکل احساس تنهایی در جمع – بخش مهمی از تجربهٔ این روزهایت است. این احساس کاملاً انسانی است، اما اگر طولانی شود می‌تواند روی خلق و سلامت روان هم اثر بگذارد.",
      testId: "UCLA",
    }),
  },
};

