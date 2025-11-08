import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const { caption, mood, tags, isPrivate } = await req.json()

    // بررسی اینکه ویدئو متعلق به کاربر است
    const video = await prisma.videoLog.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // پارس کردن تگ‌ها
    let parsedTags = video.tags
    if (tags !== undefined) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags
      } catch {
        parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags
      }
    }

    // به‌روزرسانی ویدئو
    const updatedVideo = await prisma.videoLog.update({
      where: { id },
      data: {
        ...(caption !== undefined && { caption }),
        ...(mood !== undefined && { mood }),
        ...(tags !== undefined && { tags: parsedTags ? JSON.stringify(parsedTags) : null }),
        ...(isPrivate !== undefined && { isPrivate })
      }
    })

    return NextResponse.json({
      success: true,
      video: updatedVideo
    })

  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    // بررسی اینکه ویدئو متعلق به کاربر است
    const video = await prisma.videoLog.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // حذف فایل فیزیکی (اختیاری)
    try {
      const fs = require('fs')
      const path = require('path')
      const filePath = path.join(process.cwd(), 'public', video.videoUrl)
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error('Error deleting video file:', error)
    }

    // حذف از دیتابیس
    await prisma.videoLog.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Video deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting video:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















