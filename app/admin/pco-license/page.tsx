"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Save,
  Trash2,
  Key,
  Settings,
  Info
} from "lucide-react";

interface SystemConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export default function PCOLicensePage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  // بارگذاری تنظیمات سیستم
  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/system-config");
      const data = await response.json();
      
      if (data.success) {
        setConfigs(data.configs || []);
      }
    } catch (error) {
      console.error("خطا در بارگذاری تنظیمات:", error);
    } finally {
      setLoading(false);
    }
  };

  // فعال‌سازی مجوز PCO
  const activateLicense = async () => {
    if (!licenseNumber.trim()) {
      alert("لطفاً شماره مجوز را وارد کنید");
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/admin/activate-pco-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          licenseNumber: licenseNumber.trim(),
          description: description.trim() || undefined
        })
      });
      const data = await response.json();
      
      if (data.success) {
        alert("مجوز رسمی PCO با موفقیت فعال شد!");
        setLicenseNumber("");
        setDescription("");
        await loadConfigs();
      } else {
        alert("خطا در فعال‌سازی مجوز: " + data.message);
      }
    } catch (error) {
      console.error("خطا در فعال‌سازی مجوز:", error);
      alert("خطا در فعال‌سازی مجوز");
    } finally {
      setSaving(false);
    }
  };

  // غیرفعال‌سازی مجوز PCO
  const deactivateLicense = async () => {
    if (!confirm("آیا مطمئن هستید که می‌خواهید مجوز PCO را غیرفعال کنید؟")) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/admin/activate-pco-license", {
        method: "DELETE"
      });
      const data = await response.json();
      
      if (data.success) {
        alert("مجوز رسمی PCO با موفقیت غیرفعال شد!");
        await loadConfigs();
      } else {
        alert("خطا در غیرفعال‌سازی مجوز: " + data.message);
      }
    } catch (error) {
      console.error("خطا در غیرفعال‌سازی مجوز:", error);
      alert("خطا در غیرفعال‌سازی مجوز");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadConfigs();
  }, []);

  const pcoLicense = configs.find(c => c.key === "pco_license");
  const licenseNumberConfig = configs.find(c => c.key === "pco_license_number");
  const activationDate = configs.find(c => c.key === "pco_activation_date");
  
  const isActive = pcoLicense?.value === "ACTIVE";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-indigo-400" />
            🔏 PCO License Management
          </h1>
          <p className="text-xl text-indigo-200 mb-6">
            مدیریت مجوز رسمی سازمان نظام روان‌شناسی ایران
          </p>
        </div>

        {/* وضعیت فعلی */}
        <Card className="bg-white/10 border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Shield className="w-6 h-6 text-indigo-400" />
              وضعیت مجوز PCO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {isActive ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <CheckCircle className="w-8 h-8" />
                      فعال
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-red-400">
                      <XCircle className="w-8 h-8" />
                      غیرفعال
                    </div>
                  )}
                </div>
                <div className="text-gray-300">وضعیت مجوز</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold mb-2 text-indigo-300">
                  {licenseNumberConfig?.value || "نامشخص"}
                </div>
                <div className="text-gray-300">شماره مجوز</div>
              </div>

              <div className="text-center">
                <div className="text-lg font-bold mb-2 text-gray-300">
                  {activationDate ? new Date(activationDate.value).toLocaleDateString("fa-IR") : "نامشخص"}
                </div>
                <div className="text-gray-300">تاریخ فعال‌سازی</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* مدیریت مجوز */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* فعال‌سازی مجوز */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <Key className="w-6 h-6 text-green-400" />
                فعال‌سازی مجوز PCO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="licenseNumber" className="text-gray-300">
                  شماره مجوز رسمی PCO
                </Label>
                <Input
                  id="licenseNumber"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="مثال: PCO-IR-2025-0764"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-300">
                  توضیحات (اختیاری)
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات اضافی در مورد مجوز..."
                  className="bg-white/10 border-white/20 text-white"
                  rows={3}
                />
              </div>

              <Button
                onClick={activateLicense}
                disabled={saving || !licenseNumber.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {saving ? "در حال فعال‌سازی..." : "فعال‌سازی مجوز"}
              </Button>
            </CardContent>
          </Card>

          {/* غیرفعال‌سازی مجوز */}
          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <XCircle className="w-6 h-6 text-red-400" />
                غیرفعال‌سازی مجوز PCO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <span className="text-red-300 font-semibold">هشدار</span>
                </div>
                <p className="text-gray-300 text-sm">
                  غیرفعال‌سازی مجوز باعث می‌شود که گزارش‌های جدید فاقد مهر رسمی PCO باشند.
                  این عمل قابل بازگشت است.
                </p>
              </div>

              <Button
                onClick={deactivateLicense}
                disabled={saving || !isActive}
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                {saving ? "در حال غیرفعال‌سازی..." : "غیرفعال‌سازی مجوز"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* تنظیمات سیستم */}
        <Card className="bg-white/10 border-white/20 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <Settings className="w-6 h-6 text-indigo-400" />
              تنظیمات سیستم
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
                <p>در حال بارگذاری تنظیمات...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {configs.map((config) => (
                  <div key={config.id} className="bg-black/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-indigo-300">{config.key}</span>
                      <Badge className={
                        config.value === "ACTIVE" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }>
                        {config.value}
                      </Badge>
                    </div>
                    {config.description && (
                      <p className="text-gray-400 text-sm mb-2">{config.description}</p>
                    )}
                    <p className="text-gray-500 text-xs">
                      آخرین بروزرسانی: {new Date(config.updatedAt).toLocaleString("fa-IR")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* اطلاعات فنی */}
        <Card className="bg-gray-500/10 border-gray-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                  اطلاعات فنی
                </h4>
                <div className="text-gray-400 text-sm space-y-2">
                  <p>• مجوز PCO: تأیید رسمی سازمان نظام روان‌شناسی ایران</p>
                  <p>• امضای دیجیتال: RSA-SHA256 با کلید 2048-bit</p>
                  <p>• QR Code: لینک اعتبارسنجی آنلاین</p>
                  <p>• مهر رسمی: نمایش در PDF در صورت فعال بودن مجوز</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











