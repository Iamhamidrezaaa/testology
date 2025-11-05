'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BlogPost } from '@/types/blog'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { BlogForm } from '@/components/admin/forms/BlogForm'

interface BlogFormProps {
  id?: string
}

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/blog')
      if (!res.ok) throw new Error('خطا در دریافت مقالات')
      const json = await res.json()
      setPosts(json)
    } catch (error) {
      toast.error('خطا در دریافت مقالات')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این مقاله اطمینان دارید؟')) return

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('خطا در حذف مقاله')
      toast.success('مقاله با موفقیت حذف شد')
      fetchPosts()
    } catch (error) {
      toast.error('خطا در حذف مقاله')
      console.error(error)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      })
      if (!res.ok) throw new Error('خطا در تغییر وضعیت مقاله')
      toast.success(`مقاله ${post.published ? 'به پیش‌نویس تبدیل شد' : 'منتشر شد'}`)
      fetchPosts()
    } catch (error) {
      toast.error('خطا در تغییر وضعیت مقاله')
      console.error(error)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت مقالات بلاگ</h2>
        <Button onClick={() => setEditing({
          title: '',
          content: '',
          tags: [],
          published: false
        })}>
          <Plus className="w-4 h-4 ml-2" />
          افزودن مقاله جدید
        </Button>
      </div>

      <div className="relative">
        <Input
          placeholder="جستجو در مقالات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchQuery ? 'مقاله‌ای یافت نشد' : 'هنوز مقاله‌ای ثبت نشده است'}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map(post => (
            <div key={post.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {post.slug} • {new Date(post.createdAt).toLocaleDateString('fa-IR')}
                  </p>
                  <div className="flex gap-2 mt-2">
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleTogglePublish(post)}
                    title={post.published ? 'تبدیل به پیش‌نویس' : 'انتشار'}
                  >
                    {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditing(post)}
                    title="ویرایش"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id)}
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing?.id ? 'ویرایش مقاله' : 'مقاله جدید'}</DialogTitle>
          </DialogHeader>
          {editing && <BlogForm id={editing.id} />}
        </DialogContent>
      </Dialog>
    </div>
  )
} 