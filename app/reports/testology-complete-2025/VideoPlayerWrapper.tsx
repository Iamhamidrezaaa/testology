'use client'

import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import VideoPlayer from '@/components/VideoPlayer'

export default function VideoPlayerWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
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
        
        const reactRoot = createRoot(root)
        reactRoot.render(
          <VideoPlayer 
            videoUrl="/videos/introduction.mp4"
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
  }, [])

  return null
}

