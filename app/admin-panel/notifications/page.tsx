'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Bell, Plus, Trash2, CheckCircle, XCircle, Loader2, Pencil, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import CreateNotificationModal from '@/components/admin/CreateNotificationModal'
import { formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'success' | 'error'
  isRead: boolean
  targetUser: string | null
  createdAt: string
  user?: {
    id: string
    name: string
    email: string
  }
}

interface PaginationData {
  total: number
  pages: number
  currentPage: number
  limit: number
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | undefined>()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10
  })

  // Filters
  const [search, setSearch] = useState('')
  const [type, setType] = useState<string>('')
  const [isRead, setIsRead] = useState<string>('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.limit.toString(),
        sortBy,
        sortOrder
      })

      if (search) params.append('search', search)
      if (type) params.append('type', type)
      if (isRead !== '') params.append('isRead', isRead)

      const res = await fetch(`/api/admin/notifications?${params}`)
      if (!res.ok) throw new Error('خطا در دریافت اعلان‌ها')
      
      const data = await res.json()
      setNotifications(data.notifications)
      setPagination(data.pagination)
    } catch (error) {
      toast.error('خطا در دریافت اعلان‌ها')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [pagination.currentPage, type, isRead, sortBy, sortOrder])

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این اعلان اطمینان دارید؟')) return

    try {
      setDeletingId(id)
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('خطا در حذف اعلان')

      setNotifications(prev => prev.filter(n => n.id !== id))
      toast.success('اعلان با موفقیت حذف شد')
    } catch (error) {
      toast.error('خطا در حذف اعلان')
      console.error(error)
    } finally {
      setDeletingId(null)
    }
  }

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      setTogglingId(id)
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: !currentStatus })
      })

      if (!res.ok) throw new Error('خطا در بروزرسانی وضعیت')

      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, isRead: !currentStatus } : n
        )
      )
      toast.success('وضعیت اعلان بروزرسانی شد')
    } catch (error) {
      toast.error('خطا در بروزرسانی وضعیت')
      console.error(error)
    } finally {
      setTogglingId(null)
    }
  }

  const handleEdit = (notification: Notification) => {
    setSelectedNotification(notification)
    setShowModal(true)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPagination(prev => ({ ...prev, currentPage: 1 }))
    fetchNotifications()
  }

  const getTypeBadge = (type: string) => {
    const variants = {
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
      success: 'bg-green-500',
      error: 'bg-red-500'
    }

    const labels = {
      info: 'اطلاع‌رسانی',
      warning: 'هشدار',
      success: 'موفقیت',
      error: 'خطا'
    }

    return (
      <Badge className={variants[type as keyof typeof variants]}>
        {labels[type as keyof typeof labels]}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            مدیریت اعلان‌ها
          </CardTitle>
          <Button onClick={() => {
            setSelectedNotification(undefined)
            setShowModal(true)
          }}>
            <Plus className="w-4 h-4 ml-2" />
            افزودن اعلان جدید
          </Button>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="جستجو در عنوان و متن..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="نوع اعلان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  <SelectItem value="info">اطلاع‌رسانی</SelectItem>
                  <SelectItem value="warning">هشدار</SelectItem>
                  <SelectItem value="success">موفقیت</SelectItem>
                  <SelectItem value="error">خطا</SelectItem>
                </SelectContent>
              </Select>
              <Select value={isRead} onValueChange={setIsRead}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">همه</SelectItem>
                  <SelectItem value="true">خوانده‌شده</SelectItem>
                  <SelectItem value="false">خوانده‌نشده</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit">
                <Search className="w-4 h-4 ml-2" />
                جستجو
              </Button>
            </form>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('title')}
                    className="flex items-center gap-2"
                  >
                    عنوان
                    {sortBy === 'title' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead>نوع</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>کاربر هدف</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-2"
                  >
                    تاریخ
                    {sortBy === 'createdAt' && (
                      sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </Button>
                </TableHead>
                <TableHead className="text-center">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    هیچ اعلانی یافت نشد
                  </TableCell>
                </TableRow>
              ) : (
                notifications.map(notif => (
                  <TableRow key={notif.id}>
                    <TableCell className="font-medium">{notif.title}</TableCell>
                    <TableCell>{getTypeBadge(notif.type)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleRead(notif.id, notif.isRead)}
                        className="flex items-center gap-2"
                        disabled={togglingId === notif.id}
                      >
                        {togglingId === notif.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : notif.isRead ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        {notif.isRead ? 'خوانده‌شده' : 'خوانده‌نشده'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      {notif.user ? (
                        <div className="text-sm">
                          <div>{notif.user.name}</div>
                          <div className="text-muted-foreground">{notif.user.email}</div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">همه کاربران</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: faIR
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(notif)}
                        >
                          <Pencil className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(notif.id)}
                          disabled={deletingId === notif.id}
                        >
                          {deletingId === notif.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPagination(prev => ({
                        ...prev,
                        currentPage: Math.max(1, prev.currentPage - 1)
                      }))}
                      disabled={pagination.currentPage === 1}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                        isActive={page === pagination.currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPagination(prev => ({
                        ...prev,
                        currentPage: Math.min(pagination.pages, prev.currentPage + 1)
                      }))}
                      disabled={pagination.currentPage === pagination.pages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateNotificationModal
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={fetchNotifications}
        notification={selectedNotification}
      />
    </div>
  )
} 