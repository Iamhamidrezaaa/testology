import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns-jalali'

export default function CompleteProfileForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [country, setCountry] = useState('')
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')
  const router = useRouter()

  const handleSubmit = async () => {
    if (!firstName || !lastName || !gender || !birthDate || !country || !province || !city) {
      return alert('لطفاً تمام فیلدها را تکمیل کنید.')
    }

    const res = await fetch('/api/complete-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName,
        lastName,
        gender,
        birthDate,
        country,
        province,
        city,
      }),
    })

    if (res.ok) {
      router.push('/')
    } else {
      alert('خطا در ذخیره اطلاعات')
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <h1 className="text-xl font-semibold text-center">تکمیل اطلاعات پروفایل</h1>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="نام"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          placeholder="نام خانوادگی"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      <Select value={gender} onValueChange={(value: string) => setGender(value)}>
        <SelectTrigger>
          <SelectValue placeholder="جنسیت را انتخاب کنید" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">مرد</SelectItem>
          <SelectItem value="female">زن</SelectItem>
          <SelectItem value="other">ترجیح می‌دهم نگویم</SelectItem>
        </SelectContent>
      </Select>

      <Card>
        <CardContent className="p-3">
          <Calendar mode="single" selected={birthDate} onSelect={setBirthDate} className="rounded-md border" />
          {birthDate && <p className="text-sm text-center mt-2">تاریخ انتخاب‌شده: {format(birthDate, 'yyyy/MM/dd')}</p>}
        </CardContent>
      </Card>

      <Input placeholder="کشور" value={country} onChange={(e) => setCountry(e.target.value)} />
      <Input placeholder="استان" value={province} onChange={(e) => setProvince(e.target.value)} />
      <Input placeholder="شهر" value={city} onChange={(e) => setCity(e.target.value)} />

      <Button className="w-full" onClick={handleSubmit}>ذخیره و ادامه</Button>
    </div>
  )
} 