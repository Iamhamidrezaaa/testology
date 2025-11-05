import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: params.slug },
      include: {
        comments: {
          where: { approved: true },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!blog) {
      return NextResponse.json({ error: 'مقاله پیدا نشد' }, { status: 404 });
    }

    // افزایش تعداد بازدید
    await prisma.blog.update({
      where: { id: blog.id },
      data: { views: blog.views + 1 }
    });

    return NextResponse.json({ blog });
  } catch (error) {
    console.error('خطا در دریافت مقاله:', error);
    return NextResponse.json({ error: 'خطا در دریافت مقاله' }, { status: 500 });
  }
}