import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    // دریافت پروفایل کاربر
    const userProfile = await prisma.userProfile.findUnique({
      where: { username },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true
          }
        }
      }
    })

    if (!userProfile) {
      return NextResponse.json({ error: 'پروفایل یافت نشد' }, { status: 404 })
    }

    // دریافت تست‌های انجام شده
    const completedTests = await prisma.testResult.findMany({
      where: {
        userId: userProfile.userId,
        completed: true
      },
      select: {
        id: true,
        testName: true,
        testSlug: true,
        score: true,
        totalScore: true,
        result: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // محاسبه آمار
    const stats = {
      totalTests: completedTests.length,
      averageScore: completedTests.length > 0 
        ? Math.round(completedTests.reduce((sum, test) => sum + (test.score || 0), 0) / completedTests.length)
        : 0,
      lastTestDate: completedTests[0]?.createdAt || null
    }

    return NextResponse.json({
      profile: {
        ...userProfile,
        stats,
        completedTests
      }
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
















