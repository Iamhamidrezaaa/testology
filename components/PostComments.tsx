import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import { CommentForm } from './CommentForm'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function PostComments() {
  const router = useRouter()
  const { slug } = router.query
  const { data: comments, error, mutate } = useSWR<Comment[]>(
    slug ? `/api/comments?slug=${slug}` : null,
    fetcher
  )

  if (!slug) return null

  const handleNewComment = (newComment: Comment) => {
    mutate([newComment, ...(comments || [])], false)
  }

  return (
    <div className="mt-10 space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">نظرات کاربران</h3>
      
      <CommentForm slug={slug as string} onNewComment={handleNewComment} />

      {error && (
        <p className="text-red-500 text-sm">خطا در بارگذاری نظرات</p>
      )}

      {!comments && !error && (
        <p className="text-sm text-gray-500">در حال بارگذاری...</p>
      )}

      {comments && comments.length === 0 && (
        <p className="text-gray-500 text-sm">هنوز نظری ثبت نشده است.</p>
      )}

      {comments?.map((comment) => (
        <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              {comment.user?.image ? (
                <AvatarImage src={comment.user.image} alt={comment.user.name || 'کاربر'} />
              ) : (
                <AvatarFallback>{comment.user.name?.[0] || 'ک'}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium">{comment.user.name || 'کاربر'}</div>
                <div className="text-xs text-gray-500">
                  {format(new Date(comment.createdAt), 'd MMMM yyyy', { locale: faIR })}
                </div>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 