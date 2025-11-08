import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // دریافت مقالات از جدول blog به جای article
    const articles = await prisma.blog.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        metaDescription: true,
        content: true,
        category: true,
        imageUrl: true,
        tags: true,
        featured: true,
        viewCount: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    }).catch(() => []);

    // تبدیل فرمت داده‌ها به فرمت مورد انتظار
    const formattedArticles = articles.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.metaDescription || blog.content.substring(0, 150) + '...',
      category: blog.category,
      author: blog.author?.name || 'نامشخص',
      coverUrl: blog.imageUrl,
      featured: blog.featured,
      viewCount: blog.viewCount || 0,
      createdAt: blog.createdAt,
      tags: blog.tags ? (typeof blog.tags === 'string' ? blog.tags.split(',').map(tag => tag.trim()) : blog.tags) : []
    }));

    return NextResponse.json(formattedArticles);
  } catch (error) {
    console.error('خطا در دریافت مقالات:', error);
    return NextResponse.json({ error: 'خطا در دریافت مقالات' }, { status: 500 });
  }
}