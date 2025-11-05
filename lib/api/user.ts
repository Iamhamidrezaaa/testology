import { prisma } from '@/lib/prisma'

export async function getScreeningStatus() {
  try {
    const response = await fetch('/api/user-tests')
    if (!response.ok) {
      throw new Error('خطا در دریافت وضعیت غربالگری')
    }
    const data = await response.json()
    return {
      done: data.screeningResults?.anxiety !== undefined && data.screeningResults?.depression !== undefined
    }
  } catch (error) {
    console.error('خطا در بررسی وضعیت غربالگری:', error)
    return { done: false }
  }
} 