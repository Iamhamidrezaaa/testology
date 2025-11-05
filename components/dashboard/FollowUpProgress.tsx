import { useEffect, useState } from 'react'
import axios from 'axios'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, ClipboardList, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface FollowUpItem {
  id: string
  title: string
  description?: string
  type: 'test' | 'exercise'
  done: boolean
  createdAt: string
}

export default function FollowUpProgress() {
  const { toast } = useToast()
  const [items, setItems] = useState<FollowUpItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/followup')
        setItems(res.data as any)
      } catch (error) {
        console.error('خطا در دریافت پیگیری‌ها:', error)
        toast({
          title: 'خطا',
          description: 'در دریافت پیگیری‌ها مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.',
          variant: 'destructive'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  const completed = items.filter((item) => item.done).length
  const total = items.length
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          پیگیری‌های شما
        </h2>
        <span className="text-sm text-muted-foreground">
          {progress}% انجام شده
        </span>
      </div>

      <Progress value={progress} className="mb-6" />

      {loading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="mr-2 text-sm text-muted-foreground">در حال بارگذاری...</span>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-muted-foreground">هیچ پیگیری‌ای ثبت نشده است.</p>
          <p className="text-xs text-gray-400 mt-1">پس از تکمیل تست‌ها و تمرین‌ها، آن‌ها اینجا نمایش داده می‌شوند.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                item.done ? 'bg-green-50 text-green-800' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {item.done ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <span className="w-5 h-5 border border-gray-400 rounded-full mt-0.5" />
              )}
              <div className="flex-1">
                <span className="font-medium">{item.title}</span>
                {item.description && (
                  <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-muted-foreground">
                    {item.type === 'test' ? 'تست' : 'تمرین'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(item.createdAt).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 