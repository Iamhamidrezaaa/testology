'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { Save, Upload, Download, RefreshCw, Settings, Globe, Bot, Users } from 'lucide-react'

interface SiteSettings {
  id?: string
  logoUrl?: string
  welcomeMsg?: string
  gptModel?: string
  font?: string
  chatbotOn?: boolean
  registerOn?: boolean
  updatedAt?: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching settings:', err)
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        // نمایش پیام موفقیت
        alert('تنظیمات با موفقیت ذخیره شد')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('خطا در ذخیره تنظیمات')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید تنظیمات را به حالت پیش‌فرض بازگردانید؟')) {
      // بازگردانی به تنظیمات پیش‌فرض
      fetch('/api/admin/settings/reset', { method: 'POST' })
        .then(() => {
          window.location.reload()
        })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تنظیمات کلی سایت</h1>
          <p className="text-gray-600">مدیریت تنظیمات عمومی و ظاهری سایت</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            بازگردانی
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </Button>
        </div>
      </div>

      {/* تنظیمات عمومی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Globe className="h-5 w-5" />
            <span>تنظیمات عمومی</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="logoUrl">آدرس لوگو</Label>
            <Input
              id="logoUrl"
              value={settings?.logoUrl || ''}
              onChange={(e) => setSettings({ ...settings!, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
            <p className="text-sm text-gray-500 mt-1">آدرس کامل تصویر لوگو</p>
          </div>

          <div>
            <Label htmlFor="welcomeMsg">پیام خوش‌آمدگویی</Label>
            <Textarea
              id="welcomeMsg"
              value={settings?.welcomeMsg || ''}
              onChange={(e) => setSettings({ ...settings!, welcomeMsg: e.target.value })}
              placeholder="به Testology خوش آمدید!"
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">این پیام به کاربران جدید نمایش داده می‌شود</p>
          </div>

          <div>
            <Label htmlFor="font">فونت پیش‌فرض</Label>
            <select
              id="font"
              value={settings?.font || 'Vazir'}
              onChange={(e) => setSettings({ ...settings!, font: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Vazir">Vazir</option>
              <option value="BNazanin">B Nazanin</option>
              <option value="Shabnam">Shabnam</option>
              <option value="Tahoma">Tahoma</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">فونت پیش‌فرض برای نمایش متن‌ها</p>
          </div>
        </CardContent>
      </Card>

      {/* تنظیمات GPT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <span>تنظیمات GPT</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="gptModel">مدل GPT پیش‌فرض</Label>
            <select
              id="gptModel"
              value={settings?.gptModel || 'gpt-3.5-turbo'}
              onChange={(e) => setSettings({ ...settings!, gptModel: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">مدل پیش‌فرض برای تحلیل تست‌ها</p>
          </div>
        </CardContent>
      </Card>

      {/* تنظیمات سیستم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>تنظیمات سیستم</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="chatbotOn">فعال‌سازی چت‌بات</Label>
              <p className="text-sm text-gray-500">چت‌بات روان‌یار برای کاربران فعال باشد</p>
            </div>
            <Switch
              id="chatbotOn"
              checked={settings?.chatbotOn || true}
              onCheckedChange={(checked) => setSettings({ ...settings!, chatbotOn: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="registerOn">اجازه ثبت‌نام کاربران</Label>
              <p className="text-sm text-gray-500">کاربران جدید می‌توانند ثبت‌نام کنند</p>
            </div>
            <Switch
              id="registerOn"
              checked={settings?.registerOn || true}
              onCheckedChange={(checked) => setSettings({ ...settings!, registerOn: checked })}
            />
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
