import { PrismaClient } from '@prisma/client'

declare global {
  namespace PrismaClient {
    interface UserBehavior {
      id: string
      userId: string
      action: string
      target: string
      value: string | null
      createdAt: Date
    }
  }
} 