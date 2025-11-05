"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

interface CheckmarkAnimationProps {
  show: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CheckmarkAnimation({ 
  show, 
  size = 'md', 
  className = '' 
}: CheckmarkAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (show) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`relative ${className}`}>
      <CheckCircle 
        className={`${sizeClasses[size]} text-green-500 transition-all duration-500 ${
          isAnimating 
            ? 'scale-150 opacity-100 animate-pulse' 
            : 'scale-100 opacity-90'
        }`}
      />
      
      {/* انیمیشن موج */}
      {isAnimating && (
        <div className="absolute inset-0">
          <div className="w-full h-full border-2 border-green-400 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 w-full h-full border border-green-300 rounded-full animate-ping opacity-50" style={{ animationDelay: '0.2s' }} />
        </div>
      )}
    </div>
  );
}




