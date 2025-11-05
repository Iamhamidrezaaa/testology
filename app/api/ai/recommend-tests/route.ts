import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`🧠 شروع تولید پیشنهاد تست برای کاربر ${userId}...`);

    // دریافت تست‌های انجام شده توسط کاربر
    const userTests = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // دریافت وزن‌های کلی تست‌ها
    const globalWeights = await prisma.testRecommendationWeight.findMany();

    if (!globalWeights.length) {
      return NextResponse.json({ 
        success: false,
        message: "هیچ وزن تستی برای پیشنهاد یافت نشد. ابتدا الگوهای رفتاری را تحلیل کنید." 
      });
    }

    console.log(`📊 ${userTests.length} تست کاربر و ${globalWeights.length} وزن تست یافت شد`);

    // تست‌هایی که کاربر انجام داده حذف شوند
    const doneTests = new Set(userTests.map((t) => t.testName));

    // فیلتر کردن تست‌های انجام نشده و مرتب‌سازی بر اساس وزن
    const recommendations = globalWeights
      .filter((w) => !doneTests.has(w.testName))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5)
      .map((w) => ({
        testName: w.testName,
        weight: w.weight,
        reason: `اولویت بر اساس الگوهای رفتاری و تاریخچه تست‌های کاربر. وزن: ${(w.weight * 100).toFixed(0)}%`,
      }));

    console.log(`✅ ${recommendations.length} پیشنهاد تست تولید شد`);

    return NextResponse.json({ 
      success: true,
      message: "پیشنهاد تست‌ها با موفقیت تولید شد",
      recommendations,
      count: recommendations.length,
      userId: userId,
      userTestsCount: userTests.length,
      globalWeightsCount: globalWeights.length
    });

  } catch (err) {
    console.error("❌ خطا در تولید پیشنهاد تست:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در تولید پیشنهاد تست"
    }, { status: 500 });
  }
}