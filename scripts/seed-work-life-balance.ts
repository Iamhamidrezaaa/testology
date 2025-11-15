/**
 * Script برای seed کردن تست Work-Life Balance Assessment
 * 
 * این script تست تعادل کار–زندگی را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس Work–Life Balance Scale (Fisher), WIPL, PLIW
 */

import { prisma } from '../lib/prisma';
import { getWorkLifeBalanceConfigJSON, WORK_LIFE_BALANCE_REVERSE_ITEMS, WORK_LIFE_BALANCE_SUBSCALES } from '../lib/test-configs/work-life-balance-config';

// سوالات استاندارد Work-Life Balance (12 سوال)
const WORK_LIFE_BALANCE_QUESTIONS = [
  {
    order: 1,
    text: 'کار من باعث می‌شود که نتوانم به فعالیت‌های شخصی و خانوادگی خود برسم.',
    dimension: 'Work_to_Life_Interference',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 2,
    text: 'مسئولیت‌های خانوادگی و شخصی باعث می‌شود که نتوانم در کار تمرکز کنم.',
    dimension: 'Life_to_Work_Interference',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 3,
    text: 'من می‌توانم به خوبی از کار جدا شوم و در زمان استراحت واقعاً استراحت کنم.',
    dimension: 'Recovery_Rest',
    isReverse: false,
  },
  {
    order: 4,
    text: 'من نمی‌توانم بین کار و زندگی شخصی مرزی بگذارم.',
    dimension: 'Boundaries_Control',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 5,
    text: 'کار من باعث می‌شود که زمان کافی برای خودم و علایقم نداشته باشم.',
    dimension: 'Work_to_Life_Interference',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 6,
    text: 'مشکلات شخصی و خانوادگی باعث می‌شود که نتوانم به خوبی در کار عملکرد داشته باشم.',
    dimension: 'Life_to_Work_Interference',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 7,
    text: 'حتی وقتی استراحت می‌کنم، ذهنم درگیر کار است و نمی‌توانم رها کنم.',
    dimension: 'Recovery_Rest',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من می‌توانم به خوبی زمان کار و زندگی شخصی را مدیریت کنم.',
    dimension: 'Boundaries_Control',
    isReverse: false,
  },
  {
    order: 9,
    text: 'کار من باعث می‌شود که نتوانم به تعهدات شخصی و اجتماعی خود عمل کنم.',
    dimension: 'Work_to_Life_Interference',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 10,
    text: 'مسئولیت‌های شخصی باعث می‌شود که نتوانم به تعهدات کاری خود به درستی عمل کنم.',
    dimension: 'Life_to_Work_Interference',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 11,
    text: 'من می‌توانم به خوبی انرژی خود را بازیابی کنم و برای روز بعد آماده شوم.',
    dimension: 'Recovery_Rest',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من می‌توانم به خوبی اولویت‌های کار و زندگی را تعیین کنم و به آن‌ها عمل کنم.',
    dimension: 'Boundaries_Control',
    isReverse: false,
  },
];

// گزینه‌های پاسخ (هرگز تا همیشه)
const WORK_LIFE_BALANCE_OPTIONS = [
  { text: 'هرگز', score: 1, order: 0 },
  { text: 'خیلی کم', score: 2, order: 1 },
  { text: 'گاهی', score: 3, order: 2 },
  { text: 'اغلب', score: 4, order: 3 },
  { text: 'همیشه', score: 5, order: 4 },
];

async function seedWorkLifeBalance() {
  try {
    console.log('🌱 شروع seed کردن تست Work-Life Balance Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'work-life-balance' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'work-life-balance',
          testName: 'تست تعادل کار–زندگی (Work–Life Balance)',
          description: 'ارزیابی تعادل بین کار و زندگی شخصی. این تست مزاحمت کار برای زندگی، مزاحمت زندگی برای کار، ریکاوری و مرزبندی را می‌سنجد.',
          category: 'lifestyle',
          isActive: true,
          scoringConfig: getWorkLifeBalanceConfigJSON(),
        },
      });
      console.log('✅ تست Work-Life Balance ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getWorkLifeBalanceConfigJSON(),
        },
      });
      console.log('✅ Config تست Work-Life Balance به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of WORK_LIFE_BALANCE_QUESTIONS) {
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
      for (const optionData of WORK_LIFE_BALANCE_OPTIONS) {
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

    console.log('🎉 تست Work-Life Balance با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${WORK_LIFE_BALANCE_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${WORK_LIFE_BALANCE_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Work_to_Life_Interference: ${WORK_LIFE_BALANCE_SUBSCALES.Work_to_Life_Interference.join(', ')}`);
    console.log(`   - Life_to_Work_Interference: ${WORK_LIFE_BALANCE_SUBSCALES.Life_to_Work_Interference.join(', ')}`);
    console.log(`   - Recovery_Rest: ${WORK_LIFE_BALANCE_SUBSCALES.Recovery_Rest.join(', ')}`);
    console.log(`   - Boundaries_Control: ${WORK_LIFE_BALANCE_SUBSCALES.Boundaries_Control.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: WORK_LIFE_BALANCE_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Work-Life Balance:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedWorkLifeBalance()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedWorkLifeBalance;

