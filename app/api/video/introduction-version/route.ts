import { NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    // اول سعی کن introduction1.mp4 رو پیدا کنی
    let videoPath = join(process.cwd(), 'public', 'videos', 'introduction1.mp4')
    let videoName = 'introduction1.mp4'
    
    try {
      await stat(videoPath)
    } catch {
      // اگر introduction1.mp4 وجود نداشت، از introduction.mp4 استفاده کن
      videoPath = join(process.cwd(), 'public', 'videos', 'introduction.mp4')
      videoName = 'introduction.mp4'
      await stat(videoPath) // اگر این هم وجود نداشت، خطا می‌دهد
    }
    
    // دریافت اطلاعات فایل (mtime = modification time)
    const stats = await stat(videoPath)
    
    // استفاده از mtime به عنوان version
    // این عدد فقط زمانی تغییر می‌کند که فایل واقعاً تغییر کرده باشد
    const version = stats.mtime.getTime()
    
    return NextResponse.json({ version, videoName })
  } catch (error) {
    // اگر هیچ فایلی وجود نداشت، یک timestamp فعلی برگردان
    console.error('Error getting video version:', error)
    return NextResponse.json({ 
      version: Date.now(),
      videoName: 'introduction.mp4' // fallback به فایل قدیمی
    })
  }
}

