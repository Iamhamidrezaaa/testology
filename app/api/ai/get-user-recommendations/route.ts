import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`📊 دریافت پیشنهادهای بالینی برای کاربر ${userId}...`);

    const recommendations = await prisma.userTestRecommendation.findMany({
      where: { userId },
      orderBy: { score: "desc" },
      take: 5,
    });

    console.log(`✅ ${recommendations.length} پیشنهاد دریافت شد`);

    return NextResponse.json({ 
      success: true,
      recommendations,
      count: recommendations.length,
      userId: userId,
      message: `${recommendations.length} پیشنهاد بالینی دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت پیشنهادهای بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت پیشنهادهای بالینی"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`📈 محاسبه آمار پیشنهادهای بالینی برای کاربر ${userId}...`);

    // آمار کلی
    const totalRecommendations = await prisma.userTestRecommendation.count({
      where: { userId }
    });

    // پیشنهادهای اخیر
    const recentRecommendations = await prisma.userTestRecommendation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    // آمار تست‌ها
    const testStats = await prisma.userTestRecommendation.groupBy({
      by: ['testName'],
      _count: {
        id: true
      },
      where: { userId }
    });

    // آمار اولویت
    const priorityStats = await prisma.userTestRecommendation.aggregate({
      _avg: {
        score: true
      },
      _max: {
        score: true
      },
      _min: {
        score: true
      },
      where: { userId }
    });

    const stats = {
      totalRecommendations,
      recentRecommendations: recentRecommendations.length,
      testStats: testStats.map(t => ({
        testName: t.testName,
        count: t._count.id
      })),
      priorityStats: {
        average: priorityStats._avg.score,
        max: priorityStats._max.score,
        min: priorityStats._min.score
      },
      lastRecommendation: recentRecommendations[0] || null
    };

    console.log("✅ آمار پیشنهادهای بالینی محاسبه شد");

    return NextResponse.json({ 
      success: true,
      stats,
      message: "آمار پیشنهادهای بالینی محاسبه شد"
    });

  } catch (err) {
    console.error("❌ خطا در محاسبه آمار پیشنهادهای بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در محاسبه آمار پیشنهادهای بالینی"
    }, { status: 500 });
  }
}











