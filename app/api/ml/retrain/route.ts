import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 شروع فرآیند آموزش مجدد خودکار...');
    
    // اجرای اسکریپت Self-Retrain
    const output = await runPython('ml/core/self_retrain.py');
    const result = JSON.parse(output);
    
    if (result.status === 'success') {
      console.log('✅ آموزش مجدد موفق:', result);
      
      // ارسال اطلاع‌رسانی (اختیاری)
      try {
        await fetch(`${request.nextUrl.origin}/api/admin/ai/notify-retrain`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accuracy: result.accuracy,
            samples: result.samples,
            timestamp: result.timestamp
          })
        });
      } catch (notificationError) {
        console.log('⚠️ خطا در ارسال اطلاع‌رسانی:', notificationError);
      }
      
      return NextResponse.json({
        success: true,
        message: 'مدل با موفقیت بازآموزی شد',
        data: result
      });
    } else {
      console.error('❌ خطا در آموزش مجدد:', result.message);
      return NextResponse.json(
        { 
          success: false, 
          error: result.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ خطا در فرآیند آموزش مجدد:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در اجرای آموزش مجدد' 
      },
      { status: 500 }
    );
  }
}

// GET endpoint برای بررسی وضعیت آخرین آموزش
export async function GET() {
  try {
    const fs = require('fs');
    const path = require('path');
    
    const logPath = path.join(process.cwd(), 'ml/data/retrain_log.json');
    
    if (fs.existsSync(logPath)) {
      const logData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
      const lastRetrain = logData[logData.length - 1];
      
      return NextResponse.json({
        success: true,
        lastRetrain: lastRetrain || null,
        totalRetrains: logData.length
      });
    } else {
      return NextResponse.json({
        success: true,
        lastRetrain: null,
        totalRetrains: 0
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'خطا در خواندن تاریخچه آموزش' },
      { status: 500 }
    );
  }
}













