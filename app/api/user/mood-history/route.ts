import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * دریافت تاریخچه احساسات کاربر
 * GET /api/user/mood-history
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams?.get('days') || '7');
    const userId = session?.user?.id;

    // محاسبه تاریخ شروع
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // دریافت mood entries
    const moods = await prisma.moodEntry.findMany({
      where: { 
        userId,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        userId: true,
        mood: true,
        sentiment: true,
        createdAt: true
      }
    });

    // گروه‌بندی بر اساس تاریخ
    const grouped = moods.reduce((acc: any, mood) => {
      const day = mood.createdAt.toISOString().split('T')[0];
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(mood);
      return acc;
    }, {});

    // امتیازدهی احساسات
    const sentimentScores = {
      'depressed': -2,
      'angry': -1,
      'anxious': 0,
      'neutral': 1,
      'hopeful': 2,
      'happy': 3
    };

    // محاسبه میانگین امتیاز روزانه
    const chartData = Object.entries(grouped).map(([date, dayMoods]: [string, any]) => {
      const scores = dayMoods.map((mood: any) => 
        sentimentScores[mood.sentiment as keyof typeof sentimentScores] || 0
      );
      
      const avgScore = scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length;
      
      return {
        date,
        score: Math.round(avgScore * 10) / 10, // رند به یک رقم اعشار
        count: dayMoods.length,
        sentiments: dayMoods.map((mood: any) => ({
          sentiment: mood.sentiment,
          time: mood.createdAt.toISOString().split('T')[1].substring(0, 5)
        }))
      };
    });

    // آمار کلی
    const totalMoods = moods.length;
    const sentimentCounts = moods.reduce((acc: Record<string, number>, mood: any) => {
      const sentiment = mood.sentiment || 'neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // محاسبه trend (آیا احساسات بهتر شده یا بدتر)
    let trend = 'stable';
    if (chartData.length >= 2) {
      const firstWeek = chartData.slice(0, Math.ceil(chartData.length / 2));
      const secondWeek = chartData.slice(Math.ceil(chartData.length / 2));
      
      const firstAvg = firstWeek.reduce((sum: any, day: any) => sum + day.score, 0) / firstWeek.length;
      const secondAvg = secondWeek.reduce((sum: any, day: any) => sum + day.score, 0) / secondWeek.length;
      
      if (secondAvg > firstAvg + 0.5) trend = 'improving';
      else if (secondAvg < firstAvg - 0.5) trend = 'declining';
    }

    return NextResponse.json({
      success: true,
      data: {
        chartData,
        stats: {
          totalMoods,
          sentimentCounts,
          trend,
          averageScore: chartData.length > 0 
            ? Math.round((chartData.reduce((sum: any, day: any) => sum + day.score, 0) / chartData.length) * 10) / 10
            : 0
        }
      }
    });

  } catch (error) {
    console.error('Mood history error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood history' },
      { status: 500 }
    );
  }
}














