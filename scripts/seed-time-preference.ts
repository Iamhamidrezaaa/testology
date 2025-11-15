/**
 * Script برای seed کردن تست Time Preference / Temporal Orientation
 * 
 * این script تست ترجیح زمانی را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس ZTPI, CFC, Delay Discounting Theory
 */

import { prisma } from '../lib/prisma';
import { getTimePreferenceConfigJSON, TIME_PREFERENCE_REVERSE_ITEMS, TIME_PREFERENCE_SUBSCALES } from '../lib/test-configs/time-preference-config';

// سوالات استاندارد Time Preference (12 سوال)
const TIME_PREFERENCE_QUESTIONS = [
  {
    order: 1,
    text: 'من معمولاً برای آینده برنامه‌ریزی می‌کنم و اهداف بلندمدت دارم.',
    dimension: 'Future_Orientation',
    isReverse: false,
  },
  {
    order: 2,
    text: 'من از زندگی در لحظه حال و لذت بردن از تجربیات فوری لذت می‌برم.',
    dimension: 'Present_Focused',
    isReverse: false,
  },
  {
    order: 3,
    text: 'من می‌توانم به خوبی صبر کنم و برای پاداش‌های بلندمدت تلاش کنم.',
    dimension: 'Impulsivity_Delay_Discounting',
    isReverse: false,
  },
  {
    order: 4,
    text: 'من معمولاً در گذشته گیر می‌کنم و نمی‌توانم از آن رها شوم.',
    dimension: 'Past_Reflection',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 5,
    text: 'من قبل از تصمیم‌گیری، پیامدهای آینده را در نظر می‌گیرم.',
    dimension: 'Future_Orientation',
    isReverse: false,
  },
  {
    order: 6,
    text: 'من معمولاً بدون فکر به پیامد آینده عمل می‌کنم.',
    dimension: 'Present_Focused',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 7,
    text: 'من بی‌صبر هستم و ترجیح می‌دهم پاداش فوری بگیرم تا پاداش بزرگ‌تر در آینده.',
    dimension: 'Impulsivity_Delay_Discounting',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من می‌توانم از گذشته درس بگیرم و خاطرات مثبت را حفظ کنم.',
    dimension: 'Past_Reflection',
    isReverse: false,
  },
  {
    order: 9,
    text: 'من برای دستیابی به اهداف آینده، لذت‌های فوری را به تعویق می‌اندازم.',
    dimension: 'Future_Orientation',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من از تجربیات جدید و هیجان‌انگیز در لحظه حال لذت می‌برم.',
    dimension: 'Present_Focused',
    isReverse: false,
  },
  {
    order: 11,
    text: 'من نمی‌توانم صبر کنم و همیشه می‌خواهم چیزها را فوراً داشته باشم.',
    dimension: 'Impulsivity_Delay_Discounting',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 12,
    text: 'من می‌توانم از تجربیات گذشته برای تصمیم‌گیری بهتر در آینده استفاده کنم.',
    dimension: 'Past_Reflection',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const TIME_PREFERENCE_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedTimePreference() {
  try {
    console.log('🌱 شروع seed کردن تست Time Preference / Temporal Orientation...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'time-preference' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'time-preference',
          testName: 'تست ترجیح زمانی (Time Preference / Temporal Orientation)',
          description: 'ارزیابی ترجیح زمانی و نگرش نسبت به زمان بر اساس ZTPI و CFC. این تست 4 بعد را می‌سنجد: آینده‌نگری، تمرکز بر حال، تکانشگری و رابطه با گذشته.',
          category: 'personality',
          isActive: true,
          scoringConfig: getTimePreferenceConfigJSON(),
        },
      });
      console.log('✅ تست Time Preference ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getTimePreferenceConfigJSON(),
        },
      });
      console.log('✅ Config تست Time Preference به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of TIME_PREFERENCE_QUESTIONS) {
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
      for (const optionData of TIME_PREFERENCE_OPTIONS) {
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

    console.log('🎉 تست Time Preference با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${TIME_PREFERENCE_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${TIME_PREFERENCE_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Future_Orientation: ${TIME_PREFERENCE_SUBSCALES.Future_Orientation.join(', ')}`);
    console.log(`   - Present_Focused: ${TIME_PREFERENCE_SUBSCALES.Present_Focused.join(', ')}`);
    console.log(`   - Impulsivity_Delay_Discounting: ${TIME_PREFERENCE_SUBSCALES.Impulsivity_Delay_Discounting.join(', ')}`);
    console.log(`   - Past_Reflection: ${TIME_PREFERENCE_SUBSCALES.Past_Reflection.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: TIME_PREFERENCE_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Time Preference:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedTimePreference()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedTimePreference;

