"use client";

import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Target } from "lucide-react";

interface TestProgressIndicatorProps {
  completedTests: number;
  totalTests: number;
  className?: string;
}

export default function TestProgressIndicator({ 
  completedTests, 
  totalTests, 
  className = "" 
}: TestProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const percentage = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
    setProgress(percentage);
  }, [completedTests, totalTests]);

  const isCompleted = completedTests >= totalTests;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-gray-800 dark:text-white">
            پیشرفت تست‌ها
          </h3>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {completedTests} از {totalTests}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress 
          value={progress} 
          className="h-3"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>شروع</span>
          <span className="font-medium">
            {Math.round(progress)}% تکمیل شده
          </span>
          <span>پایان</span>
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-2">
        {isCompleted ? (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">همه تست‌ها تکمیل شدند! 🎉</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Clock className="w-5 h-5" />
            <span className="font-medium">
              {totalTests - completedTests} تست باقی‌مانده
            </span>
          </div>
        )}
      </div>
    </div>
  );
}




