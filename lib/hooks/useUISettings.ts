import { useEffect, useState } from 'react'

interface UISettings {
  theme: 'light' | 'dark' | 'custom'
  font: 'Vazir' | 'IranSans' | 'Dana'
  direction: 'rtl' | 'ltr'
}

const defaultSettings: UISettings = {
  theme: 'light',
  font: 'Vazir',
  direction: 'rtl'
}

export function useUISettings() {
  const [settings, setSettings] = useState<UISettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/ui-settings')
      if (!res.ok) throw new Error('خطا در دریافت تنظیمات')
      const data = await res.json()
      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error('Error fetching UI settings:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    settings,
    loading,
    refetch: fetchSettings
  }
} 