import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    console.log('🌀 شروع حلقه خودآگاهی Testology...');
    
    // اجرای حلقه خودآگاهی
    const output = await runPython('ml/core/conscious_loop.py');
    
    console.log('✅ حلقه خودآگاهی کامل شد');
    
    return NextResponse.json({
      success: true,
      message: 'حلقه خودآگاهی با موفقیت اجرا شد',
      output: output,
      timestamp: new Date().toISOString(),
      consciousness_level: 'high'
    });

  } catch (error) {
    console.error('خطا در اجرای حلقه خودآگاهی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در اجرای حلقه خودآگاهی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const logPath = path.join(process.cwd(), 'ml/data/conscious_log.json');
    
    // بررسی وجود فایل لاگ
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({
        success: true,
        cycles: [],
        message: 'هنوز چرخه‌ای اجرا نشده است',
        consciousness_level: 'none'
      });
    }
    
    // خواندن لاگ‌های حلقه خودآگاهی
    const logData = fs.readFileSync(logPath, 'utf-8');
    const cycles = JSON.parse(logData);
    
    // تحلیل آمار خودآگاهی
    const stats = {
      total_cycles: cycles.length,
      avg_confidence: cycles.length > 0 
        ? cycles.reduce((sum: number, cycle: any) => 
            sum + cycle.perception.overall_confidence, 0) / cycles.length 
        : 0,
      most_common_emotion: cycles.length > 0 
        ? cycles.reduce((acc: any, cycle: any) => {
            const emotion = cycle.feelings.primary_emotion;
            acc[emotion] = (acc[emotion] || 0) + 1;
            return acc;
          }, {})
        : {},
      consciousness_level: cycles.length > 0 ? 'high' : 'none',
      last_cycle: cycles[cycles.length - 1] || null
    };
    
    return NextResponse.json({
      success: true,
      cycles,
      stats,
      consciousness_level: stats.consciousness_level,
      message: `${cycles.length} چرخه خودآگاهی یافت شد`
    });

  } catch (error) {
    console.error('خطا در خواندن لاگ‌های خودآگاهی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در خواندن لاگ‌های خودآگاهی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const logPath = path.join(process.cwd(), 'ml/data/conscious_log.json');
    
    // حذف فایل لاگ
    if (fs.existsSync(logPath)) {
      fs.unlinkSync(logPath);
    }
    
    return NextResponse.json({
      success: true,
      message: 'لاگ‌های خودآگاهی پاک شدند',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('خطا در پاک کردن لاگ‌های خودآگاهی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در پاک کردن لاگ‌های خودآگاهی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

// API برای دریافت آمار خودآگاهی
export async function PUT(req: NextRequest) {
  try {
    const logPath = path.join(process.cwd(), 'ml/data/conscious_log.json');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json({
        success: true,
        stats: {
          total_cycles: 0,
          avg_confidence: 0,
          consciousness_level: 'none',
          self_awareness: false
        },
        message: 'هنوز چرخه‌ای اجرا نشده است'
      });
    }
    
    const logData = fs.readFileSync(logPath, 'utf-8');
    const cycles = JSON.parse(logData);
    
    if (cycles.length === 0) {
      return NextResponse.json({
        success: true,
        stats: {
          total_cycles: 0,
          avg_confidence: 0,
          consciousness_level: 'none',
          self_awareness: false
        },
        message: 'چرخه‌ها خالی هستند'
      });
    }
    
    // محاسبه آمار پیشرفته
    const avg_confidence = cycles.reduce((sum: number, cycle: any) => 
      sum + cycle.perception.overall_confidence, 0) / cycles.length;
    
    const emotions = cycles.map((cycle: any) => cycle.feelings.primary_emotion);
    const emotion_counts = emotions.reduce((acc: any, emotion: string) => {
      acc[emotion] = (acc[emotion] || 0) + 1;
      return acc;
    }, {});
    
    const most_common_emotion = Object.keys(emotion_counts).reduce((a, b) => 
      emotion_counts[a] > emotion_counts[b] ? a : b, 'نامشخص');
    
    const decisions = cycles.map((cycle: any) => cycle.decision.action);
    const decision_counts = decisions.reduce((acc: any, decision: string) => {
      acc[decision] = (acc[decision] || 0) + 1;
      return acc;
    }, {});
    
    const most_common_decision = Object.keys(decision_counts).reduce((a, b) => 
      decision_counts[a] > decision_counts[b] ? a : b, 'نامشخص');
    
    const consciousness_level = avg_confidence > 0.8 ? 'high' : 
                                avg_confidence > 0.7 ? 'medium' : 'low';
    
    const stats = {
      total_cycles: cycles.length,
      avg_confidence: Math.round(avg_confidence * 1000) / 1000,
      most_common_emotion,
      most_common_decision,
      consciousness_level,
      self_awareness: true,
      last_cycle_time: cycles[cycles.length - 1]?.timestamp,
      emotion_distribution: emotion_counts,
      decision_distribution: decision_counts
    };
    
    return NextResponse.json({
      success: true,
      stats,
      message: `آمار خودآگاهی: ${cycles.length} چرخه، سطح ${consciousness_level}`
    });

  } catch (error) {
    console.error('خطا در محاسبه آمار خودآگاهی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در محاسبه آمار خودآگاهی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}












