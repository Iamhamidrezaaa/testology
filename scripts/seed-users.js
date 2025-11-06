// scripts/seed-users.js
// اجرا: node scripts/seed-users.js

const { hash } = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 شروع ساخت کاربران...\n');

  // اطلاعات اکانت‌ها
  const users = [
    { 
      email: 'admin@testology.me', 
      name: 'Admin', 
      role: 'ADMIN', 
      password: 'Admin@1234',
      phone: '09123456789'
    },
    { 
      email: 'user@testology.me',  
      name: 'User Test', 
      role: 'USER',  
      password: 'User@1234',
      phone: '09123456790'
    },
  ];

  // ساخت یا به‌روزرسانی کاربران
  for (const u of users) {
    const hashed = await hash(u.password, 12);
    try {
      const res = await prisma.user.upsert({
        where: { email: u.email },
        update: {
          name: u.name,
          role: u.role,
          password: hashed,
          phone: u.phone,
        },
        create: {
          email: u.email,
          name: u.name,
          role: u.role,
          password: hashed,
          phone: u.phone,
          isActive: true,
        },
      });
      console.log(`✅ کاربر ${res.email} (${res.role}) با موفقیت ایجاد/به‌روزرسانی شد`);
    } catch (err) {
      console.error(`❌ خطا هنگام upsert کاربر ${u.email}:`, err.message);
      throw err;
    }
  }

  // ساخت چند نتیجه‌ی فیک برای user@testology.me
  try {
    const user = await prisma.user.findUnique({ 
      where: { email: 'user@testology.me' }
    });

    if (user) {
      console.log('\n📊 ساخت نتایج تست فیک برای کاربر...');

      // پاک کردن نتایج قدیمی (اختیاری - اگر می‌خواهی هر بار از اول بسازد)
      const deletedCount = await prisma.testResult.deleteMany({ 
        where: { userId: user.id } 
      });
      if (deletedCount.count > 0) {
        console.log(`🗑️  ${deletedCount.count} نتیجه قدیمی حذف شد`);
      }

      // ایجاد چند رکورد نمونه
      const now = new Date();
      const testNames = [
        'تست اضطراب',
        'تست افسردگی',
        'تست استرس',
        'تست MBTI',
        'تست شخصیت',
        'تست هوش هیجانی',
        'تست اعتماد به نفس',
        'تست روابط'
      ];

      const samples = [];
      for (let i = 0; i < 8; i++) {
        const testDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000); // روزانه
        const score = Math.floor(40 + Math.random() * 60); // نمره بین 40 تا 100
        
        samples.push({
          userId: user.id,
          testName: testNames[i] || `تست ${i + 1}`,
          score: score,
          result: score >= 70 ? 'عالی' : score >= 50 ? 'متوسط' : 'نیاز به بهبود',
          analysis: `تحلیل تست انجام شده در تاریخ ${testDate.toLocaleDateString('fa-IR')}`,
          createdAt: testDate,
        });
      }

      await prisma.testResult.createMany({ data: samples });
      console.log(`✅ ${samples.length} نتیجه تست فیک برای user@testology.me ایجاد شد\n`);
    } else {
      console.log('⚠️  کاربر user@testology.me پیدا نشد، نتایج فیک ساخته نشد.\n');
    }
  } catch (e) {
    console.log('⚠️  خطا در ساخت نتایج فیک:', e.message);
    console.log('   (این خطا معمولاً مشکلی ایجاد نمی‌کند)\n');
  }

  console.log('✨ تمام! کاربران آماده استفاده هستند:');
  console.log('   👤 Admin: admin@testology.me / Admin@1234');
  console.log('   👤 User:  user@testology.me  / User@1234\n');
}

main()
  .catch((e) => {
    console.error('❌ خطای کلی:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

