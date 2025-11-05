import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import { calculateMoodScore } from '@/lib/services/analyze-combined'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // دریافت تست‌های کاربر برای محاسبه mood profile
    const tests = await prisma.testResult.findMany({
      where: { 
        userId: session.user.id,
        completed: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // آخرین 10 تست
    })

    // محاسبه mood score بر اساس تست‌ها
    const moodProfiles = tests.map(test => {
      let moodScore = 0
      let summary = ''

      // محاسبه امتیاز خلق‌وخو بر اساس نوع تست
      switch (test.testSlug) {
        case 'rosenberg':
          moodScore = test.score ? (test.score / 40) * 100 : 50
          summary = test.score >= 30 ? 'عزت نفس بالا' : 
                   test.score >= 20 ? 'عزت نفس متوسط' : 'عزت نفس پایین'
          break
        
        case 'swls':
          moodScore = test.score ? (test.score / 35) * 100 : 50
          summary = test.score >= 25 ? 'رضایت از زندگی بالا' : 
                   test.score >= 15 ? 'رضایت از زندگی متوسط' : 'رضایت از زندگی پایین'
          break
        
        case 'gad7':
          moodScore = test.score ? Math.max(0, 100 - (test.score / 21) * 100) : 50
          summary = test.score <= 4 ? 'اضطراب کم' : 
                   test.score <= 9 ? 'اضطراب متوسط' : 'اضطراب بالا'
          break
        
        case 'phq9':
          moodScore = test.score ? Math.max(0, 100 - (test.score / 27) * 100) : 50
          summary = test.score <= 4 ? 'افسردگی کم' : 
                   test.score <= 9 ? 'افسردگی متوسط' : 'افسردگی بالا'
          break
        
        case 'pss':
          moodScore = test.score ? Math.max(0, 100 - (test.score / 40) * 100) : 50
          summary = test.score <= 13 ? 'استرس کم' : 
                   test.score <= 26 ? 'استرس متوسط' : 'استرس بالا'
          break
        
        default:
          moodScore = test.score ? (test.score / 100) * 100 : 50
          summary = 'وضعیت عمومی'
      }

      return {
        id: test.id,
        createdAt: test.createdAt,
        moodScore: Math.round(moodScore),
        summary: summary,
        testName: test.testName,
        testSlug: test.testSlug
      }
    })

    // محاسبه mood score کلی
    const overallMoodScore = await calculateMoodScore(tests)

    return NextResponse.json({ 
      moods: moodProfiles,
      overallMoodScore: Math.round(overallMoodScore),
      testCount: tests.length
    })

  } catch (error) {
    console.error('Error fetching mood profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
