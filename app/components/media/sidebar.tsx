import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Folder, Tag, Search } from 'lucide-react';
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
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Folders</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCreateFolder}
              >
                <Folder className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                <Button
                  variant={selectedFolder === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => onFolderSelect(null)}
                >
                  All Files
                </Button>
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant={selectedFolder === folder.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => onFolderSelect(folder.id)}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    {folder.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {folder.fileCount || 0}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Tags</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={onCreateTag}
              >
                <Tag className="w-4 h-4" />
              </Button>
            </div>
            <ScrollArea className="h-[200px]">
              <div className="space-y-1">
                <Button
                  variant={selectedTag === null ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => onTagSelect(null)}
                >
                  All Tags
                </Button>
                {tags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTag === tag.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => onTagSelect(tag.id)}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    {tag.name}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {tag.count || 0}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 