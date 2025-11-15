/**
 * API Route برای دریافت لیست نتایج تست‌های کاربر
 * GET /api/user/tests?userId=xxx
 * 
 * در نسخه نهایی، userId را از session می‌گیریم
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 🔹 در نسخه نهایی این رو از سشن next-auth بگیر
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        testId: true,
        testName: true,
        testSlug: true,
        score: true,
        result: true,
        severity: true,
        interpretation: true,
        subscales: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Parse کردن interpretation و subscales از JSON
    const parsedResults = results.map((r) => ({
      ...r,
      interpretation: r.interpretation
        ? JSON.parse(r.interpretation as string)
        : null,
      subscales: r.subscales
        ? JSON.parse(r.subscales as string)
        : null,
    }));

    return NextResponse.json({
      success: true,
      results: parsedResults,
      count: parsedResults.length,
    });
  } catch (e: any) {
    console.error("Error fetching test results:", e);
    return NextResponse.json(
      {
        error: "Failed to fetch test results",
        details: e.message,
      },
      { status: 500 }
    );
  }
}
