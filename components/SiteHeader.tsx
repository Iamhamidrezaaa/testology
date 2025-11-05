"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const nav = [
    { href: "/", label: "خانه" },
    { href: "/tests", label: "تست‌ها" },
    { href: "/blog", label: "بلاگ" },
    { href: "/about-us", label: "درباره ما" },
    { href: "/contact-us", label: "تماس با ما" },
    { href: "/demo", label: "🎥 دمو" },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-violet-500 to-blue-500 shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6 text-white">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          تستولوژی <span className="text-pink-200">🧠</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "hover:opacity-100 transition " +
                  (active ? "opacity-100 font-semibold" : "opacity-80")
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/dashboard"
            className="ml-4 bg-white text-indigo-600 px-4 py-1.5 rounded-xl font-semibold hover:bg-indigo-50 transition"
          >
            ورود
          </Link>
        </nav>
      </div>
    </header>
  );
} 