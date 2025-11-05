export interface File {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  folderId?: string;
  tags?: Tag[];
  metadata?: Record<string, any>;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
  children?: Folder[];
  fileCount?: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  count?: number;
}

export interface MediaUpload {
  file: File;
  folderId?: string;
  tags?: string[];
}

export interface MediaFilter {
  folderId?: string;
  tagId?: string;
  search?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}