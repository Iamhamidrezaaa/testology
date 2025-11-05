import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '@/lib/utils'

interface EditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export default function Editor({ value, onChange, className }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  return (
    <div className={cn('border rounded-md', className)}>
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4" />
    </div>
  )
} 