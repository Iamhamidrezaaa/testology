'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  Image, 
  Video, 
  File, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Trash2, 
  Download, 
  Copy, 
  Eye, 
  Edit,
  Plus,
  Folder,
  Calendar,
  User,
  ImageIcon,
  VideoIcon,
  FileIcon,
  Music,
  Archive,
  Code,
  FileText,
  Presentation,
  Spreadsheet,
  Database,
  Settings,
  MoreVertical,
  Check,
  X,
  RefreshCw
} from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';
  size: number;
  url: string;
  thumbnail?: string;
  uploadedAt: Date;
  uploadedBy: string;
  description?: string;
  tags?: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  usedIn?: string[];
}

// داده‌های نمونه
const sampleMediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'blog-cover-1.jpg',
    type: 'image',
    size: 1024000,
    url: '/images/blog/blog-cover-1.jpg',
    thumbnail: '/images/blog/blog-cover-1.jpg',
    uploadedAt: new Date('2024-01-15'),
    uploadedBy: 'دکتر سارا احمدی',
    description: 'عکس کاور مقاله مدیریت اضطراب',
    tags: ['اضطراب', 'مدیریت', 'سلامت روان'],
    dimensions: { width: 1200, height: 630 },
    usedIn: ['مقاله اضطراب', 'صفحه اصلی']
  },
  {
    id: '2',
    name: 'test-background.png',
    type: 'image',
    size: 2048000,
    url: '/images/tests/test-background.png',
    thumbnail: '/images/tests/test-background.png',
    uploadedAt: new Date('2024-01-14'),
    uploadedBy: 'دکتر علی حسینی',
    description: 'پس‌زمینه تست شخصیت',
    tags: ['تست', 'شخصیت', 'پس‌زمینه'],
    dimensions: { width: 1920, height: 1080 },
    usedIn: ['تست MBTI', 'تست Big Five']
  },
  {
    id: '3',
    name: 'intro-video.mp4',
    type: 'video',
    size: 15728640,
    url: '/videos/intro-video.mp4',
    thumbnail: '/images/thumbnails/intro-video.jpg',
    uploadedAt: new Date('2024-01-13'),
    uploadedBy: 'تیم تولید محتوا',
    description: 'ویدیو معرفی سایت',
    tags: ['معرفی', 'ویدیو', 'سایت'],
    usedIn: ['صفحه اصلی', 'درباره ما']
  },
  {
    id: '4',
    name: 'user-guide.pdf',
    type: 'document',
    size: 512000,
    url: '/documents/user-guide.pdf',
    uploadedAt: new Date('2024-01-12'),
    uploadedBy: 'تیم پشتیبانی',
    description: 'راهنمای کاربری',
    tags: ['راهنما', 'کاربری', 'PDF'],
    usedIn: ['صفحه راهنما']
  }
];

