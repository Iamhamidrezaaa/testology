'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { ImageUpload } from '@/components/ui/image-upload'

type SiteSettings = {
  siteTitle: string
  welcomeText: string
  metaDescription: string
  metaKeywords: string
  gptEnabled: boolean
  darkMode: boolean
  footerText: string
  logoUrl: string
  faviconUrl: string
}

export default function SiteSettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: '',
    welcomeText: '',
    metaDescription: '',
    metaKeywords: '',
    gptEnabled: true,
    darkMode: false,
    footerText: '',
    logoUrl: '',
    faviconUrl: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }

    if (!(session.user as any).isAdmin) {
      router.push('/')
      return
    }

    fetchSettings()
  }, [session])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/site-settings')
      const data = await res.json()
      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('خطا در دریافت تنظیمات')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/admin/site-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        toast.success('تنظیمات با موفقیت ذخیره شد')
      } else {
        throw new Error('خطا در ذخیره تنظیمات')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('خطا در ذخیره تنظیمات')
    } finally {
      setIsSaving(false)
    }
  }

  if (!session || !(session.user as any).isAdmin) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">دسترسی غیرمجاز</h1>
        <p className="mt-2">شما دسترسی به این صفحه را ندارید.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">⚙️ تنظیمات کلی سایت</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات پایه</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteTitle">عنوان سایت</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                placeholder="عنوان سایت را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcomeText">پیام خوش‌آمد</Label>
              <Input
                id="welcomeText"
                value={settings.welcomeText}
                onChange={(e) => setSettings({ ...settings, welcomeText: e.target.value })}
                placeholder="پیام خوش‌آمد را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label>لوگوی سایت</Label>
              <ImageUpload
                value={settings.logoUrl}
                onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                type="logo"
              />
            </div>

            <div className="space-y-2">
              <Label>آیکون سایت</Label>
              <ImageUpload
                value={settings.faviconUrl}
                onChange={(url) => setSettings({ ...settings, faviconUrl: url })}
                type="favicon"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>سئو و متا</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaDescription">توضیحات متا</Label>
              <Textarea
                id="metaDescription"
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                placeholder="توضیحات متا را وارد کنید"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaKeywords">کلمات کلیدی متا</Label>
              <Input
                id="metaKeywords"
                value={settings.metaKeywords}
                onChange={(e) => setSettings({ ...settings, metaKeywords: e.target.value })}
                placeholder="کلمات کلیدی را با کاما جدا کنید"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تنظیمات پیشرفته</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="gptEnabled">فعال‌سازی GPT</Label>
              <Switch
                id="gptEnabled"
                checked={settings.gptEnabled}
                onCheckedChange={(checked) => setSettings({ ...settings, gptEnabled: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode">حالت تاریک</Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="footerText">متن فوتر</Label>
              <Textarea
                id="footerText"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                placeholder="متن فوتر را وارد کنید"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-32"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              'ذخیره تنظیمات'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
} 