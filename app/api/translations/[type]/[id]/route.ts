import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * دریافت ترجمه از دیتابیس
 * GET /api/translations/[type]/[id]?lang=en
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('lang');

    if (!language) {
      return NextResponse.json(
        { error: 'Language parameter is required' },
        { status: 400 }
      );
    }

    const key = `${type}_${id}`;
    const translation = await prisma.translation.findUnique({
      where: {
        key_lang: {
          key,
          lang: language
        }
      }
    });

    if (!translation) {
      return NextResponse.json(
        { error: 'Translation not found', available: false },
        { status: 404 }
      );
    }

    return NextResponse.json({
      content: translation.text,
      language: translation.lang,
      updatedAt: translation.updatedAt,
      available: true
    });

  } catch (error) {
    console.error('Error fetching translation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translation' },
      { status: 500 }
    );
  }
}

/**
 * به‌روزرسانی یا ایجاد ترجمه
 * PUT /api/translations/[type]/[id]
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    const { language, content } = await req.json();

    if (!language || !content) {
      return NextResponse.json(
        { error: 'Language and content are required' },
        { status: 400 }
      );
    }

    const key = `${type}_${id}`;
    const translation = await prisma.translation.upsert({
      where: {
        key_lang: {
          key,
          lang: language
        }
      },
      update: {
        text: content,
        updatedAt: new Date()
      },
      create: {
        key,
        lang: language,
        text: content
      }
    });

    return NextResponse.json({
      success: true,
      translation
    });

  } catch (error) {
    console.error('Error updating translation:', error);
    return NextResponse.json(
      { error: 'Failed to update translation' },
      { status: 500 }
    );
  }
}















