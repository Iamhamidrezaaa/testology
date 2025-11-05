"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { faCalendarAlt, faComment } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface ChatSession {
  id: string
  createdAt: string
  messages: {
    content: string
  }[]
}

export default function ChatSessionList() {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/chat-sessions")
      .then((res) => res.json())
      .then((data) => {
        setSessions(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching chat sessions:", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-xl shadow-sm">
        <FontAwesomeIcon icon={faComment} className="text-4xl text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">هنوز گفت‌وگویی انجام نشده</h3>
        <p className="text-gray-500">برای شروع گفت‌وگو با روان‌شناس، به صفحه چت مراجعه کنید</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">جلسات قبلی</h2>
      <div className="grid gap-4">
        {sessions.map((session) => (
          <Link
            key={session.id}
            href={`/chat/${session.id}`}
            className="block bg-white shadow-sm rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="ml-2" />
              <span>{format(new Date(session.createdAt), "d MMMM yyyy - HH:mm")}</span>
            </div>
            <p className="text-gray-800 line-clamp-2">
              {session.messages[0]?.content || "بدون پیام"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
} 