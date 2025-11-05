'use client'

import { Button } from '@/components/ui/button'

interface SidebarProps {
  activeModule: string | null
  setActiveModule: (module: string) => void
}

const modules = [
  { key: 'dashboard', label: 'پیشخوان' },
  { key: 'tests', label: 'مدیریت تست‌ها' },
  { key: 'results', label: 'نتایج و تحلیل‌ها' },
  { key: 'users', label: 'کاربران' },
  { key: 'blog', label: 'مقالات' },
  { key: 'categories', label: 'دسته‌بندی‌ها' },
  { key: 'chatbot', label: 'چت‌بات روان‌شناس' },
  { key: 'pages', label: 'برگه‌ها' },
  { key: 'files', label: 'رسانه‌ها' },
  { key: 'comments', label: 'نظرات' },
  { key: 'insights', label: 'گزارش‌ها' },
  { key: 'settings', label: 'تنظیمات' },
  { key: 'backup', label: 'پشتیبان‌گیری' },
  { key: 'roles', label: 'نقش‌ها و دسترسی‌ها' },
  { key: 'tracker', label: 'پیگیری کاربران' },
]

export default function Sidebar({ activeModule, setActiveModule }: SidebarProps) {
  return (
    <aside className="w-64 border-l bg-gray-50 p-4 space-y-2 overflow-y-auto">
      <h2 className="font-bold text-xl mb-4">داشبورد مدیریت</h2>
      {modules.map((mod) => (
        <Button
          key={mod.key}
          variant={activeModule === mod.key ? 'default' : 'outline'}
          className="w-full justify-start"
          onClick={() => setActiveModule(mod.key)}
        >
          {mod.label}
        </Button>
      ))}
    </aside>
  )
} 