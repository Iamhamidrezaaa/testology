import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, chatHistory, testResults, screeningAnalysis } = body;

    // پیدا کردن کاربر
    const user = await prisma.user.findUnique({
      where: { email: userId }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // ذخیره تاریخچه چت در دیتابیس
    const chatRecord = await prisma.chatHistory.create({
      data: {
        userId: user.id,
        messages: chatHistory,
        testResults: testResults || [],
        screeningAnalysis: screeningAnalysis || '',
        createdAt: new Date()
      }
    });

    console.log('✅ تاریخچه چت در دیتابیس ذخیره شد:', chatRecord);

    return NextResponse.json({
      success: true,
      data: {
        id: chatRecord.id,
        userId: chatRecord.userId,
        messages: chatRecord.messages,
        testResults: chatRecord.testResults,
        screeningAnalysis: chatRecord.screeningAnalysis,
        createdAt: chatRecord.createdAt
      }
    });
  } catch (error) {
    console.error('❌ خطا در ذخیره تاریخچه چت:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در ذخیره تاریخچه چت' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');

    console.log('🔍 API /api/chat/history called with:', { userId, userEmail });

    let whereClause = {};
    
    if (userId) {
      whereClause = { userId };
      console.log('💬 Using userId:', userId);
    } else if (userEmail) {
      // پیدا کردن userId بر اساس userEmail
      console.log('🔍 Looking for user with email:', userEmail);
      const user = await prisma.user.findUnique({
        where: { email: userEmail }
      });
      console.log('👤 User found:', user);
      if (user) {
        whereClause = { userId: user.id };
        console.log('💬 Using userId from email:', user.id);
      } else {
        console.log('❌ User not found with email:', userEmail);
      }
    }

    // دریافت تاریخچه چت از دیتابیس
    const chatRecords = await prisma.chatHistory.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: chatRecords
    });
  } catch (error) {
    console.error('❌ خطا در دریافت تاریخچه چت:', error);
    return NextResponse.json(
      { success: false, error: 'خطا در دریافت تاریخچه چت' },
      { status: 500 }
    );
  }
}