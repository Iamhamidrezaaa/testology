import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const logPath = path.join(process.cwd(), 'ml/data/optimization_log.json');
    
    if (!fs.existsSync(logPath)) {
      return NextResponse.json([]);
    }
    
    const logData = fs.readFileSync(logPath, 'utf-8');
    const history = JSON.parse(logData);
    
    // مرتب‌سازی بر اساس زمان (جدیدترین اول)
    const sortedHistory = history.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return NextResponse.json(sortedHistory);
  } catch (error) {
    console.error('خطا در خواندن لاگ بهینه‌سازی:', error);
    return NextResponse.json(
      { error: 'خطا در خواندن تاریخچه بهینه‌سازی' },
      { status: 500 }
    );
  }
}