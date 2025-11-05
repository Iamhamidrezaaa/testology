"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface UISettings {
  sidebarOpen: boolean
  notificationsOpen: boolean
  searchOpen: boolean
}

interface UISettingsContextType {
  settings: UISettings
  updateSettings: (newSettings: Partial<UISettings>) => void
}

const defaultSettings: UISettings = {
  sidebarOpen: false,
  notificationsOpen: false,
  searchOpen: false,
}

const UISettingsContext = createContext<UISettingsContextType | undefined>(undefined)

export function UISettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UISettings>(defaultSettings)

  const updateSettings = (newSettings: Partial<UISettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  return (
    <UISettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UISettingsContext.Provider>
  )
}

export function useUISettings() {
  const context = useContext(UISettingsContext)
  if (context === undefined) {
    throw new Error('useUISettings must be used within a UISettingsProvider')
  }
  return context
} 