import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(req: NextRequest) {
  try {
    const { command, text, answer } = await req.json();
    
    if (!command) {
      return NextResponse.json(
        { error: 'command الزامی است' },
        { status: 400 }
      );
    }

    console.log('⚖️ سیستم اخلاقی در حال انجام...');
    
    let result;
    
    if (command === 'evaluate_ethics') {
      result = await runPython('ml/core/ai_ethics.py', [
        'evaluate_ethics',
        text || ''
      ]);
    } else if (command === 'ethical_guard') {
      result = await runPython('ml/core/ai_ethics.py', [
        'ethical_guard',
        answer || ''
      ]);
    } else {
      return NextResponse.json(
        { error: 'command نامعتبر' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'سیستم اخلاقی انجام شد',
      ...result
    });

  } catch (error) {
    console.error('خطا در سیستم اخلاقی:', error);
    return NextResponse.json(
      { error: 'خطا در سیستم اخلاقی' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      // دریافت آمار اخلاقی
      const result = await runPython('ml/core/ai_ethics.py', ['get_ethics_statistics']);
      
      return NextResponse.json({
        success: true,
        stats: result
      });
    }

    if (action === 'audit') {
      // حسابرسی سیستم اخلاقی
      const result = await runPython('ml/core/ai_ethics.py', ['audit_ethics_system']);
      
      return NextResponse.json({
        success: true,
        audit: result
      });
    }

    return NextResponse.json(
      { error: 'عملیات نامعتبر' },
      { status: 400 }
    );

  } catch (error) {
    console.error('خطا در دریافت اطلاعات اخلاقی:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات اخلاقی' },
      { status: 500 }
    );
  }
}
