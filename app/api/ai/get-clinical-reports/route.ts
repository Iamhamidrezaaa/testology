import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`📊 دریافت گزارش‌های بالینی برای کاربر ${userId}...`);

    const reports = await prisma.clinicalReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    console.log(`✅ ${reports.length} گزارش بالینی دریافت شد`);

    return NextResponse.json({ 
      success: true,
      reports,
      count: reports.length,
      userId: userId,
      message: `${reports.length} گزارش بالینی دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت گزارش‌های بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت گزارش‌های بالینی"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    console.log(`📈 محاسبه آمار گزارش‌های بالینی برای کاربر ${userId}...`);

    // آمار کلی
    const totalReports = await prisma.clinicalReport.count({
      where: { userId }
    });

    // گزارش‌های اخیر
    const recentReports = await prisma.clinicalReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    // آمار زمانی
    const firstReport = await prisma.clinicalReport.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" }
    });

    const lastReport = await prisma.clinicalReport.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });

    const stats = {
      totalReports,
      recentReports: recentReports.length,
      firstReport: firstReport ? {
        id: firstReport.id,
        createdAt: firstReport.createdAt
      } : null,
      lastReport: lastReport ? {
        id: lastReport.id,
        createdAt: lastReport.createdAt
      } : null,
      timeSpan: firstReport && lastReport ? {
        days: Math.ceil((new Date(lastReport.createdAt).getTime() - new Date(firstReport.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      } : null
    };

    console.log("✅ آمار گزارش‌های بالینی محاسبه شد");

    return NextResponse.json({ 
      success: true,
      stats,
      message: "آمار گزارش‌های بالینی محاسبه شد"
    });

  } catch (err) {
    console.error("❌ خطا در محاسبه آمار گزارش‌های بالینی:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در محاسبه آمار گزارش‌های بالینی"
    }, { status: 500 });
  }
}











