// lib/auth-guard.tsx
"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // بررسی وضعیت لاگین از localStorage
    const role = localStorage.getItem("testology_role");
    const email = localStorage.getItem("testology_email");
    
    if (role && email) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
    }
    
    setIsLoading(false);
  }, [router, pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        در حال بررسی ورود...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // ریدایرکت انجام شده
  }

  return <>{children}</>;
}
