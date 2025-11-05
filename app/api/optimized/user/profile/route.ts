import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { withCache, invalidateCache } from '@/lib/cache'
import { withRateLimit, securityHeaders, validateInput, ValidationSchemas } from '@/lib/security'
import { withErrorHandling } from '@/lib/testing'
import { createNotification, NotificationTemplates } from '@/lib/notifications'

// GET - دریافت پروفایل کاربر با کش
export const GET = withErrorHandling(async (req: NextRequest) => {
  // Rate Limiting
  const rateLimitResponse = withRateLimit(50, 60 * 60 * 1000)(req);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('email');

  if (!userEmail) {
    return NextResponse.json(
      { success: false, message: 'ایمیل کاربر مورد نیاز است' },
      { status: 400, headers: securityHeaders }
    );
  }

  // استفاده از کش
  const profile = await withCache(
    `user-profile-${userEmail}`,
    async () => {
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
          id: true,
          name: true,
          lastName: true,
          email: true,
          phone: true,
          birthDate: true,
          province: true,
          city: true,
          avatar: true,
          preferences: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new Error('کاربر یافت نشد');
      }

      return user;
    },
    5 * 60 * 1000 // 5 دقیقه کش
  );

  return NextResponse.json(
    { success: true, profile },
    { headers: securityHeaders }
  );
});

// PUT - به‌روزرسانی پروفایل کاربر
export const PUT = withErrorHandling(async (req: NextRequest) => {
  // Rate Limiting
  const rateLimitResponse = withRateLimit(20, 60 * 60 * 1000)(req);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('email');
  const body = await req.json();

  if (!userEmail) {
    return NextResponse.json(
      { success: false, message: 'ایمیل کاربر مورد نیاز است' },
      { status: 400, headers: securityHeaders }
    );
  }

  // اعتبارسنجی ورودی
  const validation = validateInput(body, {
    name: ValidationSchemas.name,
    lastName: ValidationSchemas.name,
    phone: ValidationSchemas.phone,
    birthDate: { required: false, type: 'string' },
    province: { required: false, type: 'string' },
    city: { required: false, type: 'string' }
  });

  if (!validation.valid) {
    return NextResponse.json(
      { 
        success: false, 
        message: 'داده‌های ورودی نامعتبر است',
        errors: validation.errors
      },
      { status: 400, headers: securityHeaders }
    );
  }

  try {
    // به‌روزرسانی پروفایل
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: body.name,
        lastName: body.lastName,
        phone: body.phone,
        birthDate: body.birthDate ? new Date(body.birthDate) : null,
        province: body.province,
        city: body.city,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        birthDate: true,
        province: true,
        city: true,
        avatar: true,
        updatedAt: true
      }
    });

    // باطل کردن کش
    invalidateCache(`user-profile-${userEmail}`);

    // ارسال نوتیفیکیشن
    createNotification(
      updatedUser.id,
      'success',
      'پروفایل به‌روزرسانی شد',
      'اطلاعات پروفایل شما با موفقیت به‌روزرسانی شد'
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'پروفایل با موفقیت به‌روزرسانی شد',
        profile: updatedUser
      },
      { headers: securityHeaders }
    );

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در به‌روزرسانی پروفایل' },
      { status: 500, headers: securityHeaders }
    );
  }
});

// DELETE - حذف پروفایل کاربر
export const DELETE = withErrorHandling(async (req: NextRequest) => {
  // Rate Limiting سخت‌تر برای حذف
  const rateLimitResponse = withRateLimit(5, 60 * 60 * 1000)(req);
  if (rateLimitResponse) return rateLimitResponse;

  const { searchParams } = new URL(req.url);
  const userEmail = searchParams.get('email');

  if (!userEmail) {
    return NextResponse.json(
      { success: false, message: 'ایمیل کاربر مورد نیاز است' },
      { status: 400, headers: securityHeaders }
    );
  }

  try {
    // حذف کاربر
    await prisma.user.delete({
      where: { email: userEmail }
    });

    // باطل کردن تمام کش‌های مربوط به کاربر
    invalidateCache(`user-profile-${userEmail}`);
    invalidateCache(`user-stats-${userEmail}`);

    return NextResponse.json(
      { success: true, message: 'حساب کاربری با موفقیت حذف شد' },
      { headers: securityHeaders }
    );

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در حذف حساب کاربری' },
      { status: 500, headers: securityHeaders }
    );
  }
});





