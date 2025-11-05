import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    if (!slug) {
      return NextResponse.json({ error: "slug لازم است" }, { status: 400 });
    }

    // دریافت مقاله از جدول blog به جای article
    const article = await prisma.blog.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!article || !article.published) {
      return NextResponse.json({ error: "مقاله یافت نشد" }, { status: 404 });
    }

    // افزایش شمارش بازدید به صورت ایمن (non-blocking)
    prisma.blog
      .update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })
      .catch(() => {});

    // تبدیل فرمت داده‌ها به فرمت مورد انتظار
    const formattedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.metaDescription || article.content.substring(0, 150) + '...',
      category: article.category,
      author: article.author?.name || 'نامشخص',
      coverUrl: article.imageUrl,
      featured: article.featured,
      viewCount: article.viewCount || 0,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      tags: article.tags ? (typeof article.tags === 'string' ? article.tags.split(',').map(tag => tag.trim()) : article.tags) : []
    };

    return NextResponse.json(formattedArticle);
  } catch (error) {
    console.error("خطا در دریافت مقاله:", error);
    return NextResponse.json({ error: "خطای داخلی سرور" }, { status: 500 });
  }
}




