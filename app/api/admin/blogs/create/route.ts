import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title, 
      slug, 
      content, 
      excerpt, 
      category, 
      tags, 
      author, 
      coverUrl, 
      published = false, 
      featured = false 
    } = body;

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        category,
        tags: tags || [],
        author: author || "Testology Editorial Team",
        coverUrl,
        published,
        featured
      }
    });

    return NextResponse.json({ 
      success: true, 
      article 
    });
  } catch (err) {
    console.error('خطا در ایجاد مقاله:', err);
    return NextResponse.json({ 
      success: false, 
      message: 'خطا در ایجاد مقاله' 
    }, { status: 500 });
  }
}
