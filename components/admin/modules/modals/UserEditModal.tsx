'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { User } from '@/types'

interface UserEditModalProps {
  user: User | null
  onClose: () => void
  onSave: () => void
}

export function UserEditModal({ user, onClose, onSave }: UserEditModalProps) {
  const [form, setForm] = useState<Partial<User>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        throw new Error('خطا در ویرایش اطلاعات کاربر')
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error updating user:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ویرایش اطلاعات کاربر</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="نام"
          />
          <Input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="نام خانوادگی"
          />
          <Input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="شماره موبایل"
          />
          <Input
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="کشور"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-2"
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 