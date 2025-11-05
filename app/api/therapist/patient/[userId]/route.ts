import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = params

    // بررسی اینکه کاربر درمانگر است
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    })

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    // بررسی اینکه بیمار متعلق به این درمانگر است
    const patient = await prisma.patient.findFirst({
      where: {
        userId,
        therapistId: therapist.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        }
      }
    })

    if (!patient) {
      return NextResponse.json({ error: 'Patient not found or not assigned to this therapist' }, { status: 404 })
    }

    // دریافت نتایج تست‌های بیمار
    const testResults = await prisma.testResult.findMany({
      where: { userId, completed: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // دریافت ورودی‌های احساسات
    const moodEntries = await prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 30
    })

    // دریافت تحلیل روان‌شناسی
    const mentalHealthProfile = await prisma.mentalHealthProfile.findUnique({
      where: { userId }
    })

    // دریافت پیشرفت کاربر
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    })

    return NextResponse.json({
      patient: {
        id: patient.id,
        user: patient.user,
        notes: patient.notes,
        status: patient.status,
        assignedContent: patient.assignedContent,
        createdAt: patient.createdAt
      },
      testResults,
      moodEntries,
      mentalHealthProfile,
      userProgress,
      stats: {
        totalTests: testResults.length,
        totalMoodEntries: moodEntries.length,
        lastTestDate: testResults[0]?.createdAt,
        lastMoodDate: moodEntries[0]?.date
      }
    })

  } catch (error) {
    console.error('Error fetching patient details:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
















