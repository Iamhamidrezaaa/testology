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

  const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]
  const qualities = [
    { label: 'خودکار', value: 'auto' },
    { label: '4K (2160p)', value: '2160p' },
    { label: '2K (1440p)', value: '1440p' },
    { label: '1080p', value: '1080p' },
    { label: '720p', value: '720p' },
    { label: '480p', value: '480p' },
  ]

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
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

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
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
          background: #000;
          border-radius: 12px;
          overflow: hidden;
          margin: 40px 0;
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

        video {
          width: 100%;
          height: auto;
          display: block;
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
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          cursor: pointer;
          position: relative;
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
        }

        .controls-row {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-wrap: wrap;
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
          right: 0;
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

        @media (max-width: 768px) {
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

      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        onClick={togglePlay}
        className="video-element"
      />

      <div className={`video-controls ${!showControls ? 'hidden' : ''}`}>
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              step="0.1"
            />
          </div>
        </div>

        <div className="controls-row">
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
            >
              HD
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
                      setShowQualityMenu(false)
                    }}
                  >
                    {q.label}
                    {quality === q.value && ' ✓'}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="control-button" onClick={toggleFullscreen}>
            {isFullscreen ? '🗗' : '⛶'}
          </button>
        </div>
      </div>
    </div>
  )
}

