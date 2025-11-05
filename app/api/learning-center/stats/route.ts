import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // دریافت کاربر
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // آمار کلی
    const totalCourses = await prisma.exercise.count({
      where: { isActive: true }
    })

    const completedExercises = await prisma.userExercise.count({
      where: {
        userId: user.id,
        isCompleted: true
      }
    })

    const totalStudyTime = await prisma.userExercise.aggregate({
      where: {
        userId: user.id,
        isCompleted: true
      },
      _sum: {
        exercise: {
          duration: true
        }
      }
    })

    // محاسبه روزهای متوالی مطالعه
    const studyDays = await prisma.userExercise.findMany({
      where: {
        userId: user.id,
        isCompleted: true
      },
      select: {
        completedAt: true
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    let consecutiveDays = 0
    if (studyDays.length > 0) {
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      let currentDate = new Date(studyDays[0].completedAt)
      consecutiveDays = 1
      
      for (let i = 1; i < studyDays.length; i++) {
        const exerciseDate = new Date(studyDays[i].completedAt)
        const diffTime = currentDate.getTime() - exerciseDate.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays === 1) {
          consecutiveDays++
          currentDate = exerciseDate
        } else {
          break
        }
      }
    }

    // نمودار پیشرفت یادگیری (6 هفته گذشته)
    const sixWeeksAgo = new Date()
    sixWeeksAgo.setDate(sixWeeksAgo.getDate() - 42)

    const weeklyProgress = []
    for (let i = 5; i >= 0; i--) {
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - (i * 7))
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      const weekExercises = await prisma.userExercise.count({
        where: {
          userId: user.id,
          isCompleted: true,
          completedAt: {
            gte: weekStart,
            lte: weekEnd
          }
        }
      })

      const weekStudyTime = await prisma.userExercise.aggregate({
        where: {
          userId: user.id,
          isCompleted: true,
          completedAt: {
            gte: weekStart,
            lte: weekEnd
          }
        },
        _sum: {
          exercise: {
            duration: true
          }
        }
      })

      weeklyProgress.push({
        week: `هفته ${6 - i}`,
        exercises: weekExercises,
        studyTime: weekStudyTime._sum.exercise?.duration || 0,
        score: weekExercises * 10 // امتیاز ساده
      })
    }

    // نمودار زمان مطالعه روزانه (7 روز گذشته)
    const dailyStudyTime = []
    const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه']
    
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date()
      dayStart.setDate(dayStart.getDate() - i)
      dayStart.setHours(0, 0, 0, 0)
      const dayEnd = new Date(dayStart)
      dayEnd.setHours(23, 59, 59, 999)

      const dayStudyTime = await prisma.userExercise.aggregate({
        where: {
          userId: user.id,
          isCompleted: true,
          completedAt: {
            gte: dayStart,
            lte: dayEnd
          }
        },
        _sum: {
          exercise: {
            duration: true
          }
        }
      })

      dailyStudyTime.push({
        day: days[6 - i],
        minutes: dayStudyTime._sum.exercise?.duration || 0
      })
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalCourses,
        completedCourses: completedExercises,
        totalStudyTime: totalStudyTime._sum.exercise?.duration || 0,
        consecutiveDays
      },
      charts: {
        weeklyProgress,
        dailyStudyTime
      }
    })
    
  } catch (error) {
    console.error('Error fetching learning center stats:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آمار مرکز یادگیری' },
      { status: 500 }
    )
  }
}





