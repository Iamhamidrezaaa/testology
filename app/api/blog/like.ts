import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blogId, action } = body; // action: 'like' یا 'unlike'

    if (!blogId || !action) {
      return NextResponse.json({ error: 'شناسه مقاله و عملیات الزامی است' }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id: blogId }
    });

    if (!blog) {
      return NextResponse.json({ error: 'مقاله پیدا نشد' }, { status: 404 });
    }

    // likes field doesn't exist in Blog model
    return NextResponse.json({ 
      success: false, 
      error: 'Like feature not supported',
      message: 'Blog model does not have likes field'
    }, { status: 400 });
  } catch (error) {
    console.error('خطا در لایک:', error);
    return NextResponse.json({ error: 'خطا در لایک' }, { status: 500 });
  }
}