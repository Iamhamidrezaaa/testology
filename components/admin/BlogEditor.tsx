'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils/slugify'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

export default function BlogEditor() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [body, setBody] = useState('')
  const [tags, setTags] = useState('')
  const [seoKeywords, setSeoKeywords] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // تولید خودکار اسلاگ از عنوان
  useEffect(() => {
    if (title) {
      setSlug(slugify(title))
    }
  }, [title])

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/createPost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          description,
          body,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          seoKeywords,
          seoDescription
        })
      })

      if (!res.ok) {
        throw new Error('خطا در ایجاد پست')
      }

      toast.success('پست با موفقیت ایجاد شد')
      router.push('/dashboard/admin/posts')
    } catch (error) {
      toast.error('خطا در ایجاد پست')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-vazir">ایجاد پست جدید</h1>
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          بازگشت
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان</Label>
            <Input
              id="title"
              placeholder="عنوان مقاله"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="slug">آدرس اسلاگ</Label>
            <Input
              id="slug"
              placeholder="آدرس اسلاگ"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="mt-1 font-mono"
            />
            <p className="text-sm text-muted-foreground mt-1">
              اسلاگ به صورت خودکار از عنوان تولید می‌شود، اما می‌توانید آن را تغییر دهید
            </p>
          </div>

          <div>
            <Label htmlFor="description">توضیح کوتاه</Label>
            <Textarea
              id="description"
              placeholder="توضیح کوتاه مقاله"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="body">متن کامل مقاله</Label>
            <Textarea
              id="body"
              placeholder="متن کامل مقاله"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1"
              rows={15}
            />
          </div>

          <div>
            <Label htmlFor="tags">تگ‌ها</Label>
            <Input
              id="tags"
              placeholder="تگ‌ها را با کاما جدا کنید"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1"
            />
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold">تنظیمات سئو</h2>
          
          <div>
            <Label htmlFor="seoKeywords">کلمات کلیدی</Label>
            <Input
              id="seoKeywords"
              placeholder="کلمات کلیدی را با کاما جدا کنید"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="seoDescription">توضیحات متا</Label>
            <Textarea
              id="seoDescription"
              placeholder="توضیحات متا برای موتورهای جستجو"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                ذخیره
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
} 