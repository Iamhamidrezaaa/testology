import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * API برای دریافت لیست بیماران درمانگر
 * GET /api/therapist/patients
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // بررسی نقش درمانگر
    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Therapist access required' }, { status: 403 });
    }

    // دریافت اطلاعات درمانگر
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 });
    }

    // دریافت بیماران
    const patients = await prisma.therapistPatient.findMany({
      where: { therapistId: therapist.id },
      include: {
        // بیماران را از طریق Patient model می‌گیریم
      },
      orderBy: { createdAt: 'desc' }
    });

    // دریافت اطلاعات کامل بیماران با تست‌ها و پیشرفت
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

        const testResults = await prisma.testResult.findMany({
          where: { userId: patient.patientId },
          select: {
            id: true,
            testSlug: true,
            testName: true,
            score: true,
            severity: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        });

        const userProgress = await prisma.userProgress.findUnique({
          where: { userId: patient.patientId },
          select: {
            xp: true,
            level: true,
            totalTests: true,
            streakDays: true
          }
        });

        return {
          ...patient,
          user: userInfo,
          recentTests: testResults,
          progress: userProgress
        };
      })
    );

    return NextResponse.json({
      success: true,
      patients: patientsWithDetails
    });

  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

/**
 * API برای افزودن بیمار جدید
 * POST /api/therapist/patients
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'therapist' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { patientId, notes } = await req.json();

    if (!patientId) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 });
    }

    // بررسی وجود کاربر
    const patient = await prisma.user.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // دریافت اطلاعات درمانگر
    const therapist = await prisma.therapist.findUnique({
      where: { userId: session.user.id }
    });

    if (!therapist) {
      return NextResponse.json({ error: 'Therapist profile not found' }, { status: 404 });
    }

    // بررسی عدم تکراری بودن
    const existing = await prisma.therapistPatient.findUnique({
      where: {
        therapistId_patientId: {
          therapistId: therapist.id,
          patientId: patientId
        }
      }
    });

    if (existing) {
      return NextResponse.json({ error: 'Patient already assigned' }, { status: 400 });
    }

    // افزودن بیمار
    const newPatient = await prisma.therapistPatient.create({
      data: {
        therapistId: therapist.id,
        patientId: patientId,
        notes: notes || null,
        status: 'active'
      }
    });

    return NextResponse.json({
      success: true,
      patient: newPatient
    });

  } catch (error) {
    console.error('Error adding patient:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
