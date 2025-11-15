/**
 * Types برای سیستم نمره‌دهی Testology
 * ساختار مرکزی برای تمام 49 تست
 */

export type ScoringType = "sum" | "mean";

export interface SubscaleConfig {
  id: string;              // مثلا "anxiety", "energy", "family"
  label: string;           // برای نمایش یا لاگ
  items: number[];         // شماره سوال‌ها
}

export interface CutoffBand {
  id: string;              // مثلا "minimal", "mild", "moderate", "severe"
  label: string;           // برچسب انسانی برای UI
  min: number;             // شامل این مقدار
  max: number;             // شامل این مقدار
}

export interface RecommendationRule {
  id: string;
  conditions: Array<{
    target: "total" | "subscale";
    subscaleId?: string;   // اگر target = "subscale"
    comparator: "lt" | "lte" | "gt" | "gte";
    value: number;
  }>;
  recommendTests: string[];    // مثلا ["SleepLifestyle", "PSQI"]
  message?: string;            // توضیح اختیاری
}

export interface TestConfig {
  id: string;                   // یکتا مثل "GAD7", "PHQ9", "Creativity"
  title: string;
  scoringType: ScoringType;     // "sum" یا "mean"
  scaleMin: number;             // حداقل مقدار هر آیتم (مثلا 0 یا 1)
  scaleMax: number;             // حداکثر مقدار هر آیتم (مثلا 3 یا 5)
  reverseItems: number[];       // لیست شماره‌ سوال‌هایی که reverse هستند
  subscales: SubscaleConfig[];
  // اگر تست sum-based هست و رنج خاصی داره (مثل 0–21)
  totalRange?: { min: number; max: number };
  cutoffs: CutoffBand[];
  interpretationByLevel?: Record<string, string>; // متن برای هر level
  recommendations?: RecommendationRule[];
}

