import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { faIR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { CommentForm } from './CommentForm'
import { LikeDislike } from './LikeDislike'
import { Badge } from '@/components/ui/badge'
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

interface CommentThreadProps {
  comment: Comment
  slug: string
  onReply: (reply: Comment) => void
}

export function CommentThread({ comment, slug, onReply }: CommentThreadProps) {
  const [showReply, setShowReply] = useState(false)
  const isTopComment = comment.likedBy.length >= 5

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg shadow-sm border ${
        isTopComment ? 'bg-green-50 border-green-300' : 'bg-white'
      }`}>
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
              <div className="flex items-center gap-2">
                <div className="font-medium">{comment.user.name || 'کاربر'}</div>
                {isTopComment && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                    <Trophy className="w-3 h-3 ml-1" />
                    پاسخ برتر
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {format(new Date(comment.createdAt), 'd MMMM yyyy', { locale: faIR })}
              </div>
            </div>
            <p className="text-gray-700">{comment.content}</p>
            <div className="flex items-center gap-4 mt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700"
                onClick={() => setShowReply(!showReply)}
              >
                {showReply ? 'انصراف' : 'پاسخ'}
              </Button>
              <LikeDislike
                commentId={comment.id}
                likedBy={comment.likedBy}
                dislikedBy={comment.dislikedBy}
              />
            </div>
          </div>
        </div>
      </div>

      {showReply && (
        <div className="mr-8">
          <CommentForm
            slug={slug}
            parentId={comment.id}
            onNewComment={onReply}
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mr-8 space-y-4">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              slug={slug}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  )
} 