const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// لیست فایل‌هایی که باید اصلاح شوند
const files = [
  'app/api/notifications/[id]/route.ts',
  'app/api/notifications/user/route.ts',
  'app/api/notifications/daily/route.ts',
  'app/api/recommendation/generate/route.ts',
  'app/api/recommendation/[id]/route.ts',
  'app/api/weekly/assign/route.ts',
  'app/api/weekly/[id]/route.ts',
  'app/api/video-log/upload/route.ts',
  'app/api/user/assignments/[id]/route.ts',
  'app/api/therapist/sessions/[id]/route.ts',
  'app/api/therapist/assignments/[id]/route.ts',
  'app/api/mood-log/add/route.ts'
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  ${file} not found, skipping...`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // تبدیل smartNotification به notification
  content = content.replace(/prisma\.smartNotification/g, 'prisma.notification');
  
  // تبدیل seen به read (اگر وجود دارد)
  content = content.replace(/seen:\s*true/g, 'read: true');
  content = content.replace(/seen:\s*false/g, 'read: false');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${file}`);
  } else {
    console.log(`⏭️  ${file} - no changes needed`);
  }
});

console.log(`\n✨ Fixed ${files.length} files!`);

