import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // دریافت تست‌های محبوب بر اساس تعداد انجام
    const popularTests = await prisma.testResult.groupBy({
      by: ['testName'],
      where: {},
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
            testSlug: test.testName.toLowerCase().replace(/\s+/g, '-') || test.testName
          },
          select: {
            id: true,
            testSlug: true,
            testName: true,
            description: true,
            category: true,
            isActive: true
          }
        })

        return {
          slug: testDetails?.testSlug || test.testName.toLowerCase().replace(/\s+/g, '-'),
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
















