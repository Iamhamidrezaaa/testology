import { NextRequest, NextResponse } from "next/server"
import { analyzeTestWithGPT } from "@/lib/services/analyze-test"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from '@/lib/auth'
import { awardXP } from "@/lib/services/gamification"

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
      testSlug: "rosenberg",
      answers,
    })

    if (!user || !user.id) {
      return NextResponse.json({ error: "احراز هویت انجام نشد." }, { status: 401 })
    }

    const testResult = await prisma.testResult.create({
      data: {
        userId: user.id,
        testSlug: "rosenberg",
        testName: "تست عزت نفس روزنبرگ",
        score,
        resultText,
        rawAnswers: answers,
        completed: true
      },
    })

    // اهدای XP و بررسی دستاوردها
    const gamificationResult = await awardXP(user.id, 'test_completed')

    return NextResponse.json({
      success: true,
      score,
      resultText,
      gamification: {
        xpGained: gamificationResult.xpGained,
        newLevel: gamificationResult.newLevel,
        levelUp: gamificationResult.levelUp,
        badgesEarned: gamificationResult.badgesEarned
      }
    })

  } catch (error) {
    console.error("❌ analyze-rosenberg error:", error)
    return NextResponse.json({ error: "خطای داخلی سرور." }, { status: 500 })
  }
}

