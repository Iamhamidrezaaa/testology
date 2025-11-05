import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("🚨 دریافت گزارش‌های ریسک برای بررسی...");

    const risks = await prisma.riskFlag.findMany({
      where: { humanReviewed: false },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    // آمار ریسک
    const riskStats = {
      total: risks.length,
      critical: risks.filter(r => r.level === "critical").length,
      high: risks.filter(r => r.level === "high").length,
      medium: risks.filter(r => r.level === "medium").length,
      low: risks.filter(r => r.level === "low").length
    };

    console.log(`✅ ${risks.length} گزارش ریسک دریافت شد`);

    return NextResponse.json({ 
      success: true,
      risks,
      stats: riskStats,
      message: `${risks.length} گزارش ریسک دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت گزارش‌های ریسک:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت گزارش‌های ریسک"
    }, { status: 500 });
  }
}











