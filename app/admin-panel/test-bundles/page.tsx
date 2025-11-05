'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TestBundleCard } from '@/components/admin/modules/TestBundleCard'
import { AddBundleModal } from '@/components/admin/modules/AddBundleModal'
import { EditBundleModal } from '@/components/admin/modules/EditBundleModal'
import { toast } from 'react-hot-toast'

interface Test {
  id: string
  title: string
  description: string
}

interface TestBundleTest {
  id: string
  testId: string
  order: number
  test: Test
}

interface TestBundle {
  id: string
  name: string
  description: string
  isActive: boolean
  tests: TestBundleTest[]
}

interface EditModalState {
  open: boolean
  bundle: TestBundle | null
}

export default function TestBundlesPage() {
  const [bundles, setBundles] = useState<TestBundle[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editModal, setEditModal] = useState<EditModalState>({
    open: false,
    bundle: null
  })
  const [loading, setLoading] = useState(true)

  const fetchBundles = async () => {
    try {
      const response = await fetch('/api/admin/test-bundles')
      if (!response.ok) throw new Error('خطا در دریافت باندل‌ها')
      const data = await response.json()
      setBundles(data)
    } catch (error) {
      console.error('Error fetching bundles:', error)
      toast.error('خطا در دریافت باندل‌ها')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateBundle = async (updated: TestBundle) => {
    try {
      const response = await fetch(`/api/admin/test-bundles/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      })

      if (!response.ok) throw new Error('خطا در بروزرسانی باندل')

      toast.success('باندل با موفقیت بروزرسانی شد')
      fetchBundles()
    } catch (error) {
      console.error('Error updating bundle:', error)
      toast.error('خطا در بروزرسانی باندل')
      throw error
    }
  }

  useEffect(() => {
    fetchBundles()
  }, [])

  if (loading) {
    return <div className="p-6">در حال بارگذاری...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت آزمون‌های ترکیبی</h1>
        <Button onClick={() => setShowAddModal(true)}>افزودن باندل جدید</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {bundles.map((bundle) => (
          <TestBundleCard 
            key={bundle.id} 
            bundle={bundle} 
            refresh={fetchBundles}
            onEdit={() => setEditModal({ open: true, bundle })}
          />
        ))}
      </div>

      <AddBundleModal 
        open={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={fetchBundles} 
      />

      {editModal.open && (
        <EditBundleModal
          open={editModal.open}
          bundle={editModal.bundle}
          onClose={() => setEditModal({ open: false, bundle: null })}
          onSave={handleUpdateBundle}
        />
      )}
    </div>
  )
} 