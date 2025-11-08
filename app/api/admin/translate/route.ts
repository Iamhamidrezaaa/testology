import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getOpenAIClient } from '@/lib/openai-client';


// زبان‌های هدف برای ترجمه
const TARGET_LANGUAGES = ['fa', 'ar', 'fr', 'ru', 'tr', 'es'];

// پرامپت‌های مخصوص هر زبان
const TRANSLATION_PROMPTS = {
  ar: `You are a professional Arabic translator specializing in psychology and mental health content.
Translate the following text into natural, fluent Arabic that maintains the psychological and therapeutic tone.
Use appropriate Arabic terminology for psychological concepts.
Keep the structure and formatting intact.`,
  
  fr: `You are a professional French translator specializing in psychology and mental health content.
Translate the following text into natural, fluent French that maintains the psychological and therapeutic tone.
Use appropriate French terminology for psychological concepts.
Keep the structure and formatting intact.`,
  
  ru: `You are a professional Russian translator specializing in psychology and mental health content.
Translate the following text into natural, fluent Russian that maintains the psychological and therapeutic tone.
Use appropriate Russian terminology for psychological concepts.
Keep the structure and formatting intact.`,
  
  tr: `You are a professional Turkish translator specializing in psychology and mental health content.
Translate the following text into natural, fluent Turkish that maintains the psychological and therapeutic tone.
Use appropriate Turkish terminology for psychological concepts.
Keep the structure and formatting intact.`,
  
  es: `You are a professional Spanish translator specializing in psychology and mental health content.
Translate the following text into natural, fluent Spanish that maintains the psychological and therapeutic tone.
Use appropriate Spanish terminology for psychological concepts.
Keep the structure and formatting intact.`
};

/**
 * ترجمه هوشمند محتوا با GPT
 * POST /api/admin/translate
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // بررسی دسترسی ادمین
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, type, content, title, description } = await req.json();

    if (!id || !type || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: id, type, content' 
      }, { status: 400 });
    }

    if (!['article', 'test', 'exercise'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid type. Must be: article, test, or exercise' 
      }, { status: 400 });
    }

    const results: Record<string, any> = {};

    // ترجمه برای هر زبان
    for (const lang of TARGET_LANGUAGES) {
      try {
        const prompt = TRANSLATION_PROMPTS[lang as keyof typeof TRANSLATION_PROMPTS];
        
        // آماده‌سازی محتوا برای ترجمه
        const contentToTranslate = {
          title: title || '',
          description: description || '',
          content: content
        };

        const openai = getOpenAIClient();
        if (!openai) {
          results[lang] = {
            success: false,
            error: 'OpenAI API key is not configured'
          };
          continue;
        }

        const translationResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: prompt },
            { role: 'user', content: JSON.stringify(contentToTranslate, null, 2) }
          ],
          temperature: 0.3,
          max_tokens: 2000
        });

        const translatedContent = translationResponse.choices[0]?.message?.content?.trim() || '';
        
        if (!translatedContent) {
          throw new Error(`Empty translation for ${lang}`);
        }

        // ذخیره ترجمه در دیتابیس
        const translation = await prisma.translation.upsert({
          where: {
            key_lang: {
              key: `${type}_${id}`,
              lang: lang
            }
          },
          update: {
            text: translatedContent,
            updatedAt: new Date()
          },
          create: {
            key: `${type}_${id}`,
            lang: lang,
            text: translatedContent
          }
        });

        results[lang] = {
          success: true,
          translationId: translation.id,
          content: translatedContent.substring(0, 100) + '...' // پیش‌نمایش
        };

      } catch (error) {
        console.error(`Translation error for ${lang}:`, error);
        results[lang] = {
          success: false,
          error: error instanceof Error ? error.message : 'Translation failed'
        };
      }
    }

    // آمار موفقیت
    const successCount = Object.values(results).filter((r: any) => r.success).length;
    const totalCount = TARGET_LANGUAGES.length;

    return NextResponse.json({
      success: true,
      message: `Translated ${successCount}/${totalCount} languages successfully`,
      results,
      stats: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

/**
 * دریافت ترجمه‌های موجود
 * GET /api/admin/translate?type=article&id=123
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const referenceId = searchParams.get('id');

    if (!type || !referenceId) {
      return NextResponse.json({ 
        error: 'Missing required parameters: type, id' 
      }, { status: 400 });
    }

    const translations = await prisma.translation.findMany({
      where: {
        key: `${type}_${referenceId}`
      },
      orderBy: { lang: 'asc' }
    });

    return NextResponse.json({
      success: true,
      translations
    });

  } catch (error) {
    console.error('Get translations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translations' },
      { status: 500 }
    );
  }
}

/**
 * به‌روزرسانی ترجمه دستی
 * PUT /api/admin/translate
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id, type, language, content } = await req.json();

    if (!id || !type || !language || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: id, type, language, content' 
      }, { status: 400 });
    }

    const translation = await prisma.translation.upsert({
      where: {
        key_lang: {
          key: `${type}_${id}`,
          lang: language
        }
      },
      update: {
        text: content,
        updatedAt: new Date()
      },
      create: {
        key: `${type}_${id}`,
        lang: language,
        text: content
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Translation updated successfully',
      translation
    });

  } catch (error) {
    console.error('Update translation error:', error);
    return NextResponse.json(
      { error: 'Failed to update translation' },
      { status: 500 }
    );
  }
}
