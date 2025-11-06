import { NextRequest, NextResponse } from "next/server"
import { analyzeTestWithGPT } from "@/lib/services/analyze-test"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const user = session?.user

    const body = await req.json()
    const { answers } = body

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: "پاسخ‌ها نامعتبر هستند." }, { status: 400 })
    }

    const { score, resultText } = await analyzeTestWithGPT({
      testSlug: "pss",
      answers,
    })

    if (!user || !user.id) {
      return NextResponse.json({ error: "احراز هویت انجام نشد." }, { status: 401 })
    }

    await prisma.testResult.create({
      data: {
        userId: user.id,
        testSlug: "pss",
        testName: "تست استرس ادراک‌شده",
        score,
        resultText,
        rawAnswers: answers,
        completed: true
      },
    })

    return NextResponse.json({
      success: true,
      score,
      resultText,
    })

  } catch (error) {
    console.error("❌ analyze-pss error:", error)
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 })
  }
}

