'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { BlogPost } from '@/types/blog'

export default function BlogModule() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/blog')
      if (!response.ok) throw new Error('خطا در دریافت مقالات')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      toast.error('خطا در دریافت مقالات')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/admin/blog/${post.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !post.published })
      })

      if (!response.ok) throw new Error('خطا در تغییر وضعیت مقاله')

      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, published: !p.published } : p
      ))

      toast.success(`مقاله ${post.published ? 'به پیش‌نویس تبدیل شد' : 'منتشر شد'}`)
    } catch (error) {
      toast.error('خطا در تغییر وضعیت مقاله')
      console.error(error)
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div>در حال بارگذاری...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">مدیریت مقالات</h2>
        <Link href="/admin-panel/blog/new">
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            مقاله جدید
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجو در مقالات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {filteredPosts.map(post => (
          <Card key={post.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {post.title}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant={post.published ? "outline" : "default"}
                  size="sm"
                  onClick={() => handleTogglePublish(post)}
                >
                  {post.published ? 'پیش‌نویس کن' : 'منتشر کن'}
                </Button>
                <Link href={`/admin-panel/blog/edit/${post.id}`}>
                  <Button variant="outline" size="sm">
                    ویرایش
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {post.slug} • {new Date(post.createdAt).toLocaleDateString('fa-IR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 