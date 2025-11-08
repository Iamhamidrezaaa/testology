import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // دریافت داده‌های خلق و خو
    const moods = await prisma.moodTrend.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // آخرین 30 روز
        }
      }
    }).catch(() => []);

    if (!moods.length) {
      return NextResponse.json({ 
        message: "No data available",
        insights: [],
        stats: {
          totalUsers: 0,
          totalSessions: 0,
          averageMood: 0
        }
      });
    }

    // گروه‌بندی بر اساس دسته‌بندی
    const grouped = moods.reduce((acc: any, m: any) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m.score);
      return acc;
    }, {});

    // محاسبه میانگین برای هر دسته
    const insights = Object.entries(grouped).map(([category, scores]: [string, any]) => ({
      category,
      average: parseFloat((scores.reduce((a: number, b: number) => a + b, 0) / scores.length).toFixed(1)),
      count: scores.length,
      trend: "stable" // در آینده می‌توان روند را محاسبه کرد
    }));

    // آمار کلی
    const totalUsers = new Set(moods.map(m => m.userId)).size;
    const totalSessions = moods.length;
    const averageMood = parseFloat((moods.reduce((sum, m) => sum + m.score, 0) / moods.length).toFixed(1));

    // دریافت آمار جلسات درمانی
    const therapySessions = await prisma.therapySession.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }).catch(() => []);

    return NextResponse.json({ 
      insights,
      stats: {
        totalUsers,
        totalSessions,
        averageMood,
        therapySessions: therapySessions.length,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error("Public insights failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











