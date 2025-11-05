'use client'

import { useState } from 'react'
import { Integration, IntegrationType, HttpMethod } from '@/lib/types/integration'

interface IntegrationsPanelProps {
  initialIntegrations: Integration[]
}

export default function IntegrationsPanel({ initialIntegrations }: IntegrationsPanelProps) {
  const [integrations, setIntegrations] = useState(initialIntegrations)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [newIntegration, setNewIntegration] = useState<Omit<Integration, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    type: 'WEBHOOK',
    description: '',
    config: {
      url: '',
      method: 'POST',
      headers: {},
      auth: {
        type: 'basic',
        username: '',
        password: ''
      },
      events: [] as string[],
      isActive: true
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/admin/integrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newIntegration)
      })

      if (response.ok) {
        const result = await response.json()
        setIntegrations([result, ...integrations])
        setNewIntegration({
          name: '',
          type: 'WEBHOOK',
          description: '',
          config: {
            url: '',
            method: 'POST',
            headers: {},
            auth: {
              type: 'basic',
              username: '',
              password: ''
            },
            events: [] as string[],
            isActive: true
          }
        })
        setShowForm(false)
      } else {
        throw new Error('خطا در ایجاد اتصال جدید')
      }
    } catch (error) {
      console.error('خطا در ایجاد اتصال جدید:', error)
      alert('خطا در ایجاد اتصال جدید')
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async (integration: Integration) => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/integrations/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: integration.id })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`تست موفق: ${JSON.stringify(result)}`)
      } else {
        throw new Error('خطا در تست اتصال')
      }
    } catch (error) {
      console.error('خطا در تست اتصال:', error)
      alert('خطا در تست اتصال')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* دکمه افزودن اتصال جدید */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'انصراف' : 'افزودن اتصال جدید'}
        </button>
      </div>

      {/* فرم افزودن اتصال جدید */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">افزودن اتصال جدید</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">نام</label>
              <input
                type="text"
                value={newIntegration.name}
                onChange={e => setNewIntegration({...newIntegration, name: e.target.value})}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">نوع</label>
              <select
                value={newIntegration.type}
                onChange={e => setNewIntegration({...newIntegration, type: e.target.value as IntegrationType})}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="WEBHOOK">وب‌هوک</option>
                <option value="API">API</option>
                <option value="OAUTH">OAuth</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">توضیحات</label>
              <textarea
                value={newIntegration.description || ''}
                onChange={e => setNewIntegration({...newIntegration, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">آدرس</label>
              <input
                type="url"
                value={newIntegration.config.url}
                onChange={e => setNewIntegration({
                  ...newIntegration,
                  config: { ...newIntegration.config, url: e.target.value }
                })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">متد</label>
              <select
                value={newIntegration.config.method}
                onChange={e => setNewIntegration({
                  ...newIntegration,
                  config: { ...newIntegration.config, method: e.target.value as HttpMethod }
                })}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">هدرها (JSON)</label>
              <textarea
                value={JSON.stringify(newIntegration.config.headers, null, 2)}
                onChange={e => {
                  try {
                    const headers = JSON.parse(e.target.value)
                    setNewIntegration({
                      ...newIntegration,
                      config: { ...newIntegration.config, headers }
                    })
                  } catch (error) {
                    // خطای پارس JSON را نادیده می‌گیریم
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">رویدادها</label>
              <input
                type="text"
                value={(newIntegration.config.events || []).join(', ')}
                onChange={e => setNewIntegration({
                  ...newIntegration,
                  config: {
                    ...newIntegration.config,
                    events: e.target.value.split(',').map(event => event.trim()).filter(Boolean)
                  }
                })}
                placeholder="رویدادها را با کاما جدا کنید"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newIntegration.config.isActive}
                onChange={e => setNewIntegration({
                  ...newIntegration,
                  config: { ...newIntegration.config, isActive: e.target.checked }
                })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="mr-2 block text-sm text-gray-900">فعال</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'در حال ثبت...' : 'افزودن اتصال'}
            </button>
          </form>
        </div>
      )}

      {/* جدول اتصال‌ها */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">لیست اتصال‌ها</h2>
        <div className="overflow-x-auto">
          <table className="w-full border text-right">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2">نام</th>
                <th className="p-2">نوع</th>
                <th className="p-2">آدرس</th>
                <th className="p-2">متد</th>
                <th className="p-2">وضعیت</th>
                <th className="p-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map(integration => (
                <tr key={integration.id} className="border-t">
                  <td className="p-2">{integration.name}</td>
                  <td className="p-2">{integration.type}</td>
                  <td className="p-2 truncate max-w-xs">{integration.config.url}</td>
                  <td className="p-2">{integration.config.method}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      integration.config.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {integration.config.isActive ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="p-2">
                    <button
                      onClick={() => handleTest(integration)}
                      disabled={loading}
                      className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      تست
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 