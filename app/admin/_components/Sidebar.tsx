'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'

const links = [
  { 
    href: '/admin/dashboard', 
    label: 'داشبورد', 
    icon: '📊',
    description: 'آمار کلی سیستم'
  },
  { 
    href: '/admin/users', 
    label: 'کاربران', 
    icon: '👥',
    description: 'مدیریت کاربران'
  },
  { 
    href: '/admin/tests', 
    label: 'تست‌ها', 
    icon: '🧪',
    description: 'مدیریت تست‌ها'
  },
  { 
    href: '/admin/reports', 
    label: 'گزارش‌ها', 
    icon: '📈',
    description: 'گزارش‌های آماری'
  },
  { 
    href: '/admin/settings', 
    label: 'تنظیمات', 
    icon: '⚙️',
    description: 'تنظیمات سیستم'
  },
  { 
    href: '/admin/roles', 
    label: 'نقش‌ها', 
    icon: '🔐',
    description: 'مدیریت نقش‌ها'
  },
  { 
    href: '/admin/blog', 
    label: 'مقالات', 
    icon: '📝',
    description: 'مدیریت محتوا'
  },
  { 
    href: '/admin/analytics', 
    label: 'آمار و تحلیل', 
    icon: '📊',
    description: 'گزارش‌های پیشرفته'
  },
  { 
    href: '/admin/notifications', 
    label: 'نوتیفیکیشن‌ها', 
    icon: '🔔',
    description: 'ارسال پیام‌ها'
  },
  { 
    href: '/admin/marketplace', 
    label: 'مارکت‌پلیس', 
    icon: '🛒',
    description: 'فروشگاه محتوا'
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white h-full border-r border-gray-200 flex flex-col">
      {/* لوگو */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">🧠</div>
          <div>
            <div className="text-xl font-bold text-gray-800">Testology</div>
            <div className="text-sm text-gray-500">پنل مدیریت</div>
          </div>
        </div>
      </div>

      {/* منوی ناوبری */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`block p-3 rounded-lg transition-colors ${
              pathname === link.href 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-lg">{link.icon}</span>
              <div>
                <div className="font-medium">{link.label}</div>
                <div className="text-xs text-gray-500">{link.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </nav>

      {/* اطلاعات سیستم */}
      <div className="p-4 border-t border-gray-200">
        <Card>
          <CardContent className="p-3">
            <div className="text-sm text-gray-600">
              <div className="flex justify-between">
                <span>وضعیت:</span>
                <span className="text-green-600">🟢 آنلاین</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>نسخه:</span>
                <span className="text-blue-600">v1.0.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}
