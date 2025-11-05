import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // ایجاد مدیر کل
  const admin = await prisma.user.upsert({
    where: { email: 'h.asgarizade@gmail.com' },
    update: {},
    create: {
      name: 'Hamidreza Askarizade',
      email: 'h.asgarizade@gmail.com',
      role: 'ADMIN',
      password: null,
      emailVerified: new Date(),
    },
  })

  console.log('✅ مدیر کل با موفقیت ایجاد شد:', admin)
}

main()
  .catch((e) => {
    console.error('❌ خطا در ایجاد مدیر کل:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })