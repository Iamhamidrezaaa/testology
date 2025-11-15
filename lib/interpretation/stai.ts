/**
 * تفسیر تست STAI (State-Trait Anxiety Inventory)
 */

import { TestInterpretationConfig } from "@/types/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export const STAI_INTERPRETATION: TestInterpretationConfig = {
  testId: "STAI",
  byLevel: {
    low: (r) => ({
      id: "stai_low",
      title: "اضطراب پایین",
      body: "در این تست، اضطراب حالتی یا صفتی تو پایین است؛ یعنی یا در حال حاضر در وضعیت هیجانی نسبتاً آرامی هستی، یا در کل شخصیتت بیشتر به سمت آرامش و ثبات متمایل است.",
      testId: "STAI",
    }),
    medium: (r) => ({
      id: "stai_medium",
      title: "اضطراب متوسط",
      body: "اضطراب حالتی یا صفتی در سطح متوسط است؛ گاهی به‌طور طبیعی در موقعیت‌های چالش‌برانگیز بالا می‌رود، اما همیشه در اوج نیست.",
      testId: "STAI",
    }),
    high: (r) => ({
      id: "stai_high",
      title: "اضطراب بالا",
      priority: "high",
      body: "این نمره نشان می‌دهد که گرایش کلی یا وضعیت فعلی‌ات بیشتر سمت نگرانی، تنش و آماده‌باش هیجانی است. این می‌تواند هم خسته‌کننده و هم آزاردهنده باشد و ارزش دارد که برای آرام‌تر کردن این سیستم، ابزارهای بیشتری یاد بگیری.",
      testId: "STAI",
    }),
  },
  bySubscale: (result) => {
    const chunks = [];
    
    const stateAnxiety = result.subscales.find(s => s.id === "state_anxiety");
    if (stateAnxiety) {
      if (stateAnxiety.score <= 40) {
        chunks.push({
          id: "stai_state_low",
          title: "اضطراب حالت",
          body: "در حال حاضر در وضعیت هیجانی نسبتاً آرامی هستی.",
          testId: "STAI",
        });
      } else if (stateAnxiety.score <= 60) {
        chunks.push({
          id: "stai_state_medium",
          title: "اضطراب حالت",
          body: "در حال حاضر اضطراب در سطح متوسط است؛ گاهی به‌طور طبیعی در موقعیت‌های چالش‌برانگیز بالا می‌رود.",
          testId: "STAI",
        });
      } else {
        chunks.push({
          id: "stai_state_high",
          title: "اضطراب حالت",
          priority: "high",
          body: "وضعیت فعلی‌ات بیشتر سمت نگرانی، تنش و آماده‌باش هیجانی است.",
          testId: "STAI",
        });
      }
    }

    const traitAnxiety = result.subscales.find(s => s.id === "trait_anxiety");
    if (traitAnxiety) {
      if (traitAnxiety.score <= 40) {
        chunks.push({
          id: "stai_trait_low",
          title: "اضطراب صفت",
          body: "در کل شخصیتت بیشتر به سمت آرامش و ثبات متمایل است.",
          testId: "STAI",
        });
      } else if (traitAnxiety.score <= 60) {
        chunks.push({
          id: "stai_trait_medium",
          title: "اضطراب صفت",
          body: "گرایش کلی‌ات به اضطراب در سطح متوسط است.",
          testId: "STAI",
        });
      } else {
        chunks.push({
          id: "stai_trait_high",
          title: "اضطراب صفت",
          priority: "high",
          body: "گرایش کلی‌ات بیشتر سمت نگرانی و تنش است.",
          testId: "STAI",
        });
      }
    }

    return chunks;
  },
};

