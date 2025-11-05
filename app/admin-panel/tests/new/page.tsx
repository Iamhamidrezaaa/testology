import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TestForm from '@/components/admin/TestForm'

export default async function NewTestPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    redirect('/')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">ایجاد تست جدید</h1>
        <a
          href="/admin-panel/tests"
          className="text-blue-600 hover:text-blue-800"
        >
          بازگشت به لیست تست‌ها
        </a>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <TestForm />
      </div>
    </div>
  )
} 