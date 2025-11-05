'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Folder, 
  Tag, 
  Plus,
  FolderOpen,
  Hash
} from 'lucide-react';
import { Folder as FolderType, Tag as TagType } from '@/types/media';

interface SidebarProps {
  folders: FolderType[];
  tags: TagType[];
  selectedFolder: string | null;
  selectedTag: string | null;
  searchQuery: string;
  onFolderSelect: (folderId: string | null) => void;
  onTagSelect: (tagId: string | null) => void;
  onSearchChange: (query: string) => void;
  onCreateFolder: () => void;
  onCreateTag: () => void;
}

export function Sidebar({
  folders,
  tags,
  selectedFolder,
  selectedTag,
  searchQuery,
  onFolderSelect,
  onTagSelect,
  onSearchChange,
  onCreateFolder,
  onCreateTag,
}: SidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderTree = (parentId: string | null = null, level = 0) => {
    const childFolders = folders.filter(f => f.parentId === parentId);
    
    return childFolders.map(folder => (
      <div key={folder.id} className="ml-4">
        <div 
          className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
            selectedFolder === folder.id ? 'bg-blue-100 text-blue-700' : ''
          }`}
          onClick={() => onFolderSelect(selectedFolder === folder.id ? null : folder.id)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto"
            onClick={(e) => {
              e.stopPropagation();
              toggleFolder(folder.id);
            }}
          >
            {expandedFolders.has(folder.id) ? (
              <FolderOpen className="w-4 h-4" />
            ) : (
              <Folder className="w-4 h-4" />
            )}
          </Button>
          <span className="text-sm truncate" style={{ paddingLeft: `${level * 8}px` }}>
            {folder.name}
          </span>
        </div>
        {expandedFolders.has(folder.id) && renderFolderTree(folder.id, level + 1)}
      </div>
    ));
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Folders */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Folders</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateFolder}
              className="h-6 w-6 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            <div 
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedFolder === null ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => onFolderSelect(null)}
            >
              <Folder className="w-4 h-4" />
              <span className="text-sm">All Files</span>
            </div>
            {renderFolderTree()}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Tags</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCreateTag}
              className="h-6 w-6 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            <div 
              className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                selectedTag === null ? 'bg-blue-100 text-blue-700' : ''
              }`}
              onClick={() => onTagSelect(null)}
            >
              <Hash className="w-4 h-4" />
              <span className="text-sm">All Tags</span>
            </div>
            {tags.map(tag => (
              <div 
                key={tag.id}
                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedTag === tag.id ? 'bg-blue-100 text-blue-700' : ''
                }`}
                onClick={() => onTagSelect(selectedTag === tag.id ? null : tag.id)}
              >
                <Tag className="w-4 h-4" />
                <span className="text-sm">{tag.name}</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  {tag.count || 0}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

