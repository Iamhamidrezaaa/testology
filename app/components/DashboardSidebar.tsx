import { ChartBarIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const menuItems = [
  {
    title: 'مسیر پیشرفت من',
    href: '/dashboard/growth-path',
    // آیکون‌ها را به‌صورت تابعی استفاده می‌کنیم تا از JSX در data structure اجتناب شود
    Icon: ChartBarIcon,
  },
  {
    title: '📈 مسیر رشد روانی',
    href: '/profile/progress',
    Icon: ChartBarIcon,
  },
  {
    title: '🧠 تست‌های پیشنهادی',
    href: '/dashboard/suggestions',
    Icon: ChartBarIcon,
  },
]

export default function DashboardSidebar() {
  return (
    <aside className="p-4 border rounded-md">
      <nav className="space-y-2">
        {menuItems.map(({ title, href, Icon }) => (
          <Link key={href} href={href} className="flex items-center gap-2">
            <Icon className="w-6 h-6" />
            <span>{title}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}