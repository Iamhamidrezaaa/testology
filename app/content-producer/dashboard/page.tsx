"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PenTool, 
  FileText, 
  Users, 
  BarChart3, 
  Plus, 
  Edit, 
  Eye,
  Search,
  Filter,
  Star,
  Calendar,
  User,
  TrendingUp,
  BookOpen
} from "lucide-react";

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

export default function ContentProducerDashboard() {
  const router = useRouter();
  const [role, setRole] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    const r = localStorage.getItem("testology_role");
    if (!r) router.push("/login");
    if (r !== "content_producer" && r !== "admin") {
      router.push("/dashboard");
    }
    setRole(r || "");
    
    fetchBlogs();
  }, [router]);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/blog-public');
      const data = await res.json();
      if (data && Array.isArray(data.blogs)) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) {
      return;
    }

    try {
      setBlogs(blogs?.filter(blog => blog.id !== id) || []);
      alert('مقاله با موفقیت حذف شد');
    } catch (error) {
      console.error('خطا در حذف مقاله:', error);
      alert('خطا در حذف مقاله');
    }
  };

  const categories = [
    { id: "all", name: "همه دسته‌ها" },
    { id: "anxiety", name: "اضطراب و افسردگی" },
    { id: "personality", name: "روان‌شناسی شخصیت" },
    { id: "mindfulness", name: "تمرکز و ذهن‌آگاهی" },
    { id: "relationships", name: "روابط و احساسات" },
    { id: "growth", name: "رشد فردی" }
  ];

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
      <div className="flex">
        {/* سایدبار */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              پنل تولیدکننده محتوا
            </h2>
            
            <nav className="space-y-2">
              <Link
                href="/content-producer/dashboard"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <span className="text-xl">✍️</span>
                داشبورد
              </Link>
              
              <Link
                href="/admin/blog"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <span className="text-xl">📝</span>
                مدیریت مقالات
              </Link>
              
              <Link
                href="/admin/media"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <span className="text-xl">📁</span>
                کتابخانه رسانه
              </Link>
              
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
              >
                <span className="text-xl">📈</span>
                آمار و تحلیل
              </Link>
            </nav>
          </div>
        </div>
        
        {/* محتوای اصلی */}
        <div className="flex-1 p-6">
          <div className="container mx-auto px-4 py-8">
        {/* هدر */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <PenTool className="w-8 h-8 text-green-600" />
              داشبورد تولیدکننده محتوا
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">مدیریت و تولید محتوای روان‌شناسی</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/blog/new"
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} />
              افزودن مقاله جدید
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("testology_role");
                localStorage.removeItem("testology_email");
                router.push("/login");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              خروج
            </button>
          </div>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{blogs?.length || 0}</div>
                <div className="text-green-100">کل مقالات</div>
              </div>
              <div className="text-4xl opacity-20">📝</div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">{blogs?.filter(blog => blog.published).length || 0}</div>
                <div className="text-blue-100">منتشر شده</div>
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

        {/* ابزارهای تولید محتوا */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-green-600" />
            ابزارهای تولید محتوا
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/blog/new"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">مقاله جدید</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ایجاد مقاله جدید</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/admin/blog"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Edit className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">ویرایش مقالات</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">مدیریت مقالات موجود</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/blog"
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">مشاهده بلاگ</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">نمایش عمومی مقالات</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* کتابخانه رسانه */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="text-2xl">📁</span>
              کتابخانه رسانه
            </h3>
            <Link
              href="/admin/media"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
            >
              مدیریت رسانه
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                  <span className="text-indigo-600">🖼️</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">تصاویر و ویدیوها</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">مدیریت فایل‌های رسانه‌ای</p>
                </div>
              </div>
            </div>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center">
                  <span className="text-teal-600">📚</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">اسناد و فایل‌ها</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">آپلود و سازماندهی فایل‌ها</p>
                </div>
              </div>
            </div>
          </div>
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
                  className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
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
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📝</span>
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
                                  className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-lg"
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
                          <FileText size={16} />
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Plus size={16} />
              افزودن مقاله جدید
            </Link>
          </div>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
