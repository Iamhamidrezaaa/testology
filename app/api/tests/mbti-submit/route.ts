// app/api/tests/mbti-submit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildInterpretation } from "@/lib/interpretation";

export const runtime = "nodejs";

/**
 * محاسبه نمره MBTI بر اساس answers
 * MBTI از 4 بعد تشکیل شده: E/I, S/N, T/F, J/P
 */
type MbtiDimension = "EI" | "SN" | "TF" | "JP";

interface MbtiAnswer {
  questionId: number;
  value: number; // از 1 تا 5 (یا 0 تا 4)
}

interface MbtiScoreResult {
  testId: "MBTI";
  totalScore: number;
  dimensions: {
    EI: number;
    SN: number;
    TF: number;
    JP: number;
  };
  typeCode: string; // مثل "INFJ"
}

/**
 * Mapping سوالات MBTI به ابعاد
 * این mapping باید با ساختار واقعی سوالات MBTI هماهنگ شود
 * برای حالا یک mapping ساده و فرضی می‌گذاریم
 */
const MBTI_QUESTION_DIMENSIONS: Record<number, MbtiDimension> = {
  // E/I (برون‌گرایی/درون‌گرایی) - سوالات 1, 2, 4, 9, 11, 18
  1: "EI", 2: "EI", 4: "EI", 9: "EI", 11: "EI", 18: "EI",
  // S/N (حسی/شهودی) - سوالات 3, 10, 13, 16, 17, 19
  3: "SN", 10: "SN", 13: "SN", 16: "SN", 17: "SN", 19: "SN",
  // T/F (تفکری/احساسی) - سوالات 7, 8, 12, 14, 20
  7: "TF", 8: "TF", 12: "TF", 14: "TF", 20: "TF",
  // J/P (قضاوتی/ادراکی) - سوالات 5, 6, 15
  5: "JP", 6: "JP", 15: "JP",
};

