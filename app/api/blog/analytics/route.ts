import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

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
        viewCount: true
      }
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      analytics: {
        views: blog.viewCount,
        likes: 0,
        comments: 0
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
        updateData.viewCount = { increment: 1 }
        break
      case 'like':
        // likes field doesn't exist in schema
        return NextResponse.json({ error: 'Like action not supported' }, { status: 400 })
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