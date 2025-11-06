"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";
import { LogOut, User } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userProfile, setUserProfile] = useState({
    name: "",
    lastName: "",
    avatar: ""
  });

  useEffect(() => {
    const role = localStorage.getItem("testology_role");
    const email = localStorage.getItem("testology_email");
    
    if (!role) {
      router.push("/login");
    } else if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      setUserEmail(email || "");
      if (email) {
        fetchUserProfile(email);
      }
    }
  }, [router]);

  const fetchUserProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (data.success) {
        setUserProfile({
          name: data.profile.name || "",
          lastName: data.profile.lastName || "",
          avatar: data.profile.avatar || ""
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    // پاک کردن localStorage
    localStorage.removeItem("testology_role");
    localStorage.removeItem("testology_email");
    
    // Dispatch event برای اطلاع‌رسانی به سایر کامپوننت‌ها
    window.dispatchEvent(new CustomEvent("localStorageChange"));
    
    // انتقال مستقیم به صفحه اصلی
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex flex-1" />
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>خروج از حساب</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}