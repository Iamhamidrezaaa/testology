/**
 * API Endpoint: دریافت پیشنهاد تست‌های تکمیلی در سطح پروفایل کلی
 * GET /api/dashboard/recommendations
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildGlobalRecommendations } from "@/lib/recommendation/global";

export async function GET(req: NextRequest) {
  try {
    // دریافت userId از query parameter یا header
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // اگر prisma در دسترس نیست
    if (!prisma) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // همه نتایج تست‌های کاربر
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    // محاسبه پیشنهادها
    const payload = buildGlobalRecommendations(results, 6);

    return NextResponse.json(payload);
  } catch (err: any) {
    console.error("Error in dashboard recommendations API:", err);
    return NextResponse.json(
      {
        error: "خطا در محاسبه پیشنهادها",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

