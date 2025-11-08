import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d as any) - (yearStart as any)) / 86400000 + 1) / 7)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('video') as File
    const caption = formData.get('caption') as string
    const mood = formData.get('mood') as string
    const tags = formData.get('tags') as string

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // بررسی نوع فایل
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'File must be a video' }, { status: 400 })
    }

    // بررسی حجم فایل (حداکثر 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum 100MB allowed' }, { status: 400 })
    }

    // تبدیل فایل به بافر
    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)

    // شبیه‌سازی آپلود به سرور (در واقعیت باید از Cloudinary یا S3 استفاده کرد)
    // برای این مثال، فایل را در پوشه public ذخیره می‌کنیم
    const fileName = `video-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`
    const filePath = `public/uploads/videos/${fileName}`
    
    // ایجاد پوشه اگر وجود ندارد
    const fs = require('fs')
    const path = require('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos')
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // ذخیره فایل
    fs.writeFileSync(path.join(process.cwd(), filePath), fileBuffer)

    // محاسبه هفته و سال
    const today = new Date()
    const week = getWeekNumber(today)
    const year = today.getFullYear()

    // پارس کردن تگ‌ها
    let parsedTags = []
    if (tags) {
      try {
        parsedTags = JSON.parse(tags)
      } catch {
        parsedTags = tags.split(',').map(tag => tag.trim())
      }
    }

    // ذخیره اطلاعات ویدئو در دیتابیس
    const videoLog = await prisma.videoLog.create({
      data: {
        userId: session.user.id,
        videoUrl: `/uploads/videos/${fileName}`,
        thumbnailUrl: null, // در واقعیت باید thumbnail تولید کرد
        caption: caption || '',
        duration: null, // در واقعیت باید از metadata فایل استخراج کرد
        fileSize: file.size,
        week,
        year,
        mood: mood || null,
        tags: parsedTags ? JSON.stringify(parsedTags) : null,
        isPrivate: true
      }
    })

    // ایجاد نوتیفیکیشن برای ضبط ویدئو
    await prisma.notification.create({
      data: {
        userId: session.user.id,
        title: '🎥 ویدئو ضبط شد!',
        message: `ویدئوی جدید شما با موفقیت ضبط و ذخیره شد.`,
        type: 'achievement',
        priority: 'normal',
        actionUrl: '/profile/videos'
      }
    })

    // اهدای XP برای ضبط ویدئو
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId: session.user.id }
    })

    if (userProgress) {
      await prisma.userProgress.update({
        where: { userId: session.user.id },
        data: {
          xp: { increment: 15 }, // 15 XP برای ضبط ویدئو
          lastActivity: new Date()
        }
      })
    }

    return NextResponse.json({
      success: true,
      videoLog: {
        id: videoLog.id,
        videoUrl: videoLog.videoUrl,
        caption: videoLog.caption,
        mood: videoLog.mood,
        week: videoLog.week,
        year: videoLog.year,
        createdAt: videoLog.createdAt
      }
    })

  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















