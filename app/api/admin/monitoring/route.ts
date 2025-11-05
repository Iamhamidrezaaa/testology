import { NextRequest, NextResponse } from 'next/server'
import { cache } from '@/lib/cache'
import { notificationManager } from '@/lib/notifications'
import { rateLimiter } from '@/lib/security'
import { errorHandler } from '@/lib/testing'

export async function GET(req: NextRequest) {
  try {
    // آمار کش
    const cacheStats = cache.getStats();
    
    // آمار نوتیفیکیشن‌ها
    const notificationStats = notificationManager.getStats();
    
    // آمار خطاها
    const errorStats = errorHandler.getErrorStats();
    
    // آمار Rate Limiting
    const rateLimitStats = {
      active: rateLimiter['limits']?.size || 0
    };

    // آمار سیستم
    const systemStats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      nodeVersion: process.version,
      platform: process.platform
    };

    // آمار کلی
    const overview = {
      cache: {
        size: cacheStats.size,
        maxSize: cacheStats.maxSize,
        hitRate: 'N/A' // می‌توانید محاسبه کنید
      },
      notifications: {
        total: notificationStats.total,
        unread: notificationStats.unread
      },
      errors: {
        total: errorStats.total,
        last24h: errorStats.last24h
      },
      rateLimiting: rateLimitStats,
      system: systemStats
    };

    return NextResponse.json({
      success: true,
      data: overview,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در دریافت آمار سیستم' },
      { status: 500 }
    );
  }
}

// پاک‌سازی سیستم
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    switch (action) {
      case 'clear-cache':
        cache.clear();
        return NextResponse.json({ 
          success: true, 
          message: 'کش پاک شد' 
        });

      case 'cleanup-errors':
        errorHandler.cleanup();
        return NextResponse.json({ 
          success: true, 
          message: 'لاگ‌های خطای قدیمی پاک شدند' 
        });

      case 'reset-rate-limits':
        // پاک کردن محدودیت‌های Rate Limiting
        rateLimiter['limits']?.clear();
        return NextResponse.json({ 
          success: true, 
          message: 'محدودیت‌های Rate Limiting بازنشانی شدند' 
        });

      default:
        return NextResponse.json(
          { success: false, message: 'عملیات نامعتبر' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in monitoring action:', error);
    return NextResponse.json(
      { success: false, message: 'خطا در اجرای عملیات' },
      { status: 500 }
    );
  }
}





