import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 شروع ارزیابی مدل...');
    
    // اجرای اسکریپت ارزیابی
    const output = await runPython('ml/utils/evaluate_model.py');
    const result = JSON.parse(output);
    
    if (result.status === 'success') {
      console.log('✅ ارزیابی مدل موفق:', {
        accuracy: result.metrics.accuracy,
        n_classes: result.metrics.labels.length,
        n_suggestions: result.suggestions.length
      });
      
      return NextResponse.json({
        success: true,
        message: 'ارزیابی مدل با موفقیت انجام شد',
        data: result
      });
    } else {
      console.error('❌ خطا در ارزیابی مدل:', result.message);
      return NextResponse.json(
        { 
          success: false, 
          error: result.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ خطا در فرآیند ارزیابی:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در اجرای ارزیابی مدل' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const reportPath = path.join(process.cwd(), 'ml/data/eval_report.json');
    
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({
        success: false,
        message: 'گزارش ارزیابی موجود نیست. ابتدا ارزیابی انجام دهید.'
      });
    }
    
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    
    return NextResponse.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('❌ خطا در خواندن گزارش ارزیابی:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطا در خواندن گزارش ارزیابی' 
      },
      { status: 500 }
    );
  }
}













