import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🧠 شروع Meta-Learner Decision...');
    
    // اجرای اسکریپت Meta-Learner
    const output = await runPython('ml/core/meta_learner.py');
    const result = JSON.parse(output);
    
    if (result.error) {
      console.error('❌ خطا در Meta-Learner:', result.error);
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    console.log('✅ Meta-Learner موفق:', {
      action: result.decision?.action,
      reason: result.decision?.reason,
      confidence: result.decision?.confidence,
      executed: result.execution?.executed
    });
    
    // ارسال اطلاع‌رسانی (اختیاری)
    try {
      await fetch(`${request.nextUrl.origin}/api/admin/ai/notify-meta-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: result.decision?.action,
          reason: result.decision?.reason,
          confidence: result.decision?.confidence,
          executed: result.execution?.executed,
          timestamp: result.timestamp
        })
      });
    } catch (notificationError) {
      console.log('⚠️ خطا در ارسال اطلاع‌رسانی:', notificationError);
    }
    
    return NextResponse.json({
      success: true,
      message: 'Meta-Learner تصمیم‌گیری کرد',
      data: result
    });
    
  } catch (error) {
    console.error('❌ خطا در فرآیند Meta-Learner:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در اجرای Meta-Learner' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const logPath = path.join(process.cwd(), 'ml/data/meta_decision_log.json');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }
    
    const logData = fs.readFileSync(logPath, 'utf-8');
    const history = JSON.parse(logData);
    
    // مرتب‌سازی بر اساس زمان (جدیدترین اول)
    const sortedHistory = history.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return NextResponse.json(sortedHistory);
  } catch (error) {
    console.error('❌ خطا در خواندن لاگ Meta-Learner:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در خواندن تاریخچه Meta-Learner' 
      },
      { status: 500 }
    );
  }
}













