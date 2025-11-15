/**
 * Script برای seed کردن تست Adaptability Assessment
 * 
 * این script تست انطباق‌پذیری را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس Adaptability Scale (Martin), CFI, Career Adaptability Scale
 */

import { prisma } from '../lib/prisma';
import { getAdaptabilityConfigJSON, ADAPTABILITY_REVERSE_ITEMS, ADAPTABILITY_SUBSCALES } from '../lib/test-configs/adaptability-config';

// سوالات استاندارد Adaptability (12 سوال)
const ADAPTABILITY_QUESTIONS = [
  {
    order: 1,
    text: 'من می‌توانم به راحتی به روش‌های جدید فکر کنم و راه‌حل‌های مختلف را در نظر بگیرم.',
    dimension: 'Cognitive_Flexibility',
    isReverse: false,
  },
  {
    order: 2,
    text: 'در موقعیت‌های جدید و ناآشنا، معمولاً زود مضطرب و نگران می‌شوم.',
    dimension: 'Emotional_Adaptability',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 3,
    text: 'من می‌توانم به راحتی رفتار و عادت‌هایم را تغییر دهم وقتی که لازم باشد.',
    dimension: 'Behavioral_Adaptability',
    isReverse: false,
  },
  {
    order: 4,
    text: 'تغییرات معمولاً باعث ناراحتی و استرس من می‌شوند.',
    dimension: 'Openness_to_Change',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 5,
    text: 'وقتی چیزی تغییر می‌کند، معمولاً گیج می‌شوم و نمی‌دانم چه کنم.',
    dimension: 'Cognitive_Flexibility',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 6,
    text: 'من می‌توانم احساساتم را در مواجهه با تغییرات و موقعیت‌های جدید به خوبی مدیریت کنم.',
    dimension: 'Emotional_Adaptability',
    isReverse: false,
  },
  {
    order: 7,
    text: 'من معمولاً در برابر تغییر رفتار و عادت‌هایم مقاومت می‌کنم.',
    dimension: 'Behavioral_Adaptability',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من از تجربه تغییرات و موقعیت‌های جدید لذت می‌برم.',
    dimension: 'Openness_to_Change',
    isReverse: false,
  },
  {
    order: 9,
    text: 'من می‌توانم به راحتی زاویه دید خود را تغییر دهم و از منظرهای مختلف به مسائل نگاه کنم.',
    dimension: 'Cognitive_Flexibility',
    isReverse: false,
  },
  {
    order: 10,
    text: 'وقتی با موقعیت جدیدی مواجه می‌شوم، معمولاً احساس ناامنی و ترس می‌کنم.',
    dimension: 'Emotional_Adaptability',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 11,
    text: 'من می‌توانم به سرعت با شرایط جدید سازگار شوم و واکنش مناسب نشان دهم.',
    dimension: 'Behavioral_Adaptability',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من ترجیح می‌دهم در محیط‌های ثابت و قابل پیش‌بینی بمانم تا تغییر کنم.',
    dimension: 'Openness_to_Change',
    isReverse: true, // این سوال reverse است
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const ADAPTABILITY_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedAdaptability() {
  try {
    console.log('🌱 شروع seed کردن تست Adaptability Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'adaptability' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'adaptability',
          testName: 'تست انطباق‌پذیری (Adaptability Assessment)',
          description: 'ارزیابی انطباق‌پذیری و انعطاف‌پذیری در مواجهه با تغییرات. این تست انعطاف ذهنی، سازگاری هیجانی، انعطاف رفتاری و گشودگی نسبت به تغییر را می‌سنجد.',
          category: 'development',
          isActive: true,
          scoringConfig: getAdaptabilityConfigJSON(),
        },
      });
      console.log('✅ تست Adaptability ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getAdaptabilityConfigJSON(),
        },
      });
      console.log('✅ Config تست Adaptability به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of ADAPTABILITY_QUESTIONS) {
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
      for (const optionData of ADAPTABILITY_OPTIONS) {
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

    console.log('🎉 تست Adaptability با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${ADAPTABILITY_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${ADAPTABILITY_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Cognitive_Flexibility: ${ADAPTABILITY_SUBSCALES.Cognitive_Flexibility.join(', ')}`);
    console.log(`   - Emotional_Adaptability: ${ADAPTABILITY_SUBSCALES.Emotional_Adaptability.join(', ')}`);
    console.log(`   - Behavioral_Adaptability: ${ADAPTABILITY_SUBSCALES.Behavioral_Adaptability.join(', ')}`);
    console.log(`   - Openness_to_Change: ${ADAPTABILITY_SUBSCALES.Openness_to_Change.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: ADAPTABILITY_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Adaptability:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedAdaptability()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedAdaptability;

