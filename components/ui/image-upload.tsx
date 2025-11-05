'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Upload } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-hot-toast'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  type: 'logo' | 'favicon'
  className?: string
}

export function ImageUpload({ value, onChange, type, className }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // بررسی سایز فایل (حداکثر 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('حجم فایل نباید بیشتر از 2 مگابایت باشد')
      return
    }

    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      toast.error('فقط فایل‌های تصویری مجاز هستند')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        onChange(data.url)
        toast.success('تصویر با موفقیت آپلود شد')
      } else {
        throw new Error(data.error || 'خطا در آپلود تصویر')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('خطا در آپلود تصویر')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {value && (
        <div className="relative w-32 h-32">
          <Image
            src={value}
            alt="تصویر آپلود شده"
            fill
            className="object-contain rounded-lg"
          />
        </div>
      )}
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          className="relative"
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 ml-2 animate-spin" />
              در حال آپلود...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 ml-2" />
              آپلود تصویر
            </>
          )}
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => onChange('')}
            disabled={isUploading}
          >
            حذف
          </Button>
        )}
      </div>
    </div>
  )
} 