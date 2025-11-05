'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/modules/DataTable'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

const USER_ROLES = [
  { value: 'user', label: 'کاربر عادی' },
  { value: 'admin', label: 'مدیر' },
  { value: 'moderator', label: 'ناظر' }
]

const USER_STATUS = {
  active: { label: 'فعال', color: 'success' },
  inactive: { label: 'غیرفعال', color: 'destructive' },
  banned: { label: 'مسدود', color: 'secondary' }
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    search: ''
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      if (filters.role) queryParams.append('role', filters.role)
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.search) queryParams.append('search', filters.search)

      const response = await fetch(`/api/admin/users?${queryParams}`)
      if (!response.ok) throw new Error('خطا در دریافت کاربران')
      
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('خطا در دریافت کاربران')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const handleEdit = async () => {
    if (!selectedUser) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedUser)
      })

      if (!response.ok) throw new Error('خطا در ویرایش کاربر')
      
      toast.success('کاربر با موفقیت ویرایش شد')
      setShowEditDialog(false)
      fetchUsers()
    } catch (error) {
      console.error('Error editing user:', error)
      toast.error('خطا در ویرایش کاربر')
    }
  }

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) throw new Error('خطا در تغییر وضعیت')
      
      toast.success('وضعیت با موفقیت تغییر کرد')
      fetchUsers()
    } catch (error) {
      console.error('Error changing status:', error)
      toast.error('خطا در تغییر وضعیت')
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'نام',
      render: (value: string, row: any) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'نقش',
      render: (value: string) => (
        <Badge variant="outline">
          {USER_ROLES.find(role => role.value === value)?.label || value}
        </Badge>
      )
    },
    {
      key: 'status',
      label: 'وضعیت',
      render: (value: string) => {
        const color = USER_STATUS[value as keyof typeof USER_STATUS]?.color || 'default';
        const variant = (color === 'default' || color === 'outline' || color === 'destructive' || color === 'secondary') 
          ? color 
          : 'default';
        return (
          <Badge variant={variant as "default" | "outline" | "destructive" | "secondary"}>
            {USER_STATUS[value as keyof typeof USER_STATUS]?.label || value}
          </Badge>
        );
      }
    },
    {
      key: 'createdAt',
      label: 'تاریخ عضویت',
      render: (value: string) => new Date(value).toLocaleString('fa-IR')
    },
    {
      key: 'actions',
      label: 'عملیات',
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedUser(row)
              setShowEditDialog(true)
            }}
          >
            ویرایش
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusChange(
              row.id,
              row.status === 'banned' ? 'active' : 'banned'
            )}
          >
            {row.status === 'banned' ? 'رفع مسدودیت' : 'مسدود کردن'}
          </Button>
        </div>
      )
    }
  ]

  const filterOptions = [
    {
      key: 'role',
      label: 'نقش',
      options: [
        { value: '', label: 'همه' },
        ...USER_ROLES
      ]
    },
    {
      key: 'status',
      label: 'وضعیت',
      options: [
        { value: '', label: 'همه' },
        { value: 'active', label: 'فعال' },
        { value: 'inactive', label: 'غیرفعال' },
        { value: 'banned', label: 'مسدود' }
      ]
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">👥 مدیریت کاربران</h1>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          searchable
          filterable
          filters={filterOptions}
          onFilter={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
          onSearch={(value) => setFilters(prev => ({ ...prev, search: value }))}
        />
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش کاربر</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>نام</Label>
              <Input
                value={selectedUser?.name || ''}
                onChange={(e) => setSelectedUser((prev: any) => prev ? { ...prev, name: e.target.value } : null)}
              />
            </div>
            <div>
              <Label>ایمیل</Label>
              <Input
                type="email"
                value={selectedUser?.email || ''}
                onChange={(e) => setSelectedUser((prev: any) => prev ? { ...prev, email: e.target.value } : null)}
              />
            </div>
            <div>
              <Label>نقش</Label>
              <Select
                value={selectedUser?.role || ''}
                onValueChange={(value) => setSelectedUser((prev: any) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب نقش" />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>وضعیت</Label>
              <Select
                value={selectedUser?.status || ''}
                onValueChange={(value) => setSelectedUser((prev: any) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_STATUS).map(([value, { label }]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleEdit}>
              ذخیره تغییرات
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 