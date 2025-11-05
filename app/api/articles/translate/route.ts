import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const languageNames: Record<string, string> = {
  en: 'English',
  ar: 'Arabic',
  fr: 'French',
  ru: 'Russian',
  tr: 'Turkish',
  es: 'Spanish'
};

/**
 * ترجمه مقاله با GPT
 * POST /api/articles/translate
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { articleId, language, mode, text } = await req.json();

    if (!articleId || !language) {
      return NextResponse.json(
        { error: 'Article ID and language are required' },
        { status: 400 }
      );
    }

    // دریافت مقاله
    const article = await prisma.blogPost.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    let translationText = '';

    if (mode === 'auto') {
      // ترجمه خودکار با GPT
      const prompt = `You are a professional translator specialized in psychology and mental health content.
Translate the following article to ${languageNames[language]}.
Maintain the professional tone, preserve formatting (markdown), and ensure accuracy.

Title: ${article.title}

Content:
${article.content}

Provide the translation in the same format (Title first, then content):`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert translator for psychology and mental health articles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 4000
      });

      translationText = completion.choices[0]?.message?.content?.trim() || '';
    } else {
      // ترجمه دستی
      translationText = text || '';
    }

    // ذخیره در دیتابیس
    const translation = await prisma.translation.upsert({
      where: {
        type_referenceId_language: {
          type: 'article',
          referenceId: articleId,
          language
        }
      },
      update: {
        content: translationText,
        updatedAt: new Date()
      },
      create: {
        type: 'article',
        referenceId: articleId,
        language,
        content: translationText,
        translated: mode === 'auto'
      }
    });

    return NextResponse.json({
      success: true,
      translation: {
        id: translation.id,
        language: translation.language,
        content: translation.content,
        updatedAt: translation.updatedAt
      }
    });

  } catch (error) {
    console.error('Article translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

/**
 * دریافت ترجمه‌های یک مقاله
 * GET /api/articles/translate?articleId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    const translations = await prisma.translation.findMany({
      where: {
        type: 'article',
        referenceId: articleId
      }
    });

    const translationsMap: Record<string, string> = {};
    translations.forEach(t => {
      translationsMap[t.language] = t.content;
    });

    return NextResponse.json(translationsMap);

  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}















