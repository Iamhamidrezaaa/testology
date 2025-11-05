import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowRight, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center" dir="rtl">
      <div className="text-center max-w-md mx-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-500 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            صفحه یافت نشد
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            متأسفانه صفحه‌ای که دنبال آن هستید وجود ندارد یا حذف شده است.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full" size="lg">
              <Home className="w-5 h-5 ml-2" />
              بازگشت به خانه
            </Button>
          </Link>
          
          <Link href="/dashboard">
            <Button variant="outline" className="w-full" size="lg">
              <ArrowRight className="w-5 h-5 ml-2" />
              داشبورد
            </Button>
          </Link>

          <Link href="/tests">
            <Button variant="outline" className="w-full" size="lg">
              <Search className="w-5 h-5 ml-2" />
              تست‌ها
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>اگر فکر می‌کنید این خطا است، لطفاً با پشتیبانی تماس بگیرید.</p>
        </div>
      </div>
    </div>
  )
}





