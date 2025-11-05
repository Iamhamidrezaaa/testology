import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    const increment = action === 'like' ? 1 : -1;
    const newLikes = Math.max(0, blog.likes + increment);

    await prisma.blog.update({
      where: { id: blogId },
      data: { likes: newLikes }
    });

    return NextResponse.json({ 
      success: true, 
      likes: newLikes,
      action 
    });
  } catch (error) {
    console.error('خطا در لایک:', error);
    return NextResponse.json({ error: 'خطا در لایک' }, { status: 500 });
  }
}