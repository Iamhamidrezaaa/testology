import { NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  try {
    const videoPath = join(process.cwd(), 'public', 'videos', 'introduction1.mp4')
    
    // دریافت اطلاعات فایل (mtime = modification time)
    const stats = await stat(videoPath)
    
    // استفاده از mtime به عنوان version
    // این عدد فقط زمانی تغییر می‌کند که فایل واقعاً تغییر کرده باشد
    const version = stats.mtime.getTime()
    
    return NextResponse.json({ version })
  } catch (error) {
    // اگر فایل وجود نداشت، یک timestamp فعلی برگردان
    console.error('Error getting video version:', error)
    return NextResponse.json({ version: Date.now() })
  }
}

