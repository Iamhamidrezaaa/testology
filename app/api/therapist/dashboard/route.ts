import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Therapist access required' }, 
        { status: 403 }
      );
    }

    // دریافت اطلاعات درمانگر
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 });
    }

    // دریافت تمام بیماران
    const patients = await prisma.therapistPatient.findMany({
      where: { therapistId: therapist.id },
      include: {
        // اطلاعات کاربری پس از این در یک query جداگانه می‌گیریم
      }
    });

    // دریافت اطلاعات تفصیلی هر بیمار
    const patientsWithDetails = await Promise.all(
      patients.map(async (patient) => {
        const userInfo = await prisma.user.findUnique({
          where: { id: patient.patientId },
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
          where: { userId: patient.patientId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          select: {
            id: true,
            testSlug: true,
            testName: true,
            score: true,
            severity: true,
            createdAt: true
          }
        });

        // پیشرفت کاربر
        const progress = await prisma.userProgress.findUnique({
          where: { userId: patient.patientId }
        });

        // گیمیفیکیشن
        const gamification = await prisma.gamification.findUnique({
          where: { userId: patient.patientId }
        });

        // تمرین‌های ارسال شده
        const exercises = await prisma.customExercise.findMany({
          where: {
            userId: patient.patientId,
            therapistId: session.user.id
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        });

        const completedExercises = exercises.filter(e => e.completed).length;

        // احساسات اخیر
        const recentMoods = await prisma.moodEntry.findMany({
          where: { userId: patient.patientId },
          orderBy: { date: 'desc' },
          take: 7
        });

        // محاسبه سطح خطر
        const highRiskTests = recentTests.filter(
          t => t.severity === 'شدید' || t.severity === 'severe' || t.severity === 'high'
        ).length;

        const riskLevel = highRiskTests >= 3 ? 'high' : 
                         highRiskTests >= 1 ? 'medium' : 'low';

        return {
          ...patient,
          user: userInfo,
          stats: {
            totalTests: await prisma.testResult.count({
              where: { userId: patient.patientId }
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
    const activePatients = patients.filter(p => p.status === 'active').length;
    
    // تعداد جلسات این ماه
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const sessionsThisMonth = await prisma.therapistSession.count({
      where: {
        therapistId: therapist.id,
        date: {
          gte: thisMonth
        }
      }
    });

    // تمرین‌های ارسال شده
    const totalExercises = await prisma.customExercise.count({
      where: { therapistId: session.user.id }
    });

    const completedExercises = await prisma.customExercise.count({
      where: {
        therapistId: session.user.id,
        completed: true
      }
    });

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
















