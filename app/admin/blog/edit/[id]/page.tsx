'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '../../../../components/ImageUpload';
import { 
  Save, 
  Eye, 
  Upload, 
  Image, 
  Video, 
  Link, 
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
  Plus,
  Trash2,
  Move,
  Settings,
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
  Redo
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  metaDescription: string;
  category: string;
  imageUrl: string;
  tags: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface EditorElement {
  id: string;
  type: 'text' | 'heading' | 'image' | 'video' | 'button' | 'divider' | 'spacer' | 'columns' | 'card' | 'quote' | 'list' | 'code' | 'social' | 'test-link';
  content: string;
  styles: Record<string, any>;
  children?: EditorElement[];
  responsive?: {
    mobile?: Record<string, any>;
    tablet?: Record<string, any>;
    desktop?: Record<string, any>;
  };
}

const EditorElementComponent = ({ element, onUpdate, onDelete, onMove }: {
  element: EditorElement;
  onUpdate: (id: string, updates: Partial<EditorElement>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: 'up' | 'down') => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const renderElement = () => {
    const baseClasses = "relative group min-h-[50px] border-2 border-dashed border-transparent hover:border-blue-300 transition-all duration-200";
    
    switch (element.type) {
      case 'text':
        return (
          <div 
            className={`${baseClasses} p-4`}
            style={element.styles}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isEditing ? (
              <textarea
                value={element.content}
                onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                className="w-full h-full resize-none border-none outline-none bg-transparent"
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <div 
                dangerouslySetInnerHTML={{ __html: element.content }}
                onClick={() => setIsEditing(true)}
                className="cursor-text"
              />
            )}
          </div>
        );

      case 'heading':
        const HeadingTag = `h${element.styles.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isEditing ? (
              <input
                type="text"
                value={element.content}
                onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                className="w-full text-2xl font-bold border-none outline-none bg-transparent"
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <HeadingTag 
                dangerouslySetInnerHTML={{ __html: element.content }}
                onClick={() => setIsEditing(true)}
                className="cursor-text"
                style={element.styles}
              />
            )}
          </div>
        );

      case 'image':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="relative">
              {element.content ? (
                <img 
                  src={element.content} 
                  alt="تصویر" 
                  className="w-full h-auto rounded-lg"
                  style={element.styles}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">تصویر را اینجا بکشید</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'button':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isEditing ? (
              <input
                type="text"
                value={element.content}
                onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded"
                onBlur={() => setIsEditing(false)}
                autoFocus
              />
            ) : (
              <button 
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setIsEditing(true)}
                style={element.styles}
              >
                {element.content || 'دکمه'}
              </button>
            )}
          </div>
        );

      case 'columns':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {element.children?.map((child, index) => (
                <div key={child.id} className="border border-gray-200 rounded p-4">
                  <EditorElementComponent 
                    element={child} 
                    onUpdate={onUpdate} 
                    onDelete={onDelete}
                    onMove={onMove}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'card':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-2">عنوان کارت</h3>
              <p className="text-gray-600">محتوای کارت اینجا قرار می‌گیرد</p>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
              {isEditing ? (
                <textarea
                  value={element.content}
                  onChange={(e) => onUpdate(element.id, { content: e.target.value })}
                  className="w-full h-full resize-none border-none outline-none bg-transparent"
                  onBlur={() => setIsEditing(false)}
                  autoFocus
                />
              ) : (
                <div 
                  dangerouslySetInnerHTML={{ __html: element.content }}
                  onClick={() => setIsEditing(true)}
                  className="cursor-text"
                />
              )}
            </blockquote>
          </div>
        );

      case 'divider':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <hr className="border-gray-300" style={element.styles} />
          </div>
        );

      case 'spacer':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-gray-100 h-8 rounded" style={element.styles}></div>
          </div>
        );

      case 'test-link':
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg text-center">
              <h3 className="text-xl font-bold mb-2">تست روان‌شناسی</h3>
              <p className="mb-4">تست شخصیت خود را انجام دهید</p>
              <button className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                شروع تست
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div 
            className={`${baseClasses} p-4`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="text-gray-500">عنصر ناشناخته</div>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {renderElement()}
      
      {/* Toolbar */}
      {isHovered && (
        <div className="absolute -top-10 left-0 bg-gray-800 text-white rounded-lg p-2 flex items-center gap-2 z-10">
          <button
            onClick={() => onMove(element.id, 'up')}
            className="p-1 hover:bg-gray-700 rounded"
            title="جابجایی به بالا"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove(element.id, 'down')}
            className="p-1 hover:bg-gray-700 rounded"
            title="جابجایی به پایین"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(element.id)}
            className="p-1 hover:bg-red-600 rounded"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 hover:bg-gray-700 rounded"
            title="ویرایش"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default function BlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [elements, setElements] = useState<EditorElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showCoverImageModal, setShowCoverImageModal] = useState(false);
  const [coverImage, setCoverImage] = useState<string>(blogPost?.imageUrl || '');

  useEffect(() => {
    if (params.id) {
      fetchBlogPost();
    }
  }, [params.id]);

  const fetchBlogPost = async () => {
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBlogPost(data);
        setCoverImage(data.imageUrl || '');
        
        // Parse existing content or create default elements
        if (data.content) {
          try {
            const parsedElements = JSON.parse(data.content);
            setElements(parsedElements);
          } catch {
            // If content is not JSON, create a text element
            setElements([{
              id: '1',
              type: 'text',
              content: data.content,
              styles: {}
            }]);
          }
        } else {
          setElements([{
            id: '1',
            type: 'text',
            content: 'محتوای مقاله خود را اینجا بنویسید...',
            styles: {}
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const addElement = (type: EditorElement['type']) => {
    const newElement: EditorElement = {
      id: Date.now().toString(),
      type,
      content: '',
      styles: {},
      children: type === 'columns' ? [
        { id: Date.now().toString() + '_1', type: 'text', content: 'ستون 1', styles: {} },
        { id: Date.now().toString() + '_2', type: 'text', content: 'ستون 2', styles: {} }
      ] : undefined
    };
    
    setElements([...elements, newElement]);
    setShowAddMenu(false);
  };

  const updateElement = (id: string, updates: Partial<EditorElement>) => {
    setElements(elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    ));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
  };

  const moveElement = (id: string, direction: 'up' | 'down') => {
    const index = elements.findIndex(el => el.id === id);
    if (index === -1) return;

    const newElements = [...elements];
    if (direction === 'up' && index > 0) {
      [newElements[index - 1], newElements[index]] = [newElements[index], newElements[index - 1]];
    } else if (direction === 'down' && index < elements.length - 1) {
      [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
    }
    
    setElements(newElements);
  };

  const saveBlogPost = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: JSON.stringify(elements),
          title: blogPost?.title,
          metaDescription: blogPost?.metaDescription,
          category: blogPost?.category,
          tags: blogPost?.tags,
          published: blogPost?.published,
          imageUrl: coverImage
        }),
      });

      if (response.ok) {
        alert('مقاله با موفقیت ذخیره شد!');
      } else {
        alert('خطا در ذخیره مقاله');
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert('خطا در ذخیره مقاله');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">در حال بارگذاری...</div>
      </div>
    );
  }

  if (!blogPost) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">مقاله یافت نشد</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* عکس کاور */}
              {coverImage && (
                <div className="flex-shrink-0">
                  <img
                    src={coverImage}
                    alt="عکس کاور"
                    className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ویرایش مقاله: {blogPost.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  ادیتور پیشرفته مقالات
                  {coverImage && (
                    <span className="ml-2 text-green-600 dark:text-green-400">
                      ✓ عکس کاور تنظیم شده
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCoverImageModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <Image className="w-4 h-4" />
                عکس کاور
              </button>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Eye className="w-4 h-4" />
                {previewMode ? 'ویرایش' : 'پیش‌نمایش'}
              </button>
              <button
                onClick={saveBlogPost}
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4" />
                {saving ? 'در حال ذخیره...' : 'ذخیره'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        {!previewMode && (
          <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                عناصر
              </h3>
              
              {/* Add Element Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAddMenu(!showAddMenu)}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  افزودن عنصر
                </button>
                
                {showAddMenu && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                    <div className="p-2">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">متن</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => addElement('text')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Type className="w-4 h-4 mb-1" />
                          <div className="text-xs">متن</div>
                        </button>
                        <button onClick={() => addElement('heading')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Heading1 className="w-4 h-4 mb-1" />
                          <div className="text-xs">عنوان</div>
                        </button>
                        <button onClick={() => addElement('quote')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Quote className="w-4 h-4 mb-1" />
                          <div className="text-xs">نقل قول</div>
                        </button>
                        <button onClick={() => addElement('list')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <List className="w-4 h-4 mb-1" />
                          <div className="text-xs">لیست</div>
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">رسانه</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => addElement('image')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Image className="w-4 h-4 mb-1" />
                          <div className="text-xs">تصویر</div>
                        </button>
                        <button onClick={() => addElement('video')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Video className="w-4 h-4 mb-1" />
                          <div className="text-xs">ویدیو</div>
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">لایه‌بندی</h4>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <button onClick={() => addElement('columns')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Columns className="w-4 h-4 mb-1" />
                          <div className="text-xs">ستون</div>
                        </button>
                        <button onClick={() => addElement('card')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Square className="w-4 h-4 mb-1" />
                          <div className="text-xs">کارت</div>
                        </button>
                        <button onClick={() => addElement('divider')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <div className="w-4 h-4 mb-1 border-t-2 border-gray-400"></div>
                          <div className="text-xs">جداکننده</div>
                        </button>
                        <button onClick={() => addElement('spacer')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <div className="w-4 h-4 mb-1 bg-gray-300 rounded"></div>
                          <div className="text-xs">فاصله</div>
                        </button>
                      </div>
                      
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ویژه</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => addElement('button')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <div className="w-4 h-4 mb-1 bg-blue-500 rounded text-white text-xs flex items-center justify-center">B</div>
                          <div className="text-xs">دکمه</div>
                        </button>
                        <button onClick={() => addElement('test-link')} className="p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                          <Target className="w-4 h-4 mb-1" />
                          <div className="text-xs">لینک تست</div>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Elements List */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  عناصر موجود ({elements.length})
                </h4>
                <div className="space-y-2">
                  {elements.map((element, index) => (
                    <div
                      key={element.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedElement === element.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => setSelectedElement(element.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                          {element.type === 'text' && <Type className="w-3 h-3" />}
                          {element.type === 'heading' && <Heading1 className="w-3 h-3" />}
                          {element.type === 'image' && <Image className="w-3 h-3" />}
                          {element.type === 'button' && <div className="w-3 h-3 bg-blue-500 rounded text-white text-xs flex items-center justify-center">B</div>}
                          {element.type === 'columns' && <Columns className="w-3 h-3" />}
                          {element.type === 'card' && <Square className="w-3 h-3" />}
                          {element.type === 'quote' && <Quote className="w-3 h-3" />}
                          {element.type === 'divider' && <div className="w-3 h-3 border-t border-gray-400"></div>}
                          {element.type === 'spacer' && <div className="w-3 h-3 bg-gray-300 rounded"></div>}
                          {element.type === 'test-link' && <Target className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {element.type === 'text' && 'متن'}
                            {element.type === 'heading' && 'عنوان'}
                            {element.type === 'image' && 'تصویر'}
                            {element.type === 'button' && 'دکمه'}
                            {element.type === 'columns' && 'ستون'}
                            {element.type === 'card' && 'کارت'}
                            {element.type === 'quote' && 'نقل قول'}
                            {element.type === 'divider' && 'جداکننده'}
                            {element.type === 'spacer' && 'فاصله'}
                            {element.type === 'test-link' && 'لینک تست'}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {element.content.substring(0, 30)}...
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          #{index + 1}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {previewMode ? (
            <div className="flex-1 bg-white dark:bg-gray-800 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {blogPost.title}
                </h1>
                <div className="prose prose-lg max-w-none">
                  {elements.map((element) => (
                    <EditorElementComponent
                      key={element.id}
                      element={element}
                      onUpdate={updateElement}
                      onDelete={deleteElement}
                      onMove={moveElement}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm min-h-[600px]">
                <div className="p-6">
                  {elements.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <Layout className="w-16 h-16 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        مقاله خالی است
                      </h3>
                      <p className="text-gray-500 dark:text-gray-500">
                        برای شروع، یک عنصر از نوار کناری اضافه کنید
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {elements.map((element) => (
                        <EditorElementComponent
                          key={element.id}
                          element={element}
                          onUpdate={updateElement}
                          onDelete={deleteElement}
                          onMove={moveElement}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal عکس کاور */}
      {showCoverImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  تنظیم عکس کاور
                </h3>
                <button
                  onClick={() => setShowCoverImageModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* نمایش عکس کاور فعلی */}
                {coverImage && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      عکس کاور فعلی
                    </h4>
                    <div className="relative">
                      <img
                        src={coverImage}
                        alt="عکس کاور"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <button
                        onClick={() => setCoverImage('')}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="حذف عکس کاور"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* آپلود عکس کاور جدید */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {coverImage ? 'تغییر عکس کاور' : 'اضافه کردن عکس کاور'}
                  </h4>
                  <ImageUpload
                    onImageSelect={setCoverImage}
                    currentImage={coverImage}
                    className="w-full"
                  />
                </div>

                {/* اطلاعات عکس کاور */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    نکات مهم عکس کاور:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• عکس کاور در صفحه بلاگ به عنوان thumbnail نمایش داده می‌شود</li>
                    <li>• اندازه پیشنهادی: 1200x630 پیکسل</li>
                    <li>• فرمت‌های پشتیبانی شده: JPG, PNG, WebP</li>
                    <li>• حداکثر حجم: 5MB</li>
                    <li>• عکس باید واضح و با کیفیت باشد</li>
                  </ul>
                </div>

                {/* دکمه‌های عملیات */}
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowCoverImageModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={() => {
                      setBlogPost(prev => prev ? { ...prev, imageUrl: coverImage } : null);
                      setShowCoverImageModal(false);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    اعمال تغییرات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
