"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Star, 
  MessageCircle, 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  Filter,
  Search
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Psychologist {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  availability: string;
  location: string;
  languages: string[];
  image: string;
  bio: string;
  isOnline: boolean;
}

const psychologists: Psychologist[] = [
  {
    id: "1",
    name: "دکتر مریم احمدی",
    specialization: ["اضطراب", "افسردگی", "روابط زناشویی"],
    experience: 8,
    rating: 4.9,
    reviews: 127,
    price: 150000,
    availability: "آنلاین",
    location: "تهران",
    languages: ["فارسی", "انگلیسی"],
    image: "/avatars/psychologist1.jpg",
    bio: "روان‌شناس بالینی با 8 سال تجربه در درمان اضطراب و افسردگی. متخصص در درمان‌های شناختی-رفتاری.",
    isOnline: true
  },
  {
    id: "2",
    name: "دکتر علی رضایی",
    specialization: ["خانواده درمانی", "کودک و نوجوان", "مشاوره تحصیلی"],
    experience: 12,
    rating: 4.8,
    reviews: 89,
    price: 180000,
    availability: "فردا 14:00",
    location: "اصفهان",
    languages: ["فارسی"],
    image: "/avatars/psychologist2.jpg",
    bio: "روان‌شناس خانواده با تخصص در مشاوره کودکان و نوجوانان. دارای مدرک دکتری روان‌شناسی.",
    isOnline: false
  },
  {
    id: "3",
    name: "دکتر فاطمه محمدی",
    specialization: ["تروما", "PTSD", "اضطراب اجتماعی"],
    experience: 6,
    rating: 4.7,
    reviews: 64,
    price: 200000,
    availability: "امروز 16:00",
    location: "مشهد",
    languages: ["فارسی", "عربی"],
    image: "/avatars/psychologist3.jpg",
    bio: "متخصص در درمان تروما و اختلالات اضطرابی. دارای تجربه کار با قربانیان حوادث.",
    isOnline: true
  },
  {
    id: "4",
    name: "دکتر حسین کریمی",
    specialization: ["اعتیاد", "رفتارهای پرخطر", "مدیریت خشم"],
    experience: 10,
    rating: 4.6,
    reviews: 156,
    price: 170000,
    availability: "هفته آینده",
    location: "شیراز",
    languages: ["فارسی"],
    image: "/avatars/psychologist4.jpg",
    bio: "روان‌شناس متخصص در درمان اعتیاد و رفتارهای پرخطر. دارای گواهینامه‌های بین‌المللی.",
    isOnline: false
  },
  {
    id: "5",
    name: "دکتر زهرا نوری",
    specialization: ["زنان و زایمان", "بارداری", "پس از زایمان"],
    experience: 7,
    rating: 4.9,
    reviews: 98,
    price: 160000,
    availability: "آنلاین",
    location: "تبریز",
    languages: ["فارسی", "ترکی"],
    image: "/avatars/psychologist5.jpg",
    bio: "متخصص روان‌شناسی زنان با تمرکز بر مسائل دوران بارداری و پس از زایمان.",
    isOnline: true
  },
  {
    id: "6",
    name: "دکتر محسن صادقی",
    specialization: ["مشاوره شغلی", "استرس کاری", "مدیریت زمان"],
    experience: 9,
    rating: 4.5,
    reviews: 73,
    price: 140000,
    availability: "فردا 10:00",
    location: "کرج",
    languages: ["فارسی", "انگلیسی"],
    image: "/avatars/psychologist6.jpg",
    bio: "روان‌شناس صنعتی-سازمانی با تخصص در مشاوره شغلی و بهبود عملکرد کاری.",
    isOnline: false
  }
];

export default function PsychologistsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const specializations = [
    "اضطراب", "افسردگی", "روابط زناشویی", "خانواده درمانی", 
    "کودک و نوجوان", "تروما", "اعتیاد", "زنان و زایمان", "مشاوره شغلی"
  ];

  const filteredPsychologists = psychologists
    .filter(psychologist => {
      const matchesSearch = psychologist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           psychologist.specialization.some(spec => 
                             spec.toLowerCase().includes(searchTerm.toLowerCase())
                           );
      const matchesSpecialization = !selectedSpecialization || 
                                  psychologist.specialization.includes(selectedSpecialization);
      return matchesSearch && matchesSpecialization;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price":
          return a.price - b.price;
        case "experience":
          return b.experience - a.experience;
        default:
          return 0;
      }
    });

  const handleBookSession = (psychologistId: string) => {
    // در آینده می‌تواند به صفحه رزرو منتقل شود
    alert(`رزرو جلسه با روان‌شناس ${psychologistId} - این قابلیت به زودی اضافه خواهد شد`);
  };

  const handleChat = (psychologistId: string) => {
    // در آینده می‌تواند به چت خصوصی منتقل شود
    alert(`شروع چت با روان‌شناس ${psychologistId} - این قابلیت به زودی اضافه خواهد شد`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              بازگشت
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                  روان‌شناسان متخصص
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  مشاوره با بهترین متخصصان روان‌شناسی
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="جستجو در نام یا تخصص..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">همه تخصص‌ها</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="rating">مرتب‌سازی بر اساس امتیاز</option>
              <option value="price">مرتب‌سازی بر اساس قیمت</option>
              <option value="experience">مرتب‌سازی بر اساس تجربه</option>
            </select>
          </div>
        </div>

        {/* Psychologists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPsychologists.map((psychologist) => (
            <Card key={psychologist.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {psychologist.name.split(' ')[1]?.charAt(0) || 'د'}
                      </div>
                      {psychologist.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{psychologist.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{psychologist.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          ({psychologist.reviews} نظر)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Specializations */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تخصص‌ها:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {psychologist.specialization.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {psychologist.bio}
                </p>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{psychologist.experience} سال تجربه</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{psychologist.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className={psychologist.isOnline ? "text-green-600" : "text-orange-600"}>
                      {psychologist.availability}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-indigo-600">
                      {psychologist.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 mr-1">تومان</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleBookSession(psychologist.id)}
                    className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
                  >
                    <Calendar className="w-4 h-4 ml-2" />
                    رزرو جلسه
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleChat(psychologist.id)}
                    className="px-4"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPsychologists.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
              روان‌شناسی یافت نشد
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              لطفاً فیلترهای جستجو را تغییر دهید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
