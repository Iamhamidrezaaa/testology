'use client';

import { useEffect } from 'react';

/**
 * Global Error Handler Component
 * فیلتر کردن خطاهای غیرضروری از extensionهای مرورگر (مثل MetaMask)
 * این component به عنوان یک لایه اضافی برای error handling استفاده می‌شود
 */
export default function GlobalErrorHandler() {
  useEffect(() => {
    // لیست خطاهای غیرضروری که باید نادیده گرفته شوند
    const ignoredErrors = [
      'MetaMask',
      'metamask',
      'Failed to connect to MetaMask',
      'chrome-extension://',
      'moz-extension://',
      'safari-extension://',
      'extension://',
      'Non-Error promise rejection',
      'ResizeObserver loop',
      'ResizeObserver loop limit exceeded',
    ];

    // بررسی اینکه آیا خطا باید نادیده گرفته شود
    const shouldIgnoreError = (error: Error | string | any): boolean => {
      if (!error) return false;
      
      const errorMessage = typeof error === 'string' 
        ? error 
        : error?.message || error?.toString() || String(error);
      const errorStack = error instanceof Error ? (error.stack || '') : '';
      const fullError = `${errorMessage} ${errorStack}`.toLowerCase();

      return ignoredErrors.some(ignored => 
        fullError.includes(ignored.toLowerCase())
      );
    };

    // Handler برای خطاهای unhandled (با capture phase)
    const handleError = (event: ErrorEvent) => {
      if (shouldIgnoreError(event.error || event.message)) {
        // جلوگیری کامل از نمایش خطا
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };

    // Handler برای unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (shouldIgnoreError(reason)) {
        // جلوگیری کامل از نمایش خطا
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        return false;
      }
    };

    // اضافه کردن event listeners با capture phase (قبل از bubble)
    window.addEventListener('error', handleError, true);
    window.addEventListener('unhandledrejection', handleUnhandledRejection, true);

    // همچنین override کردن console.error برای فیلتر کردن
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorString = args.map(arg => 
        typeof arg === 'string' ? arg : (arg?.message || String(arg))
      ).join(' ').toLowerCase();
      
      if (ignoredErrors.some(ignored => errorString.includes(ignored.toLowerCase()))) {
        // نادیده گرفتن خطاهای MetaMask در console
        return;
      }
      
      // نمایش خطاهای واقعی
      originalConsoleError.apply(console, args);
    };

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError, true);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection, true);
      console.error = originalConsoleError;
    };
  }, []);

  // این component چیزی رندر نمی‌کند
  return null;
}

