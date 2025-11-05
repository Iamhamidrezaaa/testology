import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accuracy, samples, timestamp } = await request.json();
    
    // ایجاد پیام اطلاع‌رسانی
    const notification = {
      title: "🧠 آموزش مجدد مدل تکمیل شد",
      message: `مدل با دقت ${(accuracy * 100).toFixed(1)}% و ${samples.toLocaleString()} نمونه بازآموزی شد`,
      type: "success",
      timestamp: timestamp || new Date().toISOString(),
      data: {
        accuracy,
        samples,
        timestamp
      }
    };
    
    // در اینجا می‌توانید اطلاع‌رسانی را به روش‌های مختلف ارسال کنید:
    // - ایمیل
    // - پیام‌رسان (تلگرام، واتساپ)
    // - نوتیفیکیشن مرورگر
    // - لاگ سیستم
    
    console.log('📢 اطلاع‌رسانی آموزش مجدد:', notification);
    
    // ذخیره در فایل لاگ (اختیاری)
    const fs = require('fs');
    const path = require('path');
    
    const notificationLogPath = path.join(process.cwd(), 'ml/data/notifications.json');
    
    let notifications = [];
    if (fs.existsSync(notificationLogPath)) {
      notifications = JSON.parse(fs.readFileSync(notificationLogPath, 'utf-8'));
    }
    
    notifications.push(notification);
    
    // نگه داشتن فقط 100 اطلاع‌رسانی آخر
    if (notifications.length > 100) {
      notifications = notifications.slice(-100);
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













