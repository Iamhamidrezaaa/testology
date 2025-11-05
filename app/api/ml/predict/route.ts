import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    
    // اعتبارسنجی داده‌های ورودی
    if (!userData.score || !userData.gender || !userData.age) {
      return NextResponse.json(
        { error: 'داده‌های ناقص: score، gender و age الزامی است' },
        { status: 400 }
      );
    }

    // اجرای مدل ML
    const output = await runPython('ml/core/predict.py', [JSON.stringify(userData)]);
    const result = JSON.parse(output);

    return NextResponse.json(result);
  } catch (error) {
    console.error('خطا در پیش‌بینی ML:', error);
    return NextResponse.json(
      { error: 'خطا در پردازش درخواست' },
      { status: 500 }
    );
  }
}













