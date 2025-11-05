import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const blogId = searchParams.get('blogId')

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const comments = await prisma.blogComment.findMany({
      where: { 
        blogId,
        approved: true 
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      comments
    })

  } catch (error) {
    console.error('Error fetching blog comments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { blogId, content, author, email } = await req.json()

    if (!blogId || !content || !author || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const comment = await prisma.blogComment.create({
      data: {
        blogId,
        content,
        author,
        email,
        approved: false // نیاز به تایید ادمین
      }
    })

    return NextResponse.json({
      success: true,
      comment
    })

  } catch (error) {
    console.error('Error creating blog comment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}