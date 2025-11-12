'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoPlayerProps {
  videoUrl: string
  title?: string
  poster?: string
}

export default function VideoPlayer({ videoUrl, title = 'معرفی', poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [quality, setQuality] = useState('auto')
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [networkSpeed, setNetworkSpeed] = useState<'slow' | 'medium' | 'fast'>('medium')
  const [autoQuality, setAutoQuality] = useState(true)

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]
  const qualities = [
    { label: 'خودکار', value: 'auto' },
    { label: '4K (2160p)', value: '2160p' },
    { label: '2K (1440p)', value: '1440p' },
    { label: '1080p', value: '1080p' },
    { label: '720p', value: '720p' },
    { label: '480p', value: '480p' },
  ]

  // محاسبه سرعت اینترنت بر اساس buffering
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isPlaying) return

    let lastBuffered = 0
    let lastTime = Date.now()
    let speedMeasurements: number[] = []

    const measureSpeed = () => {
      if (video.buffered.length > 0) {
        const currentBuffered = video.buffered.end(video.buffered.length - 1)
        const currentTime = Date.now()
        const timeDiff = (currentTime - lastTime) / 1000 // seconds
        const bufferedDiff = currentBuffered - lastBuffered

        if (timeDiff > 0 && bufferedDiff > 0) {
          // سرعت دانلود به ثانیه
          const speed = bufferedDiff / timeDiff
          speedMeasurements.push(speed)

          // فقط آخرین 5 اندازه‌گیری رو نگه دار
          if (speedMeasurements.length > 5) {
            speedMeasurements.shift()
          }

          // میانگین سرعت
          const avgSpeed = speedMeasurements.reduce((a, b) => a + b, 0) / speedMeasurements.length

          // تشخیص سرعت اینترنت
          // اگر سرعت دانلود کمتر از 1 ثانیه ویدئو در هر ثانیه باشه = slow
          // اگر بین 1 تا 2 باشه = medium
          // اگر بیشتر از 2 باشه = fast
          if (avgSpeed < 1) {
            setNetworkSpeed('slow')
          } else if (avgSpeed < 2) {
            setNetworkSpeed('medium')
          } else {
            setNetworkSpeed('fast')
          }
        }

        lastBuffered = currentBuffered
        lastTime = currentTime
      }
    }

    const interval = setInterval(measureSpeed, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  // تنظیم خودکار کیفیت بر اساس سرعت اینترنت
  useEffect(() => {
    if (!autoQuality || quality !== 'auto') return

    const video = videoRef.current
    if (!video) return

    // اگر buffering زیاد باشه، کیفیت رو پایین بیار
    const checkBuffering = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        const currentTime = video.currentTime
        const bufferAhead = bufferedEnd - currentTime

        // اگر buffer کمتر از 3 ثانیه باشه و سرعت اینترنت slow باشه
        if (bufferAhead < 3 && networkSpeed === 'slow') {
          // کیفیت رو به 480p تغییر بده (اگه امکانش هست)
          // در حال حاضر فقط می‌تونیم سرعت پخش رو کم کنیم
          if (playbackRate > 0.75) {
            setPlaybackRate(0.75)
          }
        }
      }
    }

    const interval = setInterval(checkBuffering, 2000)
    return () => clearInterval(interval)
  }, [autoQuality, quality, networkSpeed, playbackRate])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => {
      setIsPlaying(true)
      setIsLoading(false)
    }
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1)
        setBuffered(bufferedEnd)
      }
    }
    const handleWaiting = () => {
      setIsLoading(true)
      // اگر buffering زیاد باشه، سرعت اینترنت رو slow در نظر بگیر
      if (networkSpeed !== 'slow') {
        setNetworkSpeed('slow')
      }
    }
    const handleCanPlay = () => setIsLoading(false)
    const handleStalled = () => {
      setIsLoading(true)
      setNetworkSpeed('slow')
    }
    const handleSuspend = () => {
      // وقتی دانلود متوقف می‌شه
      if (networkSpeed === 'fast') {
        setNetworkSpeed('medium')
      }
    }

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('stalled', handleStalled)
    video.addEventListener('suspend', handleSuspend)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('stalled', handleStalled)
      video.removeEventListener('suspend', handleSuspend)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.playbackRate = playbackRate
  }, [playbackRate])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = volume
    video.muted = isMuted
  }, [volume, isMuted])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      try {
        setIsLoading(true)
        await video.play()
      } catch (error) {
        console.error('Error playing video:', error)
        setIsLoading(false)
      }
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    const newTime = parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleFullscreen = () => {
    const container = containerRef.current
    if (!container) return

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err)
      })
    } else {
      document.exitFullscreen()
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleMouseMove = () => {
    setShowControls(true)
    clearTimeout(window.controlTimeout)
    window.controlTimeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false)
      }
    }, 3000)
  }

  return (
    <div
      ref={containerRef}
      className="video-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(true)}
    >
      <style jsx>{`
        .video-player-container {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 40px auto;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .video-title {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: 600;
          z-index: 10;
          backdrop-filter: blur(10px);
        }


        .video-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 aspect ratio fallback */
          background: #000;
          min-height: 400px;
        }

        @supports (aspect-ratio: 16 / 9) {
          .video-wrapper {
            padding-bottom: 0;
            aspect-ratio: 16 / 9;
          }
        }

        .video-wrapper video {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .video-controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
          padding: 20px;
          transition: opacity 0.3s;
          z-index: 10;
        }

        .video-controls.hidden {
          opacity: 0;
          pointer-events: none;
        }

        .progress-container {
          width: 100%;
          margin-bottom: 15px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: #666;
          border-radius: 3px;
          cursor: pointer;
          position: relative;
          direction: ltr;
        }

        .progress-bar input[type="range"] {
          width: 100%;
          height: 6px;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
          cursor: pointer;
          position: absolute;
          top: 0;
          left: 0;
          direction: ltr;
        }

        .progress-bar input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }

        .progress-bar input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #667eea;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }

        .progress-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: #667eea;
          border-radius: 3px;
          pointer-events: none;
          transition: width 0.1s;
        }

        .progress-buffered {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 3px;
          pointer-events: none;
          transition: width 0.1s;
        }

        .controls-row {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
          direction: ltr;
        }

        .controls-left {
          display: flex;
          align-items: center;
          gap: 15px;
          flex: 1;
        }

        .controls-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .control-button {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          border-radius: 6px;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .time-display {
          color: white;
          font-size: 14px;
          font-weight: 500;
          min-width: 100px;
        }

        .volume-container {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          max-width: 150px;
        }

        .volume-slider {
          width: 100%;
          height: 4px;
          -webkit-appearance: none;
          appearance: none;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .settings-menu {
          position: relative;
        }

        .dropdown-menu {
          position: absolute;
          bottom: 100%;
          left: 0;
          margin-bottom: 10px;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 180px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }

        .dropdown-item {
          padding: 10px 20px;
          color: white;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .dropdown-item.active {
          color: #667eea;
          font-weight: 600;
        }

        .quality-submenu {
          position: absolute;
          right: 100%;
          top: 0;
          margin-right: 10px;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 8px;
          padding: 8px 0;
          min-width: 150px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }


        .loading-indicator {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          z-index: 15;
        }

        .loading-indicator.hidden {
          display: none;
        }

        @keyframes spin {
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @media (max-width: 768px) {
          .video-player-container {
            max-width: 100%;
            margin: 20px 0;
          }

          .video-title {
            font-size: 14px;
            padding: 8px 15px;
            top: 10px;
            right: 10px;
          }

          .controls-row {
            gap: 8px;
          }

          .control-button {
            padding: 6px;
            font-size: 16px;
          }

          .time-display {
            font-size: 12px;
            min-width: 80px;
          }

          .volume-container {
            max-width: 100px;
          }
        }
      `}</style>

      {title && <div className="video-title">{title}</div>}

      <div className="video-wrapper">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={poster}
          onClick={togglePlay}
          className="video-element"
          preload="none"
          playsInline
          controls={false}
        />
      </div>

      {/* Loading Indicator */}
      {isLoading && <div className="loading-indicator" />}

      <div className={`video-controls ${!showControls ? 'hidden' : ''}`}>
        <div className="progress-container">
          <div className="progress-bar">
            {/* Buffered progress (gray) */}
            <div
              className="progress-buffered"
              style={{ width: `${duration > 0 ? (buffered / duration) * 100 : 0}%` }}
            />
            {/* Current progress (purple) */}
            <div
              className="progress-fill"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              step="0.1"
              style={{ direction: 'ltr' }}
            />
          </div>
        </div>

        <div className="controls-row">
          <div className="controls-left">
            <button className="control-button" onClick={togglePlay}>
              {isPlaying ? '⏸️' : '▶️'}
            </button>

            <div className="time-display">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            <div className="volume-container">
              <button className="control-button" onClick={toggleMute}>
                {isMuted || volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
              />
            </div>

            <div className="settings-menu">
              <button
                className="control-button"
                onClick={() => {
                  setShowSpeedMenu(!showSpeedMenu)
                  setShowQualityMenu(false)
                }}
              >
                ⚙️
              </button>
              {showSpeedMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" style={{ fontWeight: 600, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    سرعت پخش
                  </div>
                  {playbackRates.map(rate => (
                    <div
                      key={rate}
                      className={`dropdown-item ${playbackRate === rate ? 'active' : ''}`}
                      onClick={() => {
                        setPlaybackRate(rate)
                        setShowSpeedMenu(false)
                      }}
                    >
                      {rate}x
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="settings-menu">
              <button
                className="control-button"
                onClick={() => {
                  setShowQualityMenu(!showQualityMenu)
                  setShowSpeedMenu(false)
                }}
                title={`کیفیت: ${quality === 'auto' ? `خودکار (${networkSpeed === 'fast' ? '1080p+' : networkSpeed === 'medium' ? '720p' : '480p'})` : quality}`}
              >
                {quality === 'auto' ? (
                  networkSpeed === 'fast' ? 'HD+' : networkSpeed === 'medium' ? 'HD' : 'SD'
                ) : 'HD'}
              </button>
              {showQualityMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-item" style={{ fontWeight: 600, marginBottom: 8, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    کیفیت
                  </div>
                  {qualities.map(q => (
                    <div
                      key={q.value}
                      className={`dropdown-item ${quality === q.value ? 'active' : ''}`}
                      onClick={() => {
                        setQuality(q.value)
                        setAutoQuality(q.value === 'auto')
                        setShowQualityMenu(false)
                      }}
                    >
                      {q.label}
                      {q.value === 'auto' && quality === 'auto' && (
                        <span style={{ fontSize: '12px', marginRight: '8px', opacity: 0.7 }}>
                          ({networkSpeed === 'fast' ? '1080p+' : networkSpeed === 'medium' ? '720p' : '480p'})
                        </span>
                      )}
                      {quality === q.value && ' ✓'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="controls-right">
            <button className="control-button" onClick={toggleFullscreen}>
              {isFullscreen ? '🗗' : '⛶'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

