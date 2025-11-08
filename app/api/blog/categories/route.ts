import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/blog/categories - دریافت همه دسته‌بندی‌ها
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: {
        name: 'asc'
      }
    }).catch(() => [])

    // محاسبه تعداد پست‌های منتشر شده برای هر دسته
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const postCount = await prisma.blog.count({
          where: {
            category: category.slug,
            published: true
          }
        }).catch(() => 0)
        return {
          ...category,
          postCount
        }
      })
    )

    return NextResponse.json(categoriesWithCounts)
  } catch (error) {
    console.error('Error fetching blog categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    )
  }
}
















