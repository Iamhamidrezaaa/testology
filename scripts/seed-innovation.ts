/**
 * Script برای seed کردن تست Innovation & Creative Action Assessment
 * 
 * این script تست نوآوری را با 12 سوال و 4 زیرمقیاس در دیتابیس ایجاد می‌کند
 * بر اساس Innovative Behavior Scale (Janssen), Creative Self-Efficacy Scale
 */

import { prisma } from '../lib/prisma';
import { getInnovationConfigJSON, INNOVATION_REVERSE_ITEMS, INNOVATION_SUBSCALES } from '../lib/test-configs/innovation-config';

// سوالات استاندارد Innovation (12 سوال)
const INNOVATION_QUESTIONS = [
  {
    order: 1,
    text: 'معمولاً ایده‌های جدید زیادی به ذهنم می‌رسد.',
    dimension: 'Idea_Generation',
    isReverse: false,
  },
  {
    order: 2,
    text: 'فکر می‌کنم آدم خلاقی نیستم و نمی‌توانم ایده‌های خوبی ارائه دهم.',
    dimension: 'Creative_Confidence',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 3,
    text: 'من معمولاً ایده‌هایم را به سرعت به عمل تبدیل می‌کنم.',
    dimension: 'Innovation_Implementation',
    isReverse: false,
  },
  {
    order: 4,
    text: 'من از امتحان کردن روش‌های جدید و متفاوت لذت می‌برم.',
    dimension: 'Risk_Taking_Experimentation',
    isReverse: false,
  },
  {
    order: 5,
    text: 'من می‌توانم به راحتی راه‌حل‌های خلاقانه برای مسائل پیدا کنم.',
    dimension: 'Idea_Generation',
    isReverse: false,
  },
  {
    order: 6,
    text: 'من به توانایی خودم در تولید ایده‌های نوآورانه اعتماد دارم.',
    dimension: 'Creative_Confidence',
    isReverse: false,
  },
  {
    order: 7,
    text: 'معمولاً اجرای ایده‌هایم را به تعویق می‌اندازم و شروع نمی‌کنم.',
    dimension: 'Innovation_Implementation',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 8,
    text: 'من معمولاً از ریسک کردن و امتحان چیزهای جدید می‌ترسم.',
    dimension: 'Risk_Taking_Experimentation',
    isReverse: true, // این سوال reverse است
  },
  {
    order: 9,
    text: 'من از فکر کردن به ایده‌های جدید و خلاقانه لذت می‌برم.',
    dimension: 'Idea_Generation',
    isReverse: false,
  },
  {
    order: 10,
    text: 'من باور دارم که می‌توانم راه‌حل‌های نوآورانه برای چالش‌ها پیدا کنم.',
    dimension: 'Creative_Confidence',
    isReverse: false,
  },
  {
    order: 11,
    text: 'من می‌توانم ایده‌هایم را به پروژه‌های عملی تبدیل کنم.',
    dimension: 'Innovation_Implementation',
    isReverse: false,
  },
  {
    order: 12,
    text: 'من معمولاً از تجربه کردن چیزهای جدید و ناآشنا اجتناب می‌کنم.',
    dimension: 'Risk_Taking_Experimentation',
    isReverse: true, // این سوال reverse است
  },
];

// گزینه‌های پاسخ (Likert 1-5)
const INNOVATION_OPTIONS = [
  { text: 'کاملاً مخالفم', score: 1, order: 0 },
  { text: 'مخالفم', score: 2, order: 1 },
  { text: 'خنثی', score: 3, order: 2 },
  { text: 'موافقم', score: 4, order: 3 },
  { text: 'کاملاً موافقم', score: 5, order: 4 },
];

async function seedInnovation() {
  try {
    console.log('🌱 شروع seed کردن تست Innovation & Creative Action Assessment...');

    // بررسی وجود تست
    let test = await prisma.test.findUnique({
      where: { testSlug: 'innovation' },
    });

    if (!test) {
      // ایجاد تست
      test = await prisma.test.create({
        data: {
          testSlug: 'innovation',
          testName: 'تست نوآوری و عمل خلاقانه (Innovation & Creative Action)',
          description: 'ارزیابی نوآوری و عمل خلاقانه. این تست ایده‌پردازی، اعتمادبه‌نفس خلاقانه، اجرای ایده‌ها و ریسک‌پذیری را می‌سنجد.',
          category: 'creativity',
          isActive: true,
          scoringConfig: getInnovationConfigJSON(),
        },
      });
      console.log('✅ تست Innovation ایجاد شد');
    } else {
      // به‌روزرسانی config
      await prisma.test.update({
        where: { id: test.id },
        data: {
          scoringConfig: getInnovationConfigJSON(),
        },
      });
      console.log('✅ Config تست Innovation به‌روزرسانی شد');
    }

    // حذف سوالات قبلی (اگر وجود داشته باشند)
    await prisma.question.deleteMany({
      where: { testId: test.id },
    });
    console.log('🗑️ سوالات قبلی حذف شدند');

    // ایجاد سوالات و گزینه‌ها
    for (const questionData of INNOVATION_QUESTIONS) {
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
      for (const optionData of INNOVATION_OPTIONS) {
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

    console.log('🎉 تست Innovation با موفقیت seed شد!');
    console.log(`📊 تعداد سوالات: ${INNOVATION_QUESTIONS.length}`);
    console.log(`🔄 Reverse items: ${INNOVATION_REVERSE_ITEMS.join(', ')}`);
    console.log(`📈 زیرمقیاس‌ها:`);
    console.log(`   - Idea_Generation: ${INNOVATION_SUBSCALES.Idea_Generation.join(', ')}`);
    console.log(`   - Creative_Confidence: ${INNOVATION_SUBSCALES.Creative_Confidence.join(', ')}`);
    console.log(`   - Innovation_Implementation: ${INNOVATION_SUBSCALES.Innovation_Implementation.join(', ')}`);
    console.log(`   - Risk_Taking_Experimentation: ${INNOVATION_SUBSCALES.Risk_Taking_Experimentation.join(', ')}`);

    return {
      success: true,
      testId: test.id,
      questionsCount: INNOVATION_QUESTIONS.length,
    };
  } catch (error) {
    console.error('❌ خطا در seed کردن تست Innovation:', error);
    throw error;
  }
}

// اجرای script
if (require.main === module) {
  seedInnovation()
    .then(() => {
      console.log('✅ Seed کامل شد');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطا:', error);
      process.exit(1);
    });
}

export default seedInnovation;

