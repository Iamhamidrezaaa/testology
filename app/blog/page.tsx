"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Calendar, User, Eye, Star } from "lucide-react";

// دسته‌بندی‌های روان‌شناسی (شامل همه دسته‌بندی‌های جامع)
const categories = [
  { id: "all", name: "همه مقالات", icon: "📚" },
  { id: "personality", name: "روان‌شناسی شخصیت", icon: "🧠" },
  { id: "anxiety", name: "اضطراب و افسردگی", icon: "😰" },
  { id: "relationships", name: "روابط و احساسات", icon: "💕" },
  { id: "growth", name: "رشد فردی", icon: "🌱" },
  { id: "mindfulness", name: "تمرکز و ذهن‌آگاهی", icon: "🧘" },
  { id: "sleep", name: "خواب و سلامت ذهن", icon: "😴" },
  { id: "motivation", name: "انگیزش و موفقیت", icon: "🚀" },
  { id: "lifestyle", name: "سبک زندگی و کار", icon: "⚖️" },
  { id: "analysis", name: "تحلیل تست‌ها", icon: "📊" },
  { id: "research", name: "پژوهش‌های علمی", icon: "🔬" }
];

// داده‌های نمونه مقالات
const sampleArticles = [
  {
    id: "1",
    title: "چگونه اضطراب خود را مدیریت کنیم؟",
    slug: "anxiety-management-guide",
    excerpt: "راهنمای جامع برای مدیریت اضطراب روزانه و تکنیک‌های عملی کاهش استرس",
    category: "anxiety",
    author: "دکتر سارا احمدی",
    coverUrl: "/images/blog/anxiety-management.jpg",
    published: true,
    featured: true,
    viewCount: 1250,
    createdAt: new Date("2024-01-15"),
    tags: ["اضطراب", "مدیریت استرس", "سلامت روان"]
  },
  {
    id: "2", 
    title: "رازهای شخصیت‌شناسی با تست MBTI",
    slug: "mbti-personality-secrets",
    excerpt: "آشنایی کامل با 16 تیپ شخصیتی MBTI و نحوه استفاده از آن در زندگی",
    category: "personality",
    author: "تیم تحریریه Testology",
    coverUrl: "/images/blog/mbti-guide.jpg",
    published: true,
    featured: false,
    viewCount: 890,
    createdAt: new Date("2024-01-10"),
    tags: ["MBTI", "شخصیت‌شناسی", "تست روان‌شناسی"]
  },
  {
    id: "3",
    title: "تکنیک‌های ذهن‌آگاهی برای زندگی بهتر",
    slug: "mindfulness-techniques",
    excerpt: "آموزش گام‌به‌گام تکنیک‌های ذهن‌آگاهی و مدیتیشن برای کاهش استرس",
    category: "mindfulness",
    author: "دکتر محمد رضایی",
    coverUrl: "/images/blog/mindfulness.jpg",
    published: true,
    featured: true,
    viewCount: 2100,
    createdAt: new Date("2024-01-08"),
    tags: ["ذهن‌آگاهی", "مدیتیشن", "آرامش"]
  }
];

