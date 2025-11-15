/**
 * Script برای seed کردن تست Lifestyle Harmony Assessment
 * 
 * این script تست سبک زندگی کلی را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس WHO Healthy Lifestyle Index, Wellness Self-Assessment, PERMA-Lifestyle
 */

import { prisma } from '../lib/prisma';
import { getLifestyleHarmonyConfigJSON, LIFESTYLE_HARMONY_REVERSE_ITEMS, LIFESTYLE_HARMONY_SUBSCALES } from '../lib/test-configs/lifestyle-harmony-config';

// سوالات استاندارد Lifestyle Harmony (12 سوال)
const LIFESTYLE_HARMONY_QUESTIONS = [
  {
    order: 1,
    text: 'من تغذیه سالم و متعادل دارم و به طور منظم وعده‌های غذایی می‌خورم.',
    dimension: 'Healthy_Habits',
    isReverse: false,
  },
  {
    order: 2,
    text: 'معمولاً روزم از شدت کار و استرس می‌گذرد و فرصتی برای استراحت ندارم.',
    dimension: 'Daily_Balance_Stress',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 3,
    text: 'من انرژی کافی در طول روز دارم و می‌توانم به خوبی ریکاوری کنم.',
    dimension: 'Energy_Mood_Regulation',
    isReverse: false,
  },
  {
    order: 4,
    text: 'نظم خاصی در کارهایم ندارم و معمولاً برنامه‌هایم تداخل دارند.',
    dimension: 'Routine_Productivity',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 5,
    text: 'خوابم معمولاً بی‌کیفیت است و صبح‌ها خسته از خواب بیدار می‌شوم.',
    dimension: 'Healthy_Habits',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 6,
    text: 'من نمی‌توانم بین کار و زندگی شخصی تعادل برقرار کنم.',
    dimension: 'Daily_Balance_Stress',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 7,
    text: 'انرژی‌ام در طول روز ناگهان سقوط می‌کند و احساس خستگی می‌کنم.',
    dimension: 'Energy_Mood_Regulation',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من روتین‌های سالم روزمره دارم و می‌توانم به خوبی زمان خود را مدیریت کنم.',
    dimension: 'Routine_Productivity',
    isReverse: false,
  },
  {
    order: 9,
    text: 'من به طور منظم فعالیت بدنی دارم و از سلامت جسمی خود مراقبت می‌کنم.',
    dimension: 'Healthy_Habits',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من می‌توانم به خوبی استرس خود را مدیریت کنم و از تکنیک‌های آرامش استفاده می‌کنم.',
    dimension: 'Daily_Balance_Stress',
    isReverse: false,
  },
  {
    order: 11,
    text: 'من خلق پایدار دارم و می‌توانم احساسات خود را به خوبی تنظیم کنم.',
    dimension: 'Energy_Mood_Regulation',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من می‌توانم به خوبی اولویت‌های خود را تعیین کنم و به آن‌ها عمل کنم.',
    dimension: 'Routine_Productivity',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const LIFESTYLE_HARMONY_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedLifestyleHarmony() {
  try {
    console.log('🌱 شروع seed کردن تست Lifestyle Harmony Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'lifestyle-harmony' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'lifestyle-harmony',
          testName: 'تست سبک زندگی کلی (Lifestyle Harmony Assessment)',
          description: 'ارزیابی جامع سبک زندگی. این تست 4 بعد را می‌سنجد: عادت‌های سالم (تغذیه، خواب، فعالیت بدنی)، تعادل و استرس، انرژی و خلق، روتین و بهره‌وری.',
          category: 'lifestyle',
          isActive: true,
          scoringConfig: getLifestyleHarmonyConfigJSON(),
        },
      });
      console.log('✅ تست Lifestyle Harmony ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getLifestyleHarmonyConfigJSON(),
        },
      });
      console.log('✅ Config تست Lifestyle Harmony به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of LIFESTYLE_HARMONY_QUESTIONS) {
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
      for (const optionData of LIFESTYLE_HARMONY_OPTIONS) {
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

    console.log('🎉 تست Lifestyle Harmony با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${LIFESTYLE_HARMONY_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${LIFESTYLE_HARMONY_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Healthy_Habits: ${LIFESTYLE_HARMONY_SUBSCALES.Healthy_Habits.join(', ')}`);
    console.log(`   - Daily_Balance_Stress: ${LIFESTYLE_HARMONY_SUBSCALES.Daily_Balance_Stress.join(', ')}`);
    console.log(`   - Energy_Mood_Regulation: ${LIFESTYLE_HARMONY_SUBSCALES.Energy_Mood_Regulation.join(', ')}`);
    console.log(`   - Routine_Productivity: ${LIFESTYLE_HARMONY_SUBSCALES.Routine_Productivity.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: LIFESTYLE_HARMONY_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Lifestyle Harmony:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedLifestyleHarmony()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedLifestyleHarmony;

