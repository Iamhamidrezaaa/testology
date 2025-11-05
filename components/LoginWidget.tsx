"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginWidget() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    setMounted(true);
    const r = localStorage.getItem("testology_role");
    const em = localStorage.getItem("testology_email");
    setRole(r);
    if (em) setEmail(em);
  }, []);

  if (!mounted) return null;

  function logout() {
    localStorage.removeItem("testology_role");
    localStorage.removeItem("testology_email");
    setRole(null);
    setEmail("");
    router.refresh();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    if (email.trim().toLowerCase() === "admin@testology.me" && password === "admin123") {
      localStorage.setItem("testology_role", "admin");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      setRole("admin");
      router.push("/admin/dashboard");
      return;
    }

    if (email.trim().toLowerCase() === "user@testology.me" && password === "user123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      setRole("user");
      router.push("/dashboard");
      return;
    }

    // کاربران تست جدید
    if (email.trim().toLowerCase() === "user1@testology.me" && password === "user1123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      setRole("user");
      router.push("/dashboard");
      return;
    }

    if (email.trim().toLowerCase() === "user2@testology.me" && password === "user2123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      setRole("user");
      router.push("/dashboard");
      return;
    }

    if (email.trim().toLowerCase() === "user3@testology.me" && password === "user3123") {
      localStorage.setItem("testology_role", "user");
      localStorage.setItem("testology_email", email.trim().toLowerCase());
      setRole("user");
      router.push("/dashboard");
      return;
    }

    setErr("ایمیل یا رمز اشتباه است.");
  }

  if (role) {
    return (
      <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-md w-full max-w-md">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-400 flex items-center justify-center text-white font-bold">
            {email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{email}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">نقش: {role}</div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push(role === "admin" ? "/admin/dashboard" : "/dashboard")}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            رفتن به داشبورد
          </button>
          <button onClick={logout} className="px-4 py-2 border rounded-lg">
            خروج
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-md w-full max-w-md">
      <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">ورود سریع</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          placeholder="ایمیل"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          placeholder="رمز عبور"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err && <div className="text-sm text-red-500">{err}</div>}

        <button className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-lg">
          ورود
        </button>
      </form>
      <p className="text-xs text-gray-400 mt-3">
        admin@testology.me / admin123 — مدیر  
        <br />
        user@testology.me / user123 — کاربر
        <br />
        user1@testology.me / user1123 — تست 1
        <br />
        user2@testology.me / user2123 — تست 2
        <br />
        user3@testology.me / user3123 — تست 3
      </p>
    </div>
  );
}