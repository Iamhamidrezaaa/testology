import prisma from '../lib/prisma';

async function listTests() {
  try {
    const tests = await prisma.test.findMany({
      where: { deletedAt: null },
      select: {
        testSlug: true,
        testName: true,
        description: true,
        category: true,
        isActive: true,
        questions: {
          select: {
            id: true
          }
        },
        userTests: {
          select: {
            id: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`\n📋 لیست تست‌های موجود (${tests.length} تست):\n`);
    
    tests.forEach((test, index) => {
      const status = test.isActive ? '✅ فعال' : '❌ غیرفعال';
      const questionCount = test.questions.length;
      const completionCount = test.userTests.length;
      const category = test.category || 'بدون دسته';
      
      console.log(`${index + 1}. ${test.testName}`);
      console.log(`   📌 Slug: ${test.testSlug}`);
      console.log(`   📝 توضیحات: ${test.description || 'بدون توضیحات'}`);
      console.log(`   📂 دسته: ${category}`);
      console.log(`   ${status}`);
      console.log(`   ❓ تعداد سوالات: ${questionCount}`);
      console.log(`   👥 تعداد تکمیل‌ها: ${completionCount}`);
      console.log('');
    });

    const activeTests = tests.filter(t => t.isActive).length;
    const inactiveTests = tests.filter(t => !t.isActive).length;
    
    console.log(`\n📊 خلاصه:`);
    console.log(`   ✅ تست‌های فعال: ${activeTests}`);
    console.log(`   ❌ تست‌های غیرفعال: ${inactiveTests}`);
    console.log(`   📦 کل تست‌ها: ${tests.length}\n`);

  } catch (error) {
    console.error('❌ خطا در دریافت تست‌ها:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listTests();