const MediaFileCard = ({ file, viewMode, onSelect, onDelete, onEdit }: {
  file: MediaFile;
  viewMode: 'grid' | 'list';
  onSelect: (file: MediaFile) => void;
  onDelete: (id: string) => void;
  onEdit: (file: MediaFile) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-6 h-6 text-blue-500" />;
      case 'video': return <VideoIcon className="w-6 h-6 text-red-500" />;
      case 'audio': return <Music className="w-6 h-6 text-green-500" />;
      case 'document': return <FileText className="w-6 h-6 text-orange-500" />;
      case 'archive': return <Archive className="w-6 h-6 text-purple-500" />;
      default: return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  if (viewMode === 'list') {
    return (
      <div 
        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex-shrink-0">
          {file.type === 'image' && file.thumbnail ? (
            <img 
              src={file.thumbnail} 
              alt={file.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              {getFileIcon(file.type)}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
            {file.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {file.description || 'بدون توضیحات'}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatFileSize(file.size)}</span>
            <span>{file.uploadedAt.toLocaleDateString('fa-IR')}</span>
            <span>{file.uploadedBy}</span>
            {file.dimensions && (
              <span>{file.dimensions.width}×{file.dimensions.height}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {file.usedIn && file.usedIn.length > 0 && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
              {file.usedIn.length} استفاده
            </span>
          )}
          
          {isHovered && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSelect(file)}
                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                title="انتخاب"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => onEdit(file)}
                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                title="ویرایش"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(file.id)}
                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                title="حذف"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square p-4">
        {file.type === 'image' && file.thumbnail ? (
          <img 
            src={file.thumbnail} 
            alt={file.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {file.name}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
          {formatFileSize(file.size)}
        </p>
        {file.dimensions && (
          <p className="text-xs text-gray-500 dark:text-gray-500">
            {file.dimensions.width}×{file.dimensions.height}
          </p>
        )}
      </div>
      
      {isHovered && (
        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(file)}
              className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="انتخاب"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(file)}
              className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="ویرایش"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(file.id)}
              className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="حذف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default function MediaLibraryPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>(sampleMediaFiles);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null);

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || file.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleFileSelect = (file: MediaFile) => {
    if (selectedFiles.includes(file.id)) {
      setSelectedFiles(selectedFiles.filter(id => id !== file.id));
    } else {
      setSelectedFiles([...selectedFiles, file.id]);
    }
  };

  const handleFileDelete = (id: string) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این فایل را حذف کنید؟')) {
      setMediaFiles(mediaFiles.filter(file => file.id !== id));
      setSelectedFiles(selectedFiles.filter(fileId => fileId !== id));
    }
  };

  const handleFileEdit = (file: MediaFile) => {
    setEditingFile(file);
    setShowEditModal(true);
  };

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return;
    if (confirm(`آیا مطمئن هستید که می‌خواهید ${selectedFiles.length} فایل را حذف کنید؟`)) {
      setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)));
      setSelectedFiles([]);
    }
  };

  const getFileTypeStats = () => {
    const stats = {
      all: mediaFiles.length,
      image: mediaFiles.filter(f => f.type === 'image').length,
      video: mediaFiles.filter(f => f.type === 'video').length,
      audio: mediaFiles.filter(f => f.type === 'audio').length,
      document: mediaFiles.filter(f => f.type === 'document').length,
      archive: mediaFiles.filter(f => f.type === 'archive').length,
      other: mediaFiles.filter(f => f.type === 'other').length
    };
    return stats;
  };

  const stats = getFileTypeStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            کتابخانه رسانه
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            مدیریت تصاویر، ویدیوها و فایل‌های رسانه‌ای
          </p>
        </div>

        {/* آمار کلی */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.all}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">کل فایل‌ها</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.image}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">تصاویر</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-red-600">{stats.video}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">ویدیوها</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-green-600">{stats.audio}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">صوت‌ها</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-orange-600">{stats.document}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">اسناد</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.archive}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">آرشیوها</div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
            <div className="text-2xl font-bold text-gray-600">{stats.other}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">سایر</div>
          </div>
        </div>

        {/* نوار ابزار */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* جستجو و فیلتر */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="جستجو در فایل‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">همه انواع</option>
                <option value="image">تصاویر</option>
                <option value="video">ویدیوها</option>
                <option value="audio">صوت‌ها</option>
                <option value="document">اسناد</option>
                <option value="archive">آرشیوها</option>
                <option value="other">سایر</option>
              </select>
            </div>

            {/* دکمه‌های عملیات */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={viewMode === 'grid' ? 'نمایش لیستی' : 'نمایش شبکه‌ای'}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              
              {selectedFiles.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف انتخاب شده ({selectedFiles.length})
                </button>
              )}
              
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                آپلود فایل
              </button>
            </div>
          </div>
        </div>

        {/* لیست فایل‌ها */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                هیچ فایلی یافت نشد
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                فایل جدیدی آپلود کنید یا فیلترها را تغییر دهید
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                آپلود فایل جدید
              </button>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-6'
              : 'divide-y divide-gray-200 dark:divide-gray-700'
            }>
              {filteredFiles.map((file) => (
                <MediaFileCard
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  onSelect={handleFileSelect}
                  onDelete={handleFileDelete}
                  onEdit={handleFileEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







