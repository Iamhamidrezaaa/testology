'use client'

import { useEffect, useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import ResponsiveContainer from '@/components/responsive/ResponsiveContainer'
import ResponsiveGrid from '@/components/responsive/ResponsiveGrid'
import MobileOptimizedCard from '@/components/responsive/MobileOptimizedCard'

interface VideoLog {
  id: string
  videoUrl: string
  thumbnailUrl?: string
  caption?: string
  duration?: number
  fileSize?: number
  week: number
  year: number
  mood?: string
  tags: string[]
  isPrivate: boolean
  createdAt: string
}

interface VideosData {
  videos: VideoLog[]
  videosByWeek: Record<string, VideoLog[]>
  stats: {
    totalVideos: number
    totalDuration: number
    totalSize: number
    moodCounts: Record<string, number>
  }
}

export default function VideosPage() {
  const [data, setData] = useState<VideosData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingVideo, setEditingVideo] = useState<VideoLog | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/video-log/user')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت ویدئوها')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('video', file)
      formData.append('caption', '')
      formData.append('mood', '')
      formData.append('tags', '[]')

      const response = await fetch('/api/video-log/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        alert('ویدئو با موفقیت آپلود شد!')
        setShowUploadForm(false)
        fetchVideos() // به‌روزرسانی لیست
      } else {
        const errorData = await response.json()
        alert(`خطا در آپلود: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error uploading video:', error)
      alert('خطا در آپلود ویدئو')
    } finally {
      setUploading(false)
    }
  }

  const updateVideo = async (videoId: string, updates: Partial<VideoLog>) => {
    try {
      const response = await fetch(`/api/video-log/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        alert('ویدئو به‌روزرسانی شد!')
        setEditingVideo(null)
        fetchVideos() // به‌روزرسانی لیست
      } else {
        alert('خطا در به‌روزرسانی ویدئو')
      }
    } catch (error) {
      console.error('Error updating video:', error)
      alert('خطا در به‌روزرسانی ویدئو')
    }
  }

  const deleteVideo = async (videoId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این ویدئو را حذف کنید؟')) {
      return
    }

    try {
      const response = await fetch(`/api/video-log/${videoId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('ویدئو با موفقیت حذف شد!')
        fetchVideos() // به‌روزرسانی لیست
      } else {
        alert('خطا در حذف ویدئو')
      }
    } catch (error) {
      console.error('Error deleting video:', error)
      alert('خطا در حذف ویدئو')
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getMoodIcon = (mood: string): string => {
    switch (mood) {
      case '😊': return '😊'
      case '😐': return '😐'
      case '😢': return '😢'
      case '😠': return '😠'
      case '😴': return '😴'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-48 w-full mb-4" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </ResponsiveContainer>
    )
  }

  if (error) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold mb-2 text-red-800">خطا در دریافت ویدئوها</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchVideos} className="bg-red-500 hover:bg-red-600">
              تلاش مجدد
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  if (!data) {
    return (
      <ResponsiveContainer maxWidth="lg" padding="md">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🎥</div>
            <h2 className="text-xl font-semibold mb-2 text-blue-800">ویدئوهای من</h2>
            <p className="text-blue-600 mb-4">
              ویدئویی یافت نشد
            </p>
            <Button onClick={() => setShowUploadForm(true)} className="bg-blue-500 hover:bg-blue-600">
              ضبط ویدئو جدید
            </Button>
          </CardContent>
        </Card>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer maxWidth="lg" padding="md" className="space-y-6">
      {/* هدر */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          🎥 ویدئوهای من
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
          ضبط ویدئوهای شخصی از احساسات و پیشرفت‌های خود
        </p>
      </div>

      {/* آمار کلی */}
      <ResponsiveGrid 
        cols={{ default: 2, sm: 2, md: 4 }} 
        gap="sm"
        className="mb-6"
      >
        <MobileOptimizedCard 
          title="کل ویدئوها"
          icon="📊"
          gradient={true}
          className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {data.stats.totalVideos}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">ویدئو</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="مدت کل"
          icon="⏱️"
          gradient={true}
          className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {data.stats.totalDuration > 0 ? formatDuration(data.stats.totalDuration) : '0:00'}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">دقیقه</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="حجم کل"
          icon="💾"
          gradient={true}
          className="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatFileSize(data.stats.totalSize)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">حجم</div>
          </div>
        </MobileOptimizedCard>

        <MobileOptimizedCard 
          title="احساس غالب"
          icon="😊"
          gradient={true}
          className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">
              {Object.keys(data.stats.moodCounts).length > 0 
                ? Object.entries(data.stats.moodCounts).sort(([,a], [,b]) => b - a)[0][0]
                : '❓'
              }
            </div>
            <div className="text-xs sm:text-sm text-gray-600">احساس</div>
          </div>
        </MobileOptimizedCard>
      </ResponsiveGrid>

      {/* دکمه ضبط ویدئو */}
      <div className="text-center mb-6">
        <Button
          onClick={() => setShowUploadForm(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white"
        >
          🎥 ضبط ویدئو جدید
        </Button>
      </div>

      {/* فرم آپلود ویدئو */}
      {showUploadForm && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">🎥</span>
              <span>ضبط ویدئو جدید</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                انتخاب ویدئو
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                حداکثر حجم: 100MB، فرمت‌های پشتیبانی شده: MP4, AVI, MOV
              </p>
            </div>
            
            {uploading && (
              <div className="text-center py-4">
                <div className="text-lg">⏳ در حال آپلود...</div>
                <p className="text-sm text-gray-600">لطفاً صبر کنید</p>
              </div>
            )}
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowUploadForm(false)}
                className="text-sm"
                disabled={uploading}
              >
                لغو
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* لیست ویدئوها */}
      <div className="space-y-6">
        {Object.keys(data.videosByWeek).length === 0 ? (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">هنوز ویدئویی ضبط نکرده‌اید</h3>
              <p className="text-gray-600 text-sm mb-4">
                ویدئوهای شخصی خود را ضبط کنید و پیشرفت‌هایتان را ثبت کنید
              </p>
              <Button onClick={() => setShowUploadForm(true)} className="bg-purple-500 hover:bg-purple-600">
                شروع ضبط
              </Button>
            </CardContent>
          </Card>
        ) : (
          Object.entries(data.videosByWeek)
            .sort(([a], [b]) => b.localeCompare(a)) // مرتب‌سازی از جدید به قدیم
            .map(([weekKey, videos]) => (
              <MobileOptimizedCard 
                key={weekKey}
                title={`هفته ${weekKey}`}
                icon="📅"
                className="bg-white shadow-lg"
              >
                <div className="space-y-4">
                  {videos.map((video) => (
                    <Card key={video.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          {/* ویدئو */}
                          <div className="relative">
                            <video
                              controls
                              src={video.videoUrl}
                              className="w-full rounded-lg"
                              poster={video.thumbnailUrl}
                            />
                          </div>
                          
                          {/* اطلاعات ویدئو */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                  {new Date(video.createdAt).toLocaleDateString('fa-IR')}
                                </span>
                                {video.mood && (
                                  <span className="text-lg">{getMoodIcon(video.mood)}</span>
                                )}
                                {video.isPrivate && (
                                  <Badge className="bg-gray-100 text-gray-800 border-gray-200 text-xs">
                                    🔒 خصوصی
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingVideo(video)}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50 text-xs"
                                >
                                  ✏️ ویرایش
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteVideo(video.id)}
                                  className="text-red-600 border-red-200 hover:bg-red-50 text-xs"
                                >
                                  🗑️ حذف
                                </Button>
                              </div>
                            </div>
                            
                            {video.caption && (
                              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                {video.caption}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-2">
                              {video.tags.map((tag, index) => (
                                <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {video.duration && (
                                <span>⏱️ {formatDuration(video.duration)}</span>
                              )}
                              {video.fileSize && (
                                <span>💾 {formatFileSize(video.fileSize)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </MobileOptimizedCard>
            ))
        )}
      </div>

      {/* فرم ویرایش ویدئو */}
      {editingVideo && (
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 fixed inset-4 z-50 overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">✏️</span>
              <span>ویرایش ویدئو</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                توضیحات
              </label>
              <Textarea
                value={editingVideo.caption || ''}
                onChange={(e) => setEditingVideo({ ...editingVideo, caption: e.target.value })}
                placeholder="توضیحات ویدئو..."
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                احساس در زمان ضبط
              </label>
              <div className="flex gap-2">
                {['😊', '😐', '😢', '😠', '😴'].map(mood => (
                  <button
                    key={mood}
                    onClick={() => setEditingVideo({ ...editingVideo, mood })}
                    className={`p-2 rounded-full text-2xl ${
                      editingVideo.mood === mood ? 'bg-blue-200' : 'bg-gray-100'
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                تگ‌ها (با کاما جدا کنید)
              </label>
              <Input
                value={editingVideo.tags.join(', ')}
                onChange={(e) => setEditingVideo({ 
                  ...editingVideo, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                placeholder="مثال: پیشرفت, احساسات, موفقیت"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPrivate"
                checked={editingVideo.isPrivate}
                onChange={(e) => setEditingVideo({ ...editingVideo, isPrivate: e.target.checked })}
              />
              <label htmlFor="isPrivate" className="text-sm text-gray-700">
                ویدئو خصوصی باشد
              </label>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setEditingVideo(null)}
                className="text-sm"
              >
                لغو
              </Button>
              <Button
                onClick={() => updateVideo(editingVideo.id, editingVideo)}
                className="bg-blue-500 hover:bg-blue-600 text-sm"
              >
                ذخیره تغییرات
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </ResponsiveContainer>
  )
}
















