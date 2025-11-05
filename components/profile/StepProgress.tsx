"use client";

import { StepAnimation } from "./StepAnimation";

interface ProgressStep {
  id: string;
  name: string;
  description: string;
  icon: string;
  completed: boolean;
  current: boolean;
  date?: string;
}

interface StepProgressProps {
  steps: ProgressStep[];
}

export function StepProgress({ steps }: StepProgressProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
        مراحل مسیر رشد روانی
      </h2>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <StepAnimation 
            key={step.id} 
            isCompleted={step.completed} 
            isCurrent={step.current}
            delay={index * 200}
          >
            <div className="relative">
            {/* خط اتصال */}
            {index < steps.length - 1 && (
              <div className="absolute right-6 top-12 w-0.5 h-16 bg-gray-200">
                <div 
                  className={`w-full h-full transition-all duration-1000 ${
                    step.completed ? 'bg-gradient-to-b from-green-400 to-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              </div>
            )}

            <div className="flex items-start space-x-4 space-x-reverse">
              {/* آیکون مرحله */}
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 ${
                step.completed 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-200' 
                  : step.current 
                    ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse' 
                    : 'bg-gray-200 text-gray-400'
              }`}>
                {step.completed ? '✅' : step.current ? step.icon : '⏳'}
              </div>

              {/* محتوای مرحله */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-semibold transition-colors ${
                    step.completed ? 'text-green-700' : step.current ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {step.name}
                  </h3>
                  {step.date && (
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {step.date}
                    </span>
                  )}
                </div>
                
                <p className={`mt-1 text-sm transition-colors ${
                  step.completed ? 'text-green-600' : step.current ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </p>

                {/* وضعیت مرحله */}
                <div className="mt-2">
                  {step.completed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full ml-1"></span>
                      تکمیل شده
                    </span>
                  )}
                  {step.current && !step.completed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-1 animate-pulse"></span>
                      در حال انجام
                    </span>
                  )}
                  {!step.current && !step.completed && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full ml-1"></span>
                      در انتظار
                    </span>
                  )}
                </div>
              </div>
            </div>
            </div>
          </StepAnimation>
        ))}
      </div>

      {/* خلاصه آماری */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {steps.filter(s => s.completed).length}
            </div>
            <div className="text-sm text-gray-600">مراحل تکمیل شده</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {steps.filter(s => s.current && !s.completed).length}
            </div>
            <div className="text-sm text-gray-600">مرحله فعلی</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {steps.filter(s => !s.current && !s.completed).length}
            </div>
            <div className="text-sm text-gray-600">مراحل باقی‌مانده</div>
          </div>
        </div>
      </div>
    </div>
  );
}
