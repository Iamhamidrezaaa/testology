import { useState, useEffect } from 'react'
import { Bell, Clock, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from '@/components/ui/use-toast'
import { formatJalaliDate, isOverdue } from '@/utils/date'
import { getReminders, updateReminderStatus } from '@/lib/api'
import type { Reminder } from '@/types/dashboard'

export default function ReminderPanel() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      setLoading(true)
      const data = await getReminders()
      setReminders(data)
    } catch (error) {
      console.error('Failed to load reminders:', error)
      toast({
        title: 'خطا در دریافت یادآوری‌ها',
        description: 'لطفاً صفحه را رفرش کنید یا بعداً تلاش کنید.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (id: string) => {
    try {
      setUpdating(id)
      await updateReminderStatus(id, 'completed')
      setReminders(prev => prev.map(reminder => 
        reminder.id === id ? { ...reminder, progress: 100 } : reminder
      ))
      toast({
        title: 'یادآوری تکمیل شد',
        description: 'وضعیت با موفقیت به‌روز شد.',
      })
    } catch (error) {
      console.error('Failed to update reminder:', error)
      toast({
        title: 'خطا در به‌روزرسانی',
        description: 'لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleSnooze = async (id: string) => {
    try {
      setUpdating(id)
      await updateReminderStatus(id, 'snoozed')
      toast({
        title: 'یادآوری به تعویق افتاد',
        description: 'یادآوری برای ۲۴ ساعت بعد تنظیم شد.',
      })
    } catch (error) {
      console.error('Failed to snooze reminder:', error)
      toast({
        title: 'خطا در به تعویق انداختن',
        description: 'لطفاً دوباره تلاش کنید.',
        variant: 'destructive',
      })
    } finally {
      setUpdating(null)
    }
  }

  const renderIcon = (reminder: Reminder) => {
    const iconProps = { className: "w-5 h-5 mt-1" }
    
    if (reminder.progress === 100) {
      return <CheckCircle2 {...iconProps} className="text-green-500" />
    }
    
    if (isOverdue(reminder.dueDate)) {
      return <AlertCircle {...iconProps} className="text-red-500" />
    }
    
    return <Bell {...iconProps} className="text-yellow-500" />
  }

  const renderBadge = (reminder: Reminder) => {
    if (reminder.progress === 100) {
      return <Badge variant="default">تکمیل شده</Badge>
    }
    
    if (isOverdue(reminder.dueDate)) {
      return <Badge variant="destructive">تأخیر</Badge>
    }
    
    return <Badge variant="secondary">در انتظار</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">یادآوری‌ها</h3>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2 bg-gray-200 rounded w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">یادآوری‌ها</h3>
        <Button variant="ghost" size="sm" onClick={fetchReminders}>
          به‌روزرسانی
        </Button>
      </div>

      {reminders.length === 0 ? (
        <Card>
          <CardContent className="p-4 text-center text-gray-500">
            یادآوری فعالی وجود ندارد.
          </CardContent>
        </Card>
      ) : (
        reminders.map((reminder) => (
          <Card key={reminder.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {renderIcon(reminder)}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-800">
                      {reminder.title}
                    </div>
                    {renderBadge(reminder)}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {reminder.description}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>مهلت: {formatJalaliDate(reminder.dueDate)}</span>
                  </div>
                  
                  <Progress 
                    value={reminder.progress} 
                    className={`h-2 bg-gray-100 ${
                      reminder.progress === 100 
                        ? '[&>div]:bg-green-500' 
                        : isOverdue(reminder.dueDate)
                        ? '[&>div]:bg-red-500'
                        : '[&>div]:bg-yellow-500'
                    }`}
                  />
                  
                  {reminder.progress < 100 && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleComplete(reminder.id)}
                        disabled={updating === reminder.id}
                      >
                        تکمیل شد
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSnooze(reminder.id)}
                        disabled={updating === reminder.id}
                      >
                        به تعویق بینداز
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
} 