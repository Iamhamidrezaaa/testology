"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import AddTestModal from "./modals/AddTestModal"
import { Test } from "@/types"
import { Plus, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import QuestionsModal from "./modals/QuestionsModal"

export function TestModule() {
  const [tests, setTests] = useState<Test[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [testToDelete, setTestToDelete] = useState<Test | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [editTest, setEditTest] = useState<Test | null>(null)

  const fetchTests = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch("/api/admin/tests")
      if (!res.ok) {
        throw new Error("خطا در دریافت لیست تست‌ها")
      }
      const data = await res.json()
      setTests(data)
    } catch (err) {
      setError("خطا در دریافت لیست تست‌ها")
      console.error("Error fetching tests:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTests()
  }, [])

  const handleAddTest = async (test: { title: string; description: string; category: string }) => {
    try {
      const response = await fetch("/api/admin/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(test),
      })

      if (!response.ok) {
        throw new Error("Failed to add test")
      }

      const newTest = await response.json()
      setTests([...tests, newTest])
      setShowAddModal(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const handleEditTest = (test: Test) => {
    setEditTest(test)
  }

  const handleDeleteTest = async (test: Test) => {
    try {
      const res = await fetch(`/api/admin/tests/${test.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("خطا در حذف تست")
      }

      await fetchTests()
      setTestToDelete(null)
    } catch (err) {
      console.error("Error deleting test:", err)
      setError("خطا در حذف تست")
    }
  }

  const handleToggleStatus = async (test: Test) => {
    try {
      const res = await fetch(`/api/admin/tests/${test.id}/toggle`, {
        method: "PATCH",
      })

      if (!res.ok) {
        throw new Error("خطا در تغییر وضعیت تست")
      }

      await fetchTests()
    } catch (err) {
      console.error("Error toggling test status:", err)
      setError("خطا در تغییر وضعیت تست")
    }
  }

  const handleViewTest = (test: Test) => {
    setSelectedTest(test)
  }

  const filteredTests = tests.filter(
    (test) =>
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">مدیریت تست‌ها</h2>
          <p className="text-gray-500 mt-1">مدیریت و ویرایش تست‌های روان‌شناسی</p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="flex gap-2">
          <Plus size={16} />
          افزودن تست جدید
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <Input
          placeholder="جستجوی آزمون..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // نمایش اسکلتون در زمان لودینگ
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
            </Card>
          ))
        ) : (
          // نمایش کارت‌های تست
          filteredTests.map((test) => (
            <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{test.title}</CardTitle>
                  <Badge variant={test.isActive ? "default" : "secondary"}>
                    {test.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 line-clamp-2">{test.description}</p>

                <div className="flex flex-wrap gap-2">
                  {test.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>تعداد سوال: {test.questionCount}</span>
                  <span>اولویت: {test.priorityScore}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    آخرین به‌روزرسانی:{" "}
                    {formatDistanceToNow(new Date(test.updatedAt), {
                      addSuffix: true,
                      locale: faIR,
                    })}
                  </span>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewTest(test)}
                    title="مشاهده سوالات"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditTest(test)}
                    title="ویرایش تست"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTestToDelete(test)}
                    title="حذف تست"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleStatus(test)}
                    title={test.isActive ? "غیرفعال کردن" : "فعال کردن"}
                  >
                    {test.isActive ? (
                      <ToggleRight className="h-4 w-4" />
                    ) : (
                      <ToggleLeft className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddTestModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          fetchTests()
        }}
        onAdd={handleAddTest}
      />

      {selectedTest && (
        <QuestionsModal testId={selectedTest.id} onClose={() => setSelectedTest(null)} />
      )}

      <AlertDialog open={!!testToDelete} onOpenChange={() => setTestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف تست</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف تست "{testToDelete?.title}" اطمینان دارید؟ این عمل غیرقابل بازگشت است.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => testToDelete && handleDeleteTest(testToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 