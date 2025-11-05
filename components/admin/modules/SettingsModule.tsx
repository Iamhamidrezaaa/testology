'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function SettingsModule() {
  const [settings, setSettings] = useState({
    welcomeMessage: '',
    gptApiKey: '',
    siteLogoUrl: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('خطا در دریافت تنظیمات')
      const data = await res.json()
      setSettings(data)
    } catch (err) {
      console.error('Error fetching settings:', err)
      toast.error('خطا در دریافت تنظیمات')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('خطا در ذخیره تنظیمات')
      toast.success('تنظیمات با موفقیت ذخیره شد')
    } catch (err) {
      console.error('Error saving settings:', err)
      toast.error('خطا در ذخیره تنظیمات')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات کلی سایت</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="welcomeMessage">پیام خوش‌آمد</Label>
            <Textarea
              id="welcomeMessage"
              value={settings.welcomeMessage}
              onChange={e => setSettings({ ...settings, welcomeMessage: e.target.value })}
              placeholder="پیام خوش‌آمد به کاربران..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gptApiKey">کلید API گپت</Label>
            <Input
              id="gptApiKey"
              type="password"
              value={settings.gptApiKey}
              onChange={e => setSettings({ ...settings, gptApiKey: e.target.value })}
              placeholder="sk-..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteLogoUrl">آدرس لوگو</Label>
            <Input
              id="siteLogoUrl"
              value={settings.siteLogoUrl}
              onChange={e => setSettings({ ...settings, siteLogoUrl: e.target.value })}
              placeholder="https://..."
            />
            {settings.siteLogoUrl && (
              <div className="mt-2">
                <img
                  src={settings.siteLogoUrl}
                  alt="لوگوی سایت"
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 