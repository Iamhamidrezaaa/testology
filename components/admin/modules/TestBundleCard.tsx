'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"

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

interface TestBundleCardProps {
  bundle: TestBundle
  refresh: () => void
  onEdit: () => void
}

export function TestBundleCard({ bundle, refresh, onEdit }: TestBundleCardProps) {
  const handleDelete = async () => {
    if (!confirm('آیا از حذف این باندل اطمینان دارید؟')) return

    try {
      const response = await fetch(`/api/admin/test-bundles/${bundle.id}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('خطا در حذف باندل')
      
      toast.success('باندل با موفقیت حذف شد')
      refresh()
    } catch (error) {
      console.error('Error deleting bundle:', error)
      toast.error('خطا در حذف باندل')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {bundle.name}
            {!bundle.isActive && (
              <span className="text-xs text-muted-foreground">(غیرفعال)</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{bundle.description}</p>
        <div className="space-y-2">
          <h3 className="text-sm font-medium">تست‌های موجود:</h3>
          <ul className="text-sm space-y-1">
            {bundle.tests.map((testBundle) => (
              <li key={testBundle.id} className="flex items-center gap-2">
                <span className="text-muted-foreground">{testBundle.order + 1}.</span>
                {testBundle.test.title}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 