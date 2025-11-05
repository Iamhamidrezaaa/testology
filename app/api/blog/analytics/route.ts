import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const blogId = searchParams.get('blogId')

    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 })
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
      select: {
        views: true,
        likes: true,
        comments: {
          select: { id: true }
        }
      }
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      analytics: {
        views: blog.views,
        likes: blog.likes,
        comments: blog.comments.length
      }
    })

  } catch (error) {
    console.error('Error fetching blog analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { blogId, action } = await req.json()

    if (!blogId || !action) {
      return NextResponse.json({ error: 'Blog ID and action are required' }, { status: 400 })
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    let updateData: any = {}

    switch (action) {
      case 'view':
        updateData.views = { increment: 1 }
        break
      case 'like':
        updateData.likes = { increment: 1 }
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    await prisma.blog.update({
      where: { id: blogId },
      data: updateData
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating blog analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}