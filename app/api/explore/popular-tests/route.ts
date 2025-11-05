import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // دریافت تست‌های محبوب بر اساس تعداد انجام
    const popularTests = await prisma.testResult.groupBy({
      by: ['testSlug', 'testName'],
      where: {
        completed: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 10
    })

    // دریافت اطلاعات کامل تست‌ها
    const testsWithDetails = await Promise.all(
      popularTests.map(async (test) => {
        const testDetails = await prisma.test.findFirst({
          where: {
            slug: test.testSlug
          },
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            estimatedTime: true,
            difficulty: true
          }
        })

        return {
          slug: test.testSlug,
          name: test.testName,
          completionCount: test._count.id,
          details: testDetails
        }
      })
    )

    return NextResponse.json({ tests: testsWithDetails })

  } catch (error) {
    console.error('Error fetching popular tests:', error)
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}
















