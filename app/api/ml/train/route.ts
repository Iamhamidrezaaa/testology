import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(request: NextRequest) {
  try {
    // اجرای آموزش مدل
    const output = await runPython('ml/core/train_model.py');
    const result = JSON.parse(output);

    if (result.status === 'success') {
      return NextResponse.json({
        message: 'مدل با موفقیت آموزش داده شد',
        accuracy: result.accuracy,
        modelInfo: result.model_info
      });
    } else {
      return NextResponse.json(
        { error: result.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('خطا در آموزش مدل:', error);
    return NextResponse.json(
      { error: 'خطا در آموزش مدل' },
      { status: 500 }
    );
  }
}













