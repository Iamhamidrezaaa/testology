'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  BarChart2, 
  Brain, 
  TrendingUp, 
  AlertTriangle,
  Users,
  FileText,
  Bell,
  Headphones,
  Settings,
  Activity,
  CheckCircle,
  MessageSquare
} from 'lucide-react'

const menuItems = [
  { href: '/admin-panel', label: 'داشبورد اصلی', icon: LayoutDashboard },
  { href: '/admin-panel/stats', label: 'آمار و گزارش‌ها', icon: BarChart2 },
  { href: '/admin-panel/tests', label: 'مدیریت تست‌ها', icon: Brain },
  { href: '/admin-panel/growth', label: 'مسیر رشد کاربران', icon: TrendingUp },
  { href: '/admin-panel/alerts', label: 'هشدارهای روانی', icon: AlertTriangle },
  { href: '/admin-panel/users', label: 'کاربران', icon: Users },
  { href: '/admin-panel/blog', label: 'بلاگ', icon: FileText },
  { href: '/admin/insights', label: 'تحلیل‌های پیشرفته', icon: Activity },
  { href: '/admin/insights', label: 'تأیید محتوا', icon: CheckCircle },
  { href: '/admin/insights', label: 'واکنش کاربران', icon: MessageSquare },
  { href: '/admin-panel/notifications', label: 'اعلان‌ها', icon: Bell },
  { href: '/admin-panel/support', label: 'پشتیبانی', icon: Headphones },
  { href: '/admin-panel/settings', label: 'تنظیمات', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white border-l border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Testology</h1>
        <p className="text-sm text-gray-500">پنل مدیریت</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
} 