'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns-jalali'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  Edit, 
  Trash2, 
  MoreVertical, 
  Plus, 
  Search,
  Eye,
  FileText
} from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  createdAt: string
  published: boolean
}

export default function AdminPostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/posts')
      if (!res.ok) throw new Error('خطا در دریافت لیست پست‌ها')
      const data = await res.json()
      setPosts(data)
    } catch (error) {
      console.error('خطا در دریافت لیست پست‌ها:', error)
      toast.error('خطا در دریافت لیست پست‌ها')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/admin/edit-post/${id}`)
  }

  const handleView = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این پست مطمئن هستید؟')) return
    
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'DELETE'
      })
      
      if (!res.ok) throw new Error('خطا در حذف پست')
      
      setPosts(prev => prev.filter(post => post.id !== id))
      toast.success('پست با موفقیت حذف شد')
    } catch (error) {
      console.error('خطا در حذف پست:', error)
      toast.error('خطا در حذف پست')
    }
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <Card className="p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-8 w-[100px]" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-vazir">مدیریت پست‌ها</h1>
        <Button
          onClick={() => router.push('/admin/create-post')}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          پست جدید
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="جستجو در پست‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'نتیجه‌ای یافت نشد' : 'هنوز هیچ پستی منتشر نشده است'}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>عنوان</TableHead>
                <TableHead>اسلاگ</TableHead>
                <TableHead>تاریخ ایجاد</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead className="text-left">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map(post => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell className="font-mono text-sm">{post.slug}</TableCell>
                  <TableCell>
                    {format(new Date(post.createdAt), 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'منتشر شده' : 'پیش‌نویس'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(post.slug)}>
                          <Eye className="w-4 h-4 ml-2" />
                          مشاهده
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                          <Edit className="w-4 h-4 ml-2" />
                          ویرایش
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(post.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 ml-2" />
                          حذف
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
} 