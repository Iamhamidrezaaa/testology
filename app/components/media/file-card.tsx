import { Card, CardContent } from '@/components/ui/card';
import { File } from '@/types/media';

interface FileCardProps {
  file: File;
}

export function FileCard({ file }: FileCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-square bg-muted rounded-lg mb-2 flex items-center justify-center">
          {file.type?.startsWith('image/') ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-4xl text-muted-foreground">
              {file.type?.split('/')[1]?.toUpperCase() || 'FILE'}
            </div>
          )}
        </div>
        <div className="space-y-1">
          <p className="font-medium truncate">{file.name}</p>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(file.size)}
          </p>
          {file.folderId && (
            <p className="text-sm text-muted-foreground">
              Folder ID: {file.folderId}
            </p>
          )}
          {file.tags && file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {file.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 