import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withMonitoring } from "@/middleware/withMonitoring";

async function updateAnalyticsHandler(req: Request) {
  try {
    const { therapistId } = await req.json();
    
    if (!therapistId) {
      return NextResponse.json({ error: "Missing therapistId" }, { status: 400 });
    }

    // دریافت تمام بازخوردهای درمانگر
    const feedbacks = await prisma.therapistFeedback.findMany({ 
      where: { therapistId },
      orderBy: { createdAt: "desc" }
    });

    // دریافت تمام جلسات درمانگر
    const sessions = await prisma.sessionBooking.findMany({ 
      where: { 
        therapistId,
        type: "HUMAN",
        confirmed: true
      }
    });

    if (feedbacks.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No feedback data available",
        analytics: {
          avgRating: 0,
          avgAIScore: 0,
          avgSessionImpact: 0,
          retentionRate: 0,
          totalSessions: sessions.length
        }
      });
    }

    // محاسبه میانگین‌ها
    const avgRating = feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length;
    const avgAIScore = feedbacks.reduce((sum, f) => sum + (f.aiScore || 0), 0) / feedbacks.length;
    const avgSessionImpact = feedbacks.reduce((sum, f) => sum + (f.sessionImpact || 0), 0) / feedbacks.length;

    // محاسبه نرخ وفاداری (تعداد کاربران تکراری / کل کاربران)
    const userIds = sessions.map(s => s.userId);
    const uniqueUsers = new Set(userIds);
    const retentionRate = userIds.length > 0 ? (userIds.length - uniqueUsers.size) / userIds.length : 0;

    // محاسبه روند عملکرد (آخرین 10 بازخورد)
    const recentFeedbacks = feedbacks.slice(0, 10);
    const trend = recentFeedbacks.map((f, index) => ({
      date: f.createdAt.toISOString().split('T')[0],
      aiScore: f.aiScore || 0,
      sessionImpact: f.sessionImpact || 0,
      rating: f.rating
    }));

    // ذخیره یا به‌روزرسانی آمار
    const analytics = await prisma.therapistAnalytics.upsert({
      where: { therapistId },
      update: {
        avgRating: Math.round(avgRating * 10) / 10, // گرد کردن به یک رقم اعشار
        avgAIScore: Math.round(avgAIScore * 100) / 100,
        avgSessionImpact: Math.round(avgSessionImpact * 100) / 100,
        retentionRate: Math.round(retentionRate * 100) / 100,
        totalSessions: sessions.length,
      },
      create: {
        therapistId,
        avgRating: Math.round(avgRating * 10) / 10,
        avgAIScore: Math.round(avgAIScore * 100) / 100,
        avgSessionImpact: Math.round(avgSessionImpact * 100) / 100,
        retentionRate: Math.round(retentionRate * 100) / 100,
        totalSessions: sessions.length,
      },
    });

    return NextResponse.json({ 
      success: true,
      analytics: {
        ...analytics,
        trend,
        feedbackCount: feedbacks.length,
        recentPerformance: {
          lastWeek: feedbacks.filter(f => {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return f.createdAt >= weekAgo;
          }).length,
          lastMonth: feedbacks.filter(f => {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return f.createdAt >= monthAgo;
          }).length
        }
      }
    });
  } catch (err: any) {
    console.error("Analytics update error:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export const POST = withMonitoring(updateAnalyticsHandler, "Analytics");











