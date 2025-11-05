import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 Creating sample tests in database')

    // Sample tests from the website
    const sampleTests = [
      {
        testSlug: 'mbti',
        testName: 'تست شخصیت‌شناسی MBTI',
        description: 'شناخت تیپ شخصیتی',
        category: 'personality',
        isActive: true
      },
      {
        testSlug: 'neo-ffi',
        testName: 'تست شخصیت NEO-FFI',
        description: 'ارزیابی پنج عامل بزرگ شخصیت',
        category: 'personality',
        isActive: true
      },
      {
        testSlug: 'phq9',
        testName: 'تست افسردگی PHQ-9',
        description: 'تحلیل علائم افسردگی',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'gad7',
        testName: 'تست اضطراب GAD-7',
        description: 'بررسی اضطراب روزمره',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'bai',
        testName: 'تست اضطراب BAI',
        description: 'ارزیابی شدت اضطراب',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'bdi',
        testName: 'تست افسردگی BDI',
        description: 'ارزیابی شدت افسردگی',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'hads',
        testName: 'تست اضطراب و افسردگی HADS',
        description: 'ارزیابی اضطراب و افسردگی در بیماران',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'dass21',
        testName: 'تست افسردگی، اضطراب و استرس DASS-21',
        description: 'ارزیابی افسردگی، اضطراب و استرس',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'pss',
        testName: 'تست استرس درک شده PSS',
        description: 'ارزیابی سطح استرس درک شده',
        category: 'mental',
        isActive: true
      },
      {
        testSlug: 'panas',
        testName: 'تست عواطف مثبت و منفی PANAS',
        description: 'ارزیابی عواطف مثبت و منفی',
        category: 'emotion',
        isActive: true
      },
      {
        testSlug: 'eq',
        testName: 'تست هوش هیجانی EQ',
        description: 'ارزیابی هوش هیجانی',
        category: 'emotion',
        isActive: true
      },
      {
        testSlug: 'love-languages',
        testName: 'تست زبان عشق',
        description: 'شناخت زبان عشق شما',
        category: 'emotion',
        isActive: true
      },
      {
        testSlug: 'attachment-style',
        testName: 'تست سبک دلبستگی',
        description: 'شناخت سبک دلبستگی شما',
        category: 'emotion',
        isActive: true
      },
      {
        testSlug: 'focus-test',
        testName: 'تست تمرکز و توجه',
        description: 'ارزیابی قدرت تمرکز و توجه',
        category: 'focus',
        isActive: true
      },
      {
        testSlug: 'sleep-quality',
        testName: 'تست کیفیت خواب',
        description: 'ارزیابی کیفیت و الگوهای خواب',
        category: 'focus',
        isActive: true
      },
      {
        testSlug: 'insomnia',
        testName: 'تست بی‌خوابی',
        description: 'ارزیابی مشکلات خواب',
        category: 'focus',
        isActive: true
      },
      {
        testSlug: 'career-interest',
        testName: 'تست علایق شغلی',
        description: 'شناخت علایق و استعدادهای شغلی',
        category: 'career',
        isActive: true
      },
      {
        testSlug: 'holland-codes',
        testName: 'تست کدهای هالند',
        description: 'شناخت تیپ شخصیتی شغلی',
        category: 'career',
        isActive: true
      },
      {
        testSlug: 'work-values',
        testName: 'تست ارزش‌های کاری',
        description: 'شناخت ارزش‌های کاری شما',
        category: 'career',
        isActive: true
      },
      {
        testSlug: 'leadership-style',
        testName: 'تست سبک رهبری',
        description: 'شناخت سبک رهبری شما',
        category: 'career',
        isActive: true
      },
      {
        testSlug: 'communication-style',
        testName: 'تست سبک ارتباطی',
        description: 'شناخت سبک ارتباطی شما',
        category: 'skills',
        isActive: true
      },
      {
        testSlug: 'time-management',
        testName: 'تست مدیریت زمان',
        description: 'ارزیابی مهارت‌های مدیریت زمان',
        category: 'skills',
        isActive: true
      },
      {
        testSlug: 'decision-making',
        testName: 'تست تصمیم‌گیری',
        description: 'ارزیابی مهارت‌های تصمیم‌گیری',
        category: 'skills',
        isActive: true
      },
      {
        testSlug: 'problem-solving',
        testName: 'تست حل مسئله',
        description: 'ارزیابی مهارت‌های حل مسئله',
        category: 'skills',
        isActive: true
      },
      {
        testSlug: 'work-life-balance',
        testName: 'تست تعادل کار-زندگی',
        description: 'ارزیابی تعادل بین کار و زندگی',
        category: 'skills',
        isActive: true
      },
      {
        testSlug: 'iq',
        testName: 'تست هوش شناختی IQ',
        description: 'ارزیابی هوش شناختی و توانایی‌های ذهنی',
        category: 'intelligence',
        isActive: true
      },
      {
        testSlug: 'memory',
        testName: 'تست حافظه',
        description: 'ارزیابی قدرت حافظه و یادآوری',
        category: 'intelligence',
        isActive: true
      },
      {
        testSlug: 'spin',
        testName: 'تست اضطراب اجتماعی SPIN',
        description: 'ارزیابی اضطراب اجتماعی و ترس از تعامل',
        category: 'social',
        isActive: true
      },
      {
        testSlug: 'psss',
        testName: 'تست حمایت اجتماعی PSSS',
        description: 'ارزیابی سطح حمایت اجتماعی و روابط',
        category: 'social',
        isActive: true
      },
      {
        testSlug: 'wellness',
        testName: 'تست سلامت کلی',
        description: 'ارزیابی وضعیت سلامت جسمی و روانی',
        category: 'wellness',
        isActive: true
      },
      {
        testSlug: 'nutrition',
        testName: 'تست عادات غذایی',
        description: 'ارزیابی الگوهای تغذیه و عادات غذایی',
        category: 'wellness',
        isActive: true
      },
      {
        testSlug: 'exercise',
        testName: 'تست فعالیت بدنی',
        description: 'ارزیابی سطح فعالیت بدنی و ورزش',
        category: 'wellness',
        isActive: true
      },
      {
        testSlug: 'lifestyle',
        testName: 'تست سبک زندگی',
        description: 'ارزیابی سبک زندگی و عادات روزمره',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'happiness',
        testName: 'تست شادی و رضایت',
        description: 'ارزیابی سطح شادی و رضایت از زندگی',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'mindfulness',
        testName: 'تست ذهن‌آگاهی',
        description: 'ارزیابی سطح ذهن‌آگاهی و حضور در لحظه',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'resilience',
        testName: 'تست تاب‌آوری',
        description: 'ارزیابی توانایی مقابله با مشکلات و چالش‌ها',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'perfectionism',
        testName: 'تست کمال‌گرایی',
        description: 'ارزیابی سطح کمال‌گرایی و تأثیر آن بر زندگی',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'procrastination',
        testName: 'تست تعلل و به‌تعویق‌اندازی',
        description: 'ارزیابی تمایل به تعلل و به‌تعویق‌اندازی کارها',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'anger-management',
        testName: 'تست مدیریت خشم',
        description: 'ارزیابی مهارت‌های کنترل و مدیریت خشم',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'self-compassion',
        testName: 'تست خوددلسوزی',
        description: 'ارزیابی سطح خوددلسوزی و مهربانی با خود',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'gratitude',
        testName: 'تست قدردانی',
        description: 'ارزیابی سطح قدردانی و شکرگزاری',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'optimism',
        testName: 'تست خوش‌بینی',
        description: 'ارزیابی سطح خوش‌بینی و نگاه مثبت به آینده',
        category: 'lifestyle',
        isActive: true
      },
      {
        testSlug: 'creativity',
        testName: 'تست خلاقیت ذهنی',
        description: 'تحلیل قدرت نوآوری',
        category: 'personality',
        isActive: true
      },
      {
        testSlug: 'bfi',
        testName: 'تست شخصیت BFI',
        description: 'ارزیابی سریع شخصیت',
        category: 'personality',
        isActive: true
      }
    ]

    // Create tests in database
    for (const testData of sampleTests) {
      try {
        await prisma.$executeRaw`
          INSERT INTO Test (id, testSlug, testName, description, category, isActive, createdAt, updatedAt)
          VALUES (${crypto.randomUUID()}, ${testData.testSlug}, ${testData.testName}, ${testData.description}, ${testData.category}, ${testData.isActive}, datetime('now'), datetime('now'))
        `
      } catch (error) {
        console.log(`Test ${testData.testSlug} might already exist, skipping...`)
      }
    }

    return NextResponse.json({
      success: true,
      message: `${sampleTests.length} تست نمونه ایجاد شد`,
      count: sampleTests.length
    })

  } catch (error) {
    console.error('Error creating sample tests:', error)
    return NextResponse.json(
      { error: 'خطا در ایجاد تست‌های نمونه' },
      { status: 500 }
    )
  }
}









