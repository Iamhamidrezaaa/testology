"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Save, 
  X,
  StickyNote,
  Calendar,
  User
} from "lucide-react";
import { format } from "date-fns-jalali";

interface Note {
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

interface SessionNotesProps {
  userId: string;
  advisorId: string;
}

export default function SessionNotes({ userId, advisorId }: SessionNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [userId, advisorId]);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`/api/notes?userId=${userId}&advisorId=${advisorId}`);
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleAdd = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content, advisorId }),
      });

      if (response.ok) {
        const newNote = await response.json();
        setNotes([newNote, ...notes]);
        setContent("");
      }
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = async (noteId: string) => {
    if (!editContent.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map(n => n.id === noteId ? updatedNote : n));
        setEditingNote(null);
        setEditContent("");
      }
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent("");
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این یادداشت را حذف کنید؟')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotes(notes.filter(n => n.id !== noteId));
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    window.open(`/api/export-notes?userId=${userId}&advisorId=${advisorId}`, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-blue-600" />
            یادداشت‌های مشاور
          </CardTitle>
          <Button
            onClick={handleExportPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* فرم افزودن یادداشت جدید */}
        <div className="space-y-3">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="یادداشت جدید مشاور..."
            rows={3}
            className="w-full"
          />
          <Button 
            onClick={handleAdd} 
            disabled={!content.trim() || loading}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {loading ? 'در حال افزودن...' : 'افزودن یادداشت'}
          </Button>
        </div>

        {/* لیست یادداشت‌ها */}
        <div className="space-y-3">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>هنوز یادداشتی ثبت نشده است</p>
            </div>
          ) : (
            notes.map((note) => (
              <Card key={note.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  {editingNote === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSaveEdit(note.id)}
                          disabled={!editContent.trim() || loading}
                          className="flex items-center gap-1"
                        >
                          <Save className="w-4 h-4" />
                          {loading ? 'در حال ذخیره...' : 'ذخیره'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={loading}
                          className="flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          لغو
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                            {note.content}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(note)}
                            disabled={loading}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(note.id)}
                            disabled={loading}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {format(new Date(note.createdAt), 'yyyy/MM/dd HH:mm')}
                        </div>
                        {note.updatedAt !== note.createdAt && (
                          <span className="text-blue-600">
                            ویرایش شده: {format(new Date(note.updatedAt), 'yyyy/MM/dd HH:mm')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}






















