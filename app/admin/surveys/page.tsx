'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import SurveyResultsModal from '../../components/SurveyResultsModal'

interface SurveyOption {
  id: string
  text: string
  value: number | null
  questionId: string
}

interface SurveyQuestion {
  id: string
  text: string
  required: boolean
  order: number
  surveyId: string
  options: SurveyOption[]
}

interface Survey {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  createdAt: Date
  updatedAt: Date
  testId: string | null
  blogPostId: string | null
}

interface SurveyWithRelations extends Survey {
  questions: SurveyQuestion[]
  _count: {
    responses: number
  }
}

interface FormQuestion {
  text: string
  required: boolean
  options: {
    text: string
    value: number
  }[]
}

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<SurveyWithRelations[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<{
    title: string
    description: string
    questions: FormQuestion[]
  }>({
    title: '',
    description: '',
    questions: [{ text: '', required: true, options: [{ text: '', value: 1 }] }]
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [resultsOpen, setResultsOpen] = useState(false)
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)

  const fetchSurveys = async () => {
    try {
      const response = await fetch('/api/admin/surveys')
      if (!response.ok) throw new Error('خطا در دریافت نظرسنجی‌ها')
      const data = await response.json()
      setSurveys(data)
    } catch (error) {
      toast.error('خطا در دریافت نظرسنجی‌ها')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/admin/surveys/${editingId}` : '/api/admin/surveys'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در ذخیره نظرسنجی')
      }

      await fetchSurveys()
      resetForm()
      toast.success(editingId ? 'نظرسنجی با موفقیت ویرایش شد' : 'نظرسنجی با موفقیت ایجاد شد')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در ذخیره نظرسنجی')
    }
  }

  const handleEdit = (survey: SurveyWithRelations) => {
    setForm({
      title: survey.title,
      description: survey.description || '',
      questions: survey.questions.map(q => ({
        text: q.text,
        required: q.required,
        options: q.options.map(o => ({
          text: o.text,
          value: o.value || 0
        }))
      }))
    })
    setEditingId(survey.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این نظرسنجی اطمینان دارید؟')) return

    try {
      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در حذف نظرسنجی')
      }

      await fetchSurveys()
      toast.success('نظرسنجی با موفقیت حذف شد')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در حذف نظرسنجی')
    }
  }

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      const survey = surveys.find(s => s.id === id)
      if (!survey) throw new Error('نظرسنجی یافت نشد')

      const response = await fetch(`/api/admin/surveys/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...survey,
          isPublished: !isPublished
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'خطا در تغییر وضعیت انتشار')
      }

      await fetchSurveys()
      toast.success(`نظرسنجی با موفقیت ${isPublished ? 'غیرفعال' : 'فعال'} شد`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'خطا در تغییر وضعیت انتشار')
    }
  }

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      questions: [{ text: '', required: true, options: [{ text: '', value: 1 }] }]
    })
    setEditingId(null)
  }

  const addQuestion = () => {
    setForm(prev => ({
      ...prev,
      questions: [...prev.questions, { text: '', required: true, options: [{ text: '', value: 1 }] }]
    }))
  }

  const removeQuestion = (index: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }))
  }

  const addOption = (questionIndex: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex) {
          return {
            ...q,
            options: [...q.options, { text: '', value: q.options.length + 1 }]
          }
        }
        return q
      })
    }))
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    setForm(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i === questionIndex) {
          return {
            ...q,
            options: q.options.filter((_, j) => j !== optionIndex)
          }
        }
        return q
      })
    }))
  }

  const openResultsModal = (id: string) => {
    setSelectedSurveyId(id)
    setResultsOpen(true)
  }

  if (loading) return <div className="p-4">در حال بارگذاری...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت نظرسنجی‌ها</h1>
      </div>

      {/* فرم افزودن/ویرایش نظرسنجی */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? 'ویرایش نظرسنجی' : 'افزودن نظرسنجی جدید'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">عنوان</label>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">توضیحات</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* سوالات */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">سوالات</label>
            {form.questions.map((question, qIndex) => (
              <div key={qIndex} className="border p-4 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={question.text}
                      onChange={e => {
                        const newQuestions = [...form.questions]
                        newQuestions[qIndex].text = e.target.value
                        setForm({ ...form, questions: newQuestions })
                      }}
                      placeholder="متن سوال"
                      required
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={e => {
                        const newQuestions = [...form.questions]
                        newQuestions[qIndex].required = e.target.checked
                        setForm({ ...form, questions: newQuestions })
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label className="mr-2 text-sm text-gray-700">اجباری</label>
                  </div>
                  {form.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-900"
                    >
                      حذف سوال
                    </button>
                  )}
                </div>

                {/* گزینه‌ها */}
                <div className="space-y-2 mr-4">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center">
                      <input
                        type="text"
                        value={option.text}
                        onChange={e => {
                          const newQuestions = [...form.questions]
                          newQuestions[qIndex].options[oIndex].text = e.target.value
                          setForm({ ...form, questions: newQuestions })
                        }}
                        placeholder="متن گزینه"
                        required
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={option.value}
                        onChange={e => {
                          const newQuestions = [...form.questions]
                          newQuestions[qIndex].options[oIndex].value = parseInt(e.target.value)
                          setForm({ ...form, questions: newQuestions })
                        }}
                        placeholder="مقدار"
                        className="w-20 mr-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      {question.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(qIndex, oIndex)}
                          className="text-red-600 hover:text-red-900"
                        >
                          حذف
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addOption(qIndex)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    + افزودن گزینه
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="text-blue-600 hover:text-blue-900"
            >
              + افزودن سوال
            </button>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              {editingId ? 'ویرایش' : 'افزودن'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
              >
                انصراف
              </button>
            )}
          </div>
        </form>
      </div>

      {/* جدول نظرسنجی‌ها */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عنوان</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ایجاد</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تعداد پاسخ‌ها</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {surveys.map(survey => (
              <tr key={survey.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{survey.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(survey.createdAt).toLocaleDateString('fa-IR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    survey.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {survey.isPublished ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {survey._count.responses}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => handleEdit(survey)}
                    className="text-blue-600 hover:text-blue-900 ml-4"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleTogglePublish(survey.id, survey.isPublished)}
                    className="text-green-600 hover:text-green-900 ml-4"
                  >
                    {survey.isPublished ? 'غیرفعال کردن' : 'فعال کردن'}
                  </button>
                  <button
                    onClick={() => handleDelete(survey.id)}
                    className="text-red-600 hover:text-red-900 ml-4"
                  >
                    حذف
                  </button>
                  <button
                    onClick={() => openResultsModal(survey.id)}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    مشاهده نتایج
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resultsOpen && selectedSurveyId && (
        <SurveyResultsModal
          isOpen={resultsOpen}
          onClose={() => setResultsOpen(false)}
          surveyId={selectedSurveyId}
          surveyTitle={surveys.find(s => s.id === selectedSurveyId)?.title || ''}
        />
      )}
    </div>
  )
} 