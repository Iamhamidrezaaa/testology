import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST() {
  try {
    console.log("⚖️ شروع وزن‌دهی تست‌ها بر اساس الگوهای رفتاری...");
    
    const patterns = await prisma.behaviorPattern.findMany().catch(() => []);
    if (!patterns.length) {
      return NextResponse.json({ 
        success: false,
        message: "هیچ الگوی رفتاری برای وزن‌دهی یافت نشد." 
      });
    }

    console.log(`📊 ${patterns.length} الگوی رفتاری برای وزن‌دهی یافت شد`);

    const testScores: Record<string, { total: number; count: number }> = {};

    // محاسبه وزن‌ها بر اساس الگوهای رفتاری
    for (const p of patterns) {
      const sentiment = p.sentiment ?? 0;
      const freq = p.frequency || 1;
      // وزن بر اساس احساس و فرکانس
      const weight = Math.max(0, (1 + sentiment) / 2) * freq;

      // پردازش تست‌های مرتبط
      let relatedTests: string[] = [];
      try {
        relatedTests = p.relatedTests ? JSON.parse(p.relatedTests) : [];
      } catch (error) {
        console.error("خطا در پارس relatedTests:", error);
        relatedTests = [];
      }

      for (const t of relatedTests) {
        if (!testScores[t]) testScores[t] = { total: 0, count: 0 };
        testScores[t].total += weight;
        testScores[t].count += 1;
      }
    }

    // محاسبه وزن نهایی
    const weights = Object.entries(testScores).map(([testName, data]) => ({
      testName,
      weight: Math.min(1, data.total / (data.count * 5)), // نرمال‌سازی وزن
    }));

    console.log("💾 ذخیره وزن‌های جدید...");

    // حذف وزن‌های قدیمی و ذخیره جدید
    await prisma.testRecommendationWeight.deleteMany();
    const saved = [];
    for (const w of weights) {
      const s = await prisma.testRecommendationWeight.create({
        data: {
          testName: w.testName,
          weight: w.weight,
          source: "BehaviorPattern",
        },
      });
      saved.push(s);
    }

    console.log("✅ وزن‌دهی تست‌ها با موفقیت انجام شد!");

    return NextResponse.json({ 
      success: true,
      message: "وزن‌دهی تست‌ها بر اساس الگوهای رفتاری با موفقیت انجام شد",
      weights: saved,
      totalWeights: saved.length,
      patternsUsed: patterns.length
    });

  } catch (err) {
    console.error("❌ خطا در وزن‌دهی تست‌ها:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در وزن‌دهی تست‌ها"
    }, { status: 500 });
  }
}











