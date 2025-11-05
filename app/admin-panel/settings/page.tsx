'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface Settings {
  siteName: string
  siteDescription: string
  contactEmail: string
  supportPhone: string
  maintenanceMode: boolean
  allowRegistration: boolean
  allowComments: boolean
  maxUploadSize: number
  allowedFileTypes: string[]
  socialLinks: {
    instagram?: string
    telegram?: string
    twitter?: string
    linkedin?: string
  }
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    supportPhone: '',
    maintenanceMode: false,
    allowRegistration: true,
    allowComments: true,
    maxUploadSize: 5,
    allowedFileTypes: [],
    socialLinks: {}
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')
      if (!response.ok) throw new Error('خطا در دریافت تنظیمات')
      
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('خطا در دریافت تنظیمات')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!response.ok) throw new Error('خطا در ذخیره تنظیمات')
      
      toast.success('تنظیمات با موفقیت ذخیره شد')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('خطا در ذخیره تنظیمات')
    } finally {
      setSaving(false)
    }
  }

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }))
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">⚙️ تنظیمات سایت</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">اطلاعات پایه</h2>
          <div className="space-y-4">
            <div>
              <Label>نام سایت</Label>
              <Input
                value={settings.siteName}
                onChange={(e) => setSettings(prev => ({ ...prev, siteName: e.target.value }))}
              />
            </div>
            <div>
              <Label>توضیحات سایت</Label>
              <Textarea
                value={settings.siteDescription}
                onChange={(e) => setSettings(prev => ({ ...prev, siteDescription: e.target.value }))}
                rows={3}
              />
            </div>
            <div>
              <Label>ایمیل تماس</Label>
              <Input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
            <div>
              <Label>شماره پشتیبانی</Label>
              <Input
                value={settings.supportPhone}
                onChange={(e) => setSettings(prev => ({ ...prev, supportPhone: e.target.value }))}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">تنظیمات سیستم</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>حالت تعمیر و نگهداری</Label>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenanceMode: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>فعال‌سازی ثبت‌نام</Label>
              <Switch
                checked={settings.allowRegistration}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowRegistration: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>فعال‌سازی نظرات</Label>
              <Switch
                checked={settings.allowComments}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowComments: checked }))}
              />
            </div>
            <div>
              <Label>حداکثر حجم آپلود (مگابایت)</Label>
              <Input
                type="number"
                value={settings.maxUploadSize}
                onChange={(e) => setSettings(prev => ({ ...prev, maxUploadSize: parseInt(e.target.value) }))}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">شبکه‌های اجتماعی</h2>
          <div className="space-y-4">
            <div>
              <Label>اینستاگرام</Label>
              <Input
                value={settings.socialLinks.instagram || ''}
                onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label>تلگرام</Label>
              <Input
                value={settings.socialLinks.telegram || ''}
                onChange={(e) => handleSocialLinkChange('telegram', e.target.value)}
                placeholder="https://t.me/..."
              />
            </div>
            <div>
              <Label>توییتر</Label>
              <Input
                value={settings.socialLinks.twitter || ''}
                onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label>لینکدین</Label>
              <Input
                value={settings.socialLinks.linkedin || ''}
                onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 