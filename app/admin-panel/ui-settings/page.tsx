"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function UISettingsPage() {
  const [theme, setTheme] = useState("light")
  const [font, setFont] = useState("Vazir")
  const [direction, setDirection] = useState("rtl")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/admin/ui-settings")
      if (!res.ok) throw new Error("خطا در دریافت تنظیمات")
      const data = await res.json()
      if (data) {
        setTheme(data.theme)
        setFont(data.font)
        setDirection(data.direction)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast.error("خطا در دریافت تنظیمات")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch("/api/admin/ui-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme, font, direction }),
      })
      if (!res.ok) throw new Error("خطا در ذخیره تنظیمات")
      toast.success("تنظیمات با موفقیت ذخیره شد")
    } catch (error) {
      console.error("Error saving settings:", error)
      toast.error("خطا در ذخیره تنظیمات")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle>تنظیمات رابط کاربری</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="theme">تم رنگی</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب تم" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">روشن</SelectItem>
                  <SelectItem value="dark">تیره</SelectItem>
                  <SelectItem value="custom">سفارشی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="font">فونت سایت</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب فونت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vazir">وزیر</SelectItem>
                  <SelectItem value="IranSans">ایران‌سنس</SelectItem>
                  <SelectItem value="Dana">دانا</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">جهت نمایش</Label>
              <Select value={direction} onValueChange={setDirection}>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب جهت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rtl">راست‌چین (RTL)</SelectItem>
                  <SelectItem value="ltr">چپ‌چین (LTR)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                "ذخیره تنظیمات"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 