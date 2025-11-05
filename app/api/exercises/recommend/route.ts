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

    // دریافت تمرینات متنوع
    const recommendedExercises = []

    // تمرینات اضطراب
    const anxietyExercises = await prisma.exercise.findMany({
      where: {
        type: 'اضطراب',
        isActive: true
      },
      take: 2
    })
    recommendedExercises.push(...anxietyExercises)

    // تمرینات استرس
    const stressExercises = await prisma.exercise.findMany({
      where: {
        type: 'استرس',
        isActive: true
      },
      take: 2
    })
    recommendedExercises.push(...stressExercises)

    // تمرینات اعتماد به نفس
    const confidenceExercises = await prisma.exercise.findMany({
      where: {
        type: 'اعتماد به نفس',
        isActive: true
      },
      take: 2
    })
    recommendedExercises.push(...confidenceExercises)

    // تمرینات عمومی
    const generalExercises = await prisma.exercise.findMany({
      where: {
        type: 'عمومی',
        isActive: true
      },
      take: 2
    })
    recommendedExercises.push(...generalExercises)

    // حذف تکرارها
    const uniqueExercises = recommendedExercises.filter((exercise, index, self) => 
      index === self.findIndex(e => e.id === exercise.id)
    )

    return NextResponse.json({
      success: true,
      exercises: uniqueExercises,
      analysis: {
        anxietyLevel: 'medium',
        confidenceLevel: 'medium',
        riskLevel: 'low'
      }
    })
    
  } catch (error) {
    console.error('Error recommending exercises:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در پیشنهاد تمرینات' },
      { status: 500 }
    )
  }
}
