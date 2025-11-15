/**
 * API Route برای دریافت نتایج تست‌های کاربر بر اساس email
 * GET /api/tests/results?userEmail=xxx
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "userEmail الزامی است" },
        { status: 400 }
      );
    }

    if (!prisma) {
      return NextResponse.json(
        { success: false, error: "Database not available" },
        { status: 500 }
      );
    }

    console.log(`🔍 Looking for user with email: ${userEmail}`);

    // پیدا کردن کاربر بر اساس email
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    if (!user) {
      console.warn(`❌ User not found with email: ${userEmail}`);
      return NextResponse.json({
        success: true,
        results: [],
        message: "کاربر یافت نشد",
      });
    }

    console.log(`✅ User found with id: ${user.id}`);

    // دریافت نتایج تست‌های کاربر
    const results = await prisma.testResult.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        userId: true,
        testId: true,
        testName: true,
        testSlug: true,
        score: true,
        result: true,
        resultText: true,
        severity: true,
        interpretation: true,
        subscales: true,
        completed: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    console.log(`📊 Found ${results.length} test results for user ${user.id}`);

    // Parse کردن interpretation و subscales از JSON
    const parsedResults = results.map((r) => ({
      ...r,
      interpretation: r.interpretation
        ? (typeof r.interpretation === "string" 
            ? JSON.parse(r.interpretation) 
            : r.interpretation)
        : null,
      subscales: r.subscales
        ? (typeof r.subscales === "string"
            ? JSON.parse(r.subscales)
            : r.subscales)
        : null,
      completedAt: r.createdAt, // برای compatibility
    }));

    return NextResponse.json({
      success: true,
      results: parsedResults,
      count: parsedResults.length,
    });
  } catch (e: any) {
    console.error("❌ Error fetching test results:", e);
    return NextResponse.json(
      {
        success: false,
        error: "خطا در دریافت نتایج تست‌ها",
        details: e.message,
      },
      { status: 500 }
    );
  }
}
