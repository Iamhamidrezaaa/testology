"use client";

import { useEffect, useState } from "react";

interface StepAnimationProps {
  isCompleted: boolean;
  isCurrent: boolean;
  children: React.ReactNode;
  delay?: number;
}

export function StepAnimation({ 
  isCompleted, 
  isCurrent, 
  children, 
  delay = 0 
}: StepAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4'
      } ${
        isCompleted 
          ? 'scale-105' 
          : isCurrent 
            ? 'scale-102' 
            : 'scale-100'
      }`}
    >
      {children}
    </div>
  );
}




















