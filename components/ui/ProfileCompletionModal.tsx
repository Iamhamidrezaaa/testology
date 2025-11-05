"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { User, Calendar, MapPin, Briefcase, Heart, AlertCircle } from 'lucide-react';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onComplete: (profileData: any) => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({ isOpen, onComplete }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    city: '',
    occupation: '',
    education: '',
    relationshipStatus: '',
    interests: '',
    healthConditions: '',
    goals: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'نام الزامی است';
    if (!formData.lastName.trim()) newErrors.lastName = 'نام خانوادگی الزامی است';
    if (!formData.age.trim()) newErrors.age = 'سن الزامی است';
    if (!formData.gender) newErrors.gender = 'جنسیت الزامی است';
    if (!formData.city.trim()) newErrors.city = 'شهر الزامی است';
    if (!formData.occupation.trim()) newErrors.occupation = 'شغل الزامی است';
    if (!formData.education) newErrors.education = 'تحصیلات الزامی است';
    if (!formData.relationshipStatus) newErrors.relationshipStatus = 'وضعیت تأهل الزامی است';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // ذخیره اطلاعات پروفایل
      localStorage.setItem('testology_user_profile', JSON.stringify(formData));
      localStorage.setItem('testology_profile_completed', 'true');
      
      onComplete(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              <CardTitle className="text-xl">تکمیل پروفایل کاربری</CardTitle>
            </div>
            <p className="text-blue-100 mt-2">
              برای استفاده کامل از خدمات Testology، لطفاً اطلاعات پروفایل خود را تکمیل کنید.
            </p>
          </CardHeader>
          
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* اطلاعات شخصی */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-500" />
                  اطلاعات شخصی
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">نام *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">نام خانوادگی *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="age">سن *</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className={errors.age ? 'border-red-500' : ''}
                    />
                    {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">جنسیت *</Label>
                    <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                      <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">مرد</SelectItem>
                        <SelectItem value="female">زن</SelectItem>
                        <SelectItem value="other">سایر</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="city">شهر *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={errors.city ? 'border-red-500' : ''}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="occupation">شغل *</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => handleInputChange('occupation', e.target.value)}
                      className={errors.occupation ? 'border-red-500' : ''}
                    />
                    {errors.occupation && <p className="text-red-500 text-sm mt-1">{errors.occupation}</p>}
                  </div>
                </div>
              </div>

              {/* اطلاعات تحصیلی و اجتماعی */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-green-500" />
                  اطلاعات تحصیلی و اجتماعی
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="education">تحصیلات *</Label>
                    <Select value={formData.education} onValueChange={(value) => handleInputChange('education', value)}>
                      <SelectTrigger className={errors.education ? 'border-red-500' : ''}>
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diploma">دیپلم</SelectItem>
                        <SelectItem value="associate">فوق دیپلم</SelectItem>
                        <SelectItem value="bachelor">لیسانس</SelectItem>
                        <SelectItem value="master">فوق لیسانس</SelectItem>
                        <SelectItem value="phd">دکترا</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.education && <p className="text-red-500 text-sm mt-1">{errors.education}</p>}
                  </div>
                  
                  <div>
                    <Label htmlFor="relationshipStatus">وضعیت تأهل *</Label>
                    <Select value={formData.relationshipStatus} onValueChange={(value) => handleInputChange('relationshipStatus', value)}>
                      <SelectTrigger className={errors.relationshipStatus ? 'border-red-500' : ''}>
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">مجرد</SelectItem>
                        <SelectItem value="married">متأهل</SelectItem>
                        <SelectItem value="divorced">مطلقه</SelectItem>
                        <SelectItem value="widowed">بیوه</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.relationshipStatus && <p className="text-red-500 text-sm mt-1">{errors.relationshipStatus}</p>}
                  </div>
                </div>
              </div>

              {/* اطلاعات اضافی */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  اطلاعات اضافی
                </h3>
                
                <div>
                  <Label htmlFor="interests">علایق و سرگرمی‌ها</Label>
                  <Textarea
                    id="interests"
                    value={formData.interests}
                    onChange={(e) => handleInputChange('interests', e.target.value)}
                    placeholder="علایق و سرگرمی‌های خود را بنویسید..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="healthConditions">شرایط سلامتی (اختیاری)</Label>
                  <Textarea
                    id="healthConditions"
                    value={formData.healthConditions}
                    onChange={(e) => handleInputChange('healthConditions', e.target.value)}
                    placeholder="اگر شرایط خاص سلامتی دارید، اینجا بنویسید..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="goals">اهداف و انگیزه‌ها</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    placeholder="اهداف و انگیزه‌های خود را بنویسید..."
                    rows={3}
                  />
                </div>
              </div>

              {/* دکمه‌ها */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  تکمیل پروفایل
                </Button>
              </div>
            </form>
          </CardContent>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProfileCompletionModal;




