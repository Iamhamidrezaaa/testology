'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FileCard } from '@/components/media/file-card';
import { Sidebar } from '@/components/media/sidebar';
import { File, Folder, Tag } from '@/types/media';

export default function MediaPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (session?.user && !(session.user as any).isAdmin) {
      router.push('/');
      return;
    }

    fetchFiles();
    fetchFolders();
    fetchTags();
  }, [session, selectedFolder, selectedTag, searchQuery]);

  const fetchFiles = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedFolder) params.append('folderId', selectedFolder);
      if (selectedTag) params.append('tagId', selectedTag);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/admin/files?${params}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to load files');
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch('/api/admin/folders');
      if (!response.ok) throw new Error('Failed to fetch folders');
      const data = await response.json();
      setFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/admin/tags');
      if (!response.ok) throw new Error('Failed to fetch tags');
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error('Error fetching tags:', error);
      toast.error('Failed to load tags');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', files[0]);
      if (selectedFolder) formData.append('folderId', selectedFolder);

      const response = await fetch('/api/admin/files', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload file');
      
      toast.success('File uploaded successfully');
      fetchFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreateFolder = async () => {
    const name = prompt('Enter folder name:');
    if (!name) return;

    try {
      const response = await fetch('/api/admin/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, parentId: selectedFolder }),
      });

      if (!response.ok) throw new Error('Failed to create folder');
      
      toast.success('Folder created successfully');
      fetchFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
    }
  };

  const handleCreateTag = async () => {
    const name = prompt('Enter tag name:');
    if (!name) return;

    try {
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to create tag');
      
      toast.success('Tag created successfully');
      fetchTags();
    } catch (error) {
      console.error('Error creating tag:', error);
      toast.error('Failed to create tag');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <label>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            className="flex items-center gap-2"
            disabled={isUploading}
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </label>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <Sidebar
            folders={folders}
            tags={tags}
            selectedFolder={selectedFolder}
            selectedTag={selectedTag}
            searchQuery={searchQuery}
            onFolderSelect={setSelectedFolder}
            onTagSelect={setSelectedTag}
            onSearchChange={setSearchQuery}
            onCreateFolder={handleCreateFolder}
            onCreateTag={handleCreateTag}
          />
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <div className="grid grid-cols-3 gap-4">
            {files.map((file) => (
              <FileCard key={file.id} file={file} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 