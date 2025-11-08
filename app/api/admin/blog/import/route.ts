// API endpoint برای import مقالات از فایل‌های Markdown
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      title,
      slug,
      excerpt,
      content,
      coverUrl,
      tags,
      category,
      author,
      published,
      meta
    } = body

    // بررسی وجود دسته‌بندی
    let categoryRecord = await prisma.blogCategory.findUnique({
      where: { slug: category }
    })

    if (!categoryRecord) {
      // ایجاد دسته‌بندی جدید اگر وجود نداشته باشد
      categoryRecord = await prisma.blogCategory.create({
        data: {
          name: getCategoryName(category),
          slug: category,
          description: getCategoryDescription(category),
          color: getCategoryColor(category),
          icon: getCategoryIcon(category)
        }
      })
    }

    // بررسی وجود نویسنده
    let authorRecord = await prisma.user.findFirst({
      where: { name: author }
    })

    if (!authorRecord) {
      // ایجاد نویسنده جدید اگر وجود نداشته باشد
      authorRecord = await prisma.user.create({
        data: {
          name: author,
          email: `${author.toLowerCase().replace(/\s+/g, '.')}@testology.ir`,
          role: 'ADMIN'
        }
      })
    }

    // بررسی وجود مقاله با همین slug
    const existingArticle = await prisma.blog.findUnique({
      where: { slug }
    })

    if (existingArticle) {
      // آپدیت مقاله موجود
      const updatedArticle = await prisma.blog.update({
        where: { slug },
        data: {
          title,
          metaDescription: excerpt,
          content,
          imageUrl: coverUrl,
          tags,
          published,
          category: categoryRecord.slug,
          authorId: authorRecord.id,
          updatedAt: new Date()
        }
      })

      return NextResponse.json({
        success: true,
        message: 'مقاله با موفقیت آپدیت شد',
        article: updatedArticle
      })
    } else {
      // ایجاد مقاله جدید
      const newArticle = await prisma.blog.create({
        data: {
          title,
          slug,
          metaDescription: excerpt,
          content,
          imageUrl: coverUrl,
          tags,
          published,
          category: categoryRecord.slug,
          authorId: authorRecord.id
        }
      })

      return NextResponse.json({
        success: true,
        message: 'مقاله با موفقیت ایجاد شد',
        article: newArticle
      })
    }

  } catch (error) {
    console.error('خطا در import مقاله:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در import مقاله',
        error: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    )
  }
}

// توابع کمکی برای دسته‌بندی‌ها
function getCategoryName(slug: string): string {
  const names: Record<string, string> = {
    'mental-health': 'سلامت روان',
    'personal-growth': 'رشد شخصی',
    'relationships': 'روابط',
    'family': 'خانواده',
    'general': 'عمومی'
  }
  return names[slug] || 'عمومی'
}

function getCategoryDescription(slug: string): string {
  const descriptions: Record<string, string> = {
    'mental-health': 'مقالات مربوط به سلامت روان و اختلالات روانی',
    'personal-growth': 'مقالات رشد شخصی و توسعه فردی',
    'relationships': 'مقالات مربوط به روابط و ارتباطات',
    'family': 'مقالات مربوط به خانواده و تربیت',
    'general': 'مقالات عمومی روانشناسی'
  }
  return descriptions[slug] || 'مقالات عمومی'
}

function getCategoryColor(slug: string): string {
  const colors: Record<string, string> = {
    'mental-health': '#ef4444',
    'personal-growth': '#3b82f6',
    'relationships': '#10b981',
    'family': '#f59e0b',
    'general': '#6b7280'
  }
  return colors[slug] || '#6b7280'
}

function getCategoryIcon(slug: string): string {
  const icons: Record<string, string> = {
    'mental-health': '🧠',
    'personal-growth': '🌱',
    'relationships': '💕',
    'family': '👨‍👩‍👧‍👦',
    'general': '📚'
  }
  return icons[slug] || '📚'
}