/**
 * Script برای seed کردن تست Curiosity & Openness Assessment
 * 
 * این script تست کنجکاوی را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس مدل CEI-II (Kashdan)
 */

import { prisma } from '../lib/prisma';
import { getCuriosityConfigJSON, CURIOSITY_REVERSE_ITEMS, CURIOSITY_SUBSCALES } from '../lib/test-configs/curiosity-config';

// سوالات استاندارد Curiosity (12 سوال)
const CURIOSITY_QUESTIONS = [
  {
    order: 1,
    text: 'من از کشف و یادگیری چیزهای جدید لذت زیادی می‌برم.',
    dimension: 'Joyous_Exploration',
    isReverse: false,
  },
  {
    order: 2,
    text: 'وقتی چیزی را نمی‌فهمم، احساس ناراحتی می‌کنم تا زمانی که آن را بفهمم.',
    dimension: 'Deprivation_Sensitivity',
    isReverse: false,
  },
  {
    order: 3,
    text: 'من ترجیح می‌دهم از چیزهای جدید و ناآشنا دوری کنم.',
    dimension: 'Openness_New_Experiences',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 4,
    text: 'من از تجربه چیزهای جدید و متفاوت استقبال می‌کنم، حتی اگر کمی خطرناک باشند.',
    dimension: 'Risk_Tolerance',
    isReverse: false,
  },
  {
    order: 5,
    text: 'من از فرآیند یادگیری و کشف چیزهای جدید هیجان‌زده می‌شوم.',
    dimension: 'Joyous_Exploration',
    isReverse: false,
  },
  {
    order: 6,
    text: 'وقتی سوالی در ذهنم ایجاد می‌شود، نمی‌توانم راحت باشم تا زمانی که پاسخ آن را پیدا کنم.',
    dimension: 'Deprivation_Sensitivity',
    isReverse: false,
  },
  {
    order: 7,
    text: 'من از تجربه فرهنگ‌ها، غذاها و سبک‌های زندگی جدید لذت می‌برم.',
    dimension: 'Openness_New_Experiences',
    isReverse: false,
  },
  {
    order: 8,
    text: 'من معمولاً از انجام کارهای جدید و ناآشنا می‌ترسم.',
    dimension: 'Risk_Tolerance',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 9,
    text: 'من از خواندن، تحقیق و یادگیری درباره موضوعات جدید لذت می‌برم.',
    dimension: 'Joyous_Exploration',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من معمولاً به پاسخ سوالاتم اهمیت نمی‌دهم و راحت می‌گذرم.',
    dimension: 'Deprivation_Sensitivity',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 11,
    text: 'من از ملاقات با افراد جدید و شنیدن دیدگاه‌های متفاوت لذت می‌برم.',
    dimension: 'Openness_New_Experiences',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من معمولاً از ریسک کردن و امتحان چیزهای جدید اجتناب می‌کنم.',
    dimension: 'Risk_Tolerance',
    isReverse: true, // این سوال reverse است
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const CURIOSITY_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedCuriosity() {
  try {
    console.log('🌱 شروع seed کردن تست Curiosity & Openness Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'curiosity' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'curiosity',
          testName: 'تست کنجکاوی و گشودگی (Curiosity & Openness)',
          description: 'ارزیابی کنجکاوی و گشودگی به تجارب جدید بر اساس مدل CEI-II. این تست لذت از کشف، نیاز به دانستن، گشودگی و جسارت در کاوش را می‌سنجد.',
          category: 'personality',
          isActive: true,
          scoringConfig: getCuriosityConfigJSON(),
        },
      });
      console.log('✅ تست Curiosity ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getCuriosityConfigJSON(),
        },
      });
      console.log('✅ Config تست Curiosity به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of CURIOSITY_QUESTIONS) {
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
      for (const optionData of CURIOSITY_OPTIONS) {
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

    console.log('🎉 تست Curiosity با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${CURIOSITY_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${CURIOSITY_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Joyous_Exploration: ${CURIOSITY_SUBSCALES.Joyous_Exploration.join(', ')}`);
    console.log(`   - Deprivation_Sensitivity: ${CURIOSITY_SUBSCALES.Deprivation_Sensitivity.join(', ')}`);
    console.log(`   - Openness_New_Experiences: ${CURIOSITY_SUBSCALES.Openness_New_Experiences.join(', ')}`);
    console.log(`   - Risk_Tolerance: ${CURIOSITY_SUBSCALES.Risk_Tolerance.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: CURIOSITY_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Curiosity:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedCuriosity()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedCuriosity;

