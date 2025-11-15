/**
 * Script برای seed کردن تست Learning Style Assessment
 * 
 * این script تست سبک یادگیری را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 */

import { prisma } from '../lib/prisma';
import { getLearningStyleConfigJSON, LEARNING_STYLE_REVERSE_ITEMS, LEARNING_STYLE_SUBSCALES } from '../lib/test-configs/learning-style-config';

// سوالات استاندارد Learning Style (12 سوال)
const LEARNING_STYLE_QUESTIONS = [
  {
    order: 1,
    text: 'من ترجیح می‌دهم قبل از عمل، اطلاعات را به دقت بررسی و تحلیل کنم.',
    dimension: 'Reflective_Active',
    isReverse: false,
  },
  {
    order: 2,
    text: 'من از حل مسائل پیچیده و تحلیل عمیق لذت می‌برم.',
    dimension: 'Analytical_Practical',
    isReverse: false,
  },
  {
    order: 3,
    text: 'من معمولاً بدون برنامه‌ریزی قبلی شروع به مطالعه می‌کنم.',
    dimension: 'Self_Regulated',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 4,
    text: 'من می‌توانم در محیط‌های مختلف (پر سر و صدا یا ساکت) به خوبی یاد بگیرم.',
    dimension: 'Environment',
    isReverse: false,
  },
  {
    order: 5,
    text: 'من ترجیح می‌دهم مستقیماً وارد عمل شوم و از طریق تجربه یاد بگیرم.',
    dimension: 'Reflective_Active',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 6,
    text: 'من از کارهای عملی و پروژه‌های دست‌ساز بیشتر از مطالعه تئوری لذت می‌برم.',
    dimension: 'Analytical_Practical',
    isReverse: false,
  },
  {
    order: 7,
    text: 'من در مدیریت زمان و برنامه‌ریزی مطالعه مشکل دارم.',
    dimension: 'Self_Regulated',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من می‌توانم در محیط‌های گروهی و اجتماعی به خوبی یاد بگیرم.',
    dimension: 'Environment',
    isReverse: false,
  },
  {
    order: 9,
    text: 'من نیاز به زمان برای تأمل و مرور مطالب دارم تا آن‌ها را به خوبی درک کنم.',
    dimension: 'Reflective_Active',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من ترجیح می‌دهم از طریق تجربه و آزمایش یاد بگیرم تا مطالعه کتاب.',
    dimension: 'Analytical_Practical',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 11,
    text: 'من برنامه‌ریزی منظم و هدفمند برای مطالعه دارم.',
    dimension: 'Self_Regulated',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من می‌توانم در محیط‌های باز و منعطف به خوبی یاد بگیرم.',
    dimension: 'Environment',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const LEARNING_STYLE_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedLearningStyle() {
  try {
    console.log('🌱 شروع seed کردن تست Learning Style Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'learning-style' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'learning-style',
          testName: 'تست سبک یادگیری و پروفایل مطالعه',
          description: 'ارزیابی سبک یادگیری شما بر اساس 4 بعد علمی: فعال/تأمل‌گرا، تحلیلی/عملی، خودتنظیمی و ترجیح محیط',
          category: 'learning',
          isActive: true,
          scoringConfig: getLearningStyleConfigJSON(),
        },
      });
      console.log('✅ تست Learning Style ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getLearningStyleConfigJSON(),
        },
      });
      console.log('✅ Config تست Learning Style به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of LEARNING_STYLE_QUESTIONS) {
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
      for (const optionData of LEARNING_STYLE_OPTIONS) {
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

      console.log(`✅ سوال ${questionData.order} (${questionData.dimension}) ایجاد شد`);
    }

    console.log('🎉 تست Learning Style با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${LEARNING_STYLE_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${LEARNING_STYLE_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Reflective_Active: ${LEARNING_STYLE_SUBSCALES.Reflective_Active.join(', ')}`);
    console.log(`   - Analytical_Practical: ${LEARNING_STYLE_SUBSCALES.Analytical_Practical.join(', ')}`);
    console.log(`   - Self_Regulated: ${LEARNING_STYLE_SUBSCALES.Self_Regulated.join(', ')}`);
    console.log(`   - Environment: ${LEARNING_STYLE_SUBSCALES.Environment.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: LEARNING_STYLE_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Learning Style:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedLearningStyle()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedLearningStyle;

