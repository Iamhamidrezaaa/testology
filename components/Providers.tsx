'use client'

import { LoginModalProvider } from '@/contexts/LoginModalContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LoginModalProvider>
      {children}
    </LoginModalProvider>
  )
} 