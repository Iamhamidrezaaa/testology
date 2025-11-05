import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import axios from 'axios'

interface PublicProfile {
  id: string
  slug: string
  isVisible: boolean
}

export default function PublicProfileSettings() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [slug, setSlug] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile/public')
      setProfile(response.data as any)
      setSlug((response.data as any).slug)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleVisibilityToggle = async () => {
    if (!profile) return

    try {
      setIsLoading(true)
      const response = await axios.post('/api/profile/public', {
        isVisible: !profile.isVisible
      })
      setProfile(response.data as any)
      toast.success('وضعیت پروفایل به‌روز شد')
    } catch (error) {
      toast.error('خطا در به‌روزرسانی وضعیت پروفایل')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSlugUpdate = async () => {
    if (!profile) return

    try {
      setIsLoading(true)
      const response = await axios.patch('/api/profile/public', { slug })
      setProfile(response.data as any)
      toast.success('شناسه پروفایل به‌روز شد')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در به‌روزرسانی شناسه پروفایل')
    } finally {
      setIsLoading(false)
    }
  }

  if (!profile) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>تنظیمات پروفایل عمومی</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>پروفایل عمومی</Label>
            <p className="text-sm text-muted-foreground">
              اجازه دهید دیگران پروفایل شما را ببینند
            </p>
          </div>
          <Switch
            checked={profile.isVisible}
            onCheckedChange={handleVisibilityToggle}
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label>شناسه پروفایل</Label>
          <div className="flex gap-2">
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="شناسه پروفایل"
              disabled={isLoading}
            />
            <Button
              onClick={handleSlugUpdate}
              disabled={isLoading || slug === profile.slug}
            >
              به‌روزرسانی
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            آدرس پروفایل شما: {process.env.NEXT_PUBLIC_APP_URL}/profile/{profile.slug}
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 