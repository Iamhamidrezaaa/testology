'use client'

import { useEffect, useState } from 'react'
import DataTable from '@/components/admin/modules/DataTable'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'

const SUPPORTED_LANGUAGES = [
  { code: 'fa', name: 'فارسی' },
  { code: 'en', name: 'انگلیسی' },
  { code: 'ar', name: 'عربی' }
]

export default function TranslationPage() {
  const [translations, setTranslations] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('fa')
  const [search, setSearch] = useState('')
  const [newTranslation, setNewTranslation] = useState({ key: '', value: '' })
  const [showAddDialog, setShowAddDialog] = useState(false)

  const fetchTranslations = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      queryParams.append('language', selectedLanguage)
      if (search) queryParams.append('search', search)

      const response = await fetch(`/api/admin/translations?${queryParams}`)
      if (!response.ok) throw new Error('خطا در دریافت ترجمه‌ها')
      
      const data = await response.json()
      setTranslations(data)
    } catch (error) {
      console.error('Error fetching translations:', error)
      toast.error('خطا در دریافت ترجمه‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTranslations()
  }, [selectedLanguage, search])

  const handleSave = async (key: string, value: string) => {
    try {
      const response = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, language: selectedLanguage })
      })

      if (!response.ok) throw new Error('خطا در ذخیره ترجمه')
      
      toast.success('ترجمه با موفقیت ذخیره شد')
      fetchTranslations()
    } catch (error) {
      console.error('Error saving translation:', error)
      toast.error('خطا در ذخیره ترجمه')
    }
  }

  const handleAdd = async () => {
    if (!newTranslation.key.trim() || !newTranslation.value.trim()) {
      toast.error('کلید و مقدار ترجمه الزامی هستند')
      return
    }

    try {
      const response = await fetch('/api/admin/translations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTranslation,
          language: selectedLanguage
        })
      })

      if (!response.ok) throw new Error('خطا در افزودن ترجمه')
      
      toast.success('ترجمه با موفقیت افزوده شد')
      setShowAddDialog(false)
      setNewTranslation({ key: '', value: '' })
      fetchTranslations()
    } catch (error) {
      console.error('Error adding translation:', error)
      toast.error('خطا در افزودن ترجمه')
    }
  }

  const columns = [
    {
      key: 'key',
      label: 'کلید',
      render: (value: string) => (
        <div className="font-mono text-sm">{value}</div>
      )
    },
    {
      key: 'value',
      label: 'مقدار',
      render: (value: string, row: any) => (
        <Input
          defaultValue={value}
          onBlur={(e) => handleSave(row.key, e.target.value)}
          className="font-medium"
        />
      )
    }
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">🌐 مدیریت ترجمه‌ها</h1>
        <div className="flex gap-4">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <Button onClick={() => setShowAddDialog(true)}>
            افزودن ترجمه جدید
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <DataTable
          columns={columns}
          data={translations}
          loading={loading}
          searchable
          onSearch={setSearch}
        />
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن ترجمه جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">کلید</label>
              <Input
                value={newTranslation.key}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                placeholder="مثال: welcome_message"
              />
            </div>
            <div>
              <label className="text-sm font-medium">مقدار</label>
              <Input
                value={newTranslation.value}
                onChange={(e) => setNewTranslation(prev => ({ ...prev, value: e.target.value }))}
                placeholder="مثال: به سایت خوش آمدید"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              انصراف
            </Button>
            <Button onClick={handleAdd}>
              افزودن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 