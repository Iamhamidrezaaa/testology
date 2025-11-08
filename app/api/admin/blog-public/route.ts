import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // دریافت مقالات از دیتابیس
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        metaDescription: true,
        content: true,
        category: true,
        imageUrl: true,
        tags: true,
        published: true,
        featured: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }).catch(() => [])

    return NextResponse.json({
      blogs: blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        slug: blog.slug,
        metaDescription: blog.metaDescription,
        content: blog.content,
        category: blog.category,
        author: blog.author?.name || 'نامشخص',
        imageUrl: blog.imageUrl,
        tags: blog.tags ? (typeof blog.tags === 'string' ? blog.tags.split(',').map(tag => tag.trim()) : blog.tags) : [],
        published: blog.published,
        featured: blog.featured,
        viewCount: blog.viewCount || 0,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt
      }))
    })

  } catch (error) {
    console.error('Error fetching blogs:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت مقالات' },
      { status: 500 }
    )
  }
}
