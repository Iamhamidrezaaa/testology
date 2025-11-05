import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';

export async function POST(req: NextRequest) {
  try {
    const { event_type, content, metadata } = await req.json();
    
    if (!event_type || !content) {
      return NextResponse.json(
        { error: 'event_type و content الزامی هستند' },
        { status: 400 }
      );
    }

    // اجرای اسکریپت Python برای اضافه کردن حافظه
    const result = await runPython('ml/core/neural_memory.py', [
      'add_memory',
      event_type,
      content,
      JSON.stringify(metadata || {})
    ]);

    return NextResponse.json({
      success: true,
      message: 'حافظه با موفقیت ثبت شد',
      data: result
    });

  } catch (error) {
    console.error('خطا در ثبت حافظه:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت حافظه' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const memory_type = searchParams.get('type');
    const top_k = parseInt(searchParams.get('top_k') || '3');

    if (!query) {
      return NextResponse.json(
        { error: 'پارامتر q (query) الزامی است' },
        { status: 400 }
      );
    }

    // اجرای اسکریپت Python برای بازیابی حافظه
    const args = ['retrieve_memory', query, top_k.toString()];
    if (memory_type) {
      args.push(memory_type);
    }

    const result = await runPython('ml/core/neural_memory.py', args);

    return NextResponse.json({
      success: true,
      query,
      results: result
    });

  } catch (error) {
    console.error('خطا در بازیابی حافظه:', error);
    return NextResponse.json(
      { error: 'خطا در بازیابی حافظه' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');

    // اجرای اسکریپت Python برای پاک کردن حافظه‌های قدیمی
    const result = await runPython('ml/core/neural_memory.py', [
      'clear_old_memories',
      days.toString()
    ]);

    return NextResponse.json({
      success: true,
      message: `حافظه‌های قدیمی‌تر از ${days} روز پاک شدند`,
      removed_count: result
    });

  } catch (error) {
    console.error('خطا در پاک کردن حافظه:', error);
    return NextResponse.json(
      { error: 'خطا در پاک کردن حافظه' },
      { status: 500 }
    );
  }
}

// API برای دریافت آمار حافظه
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    if (action === 'stats') {
      // دریافت آمار حافظه
      const result = await runPython('ml/core/neural_memory.py', ['get_memory_stats']);
      
      return NextResponse.json({
        success: true,
        stats: result
      });
    }

    return NextResponse.json(
      { error: 'عملیات نامعتبر' },
      { status: 400 }
    );

  } catch (error) {
    console.error('خطا در دریافت آمار:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت آمار' },
      { status: 500 }
    );
  }
}












