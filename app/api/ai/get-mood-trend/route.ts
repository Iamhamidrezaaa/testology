import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('userId')
    const category = searchParams.get('category')
    const days = searchParams.get('days') || '30'
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // محاسبه تاریخ شروع
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - parseInt(days))

    // دریافت نتایج تست‌ها
    const testResults = await prisma.testResult.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: startDate }
      },
      orderBy: { createdAt: 'asc' }
    })

    // دریافت داده‌های خلق و خو
    const moodData = await prisma.moodAggregate.findMany({
      where: {
        recordedAt: { gte: startDate }
      },
      orderBy: { recordedAt: 'asc' }
    })

    // تبدیل داده‌ها به فرمت مورد نیاز
    const moodTrendData = []

    // اضافه کردن نتایج تست‌ها
    for (const result of testResults) {
      let categoryName = 'mood'
      
      // تشخیص دسته‌بندی بر اساس نام تست
      if (result.testName.includes('اضطراب') || result.testName.includes('anxiety')) {
        categoryName = 'anxiety'
      } else if (result.testName.includes('تمرکز') || result.testName.includes('focus')) {
        categoryName = 'focus'
      } else if (result.testName.includes('عزت') || result.testName.includes('esteem')) {
        categoryName = 'selfEsteem'
      } else if (result.testName.includes('انگیزه') || result.testName.includes('motivation')) {
        categoryName = 'motivation'
      } else if (result.testName.includes('افسردگی') || result.testName.includes('depression')) {
        categoryName = 'mood'
      }

      moodTrendData.push({
        id: result.id,
        userId: user.id,
        category: categoryName,
        score: result.score,
        source: 'testResult',
        createdAt: result.createdAt.toISOString()
      })
    }

    // اضافه کردن داده‌های خلق و خو
    for (const mood of moodData) {
      let categoryName = 'mood'
      
      // تشخیص دسته‌بندی بر اساس نوع خلق و خو
      if (mood.moodType === 'anxious' || mood.moodType === 'worried' || mood.moodType === 'panicked') {
        categoryName = 'anxiety'
      } else if (mood.moodType === 'focused' || mood.moodType === 'concentrated') {
        categoryName = 'focus'
      } else if (mood.moodType === 'confident' || mood.moodType === 'proud') {
        categoryName = 'selfEsteem'
      } else if (mood.moodType === 'excited' || mood.moodType === 'motivated') {
        categoryName = 'motivation'
      }

      moodTrendData.push({
        id: mood.id,
        userId: user.id,
        category: categoryName,
        score: mood.intensity * 10, // تبدیل از 0-10 به 0-100
        source: 'moodAggregate',
        createdAt: mood.recordedAt.toISOString()
      })
    }

    // فیلتر بر اساس دسته‌بندی
    let filteredData = moodTrendData
    if (category && category !== 'all') {
      filteredData = moodTrendData.filter(item => item.category === category)
    }

    // محاسبه آمار
    const categories = Array.from(new Set(filteredData.map(item => item.category)))
    const averageScores: Record<string, number> = {}
    
    for (const cat of categories) {
      const categoryData = filteredData.filter(item => item.category === cat)
      const avgScore = categoryData.reduce((sum, item) => sum + item.score, 0) / categoryData.length
      averageScores[cat] = Math.round(avgScore * 10) / 10
    }

    const stats = {
      totalRecords: filteredData.length,
      categories: categories,
      dateRange: {
        start: startDate.toISOString(),
        end: new Date().toISOString()
      },
      averageScores: averageScores
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      stats: stats
    })
    
  } catch (error) {
    console.error('Error fetching mood trend:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت داده‌های روند روانی' },
      { status: 500 }
    )
  }
}