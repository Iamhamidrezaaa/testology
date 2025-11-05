import { useState } from 'react'
import { CommentThread } from './CommentThread'
import { CommentForm } from './CommentForm'
import { useSession } from 'next-auth/react'
import { Trophy } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string | null
    image: string | null
  }
  replies?: Comment[]
  likedBy: string[]
  dislikedBy: string[]
}

interface CommentListProps {
  comments: Comment[]
  slug: string
}

export function CommentList({ comments, slug }: CommentListProps) {
  const { data: session } = useSession()
  const [newComments, setNewComments] = useState<Comment[]>([])

  const handleNewComment = (comment: Comment) => {
    setNewComments(prev => [...prev, comment])
  }

  const allComments = [...comments, ...newComments]
  const topComment = allComments[0]

  return (
    <div className="space-y-8">
      <CommentForm slug={slug} onNewComment={handleNewComment} />
      
      {topComment?.likedBy.length >= 5 && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <h4 className="font-bold text-yellow-800">محبوب‌ترین نظر</h4>
          </div>
          <div className="text-sm text-yellow-700 mb-2">{topComment.content}</div>
          <div className="text-xs text-yellow-600">
            توسط {topComment.user.name || 'کاربر'} در{' '}
            {new Date(topComment.createdAt).toLocaleDateString('fa-IR')}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {allComments.map((comment) => (
          <CommentThread
            key={comment.id}
            comment={comment}
            slug={slug}
            onReply={handleNewComment}
          />
        ))}
      </div>
    </div>
  )
} 