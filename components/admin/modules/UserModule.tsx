'use client'

import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Eye, Search, Mail, Phone, MapPin, Calendar, TestTube } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import UserDetailsModal from './modals/UserDetailsModal'
import UserTestsModal from './modals/UserTestsModal'
import { User, Role } from '@/types'
import { formatDate } from '@/lib/utils'

export function UserModule() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
    fetchRoles()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/admin/users')
      if (!res.ok) throw new Error('خطا در دریافت کاربران')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('خطا در دریافت کاربران')
    } finally {
      setLoading(false)
    }
  }

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/admin/roles')
      if (!res.ok) throw new Error('خطا در دریافت نقش‌ها')
      const data = await res.json()
      setRoles(data)
    } catch (err) {
      console.error('Error fetching roles:', err)
    }
  }

  const handleRoleChange = async (userId: string, roleId: string) => {
    await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId })
    })
    fetchUsers()
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.firstName?.toLowerCase().includes(searchLower) ||
      user.lastName?.toLowerCase().includes(searchLower) ||
      (user.phoneNumber && user.phoneNumber.includes(searchQuery)) ||
      user.email.toLowerCase().includes(searchLower)
    )
  })

  const getGenderText = (gender: string | null) => {
    switch (gender) {
      case 'male': return 'مرد'
      case 'female': return 'زن'
      default: return 'نامشخص'
    }
  }

  const getRoleText = (role: string) => {
    switch (role) {
      case 'admin': return 'مدیر'
      case 'therapist': return 'درمانگر'
      default: return 'کاربر'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500'
      case 'therapist': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <p>در حال بارگذاری...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="جستجو بر اساس نام، شماره تماس یا ایمیل..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.firstName} {user.lastName}
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelectedUser(user)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                {user.phoneNumber && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">شماره تماس:</span> {user.phoneNumber}
                  </div>
                )}
                <p className="text-muted-foreground">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">
                    {user.testCount} تست
                  </Badge>
                  {user.lastTestDate && (
                    <Badge variant="outline">
                      آخرین تست: {formatDate(user.lastTestDate)}
                    </Badge>
                  )}
                </div>
                <div className="mt-2">
                  <label className="block text-xs mb-1">نقش کاربر:</label>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={user.roleId || ''}
                    onChange={e => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="">بدون نقش</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>{role.name}</option>
                    ))}
                  </select>
                </div>
                {user.psychologicalScores && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-muted-foreground">نمرات روان‌شناختی:</p>
                    <div className="flex gap-2">
                      {user.psychologicalScores.stress !== null && (
                        <Badge variant="secondary">
                          استرس: {user.psychologicalScores.stress}
                        </Badge>
                      )}
                      {user.psychologicalScores.anxiety !== null && (
                        <Badge variant="secondary">
                          اضطراب: {user.psychologicalScores.anxiety}
                        </Badge>
                      )}
                      {user.psychologicalScores.depression !== null && (
                        <Badge variant="secondary">
                          افسردگی: {user.psychologicalScores.depression}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedUser && (
        <UserTestsModal
          userId={selectedUser.id}
          fullName={`${selectedUser.firstName} ${selectedUser.lastName}`}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
} 