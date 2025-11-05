'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

type Translation = {
  id: string
  key: string
  language: string
  value: string
  updatedAt: string
}

export default function TranslationEditor({ 
  translation, 
  onSave, 
  onCancel 
}: { 
  translation: Translation
  onSave: (t: Translation) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState(translation.value)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!value.trim()) {
      toast.error('لطفا متن ترجمه را وارد کنید')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/admin/translations/${translation.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: value.trim()
        })
      })

      if (!response.ok) {
        throw new Error('خطا در ذخیره ترجمه')
      }

      const updated = await response.json()
      onSave(updated)
      toast.success('ترجمه با موفقیت ذخیره شد')
    } catch (error) {
      console.error('Error saving translation:', error)
      toast.error('خطا در ذخیره ترجمه')
    } finally {
      setSaving(false)
    }
  }

  const getLanguageLabel = (language: string) => {
    const labels: Record<string, string> = {
      fa: 'فارسی',
      en: 'English',
      ar: 'العربية',
      tr: 'Türkçe'
    }
    return labels[language] || language
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            ویرایش ترجمه ({translation.key})
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">زبان:</h4>
              <span className="text-sm text-muted-foreground">
                {getLanguageLabel(translation.language)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">متن ترجمه:</h4>
            <Textarea
              placeholder="متن ترجمه را اینجا وارد کنید..."
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={saving}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 