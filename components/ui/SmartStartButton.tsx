"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, User } from "lucide-react";

interface SmartStartButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export default function SmartStartButton({ className, children }: SmartStartButtonProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isNewUser, setIsNewUser] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const userEmail = localStorage.getItem("testology_email");
      
      if (userEmail) {
        setIsLoggedIn(true);
        
        // بررسی وضعیت کاربر با استفاده از DashboardDataManager
        const { DashboardDataManager } = await import('@/lib/dashboard-data');
        const shouldGoToDashboard = DashboardDataManager.shouldGoToDashboard();
        const shouldGoToStart = DashboardDataManager.shouldGoToStart();
        
        // کاربر جدید فقط اگر باید به صفحه استارت برود
        setIsNewUser(shouldGoToStart && !shouldGoToDashboard);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuthStatus();
    
    // گوش دادن به تغییرات localStorage
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
    };
  }, []);

  const handleClick = async () => {
    if (!isLoggedIn) {
      // کاربر لاگین نیست - برو به صفحه لاگین
      router.push('/login?callbackUrl=/start');
      return;
    }

    try {
      // بررسی وضعیت کاربر
      const { DashboardDataManager } = await import('@/lib/dashboard-data');
      const shouldGoToDashboard = DashboardDataManager.shouldGoToDashboard();
      const shouldGoToStart = DashboardDataManager.shouldGoToStart();

      console.log('🔍 User status check:', {
        isLoggedIn,
        shouldGoToDashboard,
        shouldGoToStart,
        hasScreening: localStorage.getItem("testology_screening_completed"),
        hasResults: localStorage.getItem("testology_test_results"),
        hasProfile: localStorage.getItem("testology_profile_completed")
      });

      if (shouldGoToDashboard) {
        // کاربر قبلاً همه مراحل را انجام داده - برو به داشبورد
        console.log('✅ Redirecting to dashboard - user completed all steps');
        router.push('/dashboard');
      } else {
        // کاربر جدید یا ناقص - برو به صفحه استارت
        console.log('🆕 Redirecting to start - new user or incomplete');
        router.push('/start');
      }
    } catch (error) {
      console.error('Error checking user status:', error);
      // در صورت خطا، برو به صفحه استارت
      router.push('/start');
    }
  };

  if (isLoggedIn === null) {
    return (
      <Button 
        disabled 
        className={`${className} animate-pulse`}
      >
        <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse" />
        در حال بررسی...
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleClick}
      className={`${className} group transition-all duration-300 hover:scale-105`}
    >
      {!isLoggedIn ? (
        <>
          <User className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          {children || "از اینجا شروع کنید..."}
        </>
      ) : isNewUser ? (
        <>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          شروع سفر خودشناسی
        </>
      ) : (
        <>
          <CheckCircle className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
          بازگشت به داشبورد
        </>
      )}
    </Button>
  );
}
