import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // حذف مقاله
    await prisma.blog.delete({
      where: { id }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'مقاله با موفقیت حذف شد' 
    });
  } catch (error) {
    console.error('خطا در حذف مقاله:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در حذف مقاله' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { title, content, imageUrl, tags, meta } = body;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        imageUrl,
        tags: JSON.stringify(tags),
        metaTitle: meta.title,
        metaDescription: meta.description,
        ogImage: meta.ogImage,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      blog: updatedBlog 
    });
  } catch (error) {
    console.error('خطا در آپدیت مقاله:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در آپدیت مقاله' 
      },
      { status: 500 }
    );
  }
}
