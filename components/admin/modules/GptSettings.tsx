'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Save, TestTube } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GPTSettings {
  id: string
  model: string
  systemPrompt: string
  temperature: number
  numResponses: number
}

export default function GptSettings() {
  const [data, setData] = useState<GPTSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/gpt-settings')
      if (!res.ok) throw new Error('خطا در دریافت تنظیمات')
      const json = await res.json()
      setData(json)
    } catch (error) {
      toast.error('خطا در دریافت تنظیمات')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!data) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/admin/gpt-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error('خطا در ذخیره تنظیمات')
      
      toast.success('تنظیمات با موفقیت ذخیره شد')
    } catch (error) {
      toast.error('خطا در ذخیره تنظیمات')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!data) return
    
    setTesting(true)
    try {
      const res = await fetch('/api/admin/gpt-settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      
      if (!res.ok) throw new Error('خطا در تست تنظیمات')
      
      const result = await res.json()
      toast.success('تست با موفقیت انجام شد')
      console.log('Test result:', result)
    } catch (error) {
      toast.error('خطا در تست تنظیمات')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (!data) {
    return <div>خطا در بارگذاری تنظیمات</div>
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">تنظیمات GPT</h2>
        <div className="flex gap-2">
          <Button 
            onClick={handleTest} 
            disabled={testing}
            variant="outline"
          >
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <TestTube className="w-4 h-4 ml-2" />
                تست تنظیمات
              </>
            )}
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 ml-2" />
                ذخیره تنظیمات
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="space-y-2">
          <Label>مدل GPT</Label>
          <Select
            value={data.model}
            onValueChange={(value) => setData({ ...data, model: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب مدل" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
              <SelectItem value="gpt-4">GPT-4</SelectItem>
              <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>System Prompt</Label>
          <Textarea
            value={data.systemPrompt}
            onChange={(e) => setData({ ...data, systemPrompt: e.target.value })}
            rows={6}
            placeholder="دستورالعمل‌های سیستم برای GPT..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Temperature</Label>
            <Input
              type="number"
              min="0"
              max="2"
              step="0.1"
              value={data.temperature}
              onChange={(e) => setData({ ...data, temperature: parseFloat(e.target.value) })}
            />
            <p className="text-sm text-gray-500">
              مقدار بین 0 تا 2 (پیش‌فرض: 0.7)
            </p>
          </div>

          <div className="space-y-2">
            <Label>تعداد پاسخ‌ها</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={data.numResponses}
              onChange={(e) => setData({ ...data, numResponses: parseInt(e.target.value) })}
            />
            <p className="text-sm text-gray-500">
              تعداد پاسخ‌های پیشنهادی (پیش‌فرض: 1)
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 