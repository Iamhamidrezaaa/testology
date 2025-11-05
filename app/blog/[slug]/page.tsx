"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, User, Eye, Share2, ArrowLeft, Star, MessageCircle } from "lucide-react";

// داده‌های نمونه مقاله
const sampleArticle = {
  id: "1",
  title: "چگونه اضطراب خود را مدیریت کنیم؟",
  slug: "anxiety-management-guide",
  content: `
    <h2>مقدمه</h2>
    <p>اضطراب یکی از شایع‌ترین مشکلات روانی در دنیای امروز است. بسیاری از افراد در طول زندگی خود با اضطراب مواجه می‌شوند، اما نکته مهم این است که اضطراب قابل مدیریت و کنترل است.</p>
    
    <h2>علائم اضطراب</h2>
    <p>اضطراب می‌تواند خود را به شکل‌های مختلفی نشان دهد:</p>
    <ul>
      <li>احساس نگرانی مداوم</li>
      <li>تنش عضلانی</li>
      <li>مشکل در تمرکز</li>
      <li>خستگی</li>
      <li>مشکل در خواب</li>
    </ul>
    
    <h2>تکنیک‌های مدیریت اضطراب</h2>
    
    <h3>1. تنفس عمیق</h3>
    <p>یکی از ساده‌ترین و مؤثرترین روش‌ها برای کاهش اضطراب، تمرین تنفس عمیق است. این تکنیک می‌تواند در هر زمان و مکان انجام شود.</p>
    
    <h3>2. مدیتیشن و ذهن‌آگاهی</h3>
    <p>تمرین مدیتیشن به طور منظم می‌تواند به کاهش سطح اضطراب کمک کند. حتی 10 دقیقه مدیتیشن روزانه می‌تواند تأثیر قابل توجهی داشته باشد.</p>
    
    <h3>3. ورزش منظم</h3>
    <p>ورزش نه تنها برای سلامت جسمی مفید است، بلکه تأثیر مثبتی بر سلامت روان دارد. ورزش منظم می‌تواند سطح اضطراب را کاهش دهد.</p>
    
    <h3>4. مدیریت زمان</h3>
    <p>برنامه‌ریزی مناسب و مدیریت زمان می‌تواند از ایجاد استرس و اضطراب جلوگیری کند.</p>
    
    <h2>زمان مراجعه به متخصص</h2>
    <p>اگر اضطراب شما شدید است یا در زندگی روزمره اختلال ایجاد می‌کند، بهتر است با یک روان‌شناس یا روانپزشک مشورت کنید.</p>
    
    <h2>نتیجه‌گیری</h2>
    <p>اضطراب قابل مدیریت است. با استفاده از تکنیک‌های مناسب و در صورت نیاز مراجعه به متخصص، می‌توانید اضطراب خود را کنترل کنید و زندگی بهتری داشته باشید.</p>
  `,
  excerpt: "راهنمای جامع برای مدیریت اضطراب روزانه و تکنیک‌های عملی کاهش استرس",
  category: "anxiety",
  author: "دکتر سارا احمدی",
  coverUrl: "/images/blog/anxiety-management.jpg",
  published: true,
  featured: true,
  viewCount: 1250,
  createdAt: new Date("2024-01-15"),
  tags: ["اضطراب", "مدیریت استرس", "سلامت روان"]
};

// مقالات مرتبط
const relatedArticles = [
  {
    id: "2",
    title: "تکنیک‌های ذهن‌آگاهی برای زندگی بهتر",
    slug: "mindfulness-techniques",
    excerpt: "آموزش گام‌به‌گام تکنیک‌های ذهن‌آگاهی و مدیتیشن",
    category: "mindfulness",
    viewCount: 2100,
    createdAt: new Date("2024-01-08")
  },
  {
    id: "3",
    title: "راهنمای کامل تست اضطراب",
    slug: "anxiety-test-guide",
    excerpt: "آشنایی با انواع تست‌های اضطراب و نحوه تفسیر نتایج",
    category: "anxiety",
    viewCount: 890,
    createdAt: new Date("2024-01-05")
  }
];

