'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2, FileImage, FileText, FileArchive, File } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { faIR } from 'date-fns/locale'

interface MediaFile {
  id: string
  fileName: string
  fileType: string
  fileUrl: string
  uploadedAt: string
  uploadedBy: string | null
  user?: {
    id: string
    name: string | null
    email: string
  }
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [formData, setFormData] = useState({
    fileName: '',
    fileUrl: '',
    fileType: 'image/png'
  })

  const fetchFiles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/media')
      if (!res.ok) throw new Error('خطا در دریافت فایل‌ها')
      const data = await res.json()
      setFiles(data)
    } catch (error) {
      toast.error('خطا در دریافت فایل‌ها')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const handleUpload = async () => {
    try {
      setUploading(true)
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('خطا در آپلود فایل')
      
      toast.success('فایل با موفقیت آپلود شد')
      setShowUploadDialog(false)
      setFormData({ fileName: '', fileUrl: '', fileType: 'image/png' })
      fetchFiles()
    } catch (error) {
      toast.error('خطا در آپلود فایل')
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این فایل اطمینان دارید؟')) return

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('خطا در حذف فایل')
      
      toast.success('فایل با موفقیت حذف شد')
      fetchFiles()
    } catch (error) {
      toast.error('خطا در حذف فایل')
      console.error(error)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="w-8 h-8 text-blue-500" />
    if (fileType === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />
    if (fileType === 'application/zip') return <FileArchive className="w-8 h-8 text-yellow-500" />
    return <File className="w-8 h-8 text-gray-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">کتابخانه رسانه‌ها</h2>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Plus className="w-4 h-4 ml-2" />
          افزودن فایل جدید
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          هنوز فایلی آپلود نشده است
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {files.map(file => (
            <div key={file.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="relative aspect-square mb-2">
                {file.fileType.startsWith('image/') ? (
                  <Image
                    src={file.fileUrl}
                    alt={file.fileName}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getFileIcon(file.fileType)}
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 bg-white/80 hover:bg-white"
                  onClick={() => handleDelete(file.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium truncate" title={file.fileName}>
                  {file.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(file.uploadedAt), { addSuffix: true, locale: faIR })}
                </p>
                {file.user && (
                  <p className="text-xs text-muted-foreground truncate" title={file.user.email}>
                    {file.user.name || file.user.email}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن فایل جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fileName">نام فایل</Label>
              <Input
                id="fileName"
                value={formData.fileName}
                onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                placeholder="نام فایل را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileUrl">آدرس فایل</Label>
              <Input
                id="fileUrl"
                value={formData.fileUrl}
                onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                placeholder="آدرس فایل را وارد کنید"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fileType">نوع فایل</Label>
              <Select
                value={formData.fileType}
                onValueChange={(value) => setFormData({ ...formData, fileType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="نوع فایل را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image/png">تصویر PNG</SelectItem>
                  <SelectItem value="image/jpeg">تصویر JPEG</SelectItem>
                  <SelectItem value="application/pdf">فایل PDF</SelectItem>
                  <SelectItem value="application/zip">فایل ZIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowUploadDialog(false)} disabled={uploading}>
                انصراف
              </Button>
              <Button onClick={handleUpload} disabled={uploading || !formData.fileName || !formData.fileUrl}>
                {uploading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
                آپلود فایل
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 