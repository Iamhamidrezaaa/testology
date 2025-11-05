import { useEffect, useState } from 'react'
import { Progress } from '../components/ui/progress'
import { Checkbox } from '../components/ui/checkbox'
import { Button } from '../components/ui/button'
import axios from 'axios'
import { useToast } from '../components/ui/use-toast'

interface FollowUpItem {
  id: string
  title: string
  description?: string
  done: boolean
  createdAt: string
}

export default function FollowUpTracker() {
  const { toast } = useToast()
  const [items, setItems] = useState<FollowUpItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/followup')
        setItems(res.data as any)
      } catch (error) {
        console.error('خطا در دریافت تمرین‌ها', error)
        toast({
          title: 'خطا',
          description: 'در دریافت تمرین‌ها مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await axios.patch('/api/followup', { 
        id,
        done: !currentStatus
      })
      
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, done: !currentStatus } : item
        )
      )

      toast({
        title: 'موفق',
        description: 'وضعیت تمرین با موفقیت بروزرسانی شد.',
      })
    } catch (error) {
      console.error('خطا در بروزرسانی وضعیت تمرین', error)
      toast({
        title: 'خطا',
        description: 'در بروزرسانی وضعیت تمرین مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
        variant: 'destructive'
      })
    }
  }

  const progress = Math.round(
    (items.filter(i => i.done).length / Math.max(items.length, 1)) * 100
  )

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">پیگیری تمرین‌ها و اقدامات پیشنهادی</h2>
        <span className="text-sm text-gray-500">{progress}% انجام شده</span>
      </div>

      <Progress value={progress} className="h-2 bg-gray-200" />

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="mr-2 text-sm text-gray-500">در حال بارگذاری...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">هیچ تمرینی ثبت نشده است.</p>
            <p className="text-xs text-gray-400 mt-1">پس از تکمیل تست‌های پیشنهادی، تمرین‌های مرتبط اینجا نمایش داده می‌شوند.</p>
          </div>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              className={`p-4 rounded-lg border flex items-start justify-between transition-colors ${
                item.done ? 'bg-green-50 border-green-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                {item.description && (
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </div>
              <Checkbox
                checked={item.done}
                onCheckedChange={() => handleToggle(item.id, item.done)}
                className="mt-2 mr-4"
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
} 