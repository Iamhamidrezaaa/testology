"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  XCircle, 
  Shield, 
  FileText, 
  Calendar, 
  Hash,
  ExternalLink,
  AlertTriangle,
  Brain,
  Lock,
  Unlock,
  Eye,
  Download,
  RefreshCw,
  Clock,
  Star,
  Award,
  Trophy,
  Medal,
  Flag,
  Bell,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Settings,
  Info,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  Key,
  Database,
  Server,
  Cloud,
  Wifi,
  Signal,
  Battery,
  Power,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Printer,
  Scanner,
  HardDrive,
  Cpu,
  MemoryStick
} from "lucide-react";

interface VerificationData {
  success: boolean;
  valid: boolean;
  version?: string;
  createdAt?: string;
  pcoCertified?: boolean;
  reportId?: string;
  message?: string;
  error?: string;
}

export default function VerifyPage() {
  const params = useParams();
  const id = params?.id as string;
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("شناسه گزارش یافت نشد");
      setLoading(false);
      return;
    }

    const verifyReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/pdf/verify/${id}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result);
        } else {
          setError(result.message || "خطا در اعتبارسنجی");
        }
      } catch (err) {
        console.error("خطا در اعتبارسنجی:", err);
        setError("خطا در اتصال به سرور");
      } finally {
        setLoading(false);
      }
    };

    verifyReport();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="w-16 h-16 animate-spin mx-auto mb-6 text-indigo-400" />
          <h1 className="text-2xl font-bold mb-4 text-indigo-300">
            🔍 در حال بررسی اعتبار گزارش...
          </h1>
          <p className="text-gray-300">
            لطفاً صبر کنید تا گزارش بررسی شود
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl shadow-2xl p-10 w-full max-w-2xl">
          <div className="text-center">
            <XCircle className="w-16 h-16 mx-auto mb-6 text-red-400" />
            <h1 className="text-2xl font-bold mb-4 text-red-300">
              ❌ خطا در اعتبارسنجی
            </h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              تلاش مجدد
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-yellow-400" />
          <h1 className="text-2xl font-bold mb-4 text-yellow-300">
            ⚠️ داده‌ای یافت نشد
          </h1>
          <p className="text-gray-300">
            اطلاعات گزارش در دسترس نیست
          </p>
        </div>
      </div>
    );
  }

  const valid = data.valid;
  const version = data.version;
  const createdAt = data.createdAt ? new Date(data.createdAt).toLocaleString("fa-IR") : "";
  const pcoCertified = data.pcoCertified;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* هدر */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-indigo-400" />
            🧠 Testology Clinical Report Verification
          </h1>
          <p className="text-xl text-indigo-200 mb-6">
            اعتبارسنجی رسمی گزارش‌های بالینی Testology
          </p>
        </div>

        {/* کارت اصلی */}
        <Card className={`${valid ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'} backdrop-blur-md shadow-2xl`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              {valid ? (
                <div className="flex items-center justify-center gap-3 text-green-400">
                  <CheckCircle className="w-8 h-8" />
                  ✅ گزارش معتبر است
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 text-red-400">
                  <XCircle className="w-8 h-8" />
                  ❌ گزارش نامعتبر است
                </div>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* جزئیات گزارش */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Hash className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-400">شناسه گزارش</div>
                    <div className="text-white font-mono text-sm">{data.reportId}</div>
                  </div>
                </div>
                
                {version && (
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-sm text-gray-400">شماره نسخه</div>
                      <div className="text-white font-mono text-sm">{version}</div>
                    </div>
                  </div>
                )}
                
                {createdAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-sm text-gray-400">تاریخ تولید</div>
                      <div className="text-white text-sm">{createdAt}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-400">وضعیت امضا</div>
                    <Badge className={valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {valid ? "تأیید شده" : "تأیید نشده"}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-indigo-400" />
                  <div>
                    <div className="text-sm text-gray-400">امنیت دیجیتال</div>
                    <Badge className={valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {valid ? "امن" : "نامطمئن"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* وضعیت PCO */}
            {pcoCertified ? (
              <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-green-400" />
                  <h3 className="text-lg font-semibold text-green-300">
                    🔏 تأیید رسمی PCO
                  </h3>
                </div>
                <p className="text-green-200 text-sm mb-3">
                  این گزارش توسط سازمان نظام روان‌شناسی ایران (PCO) تأیید شده است.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-300">
                  <Trophy className="w-4 h-4" />
                  <span>شماره مجوز: PCO-IR-2025-0764</span>
                </div>
                <a
                  href="https://pcoiran.ir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 text-teal-300 hover:text-teal-200 underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  مشاهده در وب‌سایت رسمی PCO
                </a>
              </div>
            ) : (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-yellow-300">
                    ⏳ در انتظار تأیید رسمی
                  </h3>
                </div>
                <p className="text-yellow-200 text-sm">
                  گزارش معتبر است اما هنوز تحت تأیید رسمی PCO قرار نگرفته.
                </p>
              </div>
            )}

            {/* پیام وضعیت */}
            <div className="text-center">
              <p className={`text-lg font-medium ${valid ? 'text-green-300' : 'text-red-300'}`}>
                {data.message}
              </p>
            </div>

            {/* دکمه‌های عملیات */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="text-white border-white hover:bg-white/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                بروزرسانی
              </Button>
              
              {valid && (
                <Button
                  onClick={() => window.open(`/api/pdf/generate-clinical-report`, '_blank')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  دانلود PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* هشدار اخلاقی */}
        <Card className="bg-yellow-500/10 border-yellow-500/30 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-yellow-300 mb-2">
                  هشدار اخلاقی و قانونی
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed">
                  این سیستم برای ارزیابی صحت امضا و عدم تغییر محتوای گزارش طراحی شده است. 
                  گزارش‌های معتبر تنها زمانی به‌عنوان سند بالینی رسمی شناخته می‌شوند که دارای مهر PCO باشند. 
                  این گزارش جایگزین تشخیص یا درمان توسط روان‌درمانگر نیست.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات فنی */}
        <Card className="bg-gray-500/10 border-gray-500/30 mt-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-gray-400 mt-1" />
              <div>
                <h4 className="text-lg font-semibold text-gray-300 mb-2">
                  اطلاعات فنی
                </h4>
                <div className="text-gray-400 text-sm space-y-2">
                  <p>• امضای دیجیتال: RSA-SHA256</p>
                  <p>• الگوریتم رمزنگاری: 2048-bit RSA</p>
                  <p>• استاندارد امنیتی: PKCS#8</p>
                  <p>• تأیید آنلاین: QR Code + URL Verification</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











