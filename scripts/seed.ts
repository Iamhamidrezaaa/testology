// import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { prisma } from '../lib/prisma'

// const prisma = new PrismaClient()

async function main() {
  const password = await hash('Delvin123@456', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'h.asgarizade@gmail.com' },
    update: {},
    create: {
      email: 'h.asgarizade@gmail.com',
      name: 'Hossein Asgarizade',
      password: password,
      role: 'ADMIN',
      phone: ""
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