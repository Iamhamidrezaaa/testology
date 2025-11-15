/**
 * Script برای seed کردن تست Growth Mindset Assessment
 * 
 * این script تست ذهنیت رشد را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس مدل Carol Dweck
 */

import { prisma } from '../lib/prisma';
import { getGrowthMindsetConfigJSON, GROWTH_MINDSET_REVERSE_ITEMS, GROWTH_MINDSET_SUBSCALES } from '../lib/test-configs/growth-mindset-config';

// سوالات استاندارد Growth Mindset (12 سوال)
const GROWTH_MINDSET_QUESTIONS = [
  {
    order: 1,
    text: 'من باور دارم که تلاش و تمرین می‌تواند توانایی‌های من را بهبود بخشد.',
    dimension: 'Effort_Beliefs',
    isReverse: false,
  },
  {
    order: 2,
    text: 'من از دریافت بازخورد و یادگیری از اشتباهاتم لذت می‌برم.',
    dimension: 'Learning_Orientation',
    isReverse: false,
  },
  {
    order: 3,
    text: 'من معمولاً از کارهای سخت و چالش‌برانگیز اجتناب می‌کنم.',
    dimension: 'Challenges_Persistence',
    isReverse: true, // این سوال reverse است (بازتاب ذهنیت ثابت)
  },
  {
    order: 4,
    text: 'من باور دارم که هوش و استعداد قابل توسعه و رشد هستند.',
    dimension: 'Growth_Self_View',
    isReverse: false,
  },
  {
    order: 5,
    text: 'من فکر می‌کنم که تلاش زیاد معمولاً نتیجه چندانی ندارد.',
    dimension: 'Effort_Beliefs',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 6,
    text: 'من از فرصت‌های یادگیری و بهبود مهارت‌هایم استقبال می‌کنم.',
    dimension: 'Learning_Orientation',
    isReverse: false,
  },
  {
    order: 7,
    text: 'وقتی با مشکلی مواجه می‌شوم، معمولاً زود ناامید می‌شوم و دست می‌کشم.',
    dimension: 'Challenges_Persistence',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من باور دارم که افراد با هوش و استعداد خاصی متولد می‌شوند و این تغییر نمی‌کند.',
    dimension: 'Growth_Self_View',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 9,
    text: 'من باور دارم که با تلاش و تمرین می‌توانم در هر زمینه‌ای پیشرفت کنم.',
    dimension: 'Effort_Beliefs',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من معمولاً از بازخورد منفی و انتقاد می‌ترسم و آن را رد می‌کنم.',
    dimension: 'Learning_Orientation',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 11,
    text: 'من از چالش‌های جدید استقبال می‌کنم و در مواجهه با مشکلات مقاومت می‌کنم.',
    dimension: 'Challenges_Persistence',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من باور دارم که می‌توانم با یادگیری و تمرین، توانایی‌هایم را به طور مداوم بهبود بخشم.',
    dimension: 'Growth_Self_View',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const GROWTH_MINDSET_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedGrowthMindset() {
  try {
    console.log('🌱 شروع seed کردن تست Growth Mindset Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'growth-mindset' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'growth-mindset',
          testName: 'تست ذهنیت رشد (Growth Mindset)',
          description: 'ارزیابی ذهنیت رشد در مقابل ذهنیت ثابت بر اساس مدل Carol Dweck. این تست باور به تلاش، گرایش به یادگیری، چالش‌پذیری و خودانگاره رشدی را می‌سنجد.',
          category: 'development',
          isActive: true,
          scoringConfig: getGrowthMindsetConfigJSON(),
        },
      });
      console.log('✅ تست Growth Mindset ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getGrowthMindsetConfigJSON(),
        },
      });
      console.log('✅ Config تست Growth Mindset به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of GROWTH_MINDSET_QUESTIONS) {
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
      for (const optionData of GROWTH_MINDSET_OPTIONS) {
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

      console.log(`✅ سوال ${questionData.order} (${questionData.dimension}${questionData.isReverse ? ', Reverse' : ''}) ایجاد شد`);
    }

    console.log('🎉 تست Growth Mindset با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${GROWTH_MINDSET_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${GROWTH_MINDSET_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Effort_Beliefs: ${GROWTH_MINDSET_SUBSCALES.Effort_Beliefs.join(', ')}`);
    console.log(`   - Learning_Orientation: ${GROWTH_MINDSET_SUBSCALES.Learning_Orientation.join(', ')}`);
    console.log(`   - Challenges_Persistence: ${GROWTH_MINDSET_SUBSCALES.Challenges_Persistence.join(', ')}`);
    console.log(`   - Growth_Self_View: ${GROWTH_MINDSET_SUBSCALES.Growth_Self_View.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: GROWTH_MINDSET_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Growth Mindset:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedGrowthMindset()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedGrowthMindset;

