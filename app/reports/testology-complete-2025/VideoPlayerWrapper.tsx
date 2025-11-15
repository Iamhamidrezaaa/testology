'use client'

import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import VideoPlayer from '@/components/VideoPlayer'

export default function VideoPlayerWrapper() {
  const [mounted, setMounted] = useState(false)
  const [videoVersion, setVideoVersion] = useState<number | null>(null)

  // دریافت version فایل ویدئو از سرور
  useEffect(() => {
    fetch('/api/video/introduction-version')
      .then(res => res.json())
      .then(data => {
        setVideoVersion(data.version)
      })
      .catch(err => {
        console.error('Error fetching video version:', err)
        // در صورت خطا، از timestamp فعلی استفاده کن
        setVideoVersion(Date.now())
      })
  }, [])

  useEffect(() => {
    if (!videoVersion) return // صبر کن تا version دریافت بشه
    
    setMounted(true)
    
    // صبر کن تا DOM آماده بشه - چند بار تلاش کن
    let attempts = 0
    const maxAttempts = 10
    
    const tryMount = () => {
      attempts++
      const placeholder = document.getElementById('video-player-placeholder')
      
      if (placeholder && !placeholder.querySelector('#react-video-player-root')) {
        // پاک کردن محتوای قبلی
        placeholder.innerHTML = ''
        
        const root = document.createElement('div')
        root.id = 'react-video-player-root'
        placeholder.appendChild(root)
        
        // استفاده از version فایل برای cache-busting
        // این version فقط زمانی تغییر می‌کند که فایل واقعاً تغییر کرده باشد
        const videoUrl = `/videos/introduction1.mp4?v=${videoVersion}`
        
        const reactRoot = createRoot(root)
        reactRoot.render(
          <VideoPlayer 
            videoUrl={videoUrl}
            title="معرفی"
          />
        )
      } else if (attempts < maxAttempts) {
        // اگه placeholder پیدا نشد، دوباره تلاش کن
        setTimeout(tryMount, 200)
      } else {
        console.warn('Video player placeholder not found after', maxAttempts, 'attempts')
      }
    }
    
    // شروع با تاخیر اولیه
    const timer = setTimeout(tryMount, 300)

    return () => clearTimeout(timer)
  }, [videoVersion])

  return null
}

