import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'react-hot-toast'

interface ProfileData {
  displayName: string
  bio: string
  website: string
  twitter: string
  instagram: string
  slug: string
}

export default function PublicProfileForm() {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    website: '',
    twitter: '',
    instagram: '',
    slug: ''
  })

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await axios.get('/api/profile/public')
        setFormData({
          displayName: (res.data as any).displayName || '',
          bio: (res.data as any).bio || '',
          website: (res.data as any).website || '',
          twitter: (res.data as any).twitter || '',
          instagram: (res.data as any).instagram || '',
          slug: (res.data as any).slug || ''
        })
      } catch (e) {
        console.error('Error loading profile:', e)
        toast.error('خطا در بارگذاری پروفایل')
      }
    }
    if (session?.user?.id) {
      loadProfile()
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await axios.post('/api/profile/public', formData)
      toast.success('پروفایل با موفقیت به‌روزرسانی شد')
    } catch (err: any) {
      console.error('Error saving profile:', err)
      toast.error(err.response?.data?.error || 'خطا در ذخیره اطلاعات')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">ویرایش پروفایل عمومی</h2>
        <p className="text-gray-500">اطلاعات پروفایل عمومی خود را ویرایش کنید</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-1">
            نام نمایشی
          </label>
          <Input
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="نام نمایشی خود را وارد کنید"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium mb-1">
            درباره من
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="درباره خودتان بنویسید..."
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            شناسه پروفایل
          </label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="شناسه یکتا برای پروفایل"
          />
          <p className="text-sm text-gray-500 mt-1">
            این شناسه در آدرس پروفایل شما استفاده می‌شود
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-1">
              وب‌سایت
            </label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label htmlFor="twitter" className="block text-sm font-medium mb-1">
              توییتر
            </label>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium mb-1">
              اینستاگرام
            </label>
            <Input
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </Button>
      </div>
    </form>
  )
} 