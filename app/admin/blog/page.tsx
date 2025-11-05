'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, Eye, Edit, Trash2, Star, Calendar, User, TrendingUp, Settings, Pencil } from 'lucide-react';

// داده‌های نمونه مقالات
const sampleBlogs = [
  {
    id: "1",
    title: "چگونه اضطراب خود را مدیریت کنیم؟",
    slug: "anxiety-management-guide",
    metaDescription: "راهنمای جامع برای مدیریت اضطراب روزانه و تکنیک‌های عملی کاهش استرس",
    content: "محتوای کامل مقاله...",
    category: "anxiety",
    author: "دکتر سارا احمدی",
    imageUrl: "/images/blog/anxiety-management.jpg",
    tags: JSON.stringify(["اضطراب", "مدیریت استرس", "سلامت روان"]),
    published: true,
    featured: true,
    viewCount: 1250,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    id: "2", 
    title: "رازهای شخصیت‌شناسی با تست MBTI",
    slug: "mbti-personality-secrets",
    metaDescription: "آشنایی کامل با 16 تیپ شخصیتی MBTI و نحوه استفاده از آن در زندگی",
    content: "محتوای کامل مقاله...",
    category: "personality",
    author: "تیم تحریریه Testology",
    imageUrl: "/images/blog/mbti-guide.jpg",
    tags: JSON.stringify(["MBTI", "شخصیت‌شناسی", "تست روان‌شناسی"]),
    published: true,
    featured: false,
    viewCount: 890,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10")
  },
  {
    id: "3",
    title: "تکنیک‌های ذهن‌آگاهی برای زندگی بهتر",
    slug: "mindfulness-techniques",
    metaDescription: "آموزش گام‌به‌گام تکنیک‌های ذهن‌آگاهی و مدیتیشن برای کاهش استرس",
    content: "محتوای کامل مقاله...",
    category: "mindfulness",
    author: "دکتر محمد رضایی",
    imageUrl: "/images/blog/mindfulness.jpg",
    tags: JSON.stringify(["ذهن‌آگاهی", "مدیتیشن", "آرامش"]),
    published: false,
    featured: true,
    viewCount: 2100,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-08")
  }
];

// تعریف نوع Blog
interface Blog {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  content: string;
  category: string;
  author: string;
  imageUrl: string;
  tags: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // دریافت مقالات از API
  useEffect(() => {
    fetch('/api/admin/blog-public')
      .then(res => res.json())
      .then(data => {
        if (data && data.blogs && Array.isArray(data.blogs)) {
          setBlogs(data.blogs);
        } else {
          console.error('Invalid data format:', data);
          setBlogs([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching blogs:', err);
        setBlogs([]);
        setLoading(false);
      });
  }, []);

  // دسته‌بندی‌ها
  const categories = [
    { id: "all", name: "همه دسته‌ها" },
    { id: "anxiety", name: "اضطراب و افسردگی" },
    { id: "personality", name: "روان‌شناسی شخصیت" },
    { id: "mindfulness", name: "تمرکز و ذهن‌آگاهی" },
    { id: "relationships", name: "روابط و احساسات" },
    { id: "growth", name: "رشد فردی" }
  ];

  const deleteBlog = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) {
      return;
    }

    try {
      // در اینجا می‌توانید API واقعی را فراخوانی کنید
      setBlogs(blogs?.filter(blog => blog.id !== id) || []);
      alert('مقاله با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا در حذف مقاله:', error);
      alert('خطا در حذف مقاله');
    }
  };

  const filteredBlogs = blogs?.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.metaDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && blog.published) ||
                         (filterStatus === 'draft' && !blog.published);
    const matchesCategory = filterCategory === 'all' || blog.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  }) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">مدیریت مقالات بلاگ</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">مدیریت و ویرایش مقالات روان‌شناسی</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Plus size={20} />
            افزودن مقاله جدید
          </Link>
        </div>

        {/* فیلترها و جستجو */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                جستجو در مقالات
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="جستجو در عنوان یا محتوا..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وضعیت انتشار
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">همه مقالات</option>
                <option value="published">منتشر شده</option>
                <option value="draft">پیش‌نویس</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                دسته‌بندی
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{blogs?.length || 0}</div>
                <div className="text-blue-100">کل مقالات</div>
              </div>
              <div className="text-4xl opacity-20">📚</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{blogs?.filter(blog => blog.published).length || 0}</div>
                <div className="text-green-100">منتشر شده</div>
              </div>
              <div className="text-4xl opacity-20">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{blogs?.filter(blog => blog.featured).length || 0}</div>
                <div className="text-yellow-100">ویژه</div>
              </div>
              <div className="text-4xl opacity-20">⭐</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {blogs?.reduce((sum, blog) => sum + blog.viewCount, 0).toLocaleString() || 0}
                </div>
                <div className="text-purple-100">کل بازدید</div>
              </div>
              <div className="text-4xl opacity-20">👁️</div>
            </div>
          </div>
        </div>

        {/* لیست مقالات */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              مقالات ({filteredBlogs?.length || 0})
            </h3>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredBlogs?.map((blog) => (
              <div key={blog.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <div className="flex items-start gap-4">
                  {/* تصویر */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📖</span>
                    </div>
                  </div>

                  {/* محتوا */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                            {blog.title}
                          </h4>
                          {blog.featured && (
                            <Star size={16} className="text-yellow-500 fill-current" />
                          )}
                          {blog.published ? (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full">
                              منتشر شده
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full">
                              پیش‌نویس
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                          {blog.metaDescription}
                        </p>

                        {/* اطلاعات اضافی */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {blog.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(blog.createdAt).toLocaleDateString('fa-IR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {blog.viewCount.toLocaleString()} بازدید
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp size={14} />
                            {categories.find(c => c.id === blog.category)?.name}
                          </div>
                        </div>

                        {/* تگ‌ها */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          {(() => {
                            try {
                              const tags = typeof blog.tags === 'string' ? JSON.parse(blog.tags) : blog.tags;
                              return Array.isArray(tags) ? tags.slice(0, 3).map((tag: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs rounded-lg"
                                >
                                  #{tag}
                                </span>
                              )) : null;
                            } catch {
                              return null;
                            }
                          })()}
                        </div>
                      </div>

                      {/* دکمه‌های عملیات */}
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/blog/${blog.slug}`}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition"
                          title="مشاهده"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          href={`/admin/blog/edit/${blog.id}`}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition"
                          title="ویرایش"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => deleteBlog(blog.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition"
                          title="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {(filteredBlogs?.length || 0) === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              هیچ مقاله‌ای یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              سعی کنید فیلترها را تغییر دهید یا مقاله جدیدی اضافه کنید
            </p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={16} />
              افزودن مقاله جدید
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}