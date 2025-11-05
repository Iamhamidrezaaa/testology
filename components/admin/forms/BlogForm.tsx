'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'

interface BlogFormProps {
  id?: string
}

export function BlogForm({ id }: BlogFormProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      fetchPost()
    }
  }, [id])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${id}`)
      if (!response.ok) throw new Error('خطا در دریافت پست')
      const data = await response.json()
      setTitle(data.title)
      setContent(data.content)
      setTags(data.tags)
    } catch (error) {
      console.error('Error fetching post:', error)
      toast.error('خطا در دریافت پست')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.isAdmin) {
      toast.error('دسترسی غیرمجاز')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(id ? `/api/admin/blog/${id}` : '/api/admin/blog', {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, tags })
      })

      if (!response.ok) throw new Error('خطا در ذخیره پست')
      
      toast.success(id ? 'پست با موفقیت به‌روزرسانی شد' : 'پست با موفقیت ایجاد شد')
      router.push('/admin-panel/blog')
    } catch (error) {
      console.error('Error saving post:', error)
      toast.error('خطا در ذخیره پست')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">عنوان</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="عنوان پست را وارد کنید"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">محتوا</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="محتوا را وارد کنید"
          rows={10}
        />
      </div>

      <div className="space-y-2">
        <Label>برچسب‌ها</Label>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="برچسب جدید"
          />
          <Button type="button" onClick={handleAddTag}>
            افزودن
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'در حال ذخیره...' : id ? 'به‌روزرسانی' : 'ایجاد'}
      </Button>
    </form>
  )
} 