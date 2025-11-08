"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ProvinceCitySelect from "@/components/ui/ProvinceCitySelect";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Save,
  Check,
  AlertCircle,
  Settings,
  Shield,
  Bell,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Edit,
  Trash2,
  Download,
  Upload,
  RefreshCw
} from "lucide-react";
import PersianDatePicker from "@/components/PersianDatePicker";

interface UserProfile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  province: string;
  city: string;
  avatar?: string;
  bio?: string;
  isProfileComplete: boolean;
}

interface Province {
  id: string;
  name: string;
  cities: City[];
}

interface City {
  id: string;
  name: string;
  provinceId: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    province: '',
    city: '',
    avatar: '',
    bio: '',
    isProfileComplete: false
  });
  
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    testReminders: true,
    learningReminders: true,
    securityAlerts: true,
    marketingEmails: false
  });
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'fa',
    timezone: 'Asia/Tehran',
    dateFormat: 'persian',
    measurementUnit: 'metric'
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorStatus, setTwoFactorStatus] = useState({
    has2FA: false,
    isEnabled: false,
    qrCode: '',
    secret: ''
  });
  const [twoFactorCode, setTwoFactorCode] = useState('');

  // دریافت اطلاعات پروفایل
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userEmail = localStorage.getItem("testology_email");
      
      if (!userEmail) {
        console.error("ایمیل کاربر یافت نشد");
        return;
      }

      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile({
          ...data.profile,
          email: data.profile.email || userEmail // اطمینان از وجود ایمیل
        });
      } else {
        // اگر API کار نکرد، حداقل ایمیل را تنظیم کن
        setProfile(prev => ({
          ...prev,
          email: userEmail
        }));
      }
    } catch (error) {
      console.error("خطا در دریافت اطلاعات پروفایل:", error);
      // در صورت خطا، حداقل ایمیل را تنظیم کن
      const userEmail = localStorage.getItem("testology_email");
      if (userEmail) {
        setProfile(prev => ({
          ...prev,
          email: userEmail
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  // دریافت لیست استان‌ها
  const fetchProvinces = async () => {
    try {
      const response = await fetch('/api/locations/provinces');
      const data = await response.json();
      
      if (data.success) {
        setProvinces(data.provinces);
      }
    } catch (error) {
      console.error("خطا در دریافت استان‌ها:", error);
    }
  };

  // دریافت شهرستان‌های یک استان
  const fetchCities = async (provinceId: string) => {
    try {
      const response = await fetch(`/api/locations/cities?provinceId=${provinceId}`);
      const data = await response.json();
      
      if (data.success) {
        setCities(data.cities);
      }
    } catch (error) {
      console.error("خطا در دریافت شهرستان‌ها:", error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProvinces();
    fetch2FAStatus();
  }, []);

  // دریافت وضعیت 2FA
  const fetch2FAStatus = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      if (!userEmail) return;

      const response = await fetch(`/api/user/2fa?email=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      
      if (data.success) {
        setTwoFactorStatus({
          has2FA: data.has2FA,
          isEnabled: data.isEnabled,
          qrCode: '',
          secret: ''
        });
      }
    } catch (error) {
      console.error("خطا در دریافت وضعیت 2FA:", error);
    }
  };

  // فعال‌سازی 2FA
  const enable2FA = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          action: 'enable'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTwoFactorStatus(prev => ({
          ...prev,
          qrCode: data.qrCode,
          secret: data.secret
        }));
        setMessage({type: 'success', text: 'کد QR تولید شد. لطفاً کد را اسکن کنید و کد تأیید را وارد کنید.'});
      } else {
        setMessage({type: 'error', text: data.message});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در فعال‌سازی 2FA'});
    }
  };

  // تأیید کد 2FA
  const verify2FA = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          action: 'verify',
          code: twoFactorCode
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({type: 'success', text: 'احراز هویت دو مرحله‌ای با موفقیت فعال شد'});
        setTwoFactorCode('');
        fetch2FAStatus();
      } else {
        setMessage({type: 'error', text: data.message});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در تأیید کد'});
    }
  };

  // غیرفعال‌سازی 2FA
  const disable2FA = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      const response = await fetch('/api/user/2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          action: 'disable'
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({type: 'success', text: 'احراز هویت دو مرحله‌ای غیرفعال شد'});
        fetch2FAStatus();
      } else {
        setMessage({type: 'error', text: data.message});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در غیرفعال‌سازی 2FA'});
    }
  };

  // تغییر استان
  const handleProvinceChange = (provinceId: string) => {
    setProfile(prev => ({ ...prev, province: provinceId, city: '' }));
    if (provinceId) {
      fetchCities(provinceId);
    } else {
      setCities([]);
    }
  };

  // ذخیره پروفایل
  const saveProfile = async () => {
    try {
      setSaving(true);
      const userEmail = localStorage.getItem("testology_email");
      
      if (!userEmail) {
        setMessage({type: 'error', text: 'ایمیل کاربر یافت نشد'});
        return;
      }

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          name: profile.name,
          lastName: profile.lastName,
          phone: profile.phone,
          birthDate: profile.birthDate,
          province: profile.province,
          city: profile.city,
          bio: profile.bio
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({type: 'success', text: 'اطلاعات پروفایل با موفقیت ذخیره شد'});
        setProfile(prev => ({ ...prev, isProfileComplete: true }));
      } else {
        setMessage({type: 'error', text: data.message || 'خطا در ذخیره اطلاعات'});
      }
    } catch (error) {
      console.error("خطا در ذخیره پروفایل:", error);
      setMessage({type: 'error', text: 'خطا در ذخیره اطلاعات'});
    } finally {
      setSaving(false);
    }
  };

  // تبدیل تاریخ شمسی
  const convertToPersianDate = (date: string) => {
    // اینجا باید کتابخانه تبدیل تاریخ شمسی استفاده شود
    // برای سادگی، همان تاریخ میلادی را برمی‌گردانیم
    return date;
  };

  // آپلود آواتار
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('email', localStorage.getItem("testology_email") || '');
      
      const response = await fetch('/api/user/avatar', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfile(prev => ({ ...prev, avatar: data.avatar }));
        setMessage({type: 'success', text: 'آواتار با موفقیت آپلود شد'});
      } else {
        setMessage({type: 'error', text: data.message || 'خطا در آپلود آواتار'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در آپلود آواتار'});
    }
  };

  // تغییر رمز عبور
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({type: 'error', text: 'رمز عبور جدید و تأیید آن مطابقت ندارند'});
      return;
    }

    try {
      const userEmail = localStorage.getItem("testology_email");
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({type: 'success', text: 'رمز عبور با موفقیت تغییر کرد'});
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({type: 'error', text: data.message});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در تغییر رمز عبور'});
    }
  };

  // ذخیره تنظیمات اعلان‌ها
  const saveNotificationSettings = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      const response = await fetch('/api/user/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          settings: notificationSettings
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({type: 'success', text: 'تنظیمات اعلان‌ها ذخیره شد'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در ذخیره تنظیمات'});
    }
  };

  // ذخیره تنظیمات شخصی
  const savePreferences = async () => {
    try {
      const userEmail = localStorage.getItem("testology_email");
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          preferences
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({type: 'success', text: 'تنظیمات شخصی ذخیره شد'});
      }
    } catch (error) {
      setMessage({type: 'error', text: 'خطا در ذخیره تنظیمات'});
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white" dir="rtl">
      <div className="max-w-4xl mx-auto p-8">
        {/* هدر */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Settings className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                تنظیمات
              </h1>
              <p className="text-xl text-gray-300 mt-2">
                مدیریت اطلاعات شخصی و تنظیمات حساب کاربری
              </p>
            </div>
          </div>
        </div>

        {/* پیام‌ها */}
        {message && (
          <Alert className={`mb-6 ${message.type === 'success' ? 'bg-green-500/20 border-green-400/30' : 'bg-red-500/20 border-red-400/30'}`}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={message.type === 'success' ? 'text-green-200' : 'text-red-200'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 border border-white/20" dir="rtl">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white/20" dir="rtl">
              <User className="w-4 h-4 ml-2" />
              پروفایل
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/20" dir="rtl">
              <Shield className="w-4 h-4 ml-2" />
              امنیت
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-white/20" dir="rtl">
              <Bell className="w-4 h-4 ml-2" />
              اعلان‌ها
            </TabsTrigger>
            <TabsTrigger value="preferences" className="data-[state=active]:bg-white/20" dir="rtl">
              <Palette className="w-4 h-4 ml-2" />
              تنظیمات
            </TabsTrigger>
          </TabsList>

          {/* پروفایل */}
          <TabsContent value="profile" className="space-y-8">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <User className="w-8 h-8 text-blue-400" />
                  اطلاعات شخصی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* آواتار */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt="آواتار کاربر"
                        className="w-24 h-24 rounded-full object-cover border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {profile.name.charAt(0)}{profile.lastName.charAt(0)}
                      </div>
                    )}
                    <label className="absolute -bottom-2 -right-2 bg-blue-600 hover:bg-blue-700 rounded-full p-2 cursor-pointer">
                      <Camera className="w-4 h-4 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {profile.name} {profile.lastName}
                    </h3>
                    <p className="text-gray-400">{profile.email}</p>
                    <Badge variant="secondary" className="mt-2">
                      {profile.isProfileComplete ? 'پروفایل کامل' : 'پروفایل ناقص'}
                    </Badge>
                  </div>
                </div>

                {/* فرم اطلاعات */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">نام *</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="نام خود را وارد کنید"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="نام خانوادگی خود را وارد کنید"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">ایمیل</Label>
                    <Input
                      id="email"
                      value={profile.email || ''}
                      disabled
                      className="bg-gray-500/20 border-gray-400/20 text-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">شماره موبایل *</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                      placeholder="09123456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-white">تاریخ تولد *</Label>
                    <PersianDatePicker
                      value={profile.birthDate}
                      onChange={(date) => setProfile(prev => ({ ...prev, birthDate: date }))}
                      placeholder="انتخاب تاریخ تولد"
                      className="w-full"
                    />
                  </div>

                  <ProvinceCitySelect
                    selectedProvince={profile.province}
                    selectedCity={profile.city}
                    onProvinceChange={handleProvinceChange}
                    onCityChange={(cityId) => setProfile(prev => ({ ...prev, city: cityId }))}
                  />
                </div>

                {/* بیوگرافی */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">درباره من</Label>
                  <textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 h-24 resize-none"
                    placeholder="درباره خود بنویسید..."
                  />
                </div>

                {/* دکمه ذخیره */}
                <div className="flex gap-4 justify-end" dir="rtl">
                  <Button
                    onClick={saveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="w-5 h-5 ml-2 animate-spin" />
                        در حال ذخیره...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 ml-2" />
                        ذخیره تغییرات
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* امنیت */}
          <TabsContent value="security" className="space-y-8" dir="rtl">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl" dir="rtl">
                  <Shield className="w-8 h-8 text-green-400" />
                  امنیت حساب کاربری
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" dir="rtl">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${
                      twoFactorStatus.isEnabled 
                        ? 'bg-green-500/10 border-green-400/30' 
                        : 'bg-yellow-500/10 border-yellow-400/30'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-6 h-6 ${twoFactorStatus.isEnabled ? 'text-green-400' : 'text-yellow-400'}`}>
                          {twoFactorStatus.isEnabled ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">احراز هویت دو مرحله‌ای</h4>
                          <p className={`text-sm ${
                            twoFactorStatus.isEnabled ? 'text-green-200' : 'text-yellow-200'
                          }`}>
                            {twoFactorStatus.isEnabled 
                              ? 'فعال - حساب شما محافظت شده است' 
                              : 'غیرفعال - برای امنیت بیشتر فعال کنید'
                            }
                          </p>
                        </div>
                      </div>

                      {!twoFactorStatus.isEnabled && (
                        <div className="space-y-4">
                          <div className="bg-gray-500/10 p-4 rounded-lg">
                            <h5 className="font-semibold text-white mb-2">چرا احراز هویت دو مرحله‌ای؟</h5>
                            <ul className="text-sm text-gray-300 space-y-1">
                              <li>• محافظت اضافی از حساب کاربری</li>
                              <li>• جلوگیری از دسترسی غیرمجاز</li>
                              <li>• امنیت بالاتر در برابر هک</li>
                              <li>• کدهای موقت از طریق اپلیکیشن‌های احراز هویت</li>
                            </ul>
                          </div>

                          {!twoFactorStatus.qrCode ? (
                            <Button
                              onClick={enable2FA}
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              فعال‌سازی احراز هویت دو مرحله‌ای
                            </Button>
                          ) : (
                            <div className="space-y-4">
                              <div className="text-center">
                                <h5 className="font-semibold text-white mb-2">مرحله 1: اسکن کد QR</h5>
                                <p className="text-sm text-gray-300 mb-4">
                                  کد زیر را با اپلیکیشن احراز هویت (Google Authenticator, Authy) اسکن کنید
                                </p>
                                <div className="flex justify-center">
                                  <img 
                                    src={twoFactorStatus.qrCode} 
                                    alt="QR Code" 
                                    className="w-48 h-48 border border-white/20 rounded-lg"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <h5 className="font-semibold text-white">مرحله 2: تأیید کد</h5>
                                <p className="text-sm text-gray-300 mb-2">
                                  کد 6 رقمی که در اپلیکیشن نمایش داده می‌شود را وارد کنید
                                </p>
                                <div className="flex gap-2">
                                  <Input
                                    value={twoFactorCode}
                                    onChange={(e) => setTwoFactorCode(e.target.value)}
                                    placeholder="123456"
                                    className="bg-white/10 border-white/20 text-white placeholder-gray-400 text-center text-lg tracking-widest"
                                    maxLength={6}
                                  />
                                  <Button
                                    onClick={verify2FA}
                                    disabled={twoFactorCode.length !== 6}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    تأیید
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {twoFactorStatus.isEnabled && (
                        <div className="flex gap-2">
                          <Button
                            onClick={disable2FA}
                            variant="outline"
                            className="text-red-400 border-red-400 hover:bg-red-400/10"
                          >
                            غیرفعال‌سازی
                          </Button>
                          <Button
                            onClick={enable2FA}
                            variant="outline"
                            className="text-white border-white hover:bg-white/10"
                          >
                            تولید کد جدید
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-500/10 rounded-lg border border-blue-400/30">
                      <div className="flex items-center gap-3">
                        <Lock className="w-6 h-6 text-blue-400" />
                        <div>
                          <h4 className="font-semibold text-white">تغییر رمز عبور</h4>
                          <p className="text-sm text-blue-200">آخرین تغییر: 2 ماه پیش</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4 p-4 bg-gray-500/10 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-white">رمز عبور فعلی</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="رمز عبور فعلی خود را وارد کنید"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-white">رمز عبور جدید</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="رمز عبور جدید خود را وارد کنید"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-white">تأیید رمز عبور</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                          placeholder="رمز عبور جدید را دوباره وارد کنید"
                        />
                      </div>
                      
                      <Button
                        onClick={handlePasswordChange}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        تغییر رمز عبور
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* اعلان‌ها */}
          <TabsContent value="notifications" className="space-y-8" dir="rtl">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl" dir="rtl">
                  <Bell className="w-8 h-8 text-yellow-400" />
                  تنظیمات اعلان‌ها
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" dir="rtl">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">اعلان‌های ایمیل</h4>
                        <p className="text-sm text-gray-400">دریافت اعلان‌ها از طریق ایمیل</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationSettings.emailNotifications ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">اعلان‌های تست‌ها</h4>
                        <p className="text-sm text-gray-400">یادآوری انجام تست‌های جدید</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, testReminders: !prev.testReminders }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationSettings.testReminders ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationSettings.testReminders ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">اعلان‌های یادگیری</h4>
                        <p className="text-sm text-gray-400">یادآوری دوره‌های جدید و پیشرفت</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, learningReminders: !prev.learningReminders }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationSettings.learningReminders ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationSettings.learningReminders ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">اعلان‌های امنیتی</h4>
                        <p className="text-sm text-gray-400">هشدارهای امنیتی و ورود</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, securityAlerts: !prev.securityAlerts }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationSettings.securityAlerts ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationSettings.securityAlerts ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">ایمیل‌های بازاریابی</h4>
                        <p className="text-sm text-gray-400">اخبار و پیشنهادات ویژه</p>
                      </div>
                      <button
                        onClick={() => setNotificationSettings(prev => ({ ...prev, marketingEmails: !prev.marketingEmails }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          notificationSettings.marketingEmails ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notificationSettings.marketingEmails ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6" dir="rtl">
                    <Button
                      onClick={saveNotificationSettings}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      ذخیره تنظیمات اعلان‌ها
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* تنظیمات */}
          <TabsContent value="preferences" className="space-y-8" dir="rtl">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl" dir="rtl">
                  <Palette className="w-8 h-8 text-purple-400" />
                  تنظیمات شخصی
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6" dir="rtl">
                <div className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">تم تاریک</h4>
                        <p className="text-sm text-gray-400">استفاده از تم تاریک</p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
                        className={`w-12 h-6 rounded-full transition-colors ${
                          preferences.theme === 'dark' ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          preferences.theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">زبان رابط کاربری</h4>
                        <p className="text-sm text-gray-400">فارسی</p>
                      </div>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({ ...prev, language: e.target.value }))}
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="fa">فارسی</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">فرمت تاریخ</h4>
                        <p className="text-sm text-gray-400">تقویم شمسی</p>
                      </div>
                      <select
                        value={preferences.dateFormat}
                        onChange={(e) => setPreferences(prev => ({ ...prev, dateFormat: e.target.value }))}
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="persian">شمسی</option>
                        <option value="gregorian">میلادی</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-white">واحد اندازه‌گیری</h4>
                        <p className="text-sm text-gray-400">سیستم متریک</p>
                      </div>
                      <select
                        value={preferences.measurementUnit}
                        onChange={(e) => setPreferences(prev => ({ ...prev, measurementUnit: e.target.value }))}
                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
                      >
                        <option value="metric">متریک</option>
                        <option value="imperial">امپریال</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6" dir="rtl">
                    <Button
                      onClick={savePreferences}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      ذخیره تنظیمات شخصی
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
