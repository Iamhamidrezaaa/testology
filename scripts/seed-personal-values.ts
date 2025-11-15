/**
 * Script برای seed کردن تست Personal Values Assessment
 * 
 * این script تست ارزش‌های شخصی را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس Schwartz Value Theory
 */

import { prisma } from '../lib/prisma';
import { getPersonalValuesConfigJSON, PERSONAL_VALUES_REVERSE_ITEMS, PERSONAL_VALUES_SUBSCALES } from '../lib/test-configs/personal-values-config';

// سوالات استاندارد Personal Values (12 سوال)
const PERSONAL_VALUES_QUESTIONS = [
  {
    order: 1,
    text: 'پیشرفت شخصی و موفقیت در کار و زندگی برای من بسیار مهم است.',
    dimension: 'Self_Enhancement',
    isReverse: false,
  },
  {
    order: 2,
    text: 'کمک به دیگران و داشتن تأثیر مثبت روی جامعه برای من بسیار مهم است.',
    dimension: 'Self_Transcendence',
    isReverse: false,
  },
  {
    order: 3,
    text: 'آزادی، استقلال و تجربه چیزهای جدید برای من بسیار مهم است.',
    dimension: 'Openness_to_Change',
    isReverse: false,
  },
  {
    order: 4,
    text: 'قاعده، نظم و ساختار برای من چیز مهمی نیست.',
    dimension: 'Conservation',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 5,
    text: 'دستیابی به قدرت، تأثیر و موقعیت اجتماعی برای من مهم است.',
    dimension: 'Self_Enhancement',
    isReverse: false,
  },
  {
    order: 6,
    text: 'کمک به دیگران و خیرخواهی در اولویت من نیست.',
    dimension: 'Self_Transcendence',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 7,
    text: 'من ترجیح می‌دهم از تغییر و تجربه چیزهای جدید دوری کنم.',
    dimension: 'Openness_to_Change',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'امنیت، ثبات و حفظ سنت‌ها برای من بسیار مهم است.',
    dimension: 'Conservation',
    isReverse: false,
  },
  {
    order: 9,
    text: 'رشد فردی، یادگیری و پیشرفت مداوم برای من بسیار مهم است.',
    dimension: 'Self_Enhancement',
    isReverse: false,
  },
  {
    order: 10,
    text: 'اخلاق، عدالت و برابری برای من بسیار مهم است.',
    dimension: 'Self_Transcendence',
    isReverse: false,
  },
  {
    order: 11,
    text: 'نوآوری، خلاقیت و تفکر مستقل برای من بسیار مهم است.',
    dimension: 'Openness_to_Change',
    isReverse: false,
  },
  {
    order: 12,
    text: 'احترام به سنت‌ها، خانواده و فرهنگ برای من بسیار مهم است.',
    dimension: 'Conservation',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (مقیاس اهمیت)
const PERSONAL_VALUES_OPTIONS = [
  { text: 'اصلاً مهم نیست', score: 1, order: 0 },
  { text: 'کمی مهم است', score: 2, order: 1 },
  { text: 'متوسط است', score: 3, order: 2 },
  { text: 'مهم است', score: 4, order: 3 },
  { text: 'بسیار مهم است', score: 5, order: 4 },
];

async function seedPersonalValues() {
  try {
    console.log('🌱 شروع seed کردن تست Personal Values Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'personal-values' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'personal-values',
          testName: 'تست ارزش‌های شخصی (Personal Values Assessment)',
          description: 'ارزیابی ارزش‌های شخصی بر اساس Schwartz Value Theory. این تست 4 بعد ارزشی را می‌سنجد: پیشرفت فردی، دیگرگرایی، گشودگی به تغییر و ثبات.',
          category: 'personality',
          isActive: true,
          scoringConfig: getPersonalValuesConfigJSON(),
        },
      });
      console.log('✅ تست Personal Values ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getPersonalValuesConfigJSON(),
        },
      });
      console.log('✅ Config تست Personal Values به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of PERSONAL_VALUES_QUESTIONS) {
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
      for (const optionData of PERSONAL_VALUES_OPTIONS) {
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

    console.log('🎉 تست Personal Values با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${PERSONAL_VALUES_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${PERSONAL_VALUES_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Self_Enhancement: ${PERSONAL_VALUES_SUBSCALES.Self_Enhancement.join(', ')}`);
    console.log(`   - Self_Transcendence: ${PERSONAL_VALUES_SUBSCALES.Self_Transcendence.join(', ')}`);
    console.log(`   - Openness_to_Change: ${PERSONAL_VALUES_SUBSCALES.Openness_to_Change.join(', ')}`);
    console.log(`   - Conservation: ${PERSONAL_VALUES_SUBSCALES.Conservation.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: PERSONAL_VALUES_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Personal Values:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedPersonalValues()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedPersonalValues;

