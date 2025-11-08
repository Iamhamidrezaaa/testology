import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    console.log("📖 دریافت خواب‌های Testology...");
    
    const dreams = await prisma.dream.findMany({
      orderBy: { date: "desc" },
      take: 20,
    });

    console.log(`✅ ${dreams.length} خواب دریافت شد`);

    return NextResponse.json({ 
      success: true,
      dreams,
      count: dreams.length,
      message: `${dreams.length} خواب دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت خواب‌ها:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت خواب‌ها"
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log("📊 آمار خواب‌های Testology...");
    
    const totalDreams = await prisma.dream.count();
    
    const recentDreams = await prisma.dream.findMany({
      orderBy: { date: "desc" },
      take: 5,
    });

    const moodContexts = await prisma.dream.groupBy({
      by: ['moodContext'],
      _count: {
        moodContext: true
      }
    });

    const stats = {
      totalDreams,
      recentDreams: recentDreams.length,
      moodContexts: moodContexts.map(mc => ({
        context: mc.moodContext,
        count: mc._count.moodContext
      })),
      lastDream: recentDreams[0] || null
    };

    console.log("✅ آمار خواب‌ها محاسبه شد");

    return NextResponse.json({ 
      success: true,
      stats,
      message: "آمار خواب‌ها محاسبه شد"
    });

  } catch (err) {
    console.error("❌ خطا در محاسبه آمار خواب‌ها:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در محاسبه آمار خواب‌ها"
    }, { status: 500 });
  }
}












