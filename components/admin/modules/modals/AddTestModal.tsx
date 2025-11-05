'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from '@/components/ui/multi-select'
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const TAG_OPTIONS = [
  { value: 'personality', label: 'شخصیت' },
  { value: 'career', label: 'شغلی' },
  { value: 'education', label: 'آموزشی' },
  { value: 'health', label: 'سلامت' },
  { value: 'relationship', label: 'روابط' }
]

const GENDER_OPTIONS = [
  { value: 'all', label: 'همه' },
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' }
]

type AddTestModalProps = {
  isOpen: boolean
  onClose: () => void
  onAdd: (test: { title: string; description: string; category: string }) => void
}

export default function AddTestModal({ isOpen, onClose, onAdd }: AddTestModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [] as string[],
    targetGender: 'all',
    category: ''
  })
  const [isCommandOpen, setIsCommandOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(formData)
    setFormData({
      title: '',
      description: '',
      tags: [],
      targetGender: 'all',
      category: ''
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ایجاد تست جدید</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">عنوان</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="عنوان تست"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">توضیحات</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="توضیحات تست"
              required
            />
          </div>

          <div>
            <Label>دسته‌بندی</Label>
            <Command>
              <CommandInput placeholder="دسته‌بندی را جستجو کنید..." />
              <CommandEmpty>دسته‌بندی یافت نشد.</CommandEmpty>
              <CommandGroup>
                {TAG_OPTIONS.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setFormData(prev => ({
                        ...prev,
                        category: currentValue === formData.category ? '' : currentValue
                      }))
                      setIsCommandOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        formData.category === framework.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </div>

          <div>
            <label className="text-sm font-medium">برچسب‌ها</label>
            <MultiSelect
              options={TAG_OPTIONS}
              selectedValues={formData.tags?.map(tag => ({ value: tag, label: tag })) || []}
              onChange={(selected) => setFormData(prev => ({ 
                ...prev, 
                tags: selected.map(s => s.value)
              }))}
              placeholder="انتخاب برچسب‌ها"
            />
          </div>

          <div>
            <label className="text-sm font-medium">جنسیت هدف</label>
            <MultiSelect
              options={GENDER_OPTIONS}
              selectedValues={formData.targetGender ? [{ 
                value: formData.targetGender, 
                label: GENDER_OPTIONS.find(opt => opt.value === formData.targetGender)?.label || ''
              }] : []}
              onChange={(selected) => setFormData(prev => ({ 
                ...prev, 
                targetGender: selected[0]?.value || 'all'
              }))}
              placeholder="انتخاب جنسیت هدف"
              isSingle
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit">
              ایجاد تست
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 