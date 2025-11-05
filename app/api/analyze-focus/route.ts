import { analyzeTestWithGPT } from "@/lib/services/analyze-test";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { answers } = await req.json();
    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "Invalid answers" }, { status: 400 });
    }

    const result = await analyzeTestWithGPT("focus", answers);

    const savedResult = await prisma.testResult.create({
      data: {
        userId: session.user.id,
        testSlug: "focus",
        testName: "تست تمرکز",
        score: result.score,
        resultText: result.resultText,
        rawAnswers: answers,
        completed: true
      }
    });

    return NextResponse.json(savedResult);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

















