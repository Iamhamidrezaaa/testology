/**
 * Script برای seed کردن تست Hobbies & Interests Profile
 * 
 * این script تست علایق و سرگرمی‌ها را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 */

import { prisma } from '../lib/prisma';
import { getHobbiesInterestsConfigJSON, HOBBIES_INTERESTS_REVERSE_ITEMS, HOBBIES_INTERESTS_SUBSCALES } from '../lib/test-configs/hobbies-interests-config';

// سوالات استاندارد Hobbies & Interests (12 سوال)
const HOBBIES_INTERESTS_QUESTIONS = [
  {
    order: 1,
    text: 'من از فعالیت‌های خلاقانه مثل نقاشی، موسیقی، نوشتن یا طراحی لذت می‌برم.',
    dimension: 'Creative_Interests',
    isReverse: false,
  },
  {
    order: 2,
    text: 'من از فعالیت‌های بدنی و ورزشی مثل پیاده‌روی، دویدن، کوهنوردی یا ورزش‌های تیمی لذت می‌برم.',
    dimension: 'Physical_Outdoor_Interests',
    isReverse: false,
  },
  {
    order: 3,
    text: 'من از فعالیت‌های اجتماعی و گروهی مثل ملاقات با دوستان، شرکت در رویدادها یا کارهای داوطلبانه لذت می‌برم.',
    dimension: 'Social_Community_Interests',
    isReverse: false,
  },
  {
    order: 4,
    text: 'من از فعالیت‌های فکری و یادگیری مثل خواندن کتاب، حل معما، یادگیری زبان یا مطالعه موضوعات جدید لذت می‌برم.',
    dimension: 'Intellectual_Learning_Interests',
    isReverse: false,
  },
  {
    order: 5,
    text: 'من معمولاً ایده‌های خلاقانه برای پروژه‌های هنری یا سرگرمی‌های خلاقانه دارم.',
    dimension: 'Creative_Interests',
    isReverse: false,
  },
  {
    order: 6,
    text: 'معمولاً برای فعالیت‌های بدنی و بیرونی انگیزه ندارم و ترجیح می‌دهم در خانه بمانم.',
    dimension: 'Physical_Outdoor_Interests',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 7,
    text: 'من ترجیح می‌دهم هیچ فعالیت اجتماعی یا گروهی نداشته باشم و بیشتر وقت خود را به تنهایی بگذرانم.',
    dimension: 'Social_Community_Interests',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من از یادگیری چیزهای جدید و کشف موضوعات جالب لذت می‌برم.',
    dimension: 'Intellectual_Learning_Interests',
    isReverse: false,
  },
  {
    order: 9,
    text: 'من از خلق آثار هنری، نوشتن داستان یا ساخت چیزهای خلاقانه لذت می‌برم.',
    dimension: 'Creative_Interests',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من از گذراندن وقت در طبیعت و انجام فعالیت‌های بیرونی لذت می‌برم.',
    dimension: 'Physical_Outdoor_Interests',
    isReverse: false,
  },
  {
    order: 11,
    text: 'من از شرکت در رویدادهای اجتماعی، جشن‌ها و فعالیت‌های گروهی لذت می‌برم.',
    dimension: 'Social_Community_Interests',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من از مطالعه، تحقیق و یادگیری درباره موضوعات علمی یا تحلیلی لذت می‌برم.',
    dimension: 'Intellectual_Learning_Interests',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const HOBBIES_INTERESTS_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedHobbiesInterests() {
  try {
    console.log('🌱 شروع seed کردن تست Hobbies & Interests Profile...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'hobbies-interests' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'hobbies-interests',
          testName: 'تست علایق و سرگرمی‌ها (Hobbies & Interests Profile)',
          description: 'ارزیابی علایق و سرگرمی‌ها در 4 حوزه: خلاقانه، بدنی/بیرونی، اجتماعی و فکری/یادگیری. این تست به تحلیل سبک زندگی و پیشنهاد فعالیت‌های مرتبط کمک می‌کند.',
          category: 'lifestyle',
          isActive: true,
          scoringConfig: getHobbiesInterestsConfigJSON(),
        },
      });
      console.log('✅ تست Hobbies & Interests ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getHobbiesInterestsConfigJSON(),
        },
      });
      console.log('✅ Config تست Hobbies & Interests به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of HOBBIES_INTERESTS_QUESTIONS) {
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
      for (const optionData of HOBBIES_INTERESTS_OPTIONS) {
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

    console.log('🎉 تست Hobbies & Interests با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${HOBBIES_INTERESTS_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${HOBBIES_INTERESTS_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Creative_Interests: ${HOBBIES_INTERESTS_SUBSCALES.Creative_Interests.join(', ')}`);
    console.log(`   - Physical_Outdoor_Interests: ${HOBBIES_INTERESTS_SUBSCALES.Physical_Outdoor_Interests.join(', ')}`);
    console.log(`   - Social_Community_Interests: ${HOBBIES_INTERESTS_SUBSCALES.Social_Community_Interests.join(', ')}`);
    console.log(`   - Intellectual_Learning_Interests: ${HOBBIES_INTERESTS_SUBSCALES.Intellectual_Learning_Interests.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: HOBBIES_INTERESTS_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Hobbies & Interests:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedHobbiesInterests()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedHobbiesInterests;

