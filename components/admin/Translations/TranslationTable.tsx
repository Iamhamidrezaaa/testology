'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import TranslationEditor from './TranslationEditor'

type Translation = {
  id: string
  key: string
  language: string
  value: string
  updatedAt: string
}

type Language = 'fa' | 'en' | 'ar' | 'tr'

export default function TranslationTable({ data, onEdit }: { data: Translation[], onEdit: (t: Translation) => void }) {
  const [search, setSearch] = useState('')
  const [languageFilter, setLanguageFilter] = useState<Language | 'all'>('all')
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null)

  const filteredData = data.filter(item => {
    const matchesSearch = 
      item.key.toLowerCase().includes(search.toLowerCase()) ||
      item.value.toLowerCase().includes(search.toLowerCase())
    
    const matchesLanguage = languageFilter === 'all' || item.language === languageFilter

    return matchesSearch && matchesLanguage
  })

  const getLanguageBadge = (language: Language) => {
    const variants: Record<Language, 'default' | 'secondary' | 'outline'> = {
      fa: 'default',
      en: 'secondary',
      ar: 'outline',
      tr: 'outline'
    }

    const labels: Record<Language, string> = {
      fa: 'فارسی',
      en: 'English',
      ar: 'العربية',
      tr: 'Türkçe'
    }

    return (
      <Badge variant={variants[language]}>
        {labels[language]}
      </Badge>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="جستجو در کلید یا متن ترجمه..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={languageFilter} onValueChange={(value: Language | 'all') => setLanguageFilter(value)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="زبان" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه زبان‌ها</SelectItem>
            <SelectItem value="fa">فارسی</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="ar">العربية</SelectItem>
            <SelectItem value="tr">Türkçe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-right p-4 font-medium">کلید</th>
              <th className="text-right p-4 font-medium">زبان</th>
              <th className="text-right p-4 font-medium">متن</th>
              <th className="text-right p-4 font-medium">آخرین به‌روزرسانی</th>
              <th className="text-right p-4 font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-muted/50">
                <td className="p-4 font-mono text-sm">{item.key}</td>
                <td className="p-4">
                  {getLanguageBadge(item.language as Language)}
                </td>
                <td className="p-4">
                  <div className="max-w-md truncate">
                    {item.value}
                  </div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {new Date(item.updatedAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTranslation(item)}
                  >
                    ویرایش
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedTranslation && (
        <TranslationEditor
          translation={selectedTranslation}
          onSave={(updated) => {
            onEdit(updated)
            setSelectedTranslation(null)
          }}
          onCancel={() => setSelectedTranslation(null)}
        />
      )}
    </Card>
  )
} 