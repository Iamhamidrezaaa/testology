'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Edit, Trash2, Save, X } from 'lucide-react'
import type { Post } from '@/generated/prisma'

interface EditValues {
  title: string
  content: string
  description: string
  tags: string[]
}

export default function MyPosts() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPostId, setEditingPostId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<EditValues>({
    title: '',
    content: '',
    description: '',
    tags: [],
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/api/admin/get-my-posts')
      setPosts(res.data as any)
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'در دریافت پست‌ها مشکلی پیش آمده است.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این پست مطمئن هستید؟')) return

    try {
      await axios.delete(`/api/admin/delete-post?id=${id}`)
      setPosts(posts.filter(p => p.id !== id))
      toast({
        title: 'موفق',
        description: 'پست با موفقیت حذف شد.',
      })
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'در حذف پست مشکلی پیش آمده است.',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (post: Post) => {
    setEditingPostId(post.id)
    setEditValues({
      title: post.title,
      content: post.content,
      description: (post as any).description || '',
      tags: (post as any).tags || [],
    })
  }

  const handleSave = async () => {
    if (!editingPostId) return

    try {
      const res = await axios.put('/api/admin/update-post', {
        id: editingPostId,
        ...editValues,
      })
      setPosts(posts.map(p => (p.id === editingPostId ? res.data as any : p)))
      setEditingPostId(null)
      toast({
        title: 'موفق',
        description: 'پست با موفقیت ویرایش شد.',
      })
    } catch (error) {
      toast({
        title: 'خطا',
        description: 'در ویرایش پست مشکلی پیش آمده است.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">پست‌های من</h2>
      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">هنوز پستی منتشر نکرده‌اید.</p>
      ) : (
        posts.map(post => (
          <div key={post.id} className="border p-4 rounded-lg space-y-4">
            {editingPostId === post.id ? (
              <>
                <Input
                  placeholder="عنوان پست"
                  value={editValues.title}
                  onChange={e => setEditValues({ ...editValues, title: e.target.value })}
                />
                <Textarea
                  placeholder="توضیح کوتاه"
                  value={editValues.description}
                  onChange={e => setEditValues({ ...editValues, description: e.target.value })}
                />
                <Textarea
                  placeholder="محتوا"
                  value={editValues.content}
                  onChange={e => setEditValues({ ...editValues, content: e.target.value })}
                  className="min-h-[200px]"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    ذخیره
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingPostId(null)}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    لغو
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">{post.title}</h3>
                  {(post as any).description && (
                    <p className="text-sm text-muted-foreground">{(post as any).description}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {post.content.slice(0, 150)}...
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(post as any).tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-muted rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(post)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    ویرایش
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(post.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف
                  </Button>
                </div>
              </>
            )}
          </div>
        ))
      )}
    </div>
  )
} 