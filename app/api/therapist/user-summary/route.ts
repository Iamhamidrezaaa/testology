import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'therapist') {
    return new Response(JSON.stringify({ error: 'دسترسی غیرمجاز' }), { status: 403 })
  }

  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId الزامی است' }), { status: 400 })
    }

    // بررسی اینکه کاربر متعلق به این مشاور است
    const isOwnClient = await prisma.user.count({ 
      where: { id: userId, assignedTherapistId: session.user.id } 
    })
    
    if (!isOwnClient) {
      return new Response(JSON.stringify({ error: 'این کاربر به شما اختصاص ندارد' }), { status: 403 })
    }

    // دریافت نتایج تست‌های کاربر
    const results = await prisma.testResult.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        testName: true,
        testSlug: true,
        type: true,
        score: true,
        totalScore: true,
        result: true,
        completed: true,
        createdAt: true,
        extraData: true
      }
    })

    // فرمت کردن نتایج برای نمایش
    const formattedResults = results.map(test => ({
      id: test.id,
      testName: test.testName,
      testSlug: test.testSlug,
      type: test.type,
      score: test.score,
      totalScore: test.totalScore,
      result: test.result,
      completed: test.completed,
      completedAt: test.createdAt,
      summary: test.result?.slice(0, 100) + (test.result && test.result.length > 100 ? '...' : ''),
      label: getTestLabel(test.type, test.score, test.totalScore)
    }))

    return NextResponse.json({ results: formattedResults })
  } catch (error) {
    console.error('user-summary error:', error)
    return new Response(JSON.stringify({ error: 'خطای داخلی سرور' }), { status: 500 })
  }
}

function getTestLabel(type: string, score?: number | null, totalScore?: number | null): string {
  if (!score || !totalScore) return '-'
  
  const percentage = (score / totalScore) * 100
  
  switch (type) {
    case 'psychological':
      if (percentage >= 80) return 'نمره بالا'
      if (percentage >= 60) return 'نمره متوسط'
      return 'نمره پایین'
    case 'personality':
      if (percentage >= 70) return 'قوی'
      if (percentage >= 40) return 'متوسط'
      return 'ضعیف'
    default:
      if (percentage >= 70) return 'خوب'
      if (percentage >= 40) return 'متوسط'
      return 'نیاز به بهبود'
  }
}





















