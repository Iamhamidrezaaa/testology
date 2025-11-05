import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // دریافت ویدئوهای کاربر
    const videos = await prisma.videoLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    // گروه‌بندی ویدئوها بر اساس هفته
    const videosByWeek = videos.reduce((acc, video) => {
      const weekKey = `${video.year}-W${video.week}`
      if (!acc[weekKey]) {
        acc[weekKey] = []
      }
      acc[weekKey].push(video)
      return acc
    }, {} as Record<string, any[]>)

    // آمار کلی
    const stats = {
      totalVideos: videos.length,
      totalDuration: videos.reduce((sum, video) => sum + (video.duration || 0), 0),
      totalSize: videos.reduce((sum, video) => sum + (video.fileSize || 0), 0),
      moodCounts: videos.reduce((acc, video) => {
        if (video.mood) {
          acc[video.mood] = (acc[video.mood] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      videos,
      videosByWeek,
      stats
    })

  } catch (error) {
    console.error('Error fetching user videos:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















