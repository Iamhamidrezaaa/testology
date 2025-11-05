import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const targetLanguages = ['en', 'ar', 'fr', 'ru', 'tr', 'es'];

const languageNames: Record<string, string> = {
  en: 'English',
  ar: 'Arabic',
  fr: 'French',
  ru: 'Russian',
  tr: 'Turkish',
  es: 'Spanish'
};

/**
 * ترجمه خودکار محتوا به 6 زبان
 * POST /api/auto-translate
 */
export async function POST(req: NextRequest) {
  try {
    const { type, id, content, sourceLang = 'fa' } = await req.json();

    if (!type || !id || !content) {
      return NextResponse.json(
        { error: 'Type, ID, and content are required' },
        { status: 400 }
      );
    }

    const results: Record<string, string> = {};
    const errors: string[] = [];

    // ترجمه به هر زبان
    for (const targetLang of targetLanguages) {
      try {
        // چک کردن وجود ترجمه قبلی
        const existing = await prisma.translation.findUnique({
          where: {
            type_referenceId_language: {
              type,
              referenceId: id,
              language: targetLang
            }
          }
        });

        if (existing) {
          results[targetLang] = existing.content;
          continue;
        }

        // ترجمه با GPT
        const prompt = `You are a professional translator specialized in psychology and mental health content.
Translate the following ${type} content from ${sourceLang} to ${languageNames[targetLang]}.
Maintain professional tone, preserve formatting, and ensure cultural appropriateness.

Content:
${content}

Translation:`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert translator for psychology and mental health content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 3000
        });

        const translated = completion.choices[0]?.message?.content?.trim() || content;
        results[targetLang] = translated;

        // ذخیره در دیتابیس
        await prisma.translation.create({
          data: {
            type,
            referenceId: id,
            language: targetLang,
            content: translated,
            translated: true
          }
        });

        // ذخیره در فایل JSON (برای Static Generation)
        const localesDir = path.join(process.cwd(), 'locales');
        if (!fs.existsSync(localesDir)) {
          fs.mkdirSync(localesDir, { recursive: true });
        }

        const filePath = path.join(localesDir, `${targetLang}_${type}s.json`);
        let fileData: Record<string, string> = {};

        if (fs.existsSync(filePath)) {
          fileData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }

        fileData[id] = translated;
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2));

      } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error);
        errors.push(`${targetLang}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        results[targetLang] = content; // Fallback به محتوای اصلی
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors: errors.length > 0 ? errors : undefined,
      translatedCount: Object.keys(results).length
    });

  } catch (error) {
    console.error('Auto-translate error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

/**
 * دریافت ترجمه
 * GET /api/auto-translate?type=article&id=xxx&lang=en
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');
    const language = searchParams.get('lang');

    if (!type || !id || !language) {
      return NextResponse.json(
        { error: 'Type, ID, and language are required' },
        { status: 400 }
      );
    }

    const translation = await prisma.translation.findUnique({
      where: {
        type_referenceId_language: {
          type,
          referenceId: id,
          language
        }
      }
    });

    if (!translation) {
      return NextResponse.json(
        { error: 'Translation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      translation: translation.content
    });

  } catch (error) {
    console.error('Error fetching translation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch translation' },
      { status: 500 }
    );
  }
}















