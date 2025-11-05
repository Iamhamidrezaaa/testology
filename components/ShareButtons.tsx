import { Copy } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const encodedTitle = encodeURIComponent(title)
  const encodedURL = encodeURIComponent(url)

  return (
    <div className="flex gap-3 items-center flex-wrap">
      <a
        href={`https://t.me/share/url?url=${encodedURL}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline text-sm"
      >
        اشتراک در تلگرام
      </a>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encodedURL}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:underline text-sm"
      >
        اشتراک در واتساپ
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedURL}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline text-sm"
      >
        اشتراک در توییتر
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-gray-700 hover:text-black text-sm"
      >
        <Copy className="w-4 h-4" />
        {copied ? 'کپی شد!' : 'کپی لینک'}
      </button>
    </div>
  )
} 