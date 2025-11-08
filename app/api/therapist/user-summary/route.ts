import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== 'THERAPIST') {
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
        testId: true,
        score: true,
        result: true,
        analysis: true,
        createdAt: true
      }
    })

    // فرمت کردن نتایج برای نمایش
    const formattedResults = results.map(test => ({
      id: test.id,
      testName: test.testName,
      testId: test.testId,
      score: test.score,
      result: test.result,
      analysis: test.analysis,
      completedAt: test.createdAt,
      summary: test.result?.slice(0, 100) + (test.result && test.result.length > 100 ? '...' : ''),
      label: getTestLabel(test.score)
    }))

    return NextResponse.json({ results: formattedResults })
  } catch (error) {
    console.error('user-summary error:', error)
    return new Response(JSON.stringify({ error: 'خطای داخلی سرور' }), { status: 500 })
  }
}

function getTestLabel(score?: number | null): string {
  if (!score) return '-'
  
  if (score >= 80) return 'نمره بالا'
  if (score >= 60) return 'نمره متوسط'
  if (score >= 40) return 'نمره پایین'
  return 'نیاز به بهبود'
}





















