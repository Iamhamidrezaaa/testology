'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function RoleManagementModule() {
  const [roles, setRoles] = useState<any[]>([])
  const [newRole, setNewRole] = useState('')

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    const res = await fetch('/api/admin/roles')
    const data = await res.json()
    setRoles(data)
  }

  const handleAddRole = async () => {
    if (!newRole.trim()) return
    const res = await fetch('/api/admin/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newRole.trim() })
    })
    if (res.ok) {
      setNewRole('')
      fetchRoles()
      toast.success('نقش با موفقیت اضافه شد')
    }
  }

  const handleDeleteRole = async (id: string) => {
    const res = await fetch(`/api/admin/roles/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchRoles()
      toast.success('نقش حذف شد')
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-semibold">مدیریت نقش‌ها</h2>

      <div className="flex items-center gap-2">
        <Input placeholder="نام نقش جدید" value={newRole} onChange={e => setNewRole(e.target.value)} />
        <Button onClick={handleAddRole}>افزودن</Button>
      </div>

      <div className="space-y-2">
        {roles.map(role => (
          <div key={role.id} className="flex items-center justify-between p-2 border rounded">
            <span>{role.name}</span>
            <Button size="icon" variant="ghost" onClick={() => handleDeleteRole(role.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
} 