'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type SiteSettings = {
  siteTitle: string
  welcomeText: string
  metaDescription: string
  metaKeywords: string
  gptEnabled: boolean
  darkMode: boolean
  footerText: string
  logoUrl: string
  faviconUrl: string
}

type SiteSettingsContextType = {
  settings: SiteSettings | null
  isLoading: boolean
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: null,
  isLoading: true
})

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/admin/site-settings')
        const data = await res.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching site settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, isLoading }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider')
  }
  return context
} 