import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { screeningAnalysis, userEmail } = await request.json();

    if (!screeningAnalysis || !userEmail) {
      return NextResponse.json({ error: 'اطلاعات ناقص' }, { status: 400 });
    }

    // ساخت پرامپت برای پیشنهاد تست‌ها
    const prompt = `
شما یک روان‌شناس متخصص هستید. بر اساس تحلیل غربالگری زیر، 2-3 تست روان‌شناسی مناسب پیشنهاد دهید.

تحلیل غربالگری:
${JSON.stringify(screeningAnalysis, null, 2)}

تست‌های موجود:
- mbti: تست شخصیت‌شناسی MBTI (10 دقیقه)
- phq9: تست افسردگی PHQ-9 (7 دقیقه)
- gad7: تست اضطراب GAD-7 (5 دقیقه)
- eq: تست هوش هیجانی EQ (8 دقیقه)
- rosenberg: تست عزت نفس روزنبرگ (6 دقیقه)
- focus: تست تمرکز و توجه (5 دقیقه)
- career: تست آینده شغلی (10 دقیقه)
- riasec: تست علاقه‌مندی شغلی RIASEC (12 دقیقه)
- creativity: تست خلاقیت ذهنی (8 دقیقه)
- problem-solving: تست حل مسئله (10 دقیقه)
- decision-making: تست تصمیم‌گیری (7 دقیقه)
- stress-management: تست مدیریت استرس (6 دقیقه)
- time-management: تست مدیریت زمان (5 دقیقه)
- work-life-balance: تست تعادل کار و زندگی (8 دقیقه)
- anxiety-assessment: تست اضطراب (5 دقیقه)
- depression-screening: تست افسردگی (7 دقیقه)  
- stress-evaluation: تست استرس (6 دقیقه)
- self-esteem-test: تست اعتماد به نفس (8 دقیقه)
- relationship-satisfaction: تست رضایت از روابط (10 دقیقه)
- motivation-assessment: تست انگیزه (5 دقیقه)
- sleep-quality: تست کیفیت خواب (4 دقیقه)
- social-anxiety: تست اضطراب اجتماعی (6 دقیقه)
- personality-traits: تست ویژگی‌های شخصیتی (12 دقیقه)
- emotional-intelligence: تست هوش هیجانی پیشرفته (15 دقیقه)
- communication-skills: تست مهارت‌های ارتباطی (8 دقیقه)
- leadership-style: تست سبک رهبری (10 دقیقه)
- conflict-resolution: تست حل تعارض (7 دقیقه)
- team-work: تست کار تیمی (6 دقیقه)
- adaptability: تست انطباق‌پذیری (5 دقیقه)
- resilience: تست تاب‌آوری (8 دقیقه)
- mindfulness: تست ذهن‌آگاهی (6 دقیقه)
- happiness-level: تست سطح شادی (5 دقیقه)
- life-satisfaction: تست رضایت از زندگی (7 دقیقه)
- goal-setting: تست تعیین هدف (6 دقیقه)
- procrastination: تست تعلل‌ورزی (5 دقیقه)
- perfectionism: تست کمال‌گرایی (7 دقیقه)
- assertiveness: تست قاطعیت (6 دقیقه)
- empathy: تست همدلی (5 دقیقه)
- optimism: تست خوش‌بینی (4 دقیقه)
- gratitude: تست قدردانی (5 دقیقه)
- forgiveness: تست بخشش (6 دقیقه)
- self-compassion: تست خوددلسوزی (7 دقیقه)
- values-assessment: تست ارزش‌ها (10 دقیقه)
- interests-exploration: تست کاوش علایق (8 دقیقه)
- strengths-identification: تست شناسایی نقاط قوت (9 دقیقه)

لطفاً 2-3 تست مناسب پیشنهاد دهید و دلیل انتخاب هر تست را توضیح دهید.

فرمت خروجی:
[
  {
    "id": "test-id",
    "name": "نام تست",
    "description": "توضیح کوتاه",
    "reason": "دلیل انتخاب",
    "estimatedTime": "زمان تخمینی",
    "difficulty": "آسان/متوسط/سخت",
    "category": "دسته‌بندی"
  }
]
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'شما یک روان‌شناس متخصص هستید که تست‌های مناسب را بر اساس تحلیل غربالگری پیشنهاد می‌دهید.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content || '[]';
    
    // تلاش برای parse کردن JSON
    let suggestedTests;
    try {
      // ابتدا تلاش کن JSON مستقیم را parse کنی
      suggestedTests = JSON.parse(content);
    } catch (error) {
      console.error('Error parsing GPT response:', error);
      try {
        // اگر خطا داد، تلاش کن JSON را از markdown استخراج کنی
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          suggestedTests = JSON.parse(jsonMatch[1]);
        } else {
          throw new Error('No JSON found in markdown');
        }
      } catch (secondError) {
        console.error('Error parsing JSON from markdown:', secondError);
        // پیشنهادات پیش‌فرض در صورت خطا
        suggestedTests = [
          {
            id: "anxiety-assessment",
            name: "تست اضطراب",
            description: "ارزیابی سطح اضطراب و استرس روزانه",
            reason: "بر اساس پاسخ‌های شما، ممکن است از اضطراب خفیف رنج ببرید",
            estimatedTime: "5 دقیقه",
            difficulty: "آسان",
            category: "اضطراب"
          },
          {
            id: "depression-screening", 
            name: "تست افسردگی",
            description: "بررسی علائم افسردگی و خلق و خو",
            reason: "برای درک بهتر وضعیت روحی شما",
            estimatedTime: "7 دقیقه",
            difficulty: "متوسط",
            category: "خلق و خو"
          }
        ];
      }
    }

    // Return the suggested tests to the client - let the client handle localStorage
    const testIds = suggestedTests.map((test: any) => test.id);

    return NextResponse.json({ 
      success: true, 
      suggestedTests,
      testIds 
    });

  } catch (error) {
    console.error('Error suggesting tests:', error);
    return NextResponse.json({ 
      error: 'خطا در پیشنهاد تست‌ها' 
    }, { status: 500 });
  }
}
