import { NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    // موقتاً برای تست: همیشه introduction.mp4 برگردان
    const videoPath = join(process.cwd(), 'public', 'videos', 'introduction.mp4')
    
    // بررسی وجود فایل
    try {
      await stat(videoPath)
    } catch {
      // اگر فایل وجود نداشت، version فعلی برگردان
      return NextResponse.json({
        version: Date.now(),
        videoName: 'introduction.mp4'
      })
    }
    
    // دریافت اطلاعات فایل (mtime = modification time)
    const stats = await stat(videoPath)
    
    // استفاده از mtime به عنوان version
    // این عدد فقط زمانی تغییر می‌کند که فایل واقعاً تغییر کرده باشد
    const version = stats.mtime.getTime()
    
    return NextResponse.json({ 
      version,
      videoName: 'introduction.mp4'
    })
  } catch (error) {
    // اگر هیچ فایلی وجود نداشت، یک timestamp فعلی برگردان
    console.error('Error getting video version:', error)
    return NextResponse.json({ 
      version: Date.now(),
      videoName: 'introduction.mp4'
    })
  }
}

