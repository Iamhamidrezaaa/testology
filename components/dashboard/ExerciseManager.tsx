'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'

interface ExerciseMeta {
  id: string
  title: string
  description: string
  category: string
  suitableFor: {
    conditions: string[]
    ageRange: { min: number; max: number }
    gender: string
  }
  estimatedTime: number
  steps: string[]
  icon: string
}

export default function ExerciseManager() {
  const [exercises, setExercises] = useState<ExerciseMeta[]>([])
  const [newExercise, setNewExercise] = useState<Omit<ExerciseMeta, 'id' | 'createdAt' | 'updatedAt'>>({
    title: '',
    description: '',
    category: 'breathing',
    suitableFor: {
      conditions: [],
      ageRange: { min: 12, max: 100 },
      gender: 'any'
    },
    estimatedTime: 10,
    steps: [],
    icon: '🧘'
  })
  const [conditionInput, setConditionInput] = useState('')
  const [stepInput, setStepInput] = useState('')

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await fetch('/api/exercises')
        if (!res.ok) throw new Error('Failed to fetch exercises')
        const data = await res.json()
        setExercises(data)
      } catch (err) {
        console.error('Failed to fetch exercises:', err)
        toast.error('خطا در دریافت تمرین‌ها')
      }
    }
    fetchExercises()
  }, [])

  const handleAddCondition = () => {
    if (conditionInput.trim() && !newExercise.suitableFor.conditions.includes(conditionInput.trim())) {
      setNewExercise({
        ...newExercise,
        suitableFor: {
          ...newExercise.suitableFor,
          conditions: [...newExercise.suitableFor.conditions, conditionInput.trim()]
        }
      })
      setConditionInput('')
    }
  }

  const handleAddStep = () => {
    if (stepInput.trim()) {
      setNewExercise({
        ...newExercise,
        steps: [...newExercise.steps, stepInput.trim()]
      })
      setStepInput('')
    }
  }

  const handleAddExercise = async () => {
    try {
      const res = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExercise)
      })

      if (!res.ok) throw new Error('Failed to add exercise')

      const data = await res.json()
      setExercises([...exercises, data])
      setNewExercise({
        title: '',
        description: '',
        category: 'breathing',
        suitableFor: {
          conditions: [],
          ageRange: { min: 12, max: 100 },
          gender: 'any'
        },
        estimatedTime: 10,
        steps: [],
        icon: '🧘'
      })
      toast.success('تمرین با موفقیت اضافه شد')
    } catch (err) {
      console.error('Failed to add exercise:', err)
      toast.error('خطا در افزودن تمرین')
    }
  }

  return (
    <div className="space-y-8 p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">افزودن تمرین جدید</h2>

      <div className="space-y-4">
        <Input
          placeholder="عنوان تمرین"
          value={newExercise.title}
          onChange={(e) => setNewExercise({ ...newExercise, title: e.target.value })}
        />
        <textarea
          className="w-full min-h-[100px] p-2 border rounded-md"
          placeholder="توضیحات تمرین"
          value={newExercise.description}
          onChange={(e) => setNewExercise({ ...newExercise, description: e.target.value })}
        />
        <Select
          value={newExercise.category}
          onValueChange={(value) => setNewExercise({ ...newExercise, category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="انتخاب دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breathing">تنفس</SelectItem>
            <SelectItem value="mindfulness">ذهن‌آگاهی</SelectItem>
            <SelectItem value="cbt">شناختی-رفتاری</SelectItem>
            <SelectItem value="writing">نوشتاری</SelectItem>
            <SelectItem value="relaxation">آرامش</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="زمان تخمینی (دقیقه)"
          value={newExercise.estimatedTime}
          onChange={(e) => setNewExercise({ ...newExercise, estimatedTime: parseInt(e.target.value) })}
        />
        <div className="flex gap-2">
          <Input
            placeholder="شرایط مناسب (مثلاً: اضطراب)"
            value={conditionInput}
            onChange={(e) => setConditionInput(e.target.value)}
          />
          <Button onClick={handleAddCondition}>افزودن</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {newExercise.suitableFor.conditions.map((condition, index) => (
            <Badge key={index} variant="secondary">
              {condition}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="مرحله انجام"
            value={stepInput}
            onChange={(e) => setStepInput(e.target.value)}
          />
          <Button onClick={handleAddStep}>افزودن</Button>
        </div>
        <div className="space-y-2">
          {newExercise.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-sm font-medium">{index + 1}.</span>
              <p className="text-sm">{step}</p>
            </div>
          ))}
        </div>
        <Button onClick={handleAddExercise} className="w-full">ذخیره تمرین</Button>
      </div>

      <h2 className="text-xl font-semibold">لیست تمرین‌ها</h2>
      <div className="grid gap-4">
        {exercises.map((ex) => (
          <Card key={ex.id}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{ex.icon}</span>
                <CardTitle>{ex.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{ex.description}</p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">دسته‌بندی:</span>
                <Badge variant="secondary">{ex.category}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">زمان تخمینی:</span>
                <span>{ex.estimatedTime} دقیقه</span>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">شرایط مناسب:</p>
                <div className="flex flex-wrap gap-2">
                  {ex.suitableFor.conditions.map((condition, index) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">مراحل انجام:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  {ex.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 