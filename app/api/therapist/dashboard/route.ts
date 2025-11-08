import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

/**
 * داشبورد جامع درمانگر
 * GET /api/therapist/dashboard
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // بررسی نقش درمانگر
    if (session.user.role !== 'THERAPIST' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden - Therapist access required' }, 
        { status: 403 }
      );
    }

    // Therapist and TherapistPatient models don't exist in schema
    // Returning empty array for now
    const patients: any[] = [];

    // دریافت اطلاعات تفصیلی هر بیمار
    const patientsWithDetails = await Promise.all(
      patients.map(async (patient: any) => {
        const userInfo = await prisma.user.findUnique({
          where: { id: patient.patientId || patient.userId },
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true
          }
        });

        // تست‌های اخیر
        const recentTests = await prisma.testResult.findMany({
          where: { userId: patient.patientId || patient.userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            testId: true,
            testName: true,
            score: true,
            createdAt: true
          }
        });

        // پیشرفت کاربر
        const progress = await prisma.userProgress.findUnique({
          where: { userId: patient.patientId || patient.userId }
        }).catch(() => null);

        // گیمیفیکیشن - model doesn't exist in schema
        const gamification = null;

        // تمرین‌های ارسال شده - CustomExercise model doesn't exist in schema
        const exercises: any[] = [];
        const completedExercises = 0;

        // احساسات اخیر
        const recentMoods = await prisma.moodEntry.findMany({
          where: { userId: patient.patientId || patient.userId },
          orderBy: { date: 'desc' },
          take: 7
        });

        // محاسبه سطح خطر بر اساس score (فرض: score پایین = خطر بالا)
        const highRiskTests = recentTests.filter(
          t => t.score !== null && t.score < 40
        ).length;

        const riskLevel = highRiskTests >= 3 ? 'high' : 
                         highRiskTests >= 1 ? 'medium' : 'low';

        return {
          ...patient,
          user: userInfo,
          stats: {
            totalTests: await prisma.testResult.count({
              where: { userId: patient.patientId || patient.userId }
            }),
            recentTests,
            progress,
            gamification,
            exercises: {
              total: exercises.length,
              completed: completedExercises,
              pending: exercises.length - completedExercises
            },
            recentMoods,
            riskLevel,
            highRiskTests
          }
        };
      })
    );

    // آمار کلی درمانگر
    const totalPatients = patients.length;
    const activePatients = 0; // status field doesn't exist
    
    // تعداد جلسات این ماه
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // TherapistSession model doesn't exist in schema
    const sessionsThisMonth = 0;

    // CustomExercise model doesn't exist in schema
    const totalExercises = 0;
    const completedExercises = 0;

    return NextResponse.json({
      success: true,
      patients: patientsWithDetails,
      stats: {
        totalPatients,
        activePatients,
        inactivePatients: totalPatients - activePatients,
        sessionsThisMonth,
        exercises: {
          total: totalExercises,
          completed: completedExercises,
          pending: totalExercises - completedExercises,
          completionRate: totalExercises > 0 
            ? Math.round((completedExercises / totalExercises) * 100) 
            : 0
        }
      }
    });

  } catch (error) {
    console.error('Error fetching therapist dashboard:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
