export default function BlogPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  // بارگذاری از API واقعی
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        setArticles(data || []);
        setFilteredArticles(data || []);
        setCurrentPage(1);
      } catch (_) {
        // بازگشت به داده‌های نمونه در صورت خطا
        setArticles(sampleArticles as any);
        setFilteredArticles(sampleArticles as any);
        setCurrentPage(1);
      }
    };
    fetchArticles();
  }, []);

  // فیلتر و جستجو
  useEffect(() => {
    let filtered = [...articles];

    // فیلتر دسته‌بندی
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // جستجو
    if (searchQuery) {
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // مرتب‌سازی
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "popular":
          return b.viewCount - a.viewCount;
        case "featured":
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.max(1, Math.ceil((filteredArticles?.length || 0) / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = filteredArticles.slice(startIndex, startIndex + pageSize);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* هدر بلاگ */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">بلاگ Testology</h1>
            <p className="text-xl opacity-90 mb-8">
              مقالات تخصصی روان‌شناسی، راهنمای تست‌ها و نکات کاربردی برای رشد شخصی
            </p>
            
            {/* نوار جستجو */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="جستجو در مقالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-xl border-0 bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* محتوای اصلی */}
          <div className="lg:col-span-3">
            {/* فیلترها */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-sm">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                {/* دسته‌بندی‌ها */}
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 6).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                        selectedCategory === category.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <span className="ml-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>

                {/* مرتب‌سازی */}
                <div className="flex items-center gap-2">
                  <Filter size={16} className="text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  >
                    <option value="newest">جدیدترین</option>
                    <option value="oldest">قدیمی‌ترین</option>
                    <option value="popular">محبوب‌ترین</option>
                    <option value="featured">ویژه</option>
                  </select>
                </div>
              </div>
            </div>

            {/* لیست مقالات (۴تایی با صفحه‌بندی) */}
            <div className="space-y-6">
              {pageItems.map((article) => (
                <article
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="md:flex">
                    {/* تصویر کاور */}
                    <div className="md:w-1/3">
                      <div className="h-48 md:h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-6xl opacity-20">📖</span>
                      </div>
                    </div>

                    {/* محتوای مقاله */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {categories.find(c => c.id === article.category)?.icon} 
                          {categories.find(c => c.id === article.category)?.name}
                        </span>
                        {article.featured && (
                          <Star size={16} className="text-yellow-500 fill-current" />
                        )}
                      </div>

                      <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                        <Link href={`/blog/${article.slug}`} className="hover:text-blue-600 transition">
                          {article.title}
                        </Link>
                      </h2>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                        {article.excerpt}
                      </p>

                      {/* برچسب‌ها */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-lg text-gray-600 dark:text-gray-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* اطلاعات مقاله */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <User size={14} />
                            {article.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            {article.viewCount.toLocaleString()}
                          </div>
                        </div>
                        <Link
                          href={`/blog/${article.slug}`}
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          ادامه مطلب →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    مقاله‌ای یافت نشد
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500">
                    سعی کنید کلمات کلیدی دیگری جستجو کنید
                  </p>
                </div>
              )}

              {/* صفحه‌بندی */}
              {filteredArticles.length > 0 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg border text-sm transition ${
                      currentPage === 1
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    aria-label="صفحه قبل"
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm transition ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "border hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        aria-current={currentPage === pageNum ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-lg border text-sm transition ${
                      currentPage === totalPages
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                    aria-label="صفحه بعد"
                  >
                    {">"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* سایدبار */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* مقالات محبوب */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  مقالات محبوب 🔥
                </h3>
                <div className="space-y-3">
                  {articles
                    .sort((a, b) => b.viewCount - a.viewCount)
                    .slice(0, 3)
                    .map((article) => (
                      <Link
                        key={article.id}
                        href={`/blog/${article.slug}`}
                        className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Eye size={12} />
                          {article.viewCount.toLocaleString()}
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* دسته‌بندی‌ها */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  دسته‌بندی‌ها 📂
                </h3>
                <div className="space-y-2">
                  {categories.slice(1).map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-right px-3 py-2 rounded-lg text-sm transition ${
                        selectedCategory === category.id
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      <span className="ml-2">{category.icon}</span>
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* تست‌های مرتبط */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  تست‌های مرتبط 🧪
                </h3>
                <div className="space-y-2">
                  <Link href="/tests/mbti" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">تست MBTI</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">شخصیت‌شناسی</div>
                  </Link>
                  <Link href="/tests/big-five" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">تست Big Five</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">صفات شخصیتی</div>
                  </Link>
                  <Link href="/tests/anxiety" className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">تست اضطراب</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">سلامت روان</div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}