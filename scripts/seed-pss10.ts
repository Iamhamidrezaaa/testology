/**
 * Script برای seed کردن تست PSS-10 (Perceived Stress Scale - 10 Items)
 * 
 * این script تست PSS-10 را با سوالات و گزینه‌های استاندارد در دیتابیس ایجاد می‌کند
 */

import { prisma } from '../lib/prisma';
import { getPSS10ConfigJSON, PSS10_REVERSE_ITEMS, PSS10_SUBSCALES } from '../lib/test-configs/pss10-config';

// سوالات استاندارد PSS-10 (بر اساس نسخه اصلی Cohen et al., 1983)
const PSS10_QUESTIONS = [
  {
    order: 1,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که چیزهای غیرمنتظره‌ای اتفاق افتاده که شما را ناراحت کرده است؟',
    dimension: 'Helplessness',
    isReverse: false,
  },
  {
    order: 2,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که کنترل مهم‌ترین چیزهای زندگی خود را از دست داده‌اید؟',
    dimension: 'Helplessness',
    isReverse: false,
  },
  {
    order: 3,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که عصبی یا استرس دارید؟',
    dimension: 'Helplessness',
    isReverse: false,
  },
  {
    order: 4,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که مطمئن هستید می‌توانید مسئولیت‌های شخصی خود را انجام دهید؟',
    dimension: 'Self_Efficacy',
    isReverse: true, // این سوال مثبت است و باید reverse شود
  },
  {
    order: 5,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که همه چیز درست پیش می‌رود؟',
    dimension: 'Self_Efficacy',
    isReverse: true, // این سوال مثبت است و باید reverse شود
  },
  {
    order: 6,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که نمی‌توانید با همه چیزهایی که باید انجام دهید کنار بیایید؟',
    dimension: 'Helplessness',
    isReverse: false,
  },
  {
    order: 7,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که می‌توانید مشکلات شخصی خود را کنترل کنید؟',
    dimension: 'Self_Efficacy',
    isReverse: true, // این سوال مثبت است و باید reverse شود
  },
  {
    order: 8,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که می‌توانید اوضاع را تحت کنترل داشته باشید؟',
    dimension: 'Self_Efficacy',
    isReverse: true, // این سوال مثبت است و باید reverse شود
  },
  {
    order: 9,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که به دلیل چیزهایی که خارج از کنترل شما بوده، عصبانی شده‌اید؟',
    dimension: 'Helplessness',
    isReverse: false,
  },
  {
    order: 10,
    text: 'در ماه گذشته، چقدر احساس کرده‌اید که مشکلات آنقدر جمع شده‌اند که نمی‌توانید بر آن‌ها غلبه کنید؟',
    dimension: 'Helplessness',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (0-4)
const PSS10_OPTIONS = [
  { text: 'هرگز', score: 0, order: 0 },
  { text: 'به‌ندرت', score: 1, order: 1 },
  { text: 'گاهی', score: 2, order: 2 },
  { text: 'اغلب', score: 3, order: 3 },
  { text: 'تقریباً همیشه', score: 4, order: 4 },
];

async function seedPSS10() {
  try {
    console.log('🌱 شروع seed کردن تست PSS-10...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'pss10' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'pss10',
          testName: 'تست استرس ادراک‌شده (PSS-10)',
          description: 'ارزیابی سطح استرس ادراک‌شده بر اساس Perceived Stress Scale (PSS-10)',
          category: 'mental',
          isActive: true,
          scoringConfig: getPSS10ConfigJSON(),
        },
      });
      console.log('✅ تست PSS-10 ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getPSS10ConfigJSON(),
        },
      });
      console.log('✅ Config تست PSS-10 به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of PSS10_QUESTIONS) {
      const question = await prisma.question.create({
        data: {
          testId: test.id,
          text: questionData.text,
          order: questionData.order,
          dimension: questionData.dimension,
          isReverse: questionData.isReverse,
        },
      });

      // ایجاد گزینه‌ها
      for (const optionData of PSS10_OPTIONS) {
        await prisma.option.create({
          data: {
            questionId: question.id,
            text: optionData.text,
            score: optionData.score,
            order: optionData.order,
            isCorrect: false,
          },
        });
      }

      console.log(`✅ سوال ${questionData.order} ایجاد شد`);
    }

    console.log('🎉 تست PSS-10 با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${PSS10_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${PSS10_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Helplessness: ${PSS10_SUBSCALES.Helplessness.join(', ')}`);
    console.log(`   - Self_Efficacy: ${PSS10_SUBSCALES.Self_Efficacy.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: PSS10_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست PSS-10:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedPSS10()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedPSS10;

