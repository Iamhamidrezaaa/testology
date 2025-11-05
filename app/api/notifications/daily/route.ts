import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // دریافت تمام کاربران فعال
    const users = await prisma.user.findMany({
      where: {
        // فقط کاربران فعال
        email: { not: null }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    const today = new Date()
    const todayFormatted = today.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })

    const notifications = []

    for (const user of users) {
      // بررسی آخرین فعالیت کاربر
      const lastActivity = await prisma.userProgress.findUnique({
        where: { userId: user.id },
        select: { lastActivity: true }
      })

      const daysSinceLastActivity = lastActivity?.lastActivity 
        ? Math.floor((today.getTime() - lastActivity.lastActivity.getTime()) / (1000 * 60 * 60 * 24))
        : 999

      // تولید نوتیفیکیشن‌های مختلف بر اساس وضعیت کاربر
      let notification = null

      if (daysSinceLastActivity === 0) {
        // کاربر امروز فعال بوده
        notification = {
          userId: user.id,
          title: '🎉 عالی!',
          message: `سلام ${user.name}! امروز ${todayFormatted} است و شما در مسیر رشد خود پیشرفت خوبی داشته‌اید. ادامه دهید!`,
          type: 'achievement',
          priority: 'normal',
          actionUrl: '/profile/progress'
        }
      } else if (daysSinceLastActivity === 1) {
        // یک روز گذشته
        notification = {
          userId: user.id,
          title: '🌅 صبح بخیر!',
          message: `سلام ${user.name}! امروز ${todayFormatted} است. آماده‌ای برای یک تمرین جدید یا بررسی احساساتت؟`,
          type: 'reminder',
          priority: 'normal',
          actionUrl: '/tests'
        }
      } else if (daysSinceLastActivity === 3) {
        // سه روز گذشته
        notification = {
          userId: user.id,
          title: '💪 یادآوری دوستانه',
          message: `سلام ${user.name}! چند روزی است که شما را ندیده‌ایم. چطور احساس می‌کنید؟`,
          type: 'reminder',
          priority: 'high',
          actionUrl: '/profile/mood'
        }
      } else if (daysSinceLastActivity >= 7) {
        // یک هفته یا بیشتر
        notification = {
          userId: user.id,
          title: '🤗 ما دلتنگ شما هستیم!',
          message: `سلام ${user.name}! مدتی است که شما را ندیده‌ایم. آیا همه چیز خوب است؟`,
          type: 'warning',
          priority: 'urgent',
          actionUrl: '/contact'
        }
      } else {
        // روزهای عادی
        const motivationalMessages = [
          'امروز روز خوبی برای رشد شخصی است! 🌱',
          'هر قدم کوچک در مسیر رشد، ارزشمند است! 👣',
          'احساسات شما مهم است. امروز چطور احساس می‌کنید؟ 😊',
          'یک تست کوتاه می‌تواند بینش جالبی به شما بدهد! 🧠',
          'مراقبت از سلامت روان، سرمایه‌گذاری روی آینده است! 💎'
        ]
        
        const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
        
        notification = {
          userId: user.id,
          title: '🌞 سلام!',
          message: `سلام ${user.name}! امروز ${todayFormatted} است. ${randomMessage}`,
          type: 'info',
          priority: 'normal',
          actionUrl: '/dashboard'
        }
      }

      if (notification) {
        const createdNotification = await prisma.smartNotification.create({
          data: notification
        })
        notifications.push(createdNotification)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Daily notifications sent to ${notifications.length} users`,
      notifications: notifications.length,
      date: todayFormatted
    })

  } catch (error) {
    console.error('Error sending daily notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















