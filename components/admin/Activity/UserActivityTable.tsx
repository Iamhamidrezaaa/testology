'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'

type Activity = {
  id: string
  userId: string
  user: {
    name: string
    email: string
  }
  action: string
  metadata: any
  createdAt: string
  ip: string
}

type ActionType = 'all' | 'login' | 'view_test' | 'start_bundle' | 'complete_test'

export default function UserActivityTable({ data }: { data: Activity[] }) {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<ActionType>('all')

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.user.name.toLowerCase().includes(search.toLowerCase()) ||
      item.user.email.toLowerCase().includes(search.toLowerCase()) ||
      item.ip.includes(search)
    
    const matchesAction = actionFilter === 'all' || item.action === actionFilter

    return matchesSearch && matchesAction
  })

  const getActionBadge = (action: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      login: 'default',
      view_test: 'secondary',
      start_bundle: 'outline',
      complete_test: 'destructive'
    }

    const labels: Record<string, string> = {
      login: 'ورود به سیستم',
      view_test: 'مشاهده تست',
      start_bundle: 'شروع بسته تست',
      complete_test: 'تکمیل تست'
    }

    return (
      <Badge variant={variants[action] || 'outline'}>
        {labels[action] || action}
      </Badge>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="جستجو در نام، ایمیل یا IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={actionFilter} onValueChange={(value: ActionType) => setActionFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="نوع فعالیت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه فعالیت‌ها</SelectItem>
            <SelectItem value="login">ورود به سیستم</SelectItem>
            <SelectItem value="view_test">مشاهده تست</SelectItem>
            <SelectItem value="start_bundle">شروع بسته تست</SelectItem>
            <SelectItem value="complete_test">تکمیل تست</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right p-4 font-medium">کاربر</th>
              <th className="text-right p-4 font-medium">فعالیت</th>
              <th className="text-right p-4 font-medium">زمان</th>
              <th className="text-right p-4 font-medium">IP</th>
              <th className="text-right p-4 font-medium">جزئیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/50">
                <td className="p-4">
                  <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-sm text-muted-foreground">{item.user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  {getActionBadge(item.action)}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                    locale: faIR
                  })}
                </td>
                <td className="p-4 font-mono text-sm">{item.ip}</td>
                <td className="p-4">
                  <Button variant="ghost" size="sm">
                    مشاهده
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
} 