'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import ChatBox from './ChatBox'

export default function ChatToggleWrapper() {
  const { data: session, status } = useSession()
  const [screeningDone, setScreeningDone] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/screening-status')
        .then(res => res.json())
        .then(data => {
          setScreeningDone(data.screeningDone)
          setChecked(true)
        })
        .catch(err => {
          console.error('Error checking screening status:', err)
          setChecked(true)
        })
    }
  }, [status])

  if (status !== 'authenticated' || !checked) return null
  if (!screeningDone) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ChatBox />
    </div>
  )
} 