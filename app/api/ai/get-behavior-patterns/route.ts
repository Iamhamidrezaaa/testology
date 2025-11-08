import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("📊 دریافت الگوهای رفتاری...");
    
    const patterns = await prisma.behaviorPattern.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }).catch(() => []);

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
      message: `${patterns.length} الگوی رفتاری دریافت شد`
    });

  } catch (err) {
    console.error("❌ خطا در دریافت الگوهای رفتاری:", err);
    return NextResponse.json({ 
      success: false,
      error: String(err),
      message: "خطا در دریافت الگوهای رفتاری"
    }, { status: 500 });
  }
}











