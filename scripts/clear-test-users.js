// اسکریپت پاک کردن داده‌های کاربران تست
// این اسکریپت را در کنسول مرورگر اجرا کنید

function clearTestUserData() {
  console.log("🧹 شروع پاک کردن داده‌های کاربران تست...");
  
  // پاک کردن همه داده‌های مربوط به تست
  const keysToRemove = [
    'testology_screening_completed',
    'testology_screening_analysis', 
    'testology_test_progress',
    'testology_test_results',
    'testology_suggested_tests',
    'testology_dashboard_data',
    'testology_current_test'
  ];
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`✅ ${key} پاک شد`);
  });
  
  console.log("🎉 همه داده‌های تست پاک شدند!");
  console.log("💡 حالا می‌توانید با کاربران تست لاگین کنید و تست‌ها را انجام دهید");
}

// اجرای خودکار
clearTestUserData();