function calculateMBTIScore(answers: MbtiAnswer[]): MbtiScoreResult {
  const dimScores: Record<MbtiDimension, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  const dimCounts: Record<MbtiDimension, number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };

  // محاسبه نمره هر بعد
  for (const ans of answers) {
    const dim = MBTI_QUESTION_DIMENSIONS[ans.questionId];
    if (!dim) {
      console.warn(`⚠️ [MBTI] Question ${ans.questionId} has no dimension mapping`);
      continue;
    }

    // تبدیل value به نمره (فرض: 0-4 یا 1-5)
    // اگر value از 0 شروع می‌شود، به 1-5 تبدیل می‌کنیم
    const normalizedValue = ans.value >= 1 ? ans.value : ans.value + 1;
    
    dimScores[dim] += normalizedValue;
    dimCounts[dim] += 1;
  }

  // محاسبه میانگین هر بعد
  const avgScores: Record<MbtiDimension, number> = {
    EI: dimCounts.EI > 0 ? dimScores.EI / dimCounts.EI : 0,
    SN: dimCounts.SN > 0 ? dimScores.SN / dimCounts.SN : 0,
    TF: dimCounts.TF > 0 ? dimScores.TF / dimCounts.TF : 0,
    JP: dimCounts.JP > 0 ? dimScores.JP / dimCounts.JP : 0,
  };

  // تعیین تیپ بر اساس midpoint (فرض: 3 برای مقیاس 1-5)
  const midpoint = 3;
  const typeLetters = {
    EI: avgScores.EI >= midpoint ? "E" : "I",
    SN: avgScores.SN >= midpoint ? "S" : "N",
    TF: avgScores.TF >= midpoint ? "T" : "F",
    JP: avgScores.JP >= midpoint ? "J" : "P",
  };

  const typeCode = `${typeLetters.EI}${typeLetters.SN}${typeLetters.TF}${typeLetters.JP}`;

  // محاسبه totalScore (میانگین کل ابعاد)
  const totalScore = (avgScores.EI + avgScores.SN + avgScores.TF + avgScores.JP) / 4;

  return {
    testId: "MBTI",
    totalScore: Math.round(totalScore * 100) / 100,
    dimensions: {
      EI: Math.round(avgScores.EI * 100) / 100,
      SN: Math.round(avgScores.SN * 100) / 100,
      TF: Math.round(avgScores.TF * 100) / 100,
      JP: Math.round(avgScores.JP * 100) / 100,
    },
    typeCode,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 [MBTI] Raw body:", body);

    const { answers, email } = body as {
      answers: { questionId: number; value: number }[] | number[];
      email?: string | null;
    };

    console.log("📥 [MBTI] Parsed:", {
      hasAnswers: !!answers,
      email,
    });

    // تبدیل answers به فرمت مورد نیاز
    let formattedAnswers: { questionId: number; value: number }[];
    if (Array.isArray(answers) && answers.length > 0) {
      if (typeof answers[0] === 'number') {
        formattedAnswers = (answers as number[]).map((value: number, index: number) => ({
          questionId: index + 1,
          value: value || 0,
        }));
      } else {
        formattedAnswers = answers as { questionId: number; value: number }[];
      }
    } else {
      console.error("❌ [MBTI] Invalid answers format");
      return NextResponse.json(
        { error: "answers is required and must be an array", saved: false },
        { status: 400 }
      );
    }

    console.log("📊 [MBTI] Formatted answers count:", formattedAnswers.length);

    // محاسبه نمره MBTI با تابع اختصاصی
    const mbtiScoreResult = calculateMBTIScore(formattedAnswers);
    console.log("✅ [MBTI] MBTI Score calculated:", {
      typeCode: mbtiScoreResult.typeCode,
      dimensions: mbtiScoreResult.dimensions,
      totalScore: mbtiScoreResult.totalScore,
    });

    // تبدیل به فرمت ScoredResult برای compatibility با interpretation
    const scoredResult = {
      testId: "MBTI",
      title: "تست شخصیت MBTI",
      totalScore: mbtiScoreResult.totalScore,
      totalLevelId: mbtiScoreResult.typeCode,
      totalLevelLabel: mbtiScoreResult.typeCode,
      interpretation: null,
      subscales: [
        { id: "EI", label: "برون‌گرایی/درون‌گرایی", score: mbtiScoreResult.dimensions.EI },
        { id: "SN", label: "حسی/شهودی", score: mbtiScoreResult.dimensions.SN },
        { id: "TF", label: "تفکری/احساسی", score: mbtiScoreResult.dimensions.TF },
        { id: "JP", label: "قضاوتی/ادراکی", score: mbtiScoreResult.dimensions.JP },
      ],
      rawAnswers: formattedAnswers,
      recommendedTests: [],
      recommendationMessages: [],
    };

    // ساخت تفسیر
    const interpretation = buildInterpretation([scoredResult]);
    console.log("✅ [MBTI] Interpretation created:", {
      chunksCount: interpretation.chunks.length,
    });

    // اگر ایمیل نداریم، یه ایمیل fallback بده
    const userEmail =
      email && email.trim() !== ""
        ? email.trim()
        : "anonymous@testology.local";

    console.log("👤 [MBTI] Using email:", userEmail);

    // Upsert کاربر
    console.log("🔄 [MBTI] Attempting to upsert user...");
    const user = await prisma.user.upsert({
      where: { email: userEmail },
      update: {
        isActive: true,
      },
      create: {
        email: userEmail,
        name: userEmail.split("@")[0],
        role: "USER",
        isActive: true,
      },
    });

    console.log("✅ [MBTI] Upserted user:", {
      id: user.id,
      email: user.email,
    });

    // محاسبه safeScore برای جلوگیری از NaN
    const safeScore =
      typeof mbtiScoreResult.totalScore === "number" &&
      Number.isFinite(mbtiScoreResult.totalScore)
        ? mbtiScoreResult.totalScore
        : 0;

    console.log("📊 [MBTI] Score check:", {
      originalScore: mbtiScoreResult.totalScore,
      safeScore: safeScore,
      isNaN: Number.isNaN(mbtiScoreResult.totalScore),
    });

    // ذخیره TestResult
    console.log("💾 [MBTI] Attempting to save test result...");
    const savedResult = await prisma.testResult.create({
      data: {
        // ❗ استفاده از connect به جای userId مستقیم
        user: { connect: { id: user.id } },
        testName: "تست شخصیت MBTI",
        testId: "MBTI",
        testSlug: "mbti",
        // ❗ استفاده از safeScore به جای NaN
        score: safeScore,
        result: mbtiScoreResult.typeCode,
        resultText: null,
        rawAnswers: JSON.stringify(formattedAnswers),
        answers: JSON.stringify(formattedAnswers),
        severity: null,
        interpretation: JSON.stringify(interpretation.chunks),
        subscales: JSON.stringify(mbtiScoreResult.dimensions),
        completed: true,
      },
    });

    console.log("✅ [MBTI] TestResult saved:", {
      id: savedResult.id,
      userId: savedResult.userId || "connected via relation",
      testId: savedResult.testId,
      testName: savedResult.testName,
      score: savedResult.score,
    });

    return NextResponse.json({
      success: true,
      result: {
        ...scoredResult,
        interpretation: interpretation.chunks,
        interpretationSummary: interpretation.summary,
      },
      saved: true,
    });
  } catch (err: any) {
    console.error("❌ [MBTI] Submit error:", err);
    console.error("❌ [MBTI] Error stack:", err.stack);
    console.error("❌ [MBTI] Error message:", err.message);
    return NextResponse.json(
      {
        success: false,
        error: "Server error in MBTI submit",
        details: err.message,
        saved: false,
      },
      { status: 500 }
    );
  }
}
