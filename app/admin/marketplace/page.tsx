'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Package, Plus, Edit, Trash2, DollarSign, Calendar, User, FileText, Headphones, BookOpen, Brain } from 'lucide-react'
import AddMarketplaceItem from '@/components/admin/AddMarketplaceItem'

interface MarketplaceItem {
  id: string
  title: string
  slug: string
  description: string
  price: number
  imageUrl?: string
  type: 'exercise' | 'meditation' | 'ebook' | 'audio' | 'worksheet'
  category: 'anxiety' | 'depression' | 'self-esteem' | 'stress' | 'focus' | 'general'
  fileUrl?: string
  duration?: number // مدت زمان به دقیقه
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  createdAt: string
  author: {
    id: string
    name?: string
    email?: string
  }
}

export default function MarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      // در اینجا باید API مناسب برای دریافت آیتم‌های مارکت‌پلیس فراخوانی شود
      // فعلاً داده‌های نمونه نمایش می‌دهیم
      const sampleItems: MarketplaceItem[] = [
        {
          id: '1',
          title: 'تمرین تنفسی برای کاهش اضطراب',
          slug: 'breathing-exercise-anxiety',
          description: 'تمرین تنفسی 5 دقیقه‌ای برای کاهش اضطراب و استرس',
          price: 0,
          type: 'exercise',
          category: 'anxiety',
          duration: 5,
          difficulty: 'beginner',
          createdAt: new Date().toISOString(),
          author: { id: '1', name: 'دکتر احمدی', email: 'ahmadi@example.com' }
        },
        {
          id: '2',
          title: 'مدیتیشن عزت نفس',
          slug: 'self-esteem-meditation',
          description: 'مدیتیشن 15 دقیقه‌ای برای تقویت عزت نفس',
          price: 50000,
          type: 'meditation',
          category: 'self-esteem',
          duration: 15,
          difficulty: 'intermediate',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          author: { id: '2', name: 'دکتر محمدی', email: 'mohammadi@example.com' }
        },
        {
          id: '3',
          title: 'کتابچه راهنمای مدیریت استرس',
          slug: 'stress-management-guide',
          description: 'راهنمای کامل مدیریت استرس در 30 روز',
          price: 100000,
          type: 'ebook',
          category: 'stress',
          difficulty: 'beginner',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          author: { id: '3', name: 'دکتر رضایی', email: 'rezaei@example.com' }
        }
      ]
      
      setItems(sampleItems)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching marketplace items:', error)
      setLoading(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <Brain className="h-4 w-4" />
      case 'meditation': return <Headphones className="h-4 w-4" />
      case 'ebook': return <BookOpen className="h-4 w-4" />
      case 'audio': return <Headphones className="h-4 w-4" />
      case 'worksheet': return <FileText className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exercise': return 'تمرین'
      case 'meditation': return 'مدیتیشن'
      case 'ebook': return 'کتاب الکترونیکی'
      case 'audio': return 'فایل صوتی'
      case 'worksheet': return 'ورقه تمرین'
      default: return 'نامشخص'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'anxiety': return 'اضطراب'
      case 'depression': return 'افسردگی'
      case 'self-esteem': return 'عزت نفس'
      case 'stress': return 'استرس'
      case 'focus': return 'تمرکز'
      case 'general': return 'عمومی'
      default: return 'نامشخص'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'مبتدی'
      case 'intermediate': return 'متوسط'
      case 'advanced': return 'پیشرفته'
      default: return 'نامشخص'
    }
  }

  const handleDelete = async (itemId: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این آیتم را حذف کنید؟')) {
      try {
        const response = await fetch(`/api/admin/marketplace/items/${itemId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          fetchItems()
        }
      } catch (error) {
        console.error('Error deleting item:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">مارکت‌پلیس</h1>
          <p className="text-gray-600">مدیریت آیتم‌های فروشگاه</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{showForm ? 'بستن فرم' : 'افزودن آیتم'}</span>
        </Button>
      </div>

      {/* فرم افزودن آیتم */}
      {showForm && (
        <AddMarketplaceItem />
      )}

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">📦 کل آیتم‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">💰 میانگین قیمت</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.length > 0 
                ? Math.round(items.reduce((sum, item) => sum + item.price, 0) / items.length).toLocaleString()
                : 0
              } تومان
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">💎 گران‌ترین آیتم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.length > 0 
                ? Math.max(...items.map(item => item.price)).toLocaleString()
                : 0
              } تومان
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">👥 نویسندگان</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(items.map(item => item.author.id)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* لیست آیتم‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">هنوز هیچ آیتمی در مارکت‌پلیس وجود ندارد</p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  اولین آیتم را اضافه کنید
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getTypeIcon(item.type)}
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{getTypeLabel(item.type)}</Badge>
                      <Badge variant="outline">{getCategoryLabel(item.category)}</Badge>
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {getDifficultyLabel(item.difficulty)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{item.slug}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-green-600 font-bold">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {item.price === 0 ? 'رایگان' : `${item.price.toLocaleString()} تومان`}
                      </span>
                    </div>
                    {item.duration && (
                      <div className="text-sm text-gray-500">
                        ⏱️ {item.duration} دقیقه
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{item.author.name || item.author.email}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</span>
                    </div>
                  </div>

                  {item.fileUrl && (
                    <div className="text-xs text-blue-600">
                      📎 فایل: {item.fileUrl}
                    </div>
                  )}

                  {item.imageUrl && (
                    <div className="text-xs text-gray-500">
                      🖼️ تصویر: {item.imageUrl}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
