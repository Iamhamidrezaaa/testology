"use client";

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
          خطای سیستم
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          متأسفانه خطایی در سیستم رخ داده است. لطفاً دوباره تلاش کنید.
        </p>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-right">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            جزئیات خطا:
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
            {error.message}
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={resetError}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تلاش مجدد
          </Button>
          
          <Button
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="flex-1"
          >
            <Home className="w-4 h-4 ml-2" />
            بازگشت به خانه
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          اگر مشکل ادامه دارد، لطفاً با پشتیبانی تماس بگیرید.
        </p>
      </div>
    </div>
  );
}

export default ErrorBoundary;




