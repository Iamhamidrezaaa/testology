import { prisma } from './prisma'

/**
 * تولید کد ارجاع یکتا برای کاربر
 */
export function generateReferralCode(userId: string): string {
  return `TST-${userId.slice(0, 5).toUpperCase()}`
}

/**
 * ایجاد کد ارجاع برای کاربر جدید
 */
export async function createReferralCode(userId: string): Promise<string> {
  const referralCode = generateReferralCode(userId)
  
  // TODO: Implement when referralCode field is added to User model
  // await prisma.user.update({
  //   where: { id: userId },
  //   data: { referralCode }
  // })
  
  return referralCode
}

/**
 * استفاده از کد ارجاع
 */
export async function useReferralCode(inviteeId: string, code: string) {
  // TODO: Implement when referralCode field is added to User model
  const inviter = null

  if (!inviter) {
    throw new Error('کد ارجاع نامعتبر است')
  }

  // TODO: Implement when referral model is added to schema
  const existingReferral = null

  if (existingReferral) {
    throw new Error('شما قبلاً با کد ارجاع دیگری ثبت‌نام کرده‌اید')
  }

  // TODO: Implement when referral model is added to schema
  const referral = null

  // TODO: Implement when referredBy field is added to User model
  // await prisma.user.update({
  //   where: { id: inviteeId },
  //   data: { referredBy: code }
  // })

  return referral
}

/**
 * تکمیل فرآیند ارجاع و اعطای امتیاز
 */
export async function completeReferral(referralId: string) {
  // TODO: Implement when referral model is added to schema
  const referral = null

  if (!referral) {
    throw new Error('ارجاع یافت نشد')
  }

  // TODO: Implement when referral model is added to schema
  // if (referral.status === 'COMPLETED') {
  //   throw new Error('این ارجاع قبلاً تکمیل شده است')
  // }

  // TODO: Implement when referral model is added to schema
  // await prisma.referral.update({
  //   where: { id: referralId },
  //   data: { status: 'COMPLETED' }
  // })

  // TODO: Implement when points field is added to User model
  // await prisma.user.update({
  //   where: { id: referral.inviterId },
  //   data: {
  //     points: {
  //       increment: referral.points
  //     }
  //   }
  // })

  return referral
}

/**
 * دریافت لیست ارجاع‌های یک کاربر
 */
export async function getUserReferrals(userId: string) {
  // TODO: Implement when referral model is added to schema
  return []
} 