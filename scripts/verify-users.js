// scripts/verify-users.js
// بررسی کاربران ایجاد شده

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🔍 بررسی کاربران...\n');

  const users = await prisma.user.findMany({
    where: {
      email: {
        in: ['admin@testology.me', 'user@testology.me']
      }
    },
    include: {
      testResults: true
    }
  });

  for (const user of users) {
    console.log(`👤 ${user.email}`);
    console.log(`   نام: ${user.name}`);
    console.log(`   نقش: ${user.role}`);
    console.log(`   فعال: ${user.isActive ? 'بله' : 'خیر'}`);
    console.log(`   تعداد نتایج تست: ${user.testResults.length}`);
    if (user.testResults.length > 0) {
      console.log(`   آخرین تست: ${user.testResults[0].testName} (نمره: ${user.testResults[0].score})`);
    }
    console.log('');
  }

  console.log(`✅ مجموع: ${users.length} کاربر پیدا شد\n`);
}

main()
  .catch((e) => {
    console.error('❌ خطا:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

