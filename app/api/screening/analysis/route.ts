import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    console.log('🔍 API /api/screening/analysis called with:', { userId, userEmail });

    let whereClause = {};
    
    if (userId) {
      whereClause = { userId };
      console.log('📊 Using userId:', userId);
    } else if (userEmail) {
      // پیدا کردن userId بر اساس userEmail
      console.log('🔍 Looking for user with email:', userEmail);
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });
      console.log('👤 User found:', user);
      if (user) {
        whereClause = { userId: user.id };
        console.log('📊 Using userId from email:', user.id);
      } else {
        console.log('❌ User not found with email:', userEmail);
        return NextResponse.json({
          success: false,
          error: 'کاربر یافت نشد'
        }, { status: 404 });
      }
    }

    // دریافت تحلیل غربالگری از دیتابیس
    const screeningAnalysis = await prisma.screeningResult.findFirst({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    if (!screeningAnalysis) {
      return NextResponse.json({
        success: false,
        error: 'تحلیل غربالگری یافت نشد'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: screeningAnalysis.id,
        analysis: screeningAnalysis.analysis,
        createdAt: screeningAnalysis.createdAt
      }
    });
  } catch (error) {
    console.error('❌ خطا در دریافت تحلیل غربالگری:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت تحلیل غربالگری' },
      { status: 500 }
    );
  }
}
