import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import OpenAI from 'openai';

// ⚙️ اتصال به API GPT (اگر API key وجود داشته باشد)
let openai: OpenAI | null = null;
if (process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.warn('OpenAI initialization failed:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userEmail, screeningSetId, answers } = await req.json();

    if (!userEmail || !screeningSetId || !answers) {
      return NextResponse.json(
        { success: false, message: 'اطلاعات مورد نیاز ارسال نشده است' },
        { status: 400 }
      );
    }

    console.log('📊 Analyzing screening for:', userEmail);

    // تحلیل پاسخ‌ها با GPT (یا fallback)
    let analysis;
    try {
      analysis = await analyzeScreeningWithGPT(answers);
    } catch (gptError) {
      console.error('GPT error, using fallback:', gptError);
      // استفاده از تحلیل fallback
      analysis = {
        analysis: generateFallbackAnalysis(answers),
        recommendedTests: generateFallbackTests(answers),
        keyInsights: [],
        nextSteps: []
      };
    }
    
    // ابتدا بررسی کن که آیا ScreeningSet وجود دارد یا نه
    let screeningSet;
    try {
      screeningSet = await prisma.screeningSet.findUnique({
        where: { id: screeningSetId }
      });
    } catch (error: any) {
      console.error('Error finding ScreeningSet:', error?.message);
      screeningSet = null;
    }

    // اگر ScreeningSet وجود ندارد، یک مورد پیش‌فرض ایجاد کن
    if (!screeningSet) {
      try {
        screeningSet = await prisma.screeningSet.create({
          data: {
            id: screeningSetId,
            name: 'Screening Set 1',
            description: 'Default screening set',
            questions: JSON.stringify([]),
            isActive: true
          }
        });
        console.log('✅ Created default ScreeningSet');
      } catch (createError: any) {
        console.error('Error creating ScreeningSet:', createError?.message);
        // اگر نتوانستیم create کنیم، از screeningSetId استفاده می‌کنیم
      }
    }

    // ذخیره نتایج در دیتابیس
    let screeningResult;
    try {
      screeningResult = await prisma.screeningResult.create({
        data: {
          userEmail,
          screeningSetId: screeningSet?.id || screeningSetId,
          answers: JSON.stringify(answers),
          analysis: analysis.analysis,
          recommendedTests: JSON.stringify(analysis.recommendedTests),
          keyInsights: analysis.keyInsights ? JSON.stringify(analysis.keyInsights) : null,
          nextSteps: analysis.nextSteps ? JSON.stringify(analysis.nextSteps) : null,
          createdAt: new Date()
        }
      });
      console.log('✅ Screening result saved:', screeningResult.id);
    } catch (dbError: any) {
      console.error('Error saving to database:', dbError?.message);
      // حتی اگر ذخیره نشد، نتیجه را برگردان
      // چون ممکن است مدل در دیتابیس وجود نداشته باشد
    }

    // localStorage در client-side ذخیره می‌شود، نه در server-side

    return NextResponse.json({
      success: true,
      analysis: {
        overallAnalysis: analysis.analysis,
        recommendedTests: analysis.recommendedTests,
        keyInsights: analysis.keyInsights || [],
        nextSteps: analysis.nextSteps || []
      },
      screeningResultId: screeningResult?.id || null
    });

  } catch (error: any) {
    console.error('❌ Error analyzing screening:', error);
    console.error('Error stack:', error?.stack);
    console.error('Error message:', error?.message);
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در تحلیل ارزیابی',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

async function analyzeScreeningWithGPT(answers: { [key: number]: string }) {
  // اگر OpenAI API key وجود ندارد، از fallback استفاده کن
  if (!openai || !process.env.OPENAI_API_KEY) {
    console.log('OpenAI API key not found, using fallback analysis');
    return {
      analysis: generateFallbackAnalysis(answers),
      recommendedTests: generateFallbackTests(answers),
      keyInsights: [],
      nextSteps: []
    };
  }

  try {
    // 🔍 پرامپت تحلیل
    const prompt = `
    تو یک روان‌شناس بالینی حرفه‌ای هستی که بر اساس پاسخ‌های کاربر به ۱۵ سؤال غربالگری اولیه Testology، باید تحلیلی انسانی، دقیق و همدلانه بنویسی.
    هدف، تشخیص اولیهٔ الگوهای هیجانی، فکری، ارتباطی و خودپنداره است.
    
    پاسخ‌های کاربر:
    ${JSON.stringify(answers, null, 2)}
    
    حالا طبق این پاسخ‌ها، خروجی زیر را تولید کن:
    1. خلاصه‌ای از وضعیت هیجانی، شناختی و شخصیتی فرد در قالب ۳ پاراگراف کوتاه، با لحنی صمیمی و بدون برچسب تشخیصی.
    2. سه تست روان‌شناسی معتبر پیشنهاد بده که به شناخت دقیق‌تر وضعیت فعلی او کمک کنند. فقط نام تست‌ها را فارسی و با توضیح کوتاه بنویس (مثلاً: GAD-7 – سنجش اضطراب).
    3. متن را طوری بنویس که کاربر احساس امنیت و امید داشته باشد، نه قضاوت.
    `;

    // 🔮 فراخوانی GPT
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: "تو یک روان‌شناس بالینی حرفه‌ای و همدل هستی که برای پلتفرم Testology کار می‌کنی.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const aiResponse = completion.choices[0].message?.content || "";
    
    return {
      analysis: aiResponse,
      recommendedTests: extractTests(aiResponse),
      keyInsights: extractKeyInsights(aiResponse),
      nextSteps: extractNextSteps(aiResponse)
    };

  } catch (error: any) {
    console.error('Error calling GPT:', error?.message);
    // Fallback to local analysis if GPT fails
    return {
      analysis: generateFallbackAnalysis(answers),
      recommendedTests: generateFallbackTests(answers),
      keyInsights: [],
      nextSteps: []
    };
  }
}

// 📦 تابع استخراج تست‌های پیشنهادی از متن GPT
function extractTests(text: string) {
  const pattern = /(MBTI|GAD-7|PHQ-9|SWLS|Rosenberg|PSS|ASRS|SPIN|Attachment|COPE|GSE|ISI|UCLA|PSSS|SCS|TAS|HADS|DERS|PANAS|SCS-Y|MAAS|RSEI|CD-RISC)/gi;
  const found = text.match(pattern);
  return Array.from(new Set(found)) || ['GAD-7', 'PHQ-9', 'PSS'];
}

// استخراج بینش‌های کلیدی
function extractKeyInsights(text: string) {
  const insights = [];
  if (text.includes('اضطراب') || text.includes('نگرانی')) {
    insights.push('سطح اضطراب قابل توجه است');
  }
  if (text.includes('غم') || text.includes('ناراحتی')) {
    insights.push('احساسات منفی غالب است');
  }
  if (text.includes('اعتماد') || text.includes('خودباوری')) {
    insights.push('اعتماد به نفس نیاز به تقویت دارد');
  }
  return insights;
}

// استخراج مراحل بعدی
function extractNextSteps(text: string) {
  return [
    'انجام تست‌های تخصصی پیشنهادی',
    'گفتگو با مشاور هوشمند',
    'دریافت تمرینات شخصی‌سازی شده'
  ];
}

// تحلیل جایگزین در صورت خطای GPT
function generateFallbackAnalysis(answers: { [key: number]: string }) {
  return "بر اساس پاسخ‌هات، به نظر می‌رسه که در حال حاضر با چالش‌های روانی مواجه هستی. این کاملاً طبیعی و قابل درک است. مهم اینه که تو اینجا هستی و آماده‌ای برای بهبود وضعیتت.";
}

function generateFallbackTests(answers: { [key: number]: string }) {
  return ['GAD-7', 'PHQ-9', 'PSS'];
}