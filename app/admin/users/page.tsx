'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Plus, UserPlus, X } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  password?: string
  role: string
  createdAt: string
  testCount: number
  lastTestDate?: string
  isActive: boolean
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [showAddUser, setShowAddUser] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'USER' as 'USER' | 'ADMIN' | 'MODERATOR' | 'THERAPIST'
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [availableRoles, setAvailableRoles] = useState<any[]>([])

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [currentPage, searchTerm, filterStatus])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      })
      
      if (searchTerm) {
        params.append('search', searchTerm)
      }

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (data.error) {
        console.error('API Error:', data.error)
        setUsers([])
      } else {
        setUsers(data.users || [])
        setTotalPages(data.pagination?.totalPages || 1)
        setTotalUsers(data.pagination?.total || 0)
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/admin/roles-public')
      const data = await response.json()
      
      if (data.roles) {
        setAvailableRoles(data.roles)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }

  const getRoleValue = (roleName: string) => {
    const roleMap: { [key: string]: string } = {
      'مدیر سیستم': 'ADMIN',
      'کاربر عادی': 'USER',
      'ناظر': 'MODERATOR',
      'روان‌شناس': 'THERAPIST',
      'تولیدکننده محتوا': 'CONTENT_PRODUCER'
    }
    return roleMap[roleName] || 'USER'
  }

  // مرتب‌سازی کاربران
  const sortedUsers = (users || []).sort((a, b) => {
    // مدیر کل همیشه در صدر
    if (a.email === 'admin@testology.me') return -1
    if (b.email === 'admin@testology.me') return 1
    
    // تعریف سطح دسترسی
    const roleOrder = {
      'ADMIN': 1,
      'THERAPIST': 2,
      'MODERATOR': 3,
      'USER': 4
    }
    
    const aOrder = roleOrder[a.role as keyof typeof roleOrder] || 5
    const bOrder = roleOrder[b.role as keyof typeof roleOrder] || 5
    
    // مرتب‌سازی بر اساس سطح دسترسی
    if (aOrder !== bOrder) {
      return aOrder - bOrder
    }
    
    // اگر سطح دسترسی یکسان بود، بر اساس تاریخ ایجاد
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert('نام و ایمیل الزامی است')
      return
    }

    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          // تبدیل فرمت داده از API به فرمت مورد نیاز کامپوننت
          const newUserFormatted = {
            id: data.data.id,
            name: data.data.name,
            email: data.data.email,
            phone: data.data.phone,
            createdAt: data.data.createdAt,
            testCount: 0,
            lastTestDate: null,
            isActive: true,
            averageScore: 0,
            country: null,
            province: null
          }
          setUsers([...users, newUserFormatted])
          setNewUser({ name: '', email: '', phone: '', role: 'USER' })
          setShowAddUser(false)
          alert('کاربر با موفقیت اضافه شد')
        } else {
          alert('خطا در افزودن کاربر: ' + (data.error || 'خطای نامشخص'))
        }
      } else {
        const errorData = await response.json()
        alert('خطا در افزودن کاربر: ' + (errorData.error || 'خطای نامشخص'))
      }
    } catch (error) {
      console.error('Error adding user:', error)
      alert('خطا در افزودن کاربر')
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/toggle`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      
      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, isActive: !currentStatus } : user
        ))
        alert(`کاربر ${!currentStatus ? 'فعال' : 'غیرفعال'} شد`)
      } else {
        const errorData = await response.json()
        alert(`خطا در تغییر وضعیت کاربر: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('خطا در تغییر وضعیت کاربر')
    }
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setShowEditModal(true)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('آیا از حذف این کاربر مطمئن هستید؟')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('کاربر با موفقیت حذف شد.')
        // Refresh the list
        fetchUsers()
      } else {
        const errorData = await response.json()
        alert(`خطا در حذف کاربر: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('خطا در حذف کاربر')
    }
  }


  const createSampleUsers = async () => {
    if (!confirm('آیا می‌خواهید کاربران نمونه ایجاد شوند؟')) return

    try {
      const response = await fetch('/api/admin/users/create-sample', {
        method: 'POST',
      })

      if (response.ok) {
        alert('کاربران نمونه با موفقیت ایجاد شدند!')
        fetchUsers() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`خطا در ایجاد کاربران نمونه: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error creating sample users:', error)
      alert('خطا در ایجاد کاربران نمونه')
    }
  }

  const handleSaveUser = async () => {
    if (!editingUser) return

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          phone: editingUser.phone,
          role: editingUser.role
        })
      })

      if (response.ok) {
        alert('کاربر با موفقیت به‌روزرسانی شد.')
        setShowEditModal(false)
        fetchUsers() // Refresh the list
      } else {
        const errorData = await response.json()
        alert(`خطا در به‌روزرسانی کاربر: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating user:', error)
      alert('خطا در به‌روزرسانی کاربر')
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مدیریت کاربران</h1>
          <p className="text-gray-600">مدیریت و نظارت بر کاربران سیستم</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setShowAddUser(true)}
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>افزودن کاربر</span>
          </Button>
          <Button 
            variant="outline"
            onClick={createSampleUsers}
            className="flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>ایجاد کاربران نمونه</span>
          </Button>
        </div>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">👥 کل کاربران</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">✅ کاربران فعال</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.isActive).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🧪 تست‌های انجام‌شده</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.reduce((sum, u) => sum + u.testCount, 0)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📈 میانگین تست</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.length > 0 ? Math.round(users.reduce((sum, u) => sum + u.testCount, 0) / users.length) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* فیلترها و جستجو */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در نام یا ایمیل..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                همه
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
              >
                فعال
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
              >
                غیرفعال
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* لیست کاربران */}
      <Card>
        <CardHeader>
          <CardTitle>لیست کاربران ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedUsers.map((user) => (
              <div key={user.id} className="grid grid-cols-4 gap-4 p-4 border rounded-lg hover:bg-gray-50">
                {/* ستون اول: اطلاعات کاربر */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">
                      {user.role === 'ADMIN' ? '👑' :
                       user.role === 'THERAPIST' ? '🧠' :
                       user.role === 'MODERATOR' ? '📝' :
                       '👤'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    {user.email !== 'admin@testology.me' && (
                      <div className="text-sm text-gray-500">{user.email}</div>
                    )}
                    {user.phone && user.email !== 'admin@testology.me' && (
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    )}
                    {user.password && user.email !== 'admin@testology.me' && (
                      <div className="text-sm text-gray-500">پسورد: {user.password}</div>
                    )}
                    <div className="mt-1">
                      <Badge 
                        variant={
                          user.role === 'ADMIN' ? 'default' :
                          user.role === 'THERAPIST' ? 'secondary' :
                          user.role === 'MODERATOR' ? 'outline' :
                          'secondary'
                        }
                        className={
                          user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                          user.role === 'THERAPIST' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'MODERATOR' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {user.role === 'ADMIN' ? 'ادمین' :
                         user.role === 'THERAPIST' ? 'روان‌شناس' :
                         user.role === 'MODERATOR' ? 'مدیر محتوا' :
                         'کاربر عادی'}
                      </Badge>
                    </div>
                    {user.country && (
                      <div className="text-xs text-gray-400">{user.country} - {user.province}</div>
                    )}
                  </div>
                </div>

                {/* ستون دوم: آمار و اطلاعات */}
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-2">
                    {user.role === 'USER' && (
                      <>
                        <div className="text-sm text-gray-600">
                          {user.testCount} تست انجام داده
                        </div>
                        <div className="text-xs text-gray-500">
                          میانگین امتیاز: {user.averageScore ? user.averageScore.toFixed(1) : '0.0'}
                        </div>
                        {user.lastTestDate && (
                          <div className="text-xs text-gray-500">
                            آخرین تست: {new Date(user.lastTestDate).toLocaleDateString('fa-IR')}
                          </div>
                        )}
                      </>
                    )}
                    {user.role === 'THERAPIST' && (
                      <div className="text-sm text-gray-600 mb-3">
                        تعداد بیماران: 0
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      عضویت: {new Date(user.createdAt).toLocaleDateString('fa-IR')}
                    </div>
                  </div>
                </div>

                {/* ستون سوم: وضعیت فعال/غیرفعال */}
                <div className="flex items-center justify-center">
                  {user.email === 'admin@testology.me' ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      فعال
                    </Badge>
                  ) : (
                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs text-gray-500">
                        {user.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                      <div 
                        className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-200 ${
                          user.isActive ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                      >
                        <div 
                          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                            user.isActive ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* ستون چهارم: دکمه‌های عملیات */}
                <div className="flex items-center justify-center space-x-2">
                  {user.email !== 'admin@testology.me' && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditUser(user)}
                      title="ویرایش کاربر"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  {user.email !== 'admin@testology.me' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => handleDeleteUser(user.id)}
                      title="حذف کاربر"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {sortedUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              هیچ کاربری یافت نشد
            </div>
          )}
        </CardContent>
      </Card>

      {/* فرم افزودن کاربر */}
      {showAddUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4 bg-white shadow-xl">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>افزودن کاربر جدید</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddUser(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام و نام خانوادگی *
                </label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="نام و نام خانوادگی"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل *
                </label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تلفن
                </label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="09123456789"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نقش کاربر
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableRoles.map((role) => (
                    <option key={role.id} value={getRoleValue(role.name)}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddUser(false)}
                >
                  انصراف
                </Button>
                <Button
                  onClick={handleAddUser}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  افزودن کاربر
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* مودال ویرایش کاربر */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">ویرایش کاربر</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEditModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام
                </label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  placeholder="نام کاربر"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل
                </label>
                <Input
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  placeholder="ایمیل کاربر"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تلفن
                </label>
                <Input
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  placeholder="شماره تلفن"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نقش
                </label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableRoles.map((role) => (
                    <option key={role.id} value={getRoleValue(role.name)}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                انصراف
              </Button>
              <Button
                onClick={handleSaveUser}
                className="bg-blue-600 hover:bg-blue-700"
              >
                ذخیره تغییرات
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                نمایش {((currentPage - 1) * 10) + 1} تا {Math.min(currentPage * 10, totalUsers)} از {totalUsers} کاربر
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  قبلی
                </Button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  بعدی
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
