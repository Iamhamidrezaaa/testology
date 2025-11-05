import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID لازم است" }, { status: 400 });
    }

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!blog) {
      return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
    }

    return NextResponse.json({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      metaDescription: blog.metaDescription,
      category: blog.category,
      imageUrl: blog.imageUrl,
      tags: blog.tags,
      published: blog.published,
      featured: blog.featured,
      viewCount: blog.viewCount,
      author: blog.author?.name || 'نامشخص',
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt
    });

  } catch (error) {
    console.error("خطا در دریافت مقاله:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "ID لازم است" }, { status: 400 });
    }

    const body = await req.json();
    const { title, content, metaDescription, category, tags, published, imageUrl } = body;

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        metaDescription,
        category,
        tags,
        published,
        imageUrl,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      id: updatedBlog.id,
      title: updatedBlog.title,
      slug: updatedBlog.slug,
      content: updatedBlog.content,
      metaDescription: updatedBlog.metaDescription,
      category: updatedBlog.category,
      imageUrl: updatedBlog.imageUrl,
      tags: updatedBlog.tags,
      published: updatedBlog.published,
      featured: updatedBlog.featured,
      viewCount: updatedBlog.viewCount,
      updatedAt: updatedBlog.updatedAt
    });

  } catch (error) {
    console.error("خطا در ویرایش مقاله:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}


