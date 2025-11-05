// اسکریپت پاک کردن داده‌های کاربران تست
console.log("🧹 Clearing test user data...");

// کلیدهای localStorage که باید پاک شوند
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

// پاک کردن کلیدها
keysToClear.forEach(key => {
  localStorage.removeItem(key);
  console.log(`✅ Removed: ${key}`);
});

console.log("🎉 All test data cleared! Please refresh the page.");
console.log("📝 You can now test the flow as a new user.");




