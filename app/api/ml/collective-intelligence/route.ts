import { NextRequest, NextResponse } from 'next/server';
import { runPython } from '@/ml/bridge/run_python';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    console.log('🌍 شروع تحلیل هوش جمعی Testology...');
    console.log('🧠 تبدیل از "I think" به "We think"...');
    
    // اجرای تحلیل هوش جمعی
    const output = await runPython('ml/core/collective_intelligence.py');
    
    console.log('✅ تحلیل هوش جمعی کامل شد');
    
    return NextResponse.json({
      success: true,
      message: 'تحلیل هوش جمعی با موفقیت اجرا شد',
      output: output,
      timestamp: new Date().toISOString(),
      collective_intelligence_level: 'high'
    });

  } catch (error) {
    console.error('خطا در اجرای تحلیل هوش جمعی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در اجرای تحلیل هوش جمعی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const reportPath = path.join(process.cwd(), 'ml/data/collective_report.json');
    
    // بررسی وجود فایل گزارش
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({
        success: true,
        report: null,
        message: 'هنوز تحلیل هوش جمعی انجام نشده است',
        collective_intelligence_level: 'none'
      });
    }
    
    // خواندن گزارش هوش جمعی
    const reportData = fs.readFileSync(reportPath, 'utf-8');
    const report = JSON.parse(reportData);
    
    return NextResponse.json({
      success: true,
      report,
      collective_intelligence_level: report.collective_intelligence_level || 'medium',
      message: `گزارش هوش جمعی: ${report.total_users || 0} کاربر، ${report.collective_insights?.length || 0} بینش`
    });

  } catch (error) {
    console.error('خطا در خواندن گزارش هوش جمعی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در خواندن گزارش هوش جمعی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const reportPath = path.join(process.cwd(), 'ml/data/collective_report.json');
    
    if (!fs.existsSync(reportPath)) {
      return NextResponse.json({
        success: true,
        stats: {
          total_users: 0,
          insights_count: 0,
          mental_health_index: 0,
          clusters_count: 0,
          concerning_trends: 0,
          last_analysis: null
        },
        message: 'هنوز تحلیل هوش جمعی انجام نشده است'
      });
    }
    
    const reportData = fs.readFileSync(reportPath, 'utf-8');
    const report = JSON.parse(reportData);
    
    // محاسبه آمار پیشرفته
    const stats = {
      total_users: report.total_users || 0,
      insights_count: report.collective_insights?.length || 0,
      mental_health_index: report.psychology_analysis?.mental_health_index || 0,
      clusters_count: Object.keys(report.clustering_analysis?.clusters || {}).length,
      concerning_trends: report.trends_analysis?.concerning_trends?.length || 0,
      last_analysis: report.timestamp,
      collective_intelligence_level: report.collective_intelligence_level || 'medium',
      
      // آمار تفصیلی
      psychology_stats: report.psychology_analysis?.psychological_stats || {},
      cluster_analysis: report.clustering_analysis?.clusters || {},
      trends_analysis: report.trends_analysis || {},
      
      // شاخص‌های سلامت روان
      mental_health_status: report.psychology_analysis?.mental_health_index > 0.7 ? 'مطلوب' : 
                           report.psychology_analysis?.mental_health_index > 0.4 ? 'متوسط' : 'نیاز به توجه',
      
      // توزیع کاربران
      regional_distribution: report.psychology_analysis?.region_distribution || {},
      age_distribution: report.psychology_analysis?.age_distribution || {},
      gender_distribution: report.psychology_analysis?.gender_distribution || {}
    };
    
    return NextResponse.json({
      success: true,
      stats,
      message: `آمار هوش جمعی: ${stats.total_users} کاربر، سطح ${stats.mental_health_status}`
    });

  } catch (error) {
    console.error('خطا در محاسبه آمار هوش جمعی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در محاسبه آمار هوش جمعی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const reportPath = path.join(process.cwd(), 'ml/data/collective_report.json');
    const dataPath = path.join(process.cwd(), 'ml/data/collective_data.json');
    
    // حذف فایل‌های گزارش و داده
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
    
    if (fs.existsSync(dataPath)) {
      fs.unlinkSync(dataPath);
    }
    
    return NextResponse.json({
      success: true,
      message: 'داده‌ها و گزارش‌های هوش جمعی پاک شدند',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('خطا در پاک کردن داده‌های هوش جمعی:', error);
    return NextResponse.json(
      { 
        error: 'خطا در پاک کردن داده‌های هوش جمعی',
        details: error instanceof Error ? error.message : 'خطای نامشخص'
      },
      { status: 500 }
    );
  }
}












