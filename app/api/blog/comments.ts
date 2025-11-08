import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blogId = searchParams.get('blogId');

    if (!blogId) {
      return NextResponse.json({ error: 'شناسه مقاله الزامی است' }, { status: 400 });
    }

    // BlogComment model doesn't exist in schema
    // Using Comment model instead (if needed, add blogId to Comment model)
    const comments: any[] = [];

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error('خطا در دریافت نظرات:', error);
    return NextResponse.json({ error: 'خطا در دریافت نظرات' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogId, content, author, email } = body;

    if (!blogId || !content || !author) {
      return NextResponse.json({ error: 'فیلدهای الزامی را پر کنید' }, { status: 400 });
    }

    // BlogComment model doesn't exist in schema
    // Comment model doesn't have blogId field
    return NextResponse.json({ 
      success: false, 
      error: 'Comment feature not fully implemented',
      message: 'BlogComment model is not in schema'
    }, { status: 400 });
  } catch (error) {
    console.error('خطا در ایجاد نظر:', error);
    return NextResponse.json({ error: 'خطا در ایجاد نظر' }, { status: 500 });
  }
}