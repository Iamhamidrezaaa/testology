'use client'

import { useSession, signOut } from 'next-auth/react'
import SessionCountdown from './SessionCountdown'

export default function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              سلام {session?.user?.name}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <SessionCountdown />
            <div className="text-sm text-gray-500">
              {session?.user?.email}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              خروج
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 