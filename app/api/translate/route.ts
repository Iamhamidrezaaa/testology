import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/openai-client';




/**
 * API ترجمه خودکار با GPT
 * POST /api/translate
 */
export async function POST(req: NextRequest) {
  try {
    const { text, sourceLang, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    const languageNames: Record<string, string> = {
      fa: 'Persian (Farsi)',
      en: 'English',
      ar: 'Arabic',
      fr: 'French',
      ru: 'Russian',
      tr: 'Turkish',
      es: 'Spanish'
    };

    const prompt = `Translate the following text from ${languageNames[sourceLang] || sourceLang} to ${languageNames[targetLang] || targetLang}. 
Maintain the professional tone and context of mental health and psychology. 
Preserve any formatting, line breaks, and special characters.

Text to translate:
${text}

Translation:`;

    const openai = getOpenAIClient();
    if (!openai) {
      return NextResponse.json({ success: false, error: "OpenAI API key is not configured" }, { status: 500 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specialized in psychology and mental health content. Provide accurate, culturally appropriate translations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const translation = completion.choices[0]?.message?.content || text;

    return NextResponse.json({
      success: true,
      translation: translation.trim(),
      sourceLang,
      targetLang
    });

  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}

