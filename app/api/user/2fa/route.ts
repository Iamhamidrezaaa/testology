import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { authenticator } from 'otplib'
import QRCode from 'qrcode'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('email')
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    // بررسی وجود کاربر
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    // بررسی وضعیت 2FA
    const has2FA = !!user.twoFactorSecret
    const is2FAEnabled = !!user.twoFactorEnabled

    return NextResponse.json({
      success: true,
      has2FA,
      isEnabled: is2FAEnabled,
      message: has2FA ? 'احراز هویت دو مرحله‌ای فعال است' : 'احراز هویت دو مرحله‌ای غیرفعال است'
    })
    
  } catch (error) {
    console.error('Error checking 2FA status:', error)
    return NextResponse.json(
      { success: false, message: 'خطا در بررسی وضعیت احراز هویت' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email, action, code } = await req.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'ایمیل کاربر مورد نیاز است' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      )
    }

    if (action === 'enable') {
      // فعال‌سازی 2FA
      const secret = authenticator.generateSecret()
      const serviceName = 'Testology'
      const otpauth = authenticator.keyuri(email, serviceName, secret)
      
      // تولید QR Code
      const qrCodeUrl = await QRCode.toDataURL(otpauth)
      
      // ذخیره secret موقت (تا تأیید کد)
      await prisma.user.update({
        where: { email },
        data: { 
          twoFactorSecret: secret,
          twoFactorEnabled: false // تا تأیید کد فعال نمی‌شود
        }
      })

      return NextResponse.json({
        success: true,
        secret,
        qrCode: qrCodeUrl,
        message: 'کد QR برای فعال‌سازی احراز هویت دو مرحله‌ای تولید شد. لطفاً کد را با اپ احراز هویت خود اسکن کنید و کد 6 رقمی تولید شده را وارد کنید.',
        instructions: [
          '1. اپ احراز هویت (Google Authenticator, Authy) را باز کنید',
          '2. کد QR بالا را اسکن کنید',
          '3. کد 6 رقمی تولید شده را در فیلد زیر وارد کنید',
          '4. کدهای پشتیبان را در جای امن نگه دارید'
        ]
      })
    }

    if (action === 'verify') {
      // تأیید کد و فعال‌سازی نهایی
      if (!user.twoFactorSecret) {
        return NextResponse.json(
          { success: false, message: 'ابتدا باید 2FA را راه‌اندازی کنید' },
          { status: 400 }
        )
      }

      const isValid = authenticator.verify({
        token: code,
        secret: user.twoFactorSecret
      })

      if (isValid) {
        await prisma.user.update({
          where: { email },
          data: { twoFactorEnabled: true }
        })

        return NextResponse.json({
          success: true,
          message: 'احراز هویت دو مرحله‌ای با موفقیت فعال شد'
        })
      } else {
        return NextResponse.json(
          { 
            success: false, 
            message: 'کد وارد شده نادرست است. لطفاً کد جدیدی از اپ احراز هویت خود دریافت کنید و دوباره تلاش کنید.',
            errorCode: 'INVALID_2FA_CODE'
          },
          { status: 400 }
        )
      }
    }

    if (action === 'disable') {
      // غیرفعال‌سازی 2FA
      await prisma.user.update({
        where: { email },
        data: { 
          twoFactorSecret: null,
          twoFactorEnabled: false,
          backupCodes: null
        }
      })

      return NextResponse.json({
        success: true,
        message: 'احراز هویت دو مرحله‌ای غیرفعال شد'
      })
    }

    if (action === 'generate-backup-codes') {
      // تولید کدهای پشتیبان
      if (!user.twoFactorEnabled) {
        return NextResponse.json(
          { success: false, message: 'ابتدا باید 2FA را فعال کنید' },
          { status: 400 }
        )
      }

      const backupCodes = Array.from({ length: 10 }, () => 
        crypto.randomBytes(4).toString('hex').toUpperCase()
      )

      await prisma.user.update({
        where: { email },
        data: { backupCodes: JSON.stringify(backupCodes) }
      })

      return NextResponse.json({
        success: true,
        backupCodes,
        message: 'کدهای پشتیبان با موفقیت تولید شدند'
      })
    }

    if (action === 'verify-backup-code') {
      // تأیید کد پشتیبان
      if (!user.backupCodes) {
        return NextResponse.json(
          { success: false, message: 'کدهای پشتیبان موجود نیست' },
          { status: 400 }
        )
      }

      const storedCodes = JSON.parse(user.backupCodes)
      const codeIndex = storedCodes.indexOf(code)

      if (codeIndex === -1) {
        return NextResponse.json(
          { success: false, message: 'کد پشتیبان نادرست است' },
          { status: 400 }
        )
      }

      // حذف کد استفاده شده
      storedCodes.splice(codeIndex, 1)
      await prisma.user.update({
        where: { email },
        data: { backupCodes: JSON.stringify(storedCodes) }
      })

      return NextResponse.json({
        success: true,
        message: 'کد پشتیبان با موفقیت تأیید شد'
      })
    }

    return NextResponse.json(
      { success: false, message: 'عملیات نامعتبر' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Error managing 2FA:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'خطا در مدیریت احراز هویت دو مرحله‌ای. لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید.',
        errorCode: '2FA_SERVER_ERROR',
        troubleshooting: [
          'اطمینان حاصل کنید که اپ احراز هویت به‌روزرسانی شده است',
          'زمان سیستم خود را بررسی کنید',
          'در صورت ادامه مشکل، 2FA را غیرفعال و دوباره فعال کنید'
        ]
      },
      { status: 500 }
    )
  }
}

