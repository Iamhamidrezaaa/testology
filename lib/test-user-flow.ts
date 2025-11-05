// تست فلو کاربری
export class UserFlowTester {
  
  // شبیه‌سازی کاربر جدید
  static simulateNewUser(): void {
    localStorage.clear();
    localStorage.setItem("testology_email", "newuser@testology.me");
    localStorage.setItem("testology_role", "user");
    console.log("✅ کاربر جدید شبیه‌سازی شد");
  }

  // شبیه‌سازی کاربر با داده‌های داشبورد
  static simulateReturningUser(): void {
    localStorage.clear();
    localStorage.setItem("testology_email", "returning@testology.me");
    localStorage.setItem("testology_role", "user");
    localStorage.setItem("testology_screening_completed", "true");
    localStorage.setItem("testology_test_results", JSON.stringify([
      { testId: "anxiety-assessment", score: 75, completedAt: new Date() },
      { testId: "depression-screening", score: 80, completedAt: new Date() }
    ]));
    localStorage.setItem("testology_dashboard_data", JSON.stringify({
      hasCompletedScreening: true,
      hasTestResults: true,
      hasProgressData: true,
      lastActivity: new Date(),
      userLevel: 2,
      totalXP: 100,
      completedTests: 2,
      totalTests: 2
    }));
    console.log("✅ کاربر بازگشتی شبیه‌سازی شد");
  }

  // شبیه‌سازی کاربر نیمه‌کاره
  static simulateIncompleteUser(): void {
    localStorage.clear();
    localStorage.setItem("testology_email", "incomplete@testology.me");
    localStorage.setItem("testology_role", "user");
    localStorage.setItem("testology_screening_completed", "true");
    // تست‌ها انجام نشده
    console.log("✅ کاربر نیمه‌کاره شبیه‌سازی شد");
  }

  // تست فلو کامل
  static async testCompleteFlow(): Promise<void> {
    console.log("🧪 شروع تست فلو...");
    
    // تست 1: کاربر جدید
    this.simulateNewUser();
    const { DashboardDataManager } = await import('@/lib/dashboard-data');
    
    console.log("تست 1 - کاربر جدید:");
    console.log("  shouldGoToDashboard:", DashboardDataManager.shouldGoToDashboard());
    console.log("  shouldGoToStart:", DashboardDataManager.shouldGoToStart());
    
    // تست 2: کاربر بازگشتی
    this.simulateReturningUser();
    console.log("تست 2 - کاربر بازگشتی:");
    console.log("  shouldGoToDashboard:", DashboardDataManager.shouldGoToDashboard());
    console.log("  shouldGoToStart:", DashboardDataManager.shouldGoToStart());
    
    // تست 3: کاربر نیمه‌کاره
    this.simulateIncompleteUser();
    console.log("تست 3 - کاربر نیمه‌کاره:");
    console.log("  shouldGoToDashboard:", DashboardDataManager.shouldGoToDashboard());
    console.log("  shouldGoToStart:", DashboardDataManager.shouldGoToStart());
    
    console.log("✅ تست فلو کامل شد");
  }
}




