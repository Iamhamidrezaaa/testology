'use client'

import { useEffect, useState } from 'react'
import TranslationTable from '@/components/admin/Translations/TranslationTable'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

type Translation = {
  id: string
  key: string
  language: string
  value: string
  updatedAt: string
}

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTranslations = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/translations')
      
      if (!response.ok) {
        throw new Error('خطا در دریافت ترجمه‌ها')
      }

      const data = await response.json()
      setTranslations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTranslations()
  }, [])

  const handleEdit = async (translation: Translation) => {
    try {
      const response = await fetch(`/api/admin/translations/${translation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(translation)
      })

      if (!response.ok) {
        throw new Error('خطا در به‌روزرسانی ترجمه')
      }

      await fetchTranslations()
      toast.success('ترجمه با موفقیت به‌روز شد')
    } catch (err) {
      toast.error('خطا در به‌روزرسانی ترجمه')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطا</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (translations.length === 0) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTitle>ترجمه‌ای موجود نیست</AlertTitle>
          <AlertDescription>
            هیچ ترجمه‌ای در سیستم ثبت نشده است.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">مدیریت ترجمه‌ها</h1>
      <TranslationTable data={translations} onEdit={handleEdit} />
    </div>
  )
} 