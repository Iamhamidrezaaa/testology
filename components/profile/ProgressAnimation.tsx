"use client";

import { useEffect, useState } from "react";

interface ProgressAnimationProps {
  progress: number;
  className?: string;
}

export function ProgressAnimation({ progress, className = "" }: ProgressAnimationProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 300);

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`relative ${className}`}>
      {/* پس‌زمینه progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        {/* انیمیشن progress */}
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-2000 ease-out relative overflow-hidden"
          style={{ width: `${animatedProgress}%` }}
        >
          {/* افکت شاین */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
          
          {/* ذرات شناور */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-0 left-3/4 w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
      
      {/* نمایش درصد */}
      <div className="absolute -top-8 right-0 bg-white px-2 py-1 rounded-lg shadow-md border">
        <span className="text-sm font-bold text-gray-700">
          {Math.round(animatedProgress)}%
        </span>
      </div>
    </div>
  );
}




















