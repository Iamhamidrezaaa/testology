// سیستم مدیریت داده‌های داشبورد
export interface DashboardData {
  hasCompletedScreening: boolean;
  hasTestResults: boolean;
  hasProgressData: boolean;
  lastActivity: Date;
  userLevel: number;
  totalXP: number;
  completedTests: number;
  totalTests: number;
}

export class DashboardDataManager {
  private static STORAGE_KEY = 'testology_dashboard_data';

  // بررسی اینکه آیا کاربر داده‌های داشبورد دارد یا نه
  static hasDashboardData(): boolean {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return false;

      const dashboardData: DashboardData = JSON.parse(data);
      
      // چک کردن وجود داده‌های مهم
      return dashboardData.hasCompletedScreening || 
             dashboardData.hasTestResults || 
             dashboardData.hasProgressData;
    } catch (error) {
      console.error('Error checking dashboard data:', error);
      return false;
    }
  }

  // دریافت داده‌های داشبورد
  static getDashboardData(): DashboardData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;

      const dashboardData: DashboardData = JSON.parse(data);
      return {
        ...dashboardData,
        lastActivity: new Date(dashboardData.lastActivity)
      };
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      return null;
    }
  }

  // به‌روزرسانی داده‌های داشبورد
  static updateDashboardData(updates: Partial<DashboardData>): void {
    try {
      const existingData = this.getDashboardData() || {
        hasCompletedScreening: false,
        hasTestResults: false,
        hasProgressData: false,
        lastActivity: new Date(),
        userLevel: 1,
        totalXP: 0,
        completedTests: 0,
        totalTests: 0
      };

      const updatedData: DashboardData = {
        ...existingData,
        ...updates,
        lastActivity: new Date()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error updating dashboard data:', error);
    }
  }

  // بررسی وضعیت کامل بودن پروفایل کاربر
  static isUserProfileComplete(): boolean {
    const data = this.getDashboardData();
    if (!data) return false;

    return data.hasCompletedScreening && 
           data.hasTestResults && 
           data.completedTests > 0;
  }

  // دریافت سطح کاربر
  static getUserLevel(): number {
    const data = this.getDashboardData();
    return data?.userLevel || 1;
  }

  // دریافت XP کل
  static getTotalXP(): number {
    const data = this.getDashboardData();
    return data?.totalXP || 0;
  }

  // افزودن XP
  static addXP(amount: number): void {
    const currentXP = this.getTotalXP();
    const newXP = currentXP + amount;
    
    // محاسبه سطح جدید (هر 100 XP = یک سطح)
    const newLevel = Math.floor(newXP / 100) + 1;
    
    this.updateDashboardData({
      totalXP: newXP,
      userLevel: newLevel
    });
  }

  // پاک کردن داده‌های داشبورد (برای شروع جدید)
  static clearDashboardData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // پاک کردن تمام داده‌های کاربران تست
  static clearAllTestData(): void {
    const keysToClear = [
      'testology_screening_completed',
      'testology_screening_analysis', 
      'testology_test_progress',
      'testology_test_results',
      'testology_suggested_tests',
      'testology_dashboard_data',
      'testology_current_test',
      'testology_profile_completed',
      'testology_user_profile'
    ];

    keysToClear.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log('🧹 All test data cleared');
  }

  // بررسی اینکه آیا کاربر باید به داشبورد برود یا صفحه استارت
  static shouldGoToDashboard(): boolean {
    // چک کردن وجود داده‌های کامل
    const hasScreening = localStorage.getItem("testology_screening_completed");
    const hasResults = localStorage.getItem("testology_test_results");
    const hasProfile = localStorage.getItem("testology_profile_completed");
    
    console.log('🔍 shouldGoToDashboard check:', {
      hasScreening,
      hasResults,
      hasProfile,
      result: !!(hasScreening && hasResults && hasProfile)
    });
    
    // کاربر باید همه مراحل را تکمیل کرده باشد
    return !!(hasScreening && hasResults && hasProfile);
  }

  // بررسی اینکه آیا کاربر باید به صفحه استارت برود
  static shouldGoToStart(): boolean {
    // چک کردن اینکه آیا کاربر هنوز مراحل اولیه را تکمیل نکرده
    const hasScreening = localStorage.getItem("testology_screening_completed");
    const hasResults = localStorage.getItem("testology_test_results");
    const hasProfile = localStorage.getItem("testology_profile_completed");
    
    console.log('🔍 shouldGoToStart check:', {
      hasScreening,
      hasResults,
      hasProfile,
      result: !hasScreening || !hasResults || !hasProfile
    });
    
    // اگر هیچ کدام از مراحل تکمیل نشده، کاربر جدید است
    return !hasScreening || !hasResults || !hasProfile;
  }

  // بررسی اینکه آیا کاربر واقعاً جدید است (هیچ داده‌ای ندارد)
  static isTrulyNewUser(): boolean {
    const hasScreening = localStorage.getItem("testology_screening_completed");
    const hasResults = localStorage.getItem("testology_test_results");
    const hasProfile = localStorage.getItem("testology_profile_completed");
    const hasDashboardData = this.hasDashboardData();
    
    const isNew = !hasScreening && !hasResults && !hasProfile && !hasDashboardData;
    
    console.log('🆕 isTrulyNewUser check:', {
      hasScreening,
      hasResults,
      hasProfile,
      hasDashboardData,
      isNew
    });
    
    return isNew;
  }
}
