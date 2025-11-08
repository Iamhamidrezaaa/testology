import { NextRequest, NextResponse } from 'next/server';
import { getOpenAI } from '@/lib/openai';
import prisma from '@/lib/prisma';

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const { messages, userEmail } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'پیام‌های گفت‌وگو مورد نیاز است' },
        { status: 400 }
      );
    }

    console.log('📊 Analyzing chat conversation:', { messageCount: messages.length, userEmail });

    // ساخت خلاصه گفت‌وگو
    const conversationText = messages
      .map((msg: any) => `${msg.role === 'user' ? 'کاربر' : 'روان‌شناس'}: ${msg.content}`)
      .join('\n\n');

    // تحلیل گفت‌وگو با GPT (یا fallback)
    let analysis = '';
    let insights: string[] = [];
    let recommendations: string[] = [];

    const openai = getOpenAI();
    
    if (openai) {
      try {
        const systemPrompt = `شما یک روان‌شناس متخصص هستید که باید گفت‌وگوی یک کاربر با یک روان‌شناس هوش مصنوعی را تحلیل کنید.

گفت‌وگو:
${conversationText}

لطفاً تحلیل زیر را ارائه دهید:
1. خلاصه‌ای از مسائل و نگرانی‌های مطرح شده (۲-۳ جمله)
2. بینش‌های کلیدی درباره وضعیت روانی کاربر (۳-۴ مورد)
3. توصیه‌های عملی برای بهبود (۳-۴ مورد)

پاسخ را به صورت JSON با فرمت زیر برگردان:
{
  "summary": "خلاصه مسائل",
  "insights": ["بینش ۱", "بینش ۲", "بینش ۳"],
  "recommendations": ["توصیه ۱", "توصیه ۲", "توصیه ۳"]
}`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: 'لطفاً گفت‌وگو را تحلیل کن.' }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        
        // تلاش برای parse کردن JSON
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            analysis = parsed.summary || responseText;
            insights = parsed.insights || [];
            recommendations = parsed.recommendations || [];
          } else {
            analysis = responseText;
          }
        } catch (parseError) {
          analysis = responseText;
        }
      } catch (openaiError: any) {
        console.error('❌ OpenAI API error:', openaiError?.message);
        // استفاده از fallback
        analysis = generateFallbackAnalysis(messages);
        insights = generateFallbackInsights(messages);
        recommendations = generateFallbackRecommendations(messages);
      }
    } else {
      // استفاده از fallback
      analysis = generateFallbackAnalysis(messages);
      insights = generateFallbackInsights(messages);
      recommendations = generateFallbackRecommendations(messages);
    }

    // ذخیره در دیتابیس
    let savedAnalysis = null;
    try {
      // پیدا کردن کاربر
      const user = userEmail ? await prisma.user.findUnique({
        where: { email: userEmail }
      }) : null;

      if (user) {
        // ذخیره در ChatHistory
        await prisma.chatHistory.create({
          data: {
            userId: user.id,
            messages: JSON.stringify({
              type: 'analysis',
              chatType: 'psychologist',
              role: 'system',
              summary: analysis,
              insights,
              recommendations,
              conversationLength: messages.length,
              analyzedAt: new Date().toISOString()
            })
          }
        });
      }

      // ذخیره در localStorage (برای کاربران تست)
      savedAnalysis = {
        summary: analysis,
        insights,
        recommendations,
        conversationLength: messages.length,
        analyzedAt: new Date().toISOString()
      };
    } catch (dbError: any) {
      console.error('Error saving to database:', dbError?.message);
      // حتی اگر ذخیره نشد، نتیجه را برگردان
    }

    return NextResponse.json({
      success: true,
      analysis: savedAnalysis || {
        summary: analysis,
        insights,
        recommendations,
        conversationLength: messages.length,
        analyzedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('❌ Error analyzing chat:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'خطا در تحلیل گفت‌وگو',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

// توابع fallback
function generateFallbackAnalysis(messages: any[]): string {
  const userMessages = messages.filter(m => m.role === 'user');
  const topics = extractTopics(userMessages);
  
  return `بر اساس گفت‌وگوی شما که شامل ${userMessages.length} سوال بود، مسائل اصلی که مطرح شد شامل ${topics.join('، ')} می‌باشد. این گفت‌وگو نشان می‌دهد که شما در حال تلاش برای درک بهتر وضعیت روانی خود هستید.`;
}

function generateFallbackInsights(messages: any[]): string[] {
  const userMessages = messages.filter(m => m.role === 'user');
  const topics = extractTopics(userMessages);
  
  const insights: string[] = [];
  
  if (topics.some(t => t.includes('اضطراب') || t.includes('نگران'))) {
    insights.push('سطح اضطراب قابل توجه است و نیاز به مدیریت دارد');
  }
  if (topics.some(t => t.includes('غم') || t.includes('ناراحت'))) {
    insights.push('احساسات منفی در گفت‌وگو غالب است');
  }
  if (topics.some(t => t.includes('روابط'))) {
    insights.push('مسائل روابط بین فردی از اهمیت برخوردار است');
  }
  
  if (insights.length === 0) {
    insights.push('گفت‌وگو نشان می‌دهد که شما در حال جستجوی راهکار هستید');
    insights.push('آمادگی برای دریافت کمک و بهبود وضعیت وجود دارد');
  }
  
  return insights;
}

function generateFallbackRecommendations(messages: any[]): string[] {
  return [
    'ادامه گفت‌وگو با متخصصان سلامت روان',
    'انجام تست‌های روان‌شناختی برای درک بهتر وضعیت',
    'تمرین تکنیک‌های آرامش و مدیریت استرس',
    'برقراری ارتباط با دوستان و خانواده برای حمایت'
  ];
}

function extractTopics(messages: any[]): string[] {
  const topics: string[] = [];
  const text = messages.map(m => m.content).join(' ').toLowerCase();
  
  if (text.includes('اضطراب') || text.includes('نگران')) topics.push('اضطراب');
  if (text.includes('افسردگی') || text.includes('غم')) topics.push('افسردگی');
  if (text.includes('استرس')) topics.push('استرس');
  if (text.includes('روابط') || text.includes('خانواده')) topics.push('روابط');
  if (text.includes('خواب')) topics.push('خواب');
  if (text.includes('اعتماد به نفس')) topics.push('اعتماد به نفس');
  
  return topics.length > 0 ? topics : ['مسائل روان‌شناختی عمومی'];
}

