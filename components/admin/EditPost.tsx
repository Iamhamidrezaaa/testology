'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { slugify } from '@/lib/utils/slugify'

const Editor = dynamic(() => import('@/components/editor/Editor'), { 
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full" />
})

interface Post {
  id: string
  title: string
  slug: string
  description: string
  content: string
  tags: string[]
  seoKeywords: string
  seoDescription: string
  published: boolean
}

export default function EditPost({ postId }: { postId: string }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPost()
  }, [postId])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/posts/${postId}`)
      if (!res.ok) throw new Error('خطا در دریافت اطلاعات پست')
      const data = await res.json()
      setPost(data)
    } catch (error) {
      console.error('خطا در دریافت اطلاعات پست:', error)
      toast.error('خطا در دریافت اطلاعات پست')
    } finally {
      setLoading(false)
    }
  }

  // تولید خودکار اسلاگ از عنوان
  useEffect(() => {
    if (post?.title && !post.slug) {
      setPost(prev => prev ? { ...prev, slug: slugify(prev.title) } : null)
    }
  }, [post?.title])

  const handleSave = async () => {
    if (!post) return

    try {
      setSaving(true)
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      })

      if (!res.ok) throw new Error('خطا در ذخیره تغییرات')

      toast.success('تغییرات با موفقیت ذخیره شد')
      router.push('/admin/posts')
    } catch (error) {
      console.error('خطا در ذخیره تغییرات:', error)
      toast.error('خطا در ذخیره تغییرات')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Card className="p-6 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </Card>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">پست پیدا نشد</h1>
        <Button onClick={() => router.back()}>بازگشت</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-vazir">ویرایش پست</h1>
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
              value={post.title}
              onChange={e => setPost({ ...post, title: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="slug">آدرس اسلاگ</Label>
            <Input
              id="slug"
              value={post.slug}
              onChange={e => setPost({ ...post, slug: e.target.value })}
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
              value={post.description}
              onChange={e => setPost({ ...post, description: e.target.value })}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>محتوا</Label>
            <Editor
              value={post.content}
              onChange={(value) => setPost({ ...post, content: value })}
            />
          </div>

          <div>
            <Label htmlFor="tags">تگ‌ها</Label>
            <Input
              id="tags"
              value={post.tags.join(', ')}
              onChange={e => setPost({ ...post, tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean) })}
              className="mt-1"
              placeholder="تگ‌ها را با کاما جدا کنید"
            />
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-semibold">تنظیمات سئو</h2>
          
          <div>
            <Label htmlFor="seoKeywords">کلمات کلیدی</Label>
            <Input
              id="seoKeywords"
              value={post.seoKeywords}
              onChange={e => setPost({ ...post, seoKeywords: e.target.value })}
              className="mt-1"
              placeholder="کلمات کلیدی را با کاما جدا کنید"
            />
          </div>

          <div>
            <Label htmlFor="seoDescription">توضیحات متا</Label>
            <Textarea
              id="seoDescription"
              value={post.seoDescription}
              onChange={e => setPost({ ...post, seoDescription: e.target.value })}
              className="mt-1"
              rows={3}
              placeholder="توضیحات متا برای موتورهای جستجو"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={saving}
          >
            انصراف
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-w-[100px]"
          >
            {saving ? (
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