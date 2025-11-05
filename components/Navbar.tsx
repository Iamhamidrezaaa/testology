"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // بررسی وضعیت لاگین از localStorage
    const checkAuth = () => {
      const role = localStorage.getItem("testology_role");
      const email = localStorage.getItem("testology_email");
      
      console.log("🔍 Navbar check:", { role, email, isLoggedIn });
      
      if (role && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    };

    // بررسی اولیه
    checkAuth();

    // گوش دادن به تغییرات localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "testology_role" || e.key === "testology_email") {
        checkAuth();
      }
    };

    // گوش دادن به تغییرات در همان تب
    const handleCustomStorageChange = () => {
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("localStorageChange", handleCustomStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageChange", handleCustomStorageChange);
    };
  }, []);

  const handleLogout = () => {
    console.log("🚪 Logging out...");
    localStorage.removeItem("testology_role");
    localStorage.removeItem("testology_email");
    
    // Dispatch event برای اطلاع‌رسانی به سایر کامپوننت‌ها
    window.dispatchEvent(new CustomEvent("localStorageChange"));
    
    setIsLoggedIn(false);
    setUserEmail("");
    setMenuOpen(false); // بستن منوی کشویی
    console.log("✅ Logged out successfully");
    router.push("/");
  };

  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 text-white backdrop-blur-md shadow-md">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">
        <Link href="/" className="text-2xl font-extrabold">
          تستولوژی
        </Link>
        <ul className="hidden md:flex items-center gap-8">
          <li><Link href="/">خانه</Link></li>
          <li><Link href="/tests">تست‌ها</Link></li>
          <li><Link href="/therapists">درمانگران</Link></li>
          <li><Link href="/blog">بلاگ</Link></li>
          <li><Link href="/about-us">درباره ما</Link></li>
          <li><Link href="/contact-us">تماس با ما</Link></li>
        </ul>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          {/* دکمه ورود یا منوی کاربر */}
          {!isLoggedIn ? (
            <Link
              href={`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`}
              className="bg-white text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg transition"
            >
              ورود / عضویت
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="bg-white text-purple-600 hover:bg-purple-100 px-4 py-2 rounded-lg transition"
              >
                داشبورد ▾
              </button>
              {menuOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-xl bg-white text-gray-800 border border-gray-200 shadow-lg overflow-hidden">
                  <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                    {userEmail}
                  </div>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    مشاهده پروفایل
                  </Link>
                  <div className="border-t border-gray-200" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    خروج
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}