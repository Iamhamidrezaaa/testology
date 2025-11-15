/**
 * تفسیر تست SPIN (Social Phobia Inventory - اضطراب اجتماعی)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const SPIN_INTERPRETATION: TestInterpretationConfig = {
  testId: "SPIN",
  byLevel: {
    minimal: (r) => ({
      id: "spin_minimal",
      title: "اضطراب اجتماعی",
      body: "نشانه‌های اضطراب اجتماعی در این تست کم است؛ یعنی حضور در جمع، صحبت‌کردن و تعامل با دیگران معمولاً برایت به‌طور شدید تهدیدکننده نیست، هرچند ممکن است گاهی استرس طبیعی داشته باشی.",
      testId: "SPIN",
    }),
    mild: (r) => ({
      id: "spin_mild",
      title: "اضطراب اجتماعی خفیف",
      body: "نمرهٔ متوسط یعنی در موقعیت‌های اجتماعی (مثل حرف‌زدن در جمع، آشنا شدن با آدم‌های جدید، یا مورد قضاوت‌بودن) مقداری نگرانی و خودآگاهی شدید تجربه می‌کنی، اما لزوماً فلج‌کننده نیست.",
      testId: "SPIN",
    }),
    moderate: (r) => ({
      id: "spin_moderate",
      title: "اضطراب اجتماعی متوسط",
      body: "نمرهٔ متوسط یعنی در موقعیت‌های اجتماعی (مثل حرف‌زدن در جمع، آشنا شدن با آدم‌های جدید، یا مورد قضاوت‌بودن) مقداری نگرانی و خودآگاهی شدید تجربه می‌کنی، اما لزوماً فلج‌کننده نیست.",
      testId: "SPIN",
    }),
    severe: (r) => ({
      id: "spin_severe",
      title: "اضطراب اجتماعی شدید",
      priority: "high",
      body: "نمرهٔ بالا نشان می‌دهد ترس از قضاوت‌شدن، شرمندگی، اشتباه‌کردن در جمع یا دیده‌شدن، فشار قابل توجهی روی تو می‌گذارد و ممکن است باعث شود از بعضی موقعیت‌ها اجتناب کنی.",
      testId: "SPIN",
    }),
  },
};

