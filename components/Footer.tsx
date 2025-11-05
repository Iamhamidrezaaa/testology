export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-t from-gray-100 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10 text-right">

        {/* ستونی ۱ */}
        <div>
          <h3 className="text-xl font-extrabold text-gray-800 dark:text-gray-100 mb-3">تستولوژی</h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            پلتفرم تست‌های روان‌شناسی دقیق و تحلیل‌شده با هوش مصنوعی و گزارش‌های شخصی‌سازی‌شده.
          </p>
        </div>

        {/* ستونی ۲ */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">دسترسی سریع</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li><a href="/tests" className="hover:text-purple-500 transition">تست‌ها</a></li>
            <li><a href="/blog" className="hover:text-purple-500 transition">مقالات</a></li>
            <li><a href="/about" className="hover:text-purple-500 transition">درباره ما</a></li>
            <li><a href="/contact" className="hover:text-purple-500 transition">تماس با ما</a></li>
          </ul>
        </div>

        {/* ستونی ۳ */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">قوانین</h3>
          <ul className="space-y-2 text-gray-600 dark:text-gray-400">
            <li><a href="/privacy" className="hover:text-purple-500 transition">حریم خصوصی</a></li>
            <li><a href="/terms" className="hover:text-purple-500 transition">قوانین و مقررات</a></li>
          </ul>
        </div>

        {/* ستونی ۴ */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3">عضویت در خبرنامه</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-3">برای دریافت آخرین تحلیل‌ها و تست‌های جدید:</p>
          <form className="flex items-center bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <input
              type="email"
              placeholder="ایمیل شما"
              className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-gray-700 dark:text-gray-200"
            />
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 text-sm font-semibold transition"
            >
              عضویت
            </button>
          </form>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="text-center mt-10 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
        © ۲۰۲۵ تستولوژی | تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}