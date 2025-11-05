import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { method, accuracy, best_params, timestamp } = await request.json();
    
    // ایجاد پیام اطلاع‌رسانی
    const notification = {
      title: "⚙️ بهینه‌سازی مدل تکمیل شد",
      message: `مدل با روش ${method} و دقت ${(accuracy * 100).toFixed(1)}% بهینه‌سازی شد`,
      type: "success",
      timestamp: timestamp || new Date().toISOString(),
      data: {
        method,
        accuracy,
        best_params,
        timestamp
      }
    };
    
    // در اینجا می‌توانید اطلاع‌رسانی را به روش‌های مختلف ارسال کنید:
    // - ایمیل
    // - پیام‌رسان (تلگرام، واتساپ)
    // - نوتیفیکیشن مرورگر
    // - لاگ سیستم
    
    console.log('📢 اطلاع‌رسانی بهینه‌سازی:', notification);
    
    // ذخیره در فایل لاگ (اختیاری)
    const fs = require('fs');
    const path = require('path');
    
    const notificationLogPath = path.join(process.cwd(), 'ml/data/optimization_notifications.json');
    
    let notifications = [];
    if (fs.existsSync(notificationLogPath)) {
      notifications = JSON.parse(fs.readFileSync(notificationLogPath, 'utf-8'));
    }
    
    notifications.push(notification);
    
    // نگه داشتن فقط 50 اطلاع‌رسانی آخر
    if (notifications.length > 50) {
      notifications = notifications.slice(-50);
    }
    
    fs.writeFileSync(notificationLogPath, JSON.stringify(notifications, null, 2));
    
    return NextResponse.json({
      success: true,
      message: 'اطلاع‌رسانی ارسال شد',
      notification
    });
    
  } catch (error) {
    console.error('خطا در ارسال اطلاع‌رسانی:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در ارسال اطلاع‌رسانی' 
      },
      { status: 500 }
    );
  }
}