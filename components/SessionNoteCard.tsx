import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Edit, 
  Trash2, 
  Download, 
  Save, 
  X,
  FileText,
  Calendar
} from "lucide-react";
import { format } from "date-fns-jalali";

interface SessionNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  advisor: {
    id: string;
    name: string;
    email: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface SessionNoteCardProps {
  note: SessionNote;
  onUpdate: (noteId: string, content: string) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
  onGeneratePDF: (advisorId: string, userId: string) => void;
}

export default function SessionNoteCard({ 
  note, 
  onUpdate, 
  onDelete, 
  onGeneratePDF 
}: SessionNoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!editContent.trim()) return;
    
    setIsLoading(true);
    try {
      await onUpdate(note.id, editContent);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditContent(note.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟')) {
      setIsLoading(true);
      try {
        await onDelete(note.id);
      } catch (error) {
        console.error('Error deleting note:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleGeneratePDF = () => {
    onGeneratePDF(note.advisor.id, note.user.id);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="w-5 h-5 text-blue-600" />
            یادداشت جلسه
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleGeneratePDF}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              PDF
            </Button>
            {!isEditing && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1"
                >
                  <Edit className="w-4 h-4" />
                  ویرایش
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center gap-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                  حذف
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {format(new Date(note.createdAt), 'yyyy/MM/dd HH:mm')}
          </div>
          {note.updatedAt !== note.createdAt && (
            <span className="text-xs text-blue-600">
              ویرایش شده: {format(new Date(note.updatedAt), 'yyyy/MM/dd HH:mm')}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="محتوای یادداشت را اینجا بنویسید..."
              rows={4}
              className="w-full"
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isLoading || !editContent.trim()}
                className="flex items-center gap-1"
              >
                <Save className="w-4 h-4" />
                {isLoading ? 'در حال ذخیره...' : 'ذخیره'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                لغو
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}






















