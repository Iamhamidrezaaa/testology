'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Plus, Package, DollarSign } from 'lucide-react'

export default function AddMarketplaceItem() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [type, setType] = useState('exercise')
  const [category, setCategory] = useState('anxiety')
  const [difficulty, setDifficulty] = useState('beginner')
  const [duration, setDuration] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    setSlug(generateSlug(value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/admin/marketplace/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          slug, 
          description, 
          price: parseFloat(price),
          imageUrl,
          type,
          category,
          difficulty,
          duration: duration ? parseInt(duration) : undefined,
          fileUrl
        })
      })

      if (response.ok) {
        alert('آیتم با موفقیت اضافه شد')
        setTitle('')
        setSlug('')
        setDescription('')
        setPrice('')
        setImageUrl('')
        setType('exercise')
        setCategory('anxiety')
        setDifficulty('beginner')
        setDuration('')
        setFileUrl('')
      } else {
        alert('خطا در افزودن آیتم')
      }
    } catch (error) {
      console.error('Error adding marketplace item:', error)
      alert('خطا در افزودن آیتم')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>افزودن آیتم مارکت‌پلیس</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان آیتم</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="عنوان آیتم"
              required
            />
          </div>

          <div>
            <Label htmlFor="slug">اسلاگ</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="slug-url"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              اسلاگ به صورت خودکار از عنوان تولید می‌شود
            </p>
          </div>

          <div>
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="توضیحات کامل آیتم"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="type">نوع محتوا</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="exercise">تمرین</option>
                <option value="meditation">مدیتیشن</option>
                <option value="ebook">کتاب الکترونیکی</option>
                <option value="audio">فایل صوتی</option>
                <option value="worksheet">ورقه تمرین</option>
              </select>
            </div>

            <div>
              <Label htmlFor="category">دسته‌بندی</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="anxiety">اضطراب</option>
                <option value="depression">افسردگی</option>
                <option value="self-esteem">عزت نفس</option>
                <option value="stress">استرس</option>
                <option value="focus">تمرکز</option>
                <option value="general">عمومی</option>
              </select>
            </div>

            <div>
              <Label htmlFor="difficulty">سطح دشواری</Label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="beginner">مبتدی</option>
                <option value="intermediate">متوسط</option>
                <option value="advanced">پیشرفته</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">قیمت (تومان)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">مدت زمان (دقیقه)</Label>
              <Input
                id="duration"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="5"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">آدرس تصویر</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="fileUrl">آدرس فایل</Label>
            <Input
              id="fileUrl"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://example.com/file.pdf"
            />
            <p className="text-xs text-gray-500 mt-1">
              آدرس فایل اصلی (PDF، MP3، MP4 و غیره)
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="submit" disabled={loading} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>{loading ? 'در حال افزودن...' : 'افزودن آیتم'}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
