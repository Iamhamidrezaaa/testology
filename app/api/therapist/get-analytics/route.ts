import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const therapistId = searchParams.get("therapistId");
    
    if (!therapistId) {
      return NextResponse.json({ error: "Missing therapistId" }, { status: 400 });
    }

    // دریافت آمار کلی
    const analytics = await prisma.therapistAnalytics.findUnique({ 
      where: { therapistId }
    });

    // دریافت بازخوردهای اخیر برای روند
    const recentFeedbacks = await prisma.therapistFeedback.findMany({
      where: { therapistId },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    // محاسبه روند عملکرد
    const trend = recentFeedbacks.map(f => ({
      date: f.createdAt.toISOString().split('T')[0],
      aiScore: f.aiScore || 0,
      sessionImpact: f.sessionImpact || 0,
      rating: f.rating
    })).reverse(); // برای نمایش ترتیب زمانی

    // آمار ماهانه
    const monthlyStats = await prisma.therapistFeedback.groupBy({
      by: ['createdAt'],
      where: {
        therapistId,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1) // 6 ماه گذشته
        }
      },
      _avg: {
        rating: true,
        aiScore: true,
        sessionImpact: true
      },
      _count: {
        id: true
      }
    });

    // محاسبه امتیاز کلی عملکرد
    const overallScore = analytics ? 
      Math.round(((analytics.avgRating / 5) * 0.4 + analytics.avgAIScore * 0.3 + analytics.avgSessionImpact * 0.3) * 100) / 100 : 0;

    return NextResponse.json({ 
      analytics: analytics || {
        therapistId,
        avgRating: 0,
        avgAIScore: 0,
        avgSessionImpact: 0,
        retentionRate: 0,
        totalSessions: 0
      },
      trend,
      monthlyStats,
      overallScore,
      performanceLevel: overallScore >= 0.8 ? "عالی" : 
                       overallScore >= 0.6 ? "خوب" : 
                       overallScore >= 0.4 ? "متوسط" : "نیاز به بهبود"
    });
  } catch (err: any) {
    console.error("Get analytics failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











