import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface CommentFormProps {
  slug: string
  parentId?: string
  onNewComment: (comment: any) => void
}

export function CommentForm({ slug, parentId, onNewComment }: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.warning('لطفاً نظر خود را بنویسید.')
      return
    }

    try {
      setLoading(true)
      const res = await axios.post('/api/comments', { slug, content, parentId })
      onNewComment(res.data)
      setContent('')
      toast.success('نظر شما با موفقیت ثبت شد.')
    } catch (error) {
      toast.error('ارسال نظر با خطا مواجه شد.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (!session) return <p className="text-sm text-gray-500">برای ثبت نظر، لطفاً وارد شوید.</p>

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "پاسخ خود را بنویسید..." : "نظر خود را بنویسید..."}
        rows={3}
        className="min-h-[100px]"
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'در حال ارسال...' : parentId ? 'ارسال پاسخ' : 'ارسال نظر'}
      </Button>
    </div>
  )
} 