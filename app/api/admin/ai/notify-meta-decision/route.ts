import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { action, reason, confidence, executed, timestamp } = await request.json();
    
    // ایجاد پیام اطلاع‌رسانی
    const notification = {
      title: "🧠 Meta-Learner تصمیم‌گیری کرد",
      message: `اقدام: ${action} - ${reason} (اعتماد: ${(confidence * 100).toFixed(1)}%)`,
      type: executed ? "success" : "info",
      timestamp: timestamp || new Date().toISOString(),
      data: {
        action,
        reason,
        confidence,
        executed,
        timestamp
      }
    };
    
    // در اینجا می‌توانید اطلاع‌رسانی را به روش‌های مختلف ارسال کنید:
    // - ایمیل
    // - پیام‌رسان (تلگرام، واتساپ)
    // - نوتیفیکیشن مرورگر
    // - لاگ سیستم
    
    console.log('📢 اطلاع‌رسانی Meta-Learner:', notification);
    
    // ذخیره در فایل لاگ (اختیاری)
    const fs = require('fs');
    const path = require('path');
    
    const notificationLogPath = path.join(process.cwd(), 'ml/data/meta_notifications.json');
    
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













