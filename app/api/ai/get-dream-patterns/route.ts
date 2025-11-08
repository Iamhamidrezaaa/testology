import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("📊 دریافت الگوهای کشف‌شده از خواب‌ها...");
    
    const patterns = await prisma.dreamPattern.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // تبدیل JSON string به array برای relatedTests
    const processedPatterns = patterns.map(pattern => ({
      ...pattern,
      relatedTests: pattern.relatedTests ? JSON.parse(pattern.relatedTests) : []
    }));

    console.log(`✅ ${patterns.length} الگو دریافت شد`);

    return NextResponse.json({ 
      success: true,
      patterns: processedPatterns,
      count: patterns.length,
      message: `${patterns.length} الگو دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت الگوها:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت الگوهای کشف‌شده"
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log("📈 محاسبه آمار الگوهای خواب...");
    
    const totalPatterns = await prisma.dreamPattern.count();
    
    const recentPatterns = await prisma.dreamPattern.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // آمار احساسات
    const sentimentStats = await prisma.dreamPattern.groupBy({
      by: ['sentiment'],
      _count: {
        sentiment: true
      },
      where: {
        sentiment: {
          not: null
        }
      }
    });

    // آمار فرکانس
    const frequencyStats = await prisma.dreamPattern.aggregate({
      _avg: {
        frequency: true
      },
      _max: {
        frequency: true
      },
      _min: {
        frequency: true
      }
    });

    // الگوهای پرتکرار
    const topPatterns = await prisma.dreamPattern.findMany({
      orderBy: { frequency: "desc" },
      take: 5,
    });

    const stats = {
      totalPatterns,
      recentPatterns: recentPatterns.length,
      sentimentStats: sentimentStats.map(s => ({
        sentiment: s.sentiment,
        count: s._count.sentiment
      })),
      frequencyStats: {
        average: frequencyStats._avg.frequency,
        max: frequencyStats._max.frequency,
        min: frequencyStats._min.frequency
      },
      topPatterns: topPatterns.map(p => ({
        symbol: p.symbol,
        frequency: p.frequency,
        meaning: p.meaning
      }))
    };

    console.log("✅ آمار الگوها محاسبه شد");

    return NextResponse.json({ 
      success: true,
      stats,
      message: "آمار الگوهای خواب محاسبه شد"
    });

  } catch (err) {
    console.error("❌ خطا در محاسبه آمار الگوها:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در محاسبه آمار الگوها"
    }, { status: 500 });
  }
}











