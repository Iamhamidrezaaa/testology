/**
 * Seed script برای ایجاد کاربران تست
 * اجرا: npx tsx prisma/seed-users.ts
 */

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 شروع seed کاربران تست...\n');

  const testUsers = [
    {
      email: 'user1@testology.me',
      name: 'کاربر تست ۱',
      password: 'User@1234',
    },
    {
      email: 'user2@testology.me',
      name: 'کاربر تست ۲',
      password: 'User@1234',
    },
    {
      email: 'user3@testology.me',
      name: 'کاربر تست ۳',
      password: 'User@1234',
    },
  ];

  for (const userData of testUsers) {
    try {
      const hashedPassword = await hash(userData.password, 12);
      
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {
          name: userData.name,
          password: hashedPassword,
          isActive: true,
          role: 'USER',
        },
        create: {
          email: userData.email,
          name: userData.name,
          password: hashedPassword,
          role: 'USER',
          isActive: true,
        },
      });

      console.log(`✅ کاربر ${userData.email} ایجاد/به‌روزرسانی شد (ID: ${user.id})`);
    } catch (error: any) {
      console.error(`❌ خطا در ایجاد کاربر ${userData.email}:`, error.message);
    }
  }

  console.log('\n✨ Seed کاربران تست تکمیل شد!');
}

main()
  .catch((e) => {
    console.error('❌ خطا در seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

