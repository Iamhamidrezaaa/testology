import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(request: NextRequest) {
  try {
    // اجرای تحلیل AI Supervisor
    const output = await runPython('ml/core/ai_supervisor.py');
    const result = JSON.parse(output);

    return NextResponse.json(result);
  } catch (error) {
    console.error('خطا در تحلیل AI Supervisor:', error);
    return NextResponse.json(
      { error: 'خطا در تحلیل داده‌ها' },
      { status: 500 }
    );
  }
}













