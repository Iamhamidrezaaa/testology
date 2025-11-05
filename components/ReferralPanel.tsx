'use client'

import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'

interface ReferralPanelProps {
  userId: string
  referralCode: string
  points: number
}

export default function ReferralPanel({ userId, referralCode, points }: ReferralPanelProps) {
  const [copied, setCopied] = useState(false)
  const [referrals, setReferrals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL}/signup?ref=${referralCode}`

  useEffect(() => {
    fetchReferrals()
  }, [userId])

  const fetchReferrals = async () => {
    try {
      const response = await fetch(`/api/referral/list?userId=${userId}`)
      const data = await response.json()
      if (data.success) {
        setReferrals(data.referrals)
      }
    } catch (error) {
      console.error('خطا در دریافت لیست ارجاع‌ها:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      toast.success('لینک با موفقیت کپی شد')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('خطا در کپی کردن لینک')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">دعوت دوستان</h2>
        <p className="text-gray-600">
          با دعوت دوستان خود، امتیاز دریافت کنید. به ازای هر دعوت موفق، ۱۰ امتیاز به حساب شما اضافه می‌شود.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="text-lg font-semibold">امتیازات شما:</div>
          <div className="text-2xl font-bold text-blue-600">{points}</div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          لینک دعوت شما:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={referralLink}
            className="flex-1 p-2 border rounded-lg bg-gray-50"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {copied ? 'کپی شد!' : 'کپی لینک'}
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">دعوت‌های شما</h3>
        {loading ? (
          <div className="text-center py-4">در حال بارگذاری...</div>
        ) : referrals.length > 0 ? (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="p-4 border rounded-lg flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{referral.invitee.name || 'کاربر'}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(referral.createdAt).toLocaleDateString('fa-IR')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      referral.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {referral.status === 'COMPLETED' ? 'تکمیل شده' : 'در انتظار'}
                  </span>
                  {referral.status === 'COMPLETED' && (
                    <span className="text-green-600 font-medium">+{referral.points} امتیاز</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            هنوز کسی را دعوت نکرده‌اید
          </div>
        )}
      </div>
    </div>
  )
} 