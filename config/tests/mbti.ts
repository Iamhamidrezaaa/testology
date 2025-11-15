/**
 * Config برای تست MBTI
 * توجه: MBTI یک تست خاص است که از dimension scoring استفاده می‌کند
 */

import { TestConfig } from "@/types/test-scoring";

export const MBTI_CONFIG: TestConfig = {
  id: "MBTI",
  title: "تست شخصیت MBTI",
  scoringType: "mean", // برای compatibility
  scaleMin: 1,
  scaleMax: 5,
  reverseItems: [], // MBTI از dimension scoring استفاده می‌کند
  subscales: [
    { id: "ei", label: "برون‌گرایی/درون‌گرایی", items: [] }, // باید با سوالات واقعی پر شود
    { id: "sn", label: "حسی/شهودی", items: [] },
    { id: "tf", label: "تفکری/احساسی", items: [] },
    { id: "jp", label: "قضاوتی/ادراکی", items: [] },
  ],
  cutoffs: [],
  interpretationByLevel: {},
  recommendations: [],
};

