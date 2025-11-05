'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Edit, Trash2, Shield, Users, Settings, BarChart3 } from 'lucide-react'

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
  isDefault: boolean
  createdAt: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: string
}

const availablePermissions: Permission[] = [
  { id: 'users.view', name: 'مشاهده کاربران', description: 'مشاهده لیست کاربران', category: 'کاربران' },
  { id: 'users.edit', name: 'ویرایش کاربران', description: 'ویرایش اطلاعات کاربران', category: 'کاربران' },
  { id: 'users.delete', name: 'حذف کاربران', description: 'حذف کاربران', category: 'کاربران' },
  { id: 'tests.view', name: 'مشاهده تست‌ها', description: 'مشاهده لیست تست‌ها', category: 'تست‌ها' },
  { id: 'tests.edit', name: 'ویرایش تست‌ها', description: 'ویرایش تست‌ها', category: 'تست‌ها' },
  { id: 'tests.create', name: 'ایجاد تست', description: 'ایجاد تست جدید', category: 'تست‌ها' },
  { id: 'tests.delete', name: 'حذف تست‌ها', description: 'حذف تست‌ها', category: 'تست‌ها' },
  { id: 'blog.view', name: 'مشاهده مقالات', description: 'مشاهده لیست مقالات بلاگ', category: 'مقالات' },
  { id: 'blog.edit', name: 'ویرایش مقالات', description: 'ویرایش مقالات بلاگ', category: 'مقالات' },
  { id: 'blog.create', name: 'ایجاد مقاله', description: 'ایجاد مقاله جدید', category: 'مقالات' },
  { id: 'blog.delete', name: 'حذف مقالات', description: 'حذف مقالات بلاگ', category: 'مقالات' },
  { id: 'reports.view', name: 'مشاهده گزارش‌ها', description: 'مشاهده گزارش‌های آماری', category: 'گزارش‌ها' },
  { id: 'settings.edit', name: 'ویرایش تنظیمات', description: 'ویرایش تنظیمات سیستم', category: 'تنظیمات' },
  { id: 'roles.manage', name: 'مدیریت نقش‌ها', description: 'مدیریت نقش‌ها و مجوزها', category: 'نقش‌ها' }
]

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  useEffect(() => {
    fetch('/api/admin/roles-public')
      .then(res => res.json())
      .then(data => {
        // اطمینان از اینکه roles یک آرایه است
        if (data && Array.isArray(data.roles)) {
          setRoles(data.roles)
        } else {
          console.error('Invalid data format:', data)
          setRoles([])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching roles:', err)
        setRoles([])
        setLoading(false)
      })
  }, [])

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      })

      if (response.ok) {
        const newRole = await response.json()
        setRoles([...roles, newRole.role])
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  const handleUpdateRole = async (roleId: string, roleData: Partial<Role>) => {
    try {
      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      })

      if (response.ok) {
        const updatedRole = await response.json()
        setRoles(roles.map(role => role.id === roleId ? updatedRole.role : role))
        setEditingRole(null)
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این نقش را حذف کنید؟')) {
      try {
        const response = await fetch(`/api/admin/roles/${roleId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          setRoles(roles.filter(role => role.id !== roleId))
        }
      } catch (error) {
        console.error('Error deleting role:', error)
      }
    }
  }

  const getPermissionIcon = (permission: string) => {
    if (permission.includes('users')) return <Users className="h-4 w-4" />
    if (permission.includes('tests')) return <Shield className="h-4 w-4" />
    if (permission.includes('reports')) return <BarChart3 className="h-4 w-4" />
    if (permission.includes('settings')) return <Settings className="h-4 w-4" />
    return <Shield className="h-4 w-4" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مدیریت نقش‌ها</h1>
          <p className="text-gray-600">مدیریت نقش‌ها و مجوزهای دسترسی</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          نقش جدید
        </Button>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🔐 کل نقش‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">👥 کاربران با نقش</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles?.reduce((sum, role) => sum + role.userCount, 0) || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">🛡️ مجوزهای موجود</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availablePermissions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* لیست نقش‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles?.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {role.isDefault && (
                    <Badge variant="default">پیش‌فرض</Badge>
                  )}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingRole(role)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!role.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRole(role.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">تعداد کاربران:</span>
                  <span className="font-medium">{role.userCount}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">تعداد مجوزها:</span>
                  <span className="font-medium">{role.permissions.length}</span>
                </div>

                <div>
                  <span className="text-sm text-gray-600 block mb-2">مجوزها:</span>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} بیشتر
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-gray-500">
                  ایجاد شده: {new Date(role.createdAt).toLocaleDateString('fa-IR')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* فرم ایجاد نقش */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>ایجاد نقش جدید</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateRoleForm
              onSave={handleCreateRole}
              onCancel={() => setShowCreateForm(false)}
              availablePermissions={availablePermissions}
            />
          </CardContent>
        </Card>
      )}

      {/* فرم ویرایش نقش */}
      {editingRole && (
        <Card>
          <CardHeader>
            <CardTitle>ویرایش نقش: {editingRole.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <EditRoleForm
              role={editingRole}
              onSave={(roleData) => handleUpdateRole(editingRole.id, roleData)}
              onCancel={() => setEditingRole(null)}
              availablePermissions={availablePermissions}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// کامپوننت فرم ایجاد نقش
function CreateRoleForm({ onSave, onCancel, availablePermissions }: {
  onSave: (roleData: Partial<Role>) => void
  onCancel: () => void
  availablePermissions: Permission[]
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">نام نقش</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="نام نقش"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">توضیحات</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="توضیحات نقش"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">مجوزها</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {availablePermissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
                className="rounded"
              />
              <label htmlFor={permission.id} className="text-sm">
                {permission.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          لغو
        </Button>
        <Button type="submit">
          ایجاد نقش
        </Button>
      </div>
    </form>
  )
}

// کامپوننت فرم ویرایش نقش
function EditRoleForm({ role, onSave, onCancel, availablePermissions }: {
  role: Role
  onSave: (roleData: Partial<Role>) => void
  onCancel: () => void
  availablePermissions: Permission[]
}) {
  const [formData, setFormData] = useState({
    name: role.name,
    description: role.description,
    permissions: role.permissions
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">نام نقش</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="نام نقش"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">توضیحات</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="توضیحات نقش"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">مجوزها</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {availablePermissions.map((permission) => (
            <div key={permission.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={permission.id}
                checked={formData.permissions.includes(permission.id)}
                onChange={() => togglePermission(permission.id)}
                className="rounded"
              />
              <label htmlFor={permission.id} className="text-sm">
                {permission.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          لغو
        </Button>
        <Button type="submit">
          ذخیره تغییرات
        </Button>
      </div>
    </form>
  )
}

















