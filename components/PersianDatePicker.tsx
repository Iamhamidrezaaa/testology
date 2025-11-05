"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface PersianDatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PersianDatePicker({ 
  value, 
  onChange, 
  placeholder = "انتخاب تاریخ", 
  className = "" 
}: PersianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<{year: number, month: number, day: number} | null>(null);
  const [currentYear, setCurrentYear] = useState(1403);
  const [currentMonth, setCurrentMonth] = useState(1);

  const persianMonths = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
  ];

  const persianDays = [
    "ش", "ی", "د", "س", "چ", "پ", "ج"
  ];

  const daysInMonth = (year: number, month: number) => {
    if (month <= 6) return 31;
    if (month <= 11) return 30;
    return year % 4 === 3 ? 30 : 29; // کبیسه
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // محاسبه ساده روز اول ماه
    const totalDays = (year - 1400) * 365 + (month - 1) * 30;
    return (totalDays + 4) % 7; // شروع از شنبه
  };

  useEffect(() => {
    if (value) {
      // تبدیل تاریخ میلادی به شمسی (ساده)
      const date = new Date(value);
      const year = date.getFullYear() - 621;
      const month = date.getMonth() + 1;
      const day = date.getDate();
      setSelectedDate({ year, month, day });
    }
  }, [value]);

  const handleDateSelect = (day: number) => {
    const newDate = { year: currentYear, month: currentMonth, day };
    setSelectedDate(newDate);
    
    // تبدیل به تاریخ میلادی
    const gregorianDate = new Date(currentYear + 621, currentMonth - 1, day);
    onChange(gregorianDate.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const formatDisplayDate = () => {
    if (!selectedDate) return placeholder;
    return `${selectedDate.year}/${selectedDate.month.toString().padStart(2, '0')}/${selectedDate.day.toString().padStart(2, '0')}`;
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays = [];

    // روزهای خالی قبل از ماه
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // روزهای ماه
    for (let day = 1; day <= days; day++) {
      const isSelected = selectedDate?.year === currentYear && 
                        selectedDate?.month === currentMonth && 
                        selectedDate?.day === day;
      
      calendarDays.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-8 w-8 rounded-lg text-sm transition-colors ${
            isSelected
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          }`}
        >
          {day}
        </button>
      );
    }

    return calendarDays;
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 text-right flex items-center justify-between"
      >
        <Calendar className="w-5 h-5 text-gray-400" />
        <span className={selectedDate ? "text-white" : "text-gray-400"}>
          {formatDisplayDate()}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 p-4">
          {/* هدر تقویم */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(prev => prev === 1 ? 12 : prev - 1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {persianMonths[currentMonth - 1]}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                {currentYear}
              </span>
            </div>
            
            <button
              onClick={() => setCurrentMonth(prev => prev === 12 ? 1 : prev + 1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* روزهای هفته */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {persianDays.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* روزهای ماه */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* دکمه‌های سال */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentYear(prev => prev - 1)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              سال قبل
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentYear}
            </span>
            <button
              onClick={() => setCurrentYear(prev => prev + 1)}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              سال بعد
            </button>
          </div>
        </div>
      )}
    </div>
  );
}






