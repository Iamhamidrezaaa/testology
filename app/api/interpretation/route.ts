/**
 * API Endpoint برای دریافت Interpretation چندلایه
 * 
 * POST /api/interpretation
 * 
 * Body: {
 *   results: ScoredResult[]  // نتایج تست‌های انجام شده
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import { buildInterpretation, buildSummary } from "@/lib/interpretation";
import { ScoredResult } from "@/lib/scoring-engine-v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { results } = body as { results: ScoredResult[] };

    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json(
        { error: "results array is required" },
        { status: 400 }
      );
    }

    // ساخت Interpretation چندلایه
    const interpretation = buildInterpretation(results);
    const summary = buildSummary(interpretation.chunks);

    return NextResponse.json({
      success: true,
      interpretation: {
        ...interpretation,
        summary,
      },
    });
  } catch (err: any) {
    console.error("Interpretation error:", err);
    return NextResponse.json(
      { error: "Interpretation failed", details: err.message },
      { status: 500 }
    );
  }
}

