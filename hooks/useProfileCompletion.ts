import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProfileData {
  isComplete: boolean
  missingFields: string[]
}

export function useProfileCompletion() {
  const [profileData, setProfileData] = useState<ProfileData>({
    isComplete: false,
    missingFields: []
  })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkProfileCompletion()
  }, [])

  const checkProfileCompletion = async () => {
    try {
      setLoading(true)
      const userEmail = localStorage.getItem("testology_email")
      
      if (!userEmail) {
        setLoading(false)
        return
      }

      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`)
      const data = await response.json()
      
      if (data.success) {
        const profile = data.profile
        const missingFields = []
        
        if (!profile.name) missingFields.push('نام')
        if (!profile.lastName) missingFields.push('نام خانوادگی')
        if (!profile.phone) missingFields.push('شماره موبایل')
        if (!profile.birthDate) missingFields.push('تاریخ تولد')
        if (!profile.province) missingFields.push('استان')
        if (!profile.city) missingFields.push('شهرستان')
        
        const isComplete = missingFields.length === 0
        
        setProfileData({
          isComplete,
          missingFields
        })

        // اگر پروفایل ناقص است و کاربر در صفحه تنظیمات نیست، هدایت کن
        // if (!isComplete && !window.location.pathname.includes('/settings')) {
        //   // نمایش اعلان برای تکمیل پروفایل
        //   showProfileCompletionModal()
        // }
      }
    } catch (error) {
      console.error('Error checking profile completion:', error)
    } finally {
      setLoading(false)
    }
  }

  const showProfileCompletionModal = () => {
    // نمایش modal برای تکمیل پروفایل
    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تکمیل پروفایل</h3>
        </div>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          برای استفاده کامل از خدمات، لطفاً اطلاعات پروفایل خود را تکمیل کنید.
        </p>
        <div class="flex gap-3">
          <button 
            onclick="this.closest('.fixed').remove(); window.location.href='/dashboard/settings'"
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            تکمیل پروفایل
          </button>
          <button 
            onclick="this.closest('.fixed').remove()"
            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition"
          >
            بعداً
          </button>
        </div>
      </div>
    `
    document.body.appendChild(modal)
  }

  const redirectToSettings = () => {
    router.push('/dashboard/settings')
  }

  return {
    profileData,
    loading,
    checkProfileCompletion,
    redirectToSettings
  }
}

