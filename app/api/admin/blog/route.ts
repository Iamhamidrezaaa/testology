import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // دریافت مقالات از دیتابیس
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

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
        tags: blog.tags,
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // فقط ادمین مجاز است
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, slug, metaDescription, content, category, imageUrl, tags, published, featured } = await req.json()

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'عنوان، slug و محتوا الزامی است' },
        { status: 400 }
      )
    }

    // ایجاد مقاله جدید
    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        metaDescription: metaDescription || '',
        content,
        category: category || 'general',
        imageUrl: imageUrl || '',
        tags: tags || [],
        published: published || false,
        featured: featured || false,
        viewCount: 0,
        authorId: session.user.id
      }
    })

    return NextResponse.json({
      blog: newBlog,
      message: 'مقاله با موفقیت ایجاد شد'
    })

  } catch (error) {
    console.error('Error creating blog:', error)
    return NextResponse.json(
      { error: 'خطا در ایجاد مقاله' },
      { status: 500 }
    )
  }
}



