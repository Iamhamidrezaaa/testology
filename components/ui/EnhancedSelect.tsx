"use client"

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Search, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface EnhancedSelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  loading?: boolean
  searchable?: boolean
  className?: string
  label?: string
}

export default function EnhancedSelect({
  options,
  value,
  onChange,
  placeholder = "انتخاب کنید",
  disabled = false,
  loading = false,
  searchable = false,
  className = "",
  label
}: EnhancedSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredOptions, setFilteredOptions] = useState(options)
  const selectRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchable && searchTerm) {
      setFilteredOptions(
        options.filter(option =>
          option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredOptions(options)
    }
  }, [options, searchTerm, searchable])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    if (!disabled && !loading) {
      setIsOpen(!isOpen)
      if (!isOpen && searchable && searchRef.current) {
        setTimeout(() => searchRef.current?.focus(), 100)
      }
    }
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
    setSearchTerm("")
  }

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className={cn("relative", className)} ref={selectRef}>
      {label && (
        <label className="block text-white font-medium mb-2 text-sm">
          {label}
        </label>
      )}
      
      <div
        className={cn(
          "w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white cursor-pointer transition-all duration-200",
          "hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          disabled && "opacity-50 cursor-not-allowed",
          loading && "cursor-wait"
        )}
        onClick={handleToggle}
      >
        <div className="flex items-center justify-between">
          <span className={cn(
            "truncate",
            !selectedOption && "text-white/60"
          )}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          
          <div className="flex items-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-8 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    "px-4 py-2 text-white cursor-pointer transition-colors duration-150",
                    "hover:bg-gray-700 focus:bg-gray-700",
                    option.disabled && "opacity-50 cursor-not-allowed",
                    value === option.value && "bg-blue-600 text-white"
                  )}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400 text-center">
                {searchable ? "نتیجه‌ای یافت نشد" : "گزینه‌ای موجود نیست"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}