// تست‌های مرتبط
const relatedTests = [
  { name: "تست اضطراب GAD-7", href: "/tests/gad-7", description: "ارزیابی سطح اضطراب" },
  { name: "تست استرس", href: "/tests/stress", description: "سنجش میزان استرس" },
  { name: "تست ذهن‌آگاهی", href: "/tests/mindfulness", description: "بررسی سطح ذهن‌آگاهی" }
];

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<any | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [shareCount, setShareCount] = useState(42);

  // بارگذاری از API واقعی
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${params.slug}`, { cache: "no-store" });
        if (!res.ok) throw new Error("not found");
        const data = await res.json();
        setArticle(data);
      } catch (_) {
        setArticle(sampleArticle as any);
      }
    };
    fetchArticle();
  }, [params.slug]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article.title;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`);
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('لینک کپی شد!');
        break;
    }
    
    setShareCount(prev => prev + 1);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 dark:text-gray-300">در حال بارگذاری...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* دکمه برگشت */}
      <div className="container mx-auto px-4 pt-6">
            <Link
              href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
          <ArrowLeft size={16} />
          بازگشت به بلاگ
            </Link>
          </div>
          
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* محتوای اصلی */}
          <div className="lg:col-span-3">
            <article className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
              {/* هدر مقاله */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                    😰 اضطراب و افسردگی
                  </span>
                  {article.featured && (
                    <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-sm flex items-center gap-1">
                      <Star size={14} className="fill-current" />
                      ویژه
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl font-bold mb-4 leading-tight">
                  {article.title}
          </h1>
          
                <p className="text-lg opacity-90 mb-6">
                  {article.excerpt}
                </p>

                {/* اطلاعات مقاله */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    {new Date(article.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye size={16} />
                    {article.viewCount.toLocaleString()} بازدید
                  </div>
                </div>
              </div>

              {/* تصویر کاور */}
              <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-8xl opacity-20">📖</span>
              </div>

              {/* محتوای مقاله */}
              <div className="p-8">
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
          </div>

              {/* برچسب‌ها */}
              <div className="px-8 pb-6">
                <div className="flex flex-wrap gap-2">
                  {article.tags?.map((tag: string) => (
              <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-sm rounded-lg"
              >
                      #{tag}
              </span>
            ))}
          </div>
        </div>

              {/* دکمه‌های تعامل */}
              <div className="px-8 pb-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                        isLiked
                          ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      <span className={isLiked ? "❤️" : "🤍"}>
                        {isLiked ? "❤️" : "🤍"}
                      </span>
                      {isLiked ? "لایک شده" : "لایک"}
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">
                      <MessageCircle size={16} />
                      نظر
                    </button>
        </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {shareCount} اشتراک‌گذاری
                    </span>
                  </div>
                </div>
              </div>
            </article>

            {/* مقالات مرتبط */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                مقالات مرتبط 📚
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/blog/${relatedArticle.slug}`}
                    className="block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
                  >
                    <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-3">
                      {relatedArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        {relatedArticle.viewCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(relatedArticle.createdAt).toLocaleDateString('fa-IR')}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </div>

          {/* سایدبار */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* اشتراک‌گذاری */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  اشتراک‌گذاری 📤
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-800 transition"
                  >
                    <span className="text-xl">📱</span>
                    واتساپ
                  </button>
                  <button
                    onClick={() => handleShare('telegram')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
                  >
                    <span className="text-xl">✈️</span>
              تلگرام
            </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <Share2 size={16} />
              کپی لینک
            </button>
          </div>
        </div>

              {/* تست‌های مرتبط */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                  تست‌های مرتبط 🧪
                </h3>
                <div className="space-y-3">
                  {relatedTests.map((test) => (
                <Link
                      key={test.name}
                      href={test.href}
                      className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                    >
                      <div className="font-medium text-sm text-gray-900 dark:text-white">
                        {test.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {test.description}
                  </div>
                </Link>
              ))}
            </div>
          </div>

              {/* خبرنامه */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-6">
                <h3 className="text-lg font-bold mb-3">
                  عضویت در خبرنامه 📧
                </h3>
                <p className="text-sm opacity-90 mb-4">
                  آخرین مقالات روان‌شناسی و راهنمای تست‌ها را دریافت کنید
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="ایمیل شما"
                    className="w-full px-3 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
                    عضویت
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}