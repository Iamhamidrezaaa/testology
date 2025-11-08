import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const logs = await prisma.emotionLog.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 50, // آخرین 50 رکورد
    });

    // گروه‌بندی بر اساس تاریخ
    const groupedData = logs.reduce((acc: any, log) => {
      const date = new Date(log.createdAt).toLocaleDateString("fa-IR");
      if (!acc[date]) {
        acc[date] = {
          date,
          emotions: [],
          avgIntensity: 0,
          dominantEmotion: log.emotion
        };
      }
      acc[date].emotions.push(log.emotion);
      acc[date].avgIntensity += log.intensity;
      return acc;
    }, {});

    // محاسبه میانگین و غالب‌ترین احساس برای هر روز
    const data = Object.values(groupedData).map((day: any) => {
      const emotionCounts = day.emotions.reduce((acc: any, emotion: string) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {});

      const dominantEmotion = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || "calm";

      return {
        date: day.date,
        intensity: parseFloat((day.avgIntensity / day.emotions.length).toFixed(2)),
        dominantEmotion,
        emotionCount: day.emotions.length
      };
    });

    // آمار کلی
    const totalEmotions = logs.length;
    const emotionDistribution = logs.reduce((acc: any, log) => {
      acc[log.emotion] = (acc[log.emotion] || 0) + 1;
      return acc;
    }, {});

    const avgIntensity = logs.length > 0 
      ? parseFloat((logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length).toFixed(2))
      : 0;

    return NextResponse.json({ 
      data,
      stats: {
        totalEmotions,
        avgIntensity,
        emotionDistribution,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (err: any) {
    console.error("Get emotions failed:", err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}











