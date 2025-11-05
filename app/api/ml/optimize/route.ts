import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(request: NextRequest) {
  try {
    console.log('⚙️ شروع بهینه‌سازی خودکار مدل...');
    
    // اجرای اسکریپت بهینه‌سازی
    const output = await runPython('ml/core/ai_optimizer.py');
    const result = JSON.parse(output);
    
    if (result.status === 'success') {
      console.log('✅ بهینه‌سازی موفق:', {
        method: result.method,
        accuracy: result.accuracy,
        best_params: result.best_params
      });
      
      // ارسال اطلاع‌رسانی (اختیاری)
      try {
        await fetch(`${request.nextUrl.origin}/api/admin/ai/notify-optimization`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            method: result.method,
            accuracy: result.accuracy,
            best_params: result.best_params,
            timestamp: result.timestamp
          })
        });
      } catch (notificationError) {
        console.log('⚠️ خطا در ارسال اطلاع‌رسانی:', notificationError);
      }
      
      return NextResponse.json({
        success: true,
        message: 'مدل با موفقیت بهینه‌سازی شد',
        data: result
      });
    } else {
      console.error('❌ خطا در بهینه‌سازی:', result.message);
      return NextResponse.json(
        { 
          success: false, 
          error: result.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ خطا در فرآیند بهینه‌سازی:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در اجرای بهینه‌سازی مدل' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint برای بررسی وضعیت آخرین بهینه‌سازی
export async function GET() {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logPath = path.join(process.cwd(), 'ml/data/optimization_log.json');
    
    if (fs.existsSync(logPath)) {
      const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
      const lastOptimization = logData[logData.length - 1];
      
      return NextResponse.json({
        success: true,
        lastOptimization: lastOptimization || null,
        totalOptimizations: logData.length
      });
    } else {
      return NextResponse.json({
        success: true,
        lastOptimization: null,
        totalOptimizations: 0
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'خطا در خواندن تاریخچه بهینه‌سازی' },
      { status: 500 }
    );
  }
}