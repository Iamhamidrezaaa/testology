import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * API برای دریافت اطلاعات کامل یک بیمار
 * GET /api/therapist/patients/[patientId]
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patientId } = params;

    // دریافت اطلاعات بیمار
    const user = await prisma.user.findUnique({
      where: { id: patientId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        birthDate: true,
        gender: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    // دریافت تمام تست‌های بیمار
    const testResults = await prisma.testResult.findMany({
      where: { userId: patientId },
      orderBy: { createdAt: 'desc' }
    });

    // دریافت پیشرفت
    const progress = await prisma.userProgress.findUnique({
      where: { userId: patientId }
    });

    // دریافت جلسات
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    const sessions = therapist ? await prisma.therapistSession.findMany({
      where: {
        therapistId: therapist.id,
        patientId: patientId
      },
      orderBy: { date: 'desc' }
    }) : [];

    // دریافت یادداشت‌های درمانگر
    const patientRelation = therapist ? await prisma.therapistPatient.findUnique({
      where: {
        therapistId_patientId: {
          therapistId: therapist.id,
          patientId: patientId
        }
      }
    }) : null;

    // تحلیل ترکیبی تست‌ها
    const analysis = analyzeTestResults(testResults);

    return NextResponse.json({
      success: true,
      patient: {
        ...user,
        tests: testResults,
        progress,
        sessions,
        notes: patientRelation?.notes,
        analysis
      }
    });

  } catch (error) {
    console.error('Error fetching patient details:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * API برای به‌روزرسانی یادداشت‌های بیمار
 * PATCH /api/therapist/patients/[patientId]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patientId } = params;
    const { notes, status } = await req.json();

    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
    }

    // به‌روزرسانی
    const updated = await prisma.therapistPatient.update({
      where: {
        therapistId_patientId: {
          therapistId: therapist.id,
          patientId: patientId
        }
      },
      data: {
        notes: notes !== undefined ? notes : undefined,
        status: status !== undefined ? status : undefined
      }
    });

    return NextResponse.json({
      success: true,
      patient: updated
    });

  } catch (error) {
    console.error('Error updating patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * تحلیل ترکیبی نتایج تست‌ها
 */
function analyzeTestResults(tests: any[]) {
  if (tests.length === 0) {
    return {
      summary: 'هنوز تستی انجام نشده است',
      riskLevel: 'unknown',
      recommendations: []
    };
  }

  // شمارش تست‌ها بر اساس نوع
  const testsByType = tests.reduce((acc: any, test) => {
    if (!acc[test.testSlug]) {
      acc[test.testSlug] = [];
    }
    acc[test.testSlug].push(test);
    return acc;
  }, {});

  // شناسایی مشکلات اصلی
  const issues: string[] = [];
  let highRiskCount = 0;

  tests.forEach(test => {
    if (test.severity === 'شدید' || test.severity === 'severe' || test.severity === 'high') {
      highRiskCount++;
      issues.push(`${test.testName || test.testSlug}: ${test.severity}`);
    }
  });

  const riskLevel = highRiskCount >= 3 ? 'high' : highRiskCount >= 1 ? 'medium' : 'low';

  return {
    summary: `${tests.length} تست انجام شده - ${highRiskCount} مورد نیاز به توجه ویژه`,
    riskLevel,
    totalTests: tests.length,
    highRiskTests: highRiskCount,
    recentIssues: issues.slice(0, 5),
    recommendations: generateRecommendations(riskLevel, issues)
  };
}

/**
 * تولید توصیه‌ها بر اساس تحلیل
 */
function generateRecommendations(riskLevel: string, issues: string[]): string[] {
  const recommendations: string[] = [];

  if (riskLevel === 'high') {
    recommendations.push('نیاز به جلسات درمانی منظم هفتگی');
    recommendations.push('پیگیری دقیق و مداوم وضعیت بیمار');
    recommendations.push('احتمال نیاز به مشاوره با روانپزشک');
  } else if (riskLevel === 'medium') {
    recommendations.push('جلسات درمانی دوهفته‌ای');
    recommendations.push('تمرین‌های روان‌شناختی منظم');
  } else {
    recommendations.push('جلسات ماهانه برای پیگیری');
    recommendations.push('ادامه تمرین‌های خودیاری');
  }

  return recommendations;
}
















