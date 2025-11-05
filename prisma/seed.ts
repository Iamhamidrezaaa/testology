import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('admin123', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'h.asgarizade@gmail.com' },
    update: { role: 'admin' },
    create: {
      email: 'h.asgarizade@gmail.com',
      name: 'هادی اصغری‌زاده',
      role: 'admin',
      hashedPassword
    },
  })

  console.log({ admin })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 