import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

    if (session?.user?.role !== 'THERAPIST' && session?.user?.role !== 'ADMIN') {
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

    // Therapist, TherapistSession, and TherapistPatient models don't exist in schema
    const sessions: any[] = [];
    const patientRelation = null;

    // تحلیل ترکیبی تست‌ها
    const analysis = analyzeTestResults(testResults);

    return NextResponse.json({
      success: true,
      patient: {
        ...user,
        tests: testResults,
        progress,
        sessions,
        notes: (patientRelation as any)?.notes || null,
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

    if (session?.user?.role !== 'THERAPIST' && session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patientId } = params;
    // Therapist and TherapistPatient models don't exist in schema
    return NextResponse.json({ 
      error: 'Therapist feature not fully implemented',
      message: 'Therapist and TherapistPatient models are not in schema'
    }, { status: 400 })

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
    const key = test.testId || test.testName || 'unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(test);
    return acc;
  }, {});

  // شناسایی مشکلات اصلی
  const issues: string[] = [];
  let highRiskCount = 0;

  tests.forEach(test => {
    // استفاده از score برای تعیین سطح خطر (فرض: score پایین = خطر بالا)
    if (test.score !== null && test.score < 40) {
      highRiskCount++;
      issues.push(`${test.testName || test.testId || 'unknown'}: score=${test.score} (low)`);
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
















