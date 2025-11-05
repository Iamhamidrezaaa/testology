'use client';

import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  Quote, 
  Code, 
  Heading1, 
  Heading2, 
  Heading3,
  Link,
  Image,
  Video,
  Palette,
  Type,
  Layout,
  Grid,
  Columns,
  Square,
  Circle,
  Triangle,
  Star,
  Heart,
  Zap,
  Target,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Undo,
  Redo,
  Settings,
  Trash2,
  Move,
  Eye,
  EyeOff
} from 'lucide-react';

interface EditorToolbarProps {
  onFormat: (format: string) => void;
  onInsert: (type: string) => void;
  onStyle: (style: string, value: any) => void;
  onDelete: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onDuplicate: () => void;
  onToggleVisibility: () => void;
  selectedElement?: any;
  isVisible?: boolean;
}

export default function EditorToolbar({
  onFormat,
  onInsert,
  onStyle,
  onDelete,
  onMove,
  onDuplicate,
  onToggleVisibility,
  selectedElement,
  isVisible = true
}: EditorToolbarProps) {
  const formatButtons = [
    { icon: Bold, format: 'bold', title: 'پررنگ' },
    { icon: Italic, format: 'italic', title: 'مایل' },
    { icon: Underline, format: 'underline', title: 'زیرخط' },
    { icon: Code, format: 'code', title: 'کد' },
  ];

  const headingButtons = [
    { icon: Heading1, format: 'h1', title: 'عنوان 1' },
    { icon: Heading2, format: 'h2', title: 'عنوان 2' },
    { icon: Heading3, format: 'h3', title: 'عنوان 3' },
  ];

  const alignButtons = [
    { icon: AlignLeft, format: 'left', title: 'چپ' },
    { icon: AlignCenter, format: 'center', title: 'وسط' },
    { icon: AlignRight, format: 'right', title: 'راست' },
  ];

  const insertButtons = [
    { icon: Image, type: 'image', title: 'تصویر' },
    { icon: Video, type: 'video', title: 'ویدیو' },
    { icon: Link, type: 'link', title: 'لینک' },
    { icon: Quote, type: 'quote', title: 'نقل قول' },
    { icon: List, type: 'list', title: 'لیست' },
  ];

  const layoutButtons = [
    { icon: Columns, type: 'columns', title: 'ستون' },
    { icon: Grid, type: 'grid', title: 'شبکه' },
    { icon: Square, type: 'card', title: 'کارت' },
    { icon: Layout, type: 'section', title: 'بخش' },
  ];

  const specialButtons = [
    { icon: Target, type: 'test-link', title: 'لینک تست' },
    { icon: Star, type: 'rating', title: 'امتیازدهی' },
    { icon: Heart, type: 'like', title: 'لایک' },
    { icon: Zap, type: 'cta', title: 'دعوت به عمل' },
  ];

  const actionButtons = [
    { icon: Undo, action: 'undo', title: 'برگردان' },
    { icon: Redo, action: 'redo', title: 'تکرار' },
    { icon: Copy, action: 'duplicate', title: 'کپی' },
    { icon: Move, action: 'move', title: 'جابجایی' },
    { icon: ChevronUp, action: 'move-up', title: 'بالا' },
    { icon: ChevronDown, action: 'move-down', title: 'پایین' },
    { icon: isVisible ? Eye : EyeOff, action: 'toggle-visibility', title: isVisible ? 'مخفی' : 'نمایش' },
    { icon: Trash2, action: 'delete', title: 'حذف' },
  ];

  const handleAction = (action: string) => {
    switch (action) {
      case 'undo':
        // Implement undo
        break;
      case 'redo':
        // Implement redo
        break;
      case 'duplicate':
        onDuplicate();
        break;
      case 'move':
        // Implement move
        break;
      case 'move-up':
        onMove('up');
        break;
      case 'move-down':
        onMove('down');
        break;
      case 'toggle-visibility':
        onToggleVisibility();
        break;
      case 'delete':
        onDelete();
        break;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Format Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">
          {formatButtons.map((button) => (
            <button
              key={button.format}
              onClick={() => onFormat(button.format)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Heading Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">
          {headingButtons.map((button) => (
            <button
              key={button.format}
              onClick={() => onFormat(button.format)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Align Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">
          {alignButtons.map((button) => (
            <button
              key={button.format}
              onClick={() => onStyle('textAlign', button.format)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Insert Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">
          {insertButtons.map((button) => (
            <button
              key={button.type}
              onClick={() => onInsert(button.type)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Layout Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">
          {layoutButtons.map((button) => (
            <button
              key={button.type}
              onClick={() => onInsert(button.type)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Special Buttons */}
        <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-600 pr-3 mr-3">
          {specialButtons.map((button) => (
            <button
              key={button.type}
              onClick={() => onInsert(button.type)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {actionButtons.map((button) => (
            <button
              key={button.action}
              onClick={() => handleAction(button.action)}
              className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors ${
                button.action === 'delete' ? 'hover:bg-red-100 dark:hover:bg-red-900' : ''
              }`}
              title={button.title}
            >
              <button.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Style Panel */}
      {selectedElement && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            تنظیمات استایل
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                رنگ متن
              </label>
              <input
                type="color"
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
                onChange={(e) => onStyle('color', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                رنگ پس‌زمینه
              </label>
              <input
                type="color"
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded"
                onChange={(e) => onStyle('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                اندازه فونت
              </label>
              <select
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded text-sm"
                onChange={(e) => onStyle('fontSize', e.target.value)}
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="32px">32px</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                فاصله
              </label>
              <select
                className="w-full h-8 border border-gray-300 dark:border-gray-600 rounded text-sm"
                onChange={(e) => onStyle('padding', e.target.value)}
              >
                <option value="0">بدون فاصله</option>
                <option value="8px">کم</option>
                <option value="16px">متوسط</option>
                <option value="24px">زیاد</option>
                <option value="32px">خیلی زیاد</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}







