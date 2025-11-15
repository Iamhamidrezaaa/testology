/**
 * Script برای seed کردن تست Ideal Environment Profile
 * 
 * این script تست محیط ایده‌آل را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 */

import { prisma } from '../lib/prisma';
import { getIdealEnvironmentConfigJSON, IDEAL_ENVIRONMENT_REVERSE_ITEMS, IDEAL_ENVIRONMENT_SUBSCALES } from '../lib/test-configs/ideal-environment-config';

// سوالات استاندارد Ideal Environment (12 سوال)
const IDEAL_ENVIRONMENT_QUESTIONS = [
  {
    order: 1,
    text: 'من در محیط‌های ساکت و آرام بهترین عملکرد را دارم.',
    dimension: 'Sensory_Preferences',
    isReverse: false,
  },
  {
    order: 2,
    text: 'من از کار در محیط‌های اجتماعی و گروهی لذت می‌برم.',
    dimension: 'Social_Environment',
    isReverse: false,
  },
  {
    order: 3,
    text: 'من به محیط ساختاریافته و قابل پیش‌بینی نیاز دارم تا بهترین عملکرد را داشته باشم.',
    dimension: 'Structure_Predictability',
    isReverse: false,
  },
  {
    order: 4,
    text: 'تغییر محیط باعث بی‌ثباتی و کاهش تمرکز من می‌شود.',
    dimension: 'Stimulation_Variety',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 5,
    text: 'در محیط‌های شلوغ و پر سر و صدا تمرکزم بهتر است.',
    dimension: 'Sensory_Preferences',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 6,
    text: 'در محیط‌های شلوغ و پر از افراد مضطرب می‌شوم و نمی‌توانم تمرکز کنم.',
    dimension: 'Social_Environment',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 7,
    text: 'من به انعطاف و آزادی در محیط کار نیاز دارم و محیط‌های سخت‌گیر برایم مناسب نیست.',
    dimension: 'Structure_Predictability',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من از تغییر محیط و تجربه فضاهای جدید لذت می‌برم.',
    dimension: 'Stimulation_Variety',
    isReverse: false,
  },
  {
    order: 9,
    text: 'من به نور مناسب و محیط حسی متعادل نیاز دارم تا بهترین عملکرد را داشته باشم.',
    dimension: 'Sensory_Preferences',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من ترجیح می‌دهم به تنهایی کار کنم و در محیط‌های اجتماعی احساس ناراحتی می‌کنم.',
    dimension: 'Social_Environment',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 11,
    text: 'من به برنامه مشخص و نظم در محیط کار نیاز دارم.',
    dimension: 'Structure_Predictability',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من به محیط پویا و متنوع نیاز دارم تا از روتین ثابت خسته نشوم.',
    dimension: 'Stimulation_Variety',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const IDEAL_ENVIRONMENT_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedIdealEnvironment() {
  try {
    console.log('🌱 شروع seed کردن تست Ideal Environment Profile...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'ideal-environment' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'ideal-environment',
          testName: 'تست محیط ایده‌آل (Ideal Environment Profile)',
          description: 'ارزیابی ترجیحات محیطی فرد. این تست 4 بعد را می‌سنجد: ترجیح حسی، محیط اجتماعی، ساختار و نظم، تنوع و تغییر.',
          category: 'lifestyle',
          isActive: true,
          scoringConfig: getIdealEnvironmentConfigJSON(),
        },
      });
      console.log('✅ تست Ideal Environment ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getIdealEnvironmentConfigJSON(),
        },
      });
      console.log('✅ Config تست Ideal Environment به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of IDEAL_ENVIRONMENT_QUESTIONS) {
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
      for (const optionData of IDEAL_ENVIRONMENT_OPTIONS) {
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

    console.log('🎉 تست Ideal Environment با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${IDEAL_ENVIRONMENT_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${IDEAL_ENVIRONMENT_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Sensory_Preferences: ${IDEAL_ENVIRONMENT_SUBSCALES.Sensory_Preferences.join(', ')}`);
    console.log(`   - Social_Environment: ${IDEAL_ENVIRONMENT_SUBSCALES.Social_Environment.join(', ')}`);
    console.log(`   - Structure_Predictability: ${IDEAL_ENVIRONMENT_SUBSCALES.Structure_Predictability.join(', ')}`);
    console.log(`   - Stimulation_Variety: ${IDEAL_ENVIRONMENT_SUBSCALES.Stimulation_Variety.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: IDEAL_ENVIRONMENT_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Ideal Environment:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedIdealEnvironment()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedIdealEnvironment;

