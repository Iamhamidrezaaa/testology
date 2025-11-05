import { ThumbsUp, ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface LikeDislikeProps {
  commentId: string
  likedBy: string[]
  dislikedBy: string[]
}

export function LikeDislike({ commentId, likedBy, dislikedBy }: LikeDislikeProps) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState(likedBy.length)
  const [dislikes, setDislikes] = useState(dislikedBy.length)
  const [liked, setLiked] = useState(likedBy.includes(session?.user?.id || ''))
  const [disliked, setDisliked] = useState(dislikedBy.includes(session?.user?.id || ''))
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!session?.user) {
      toast.warning('لطفاً وارد شوید')
      return
    }

    try {
      setLoading(true)
      await axios.post('/api/comments/like', { commentId })
      setLiked(!liked)
      setDisliked(false)
      setLikes(prev => liked ? prev - 1 : prev + 1)
      if (disliked) setDislikes(prev => prev - 1)
      toast.success(liked ? 'لایک شما برداشته شد' : 'نظر شما لایک شد')
    } catch (error) {
      toast.error('خطا در ثبت لایک')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDislike = async () => {
    if (!session?.user) {
      toast.warning('لطفاً وارد شوید')
      return
    }

    try {
      setLoading(true)
      await axios.post('/api/comments/dislike', { commentId })
      setDisliked(!disliked)
      setLiked(false)
      setDislikes(prev => disliked ? prev - 1 : prev + 1)
      if (liked) setLikes(prev => prev - 1)
      toast.success(disliked ? 'دیسلایک شما برداشته شد' : 'نظر شما دیسلایک شد')
    } catch (error) {
      toast.error('خطا در ثبت دیسلایک')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3 text-sm mt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-1 ${liked ? 'text-blue-600' : 'text-gray-500'}`}
      >
        <ThumbsUp size={16} />
        <span>{likes}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDislike}
        disabled={loading}
        className={`flex items-center gap-1 ${disliked ? 'text-red-600' : 'text-gray-500'}`}
      >
        <ThumbsDown size={16} />
        <span>{dislikes}</span>
      </Button>
    </div>
  )
} 