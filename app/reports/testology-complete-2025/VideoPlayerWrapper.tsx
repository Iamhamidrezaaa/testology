'use client'

import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import VideoPlayer from '@/components/VideoPlayer'

export default function VideoPlayerWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // صبر کن تا DOM آماده بشه
    const timer = setTimeout(() => {
      const placeholder = document.getElementById('video-player-placeholder')
      if (placeholder && !placeholder.querySelector('#react-video-player-root')) {
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
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return null
}

