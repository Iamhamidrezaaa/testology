// find-all-conflicts.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "app"); // کل پوشه app

const dynamicFolderMap = {};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const isDynamic = entry.name.startsWith("[") && entry.name.endsWith("]");
      const parentDir = path.relative(baseDir, path.dirname(fullPath));

      if (isDynamic) {
        const cleanPath = parentDir.replace(/\\/g, "/");

        if (!dynamicFolderMap[cleanPath]) {
          dynamicFolderMap[cleanPath] = new Set();
        }

        dynamicFolderMap[cleanPath].add(entry.name);
      }

      walk(fullPath);
    }
  }
}

walk(baseDir);

// بررسی تداخل مسیرها
let hasConflict = false;
console.log("🔎 بررسی تداخل نام‌های داینامیک در کل app...\n");
for (const [parentPath, names] of Object.entries(dynamicFolderMap)) {
  if (names.size > 1) {
    hasConflict = true;
    console.log(`❗ مسیر متداخل: ${parentPath}`);
    console.log(`   فولدرهای داینامیک: ${Array.from(names).join(", ")}`);
    console.log();
  }
}

if (!hasConflict) {
  console.log("✅ هیچ تداخلی پیدا نشد.");
}



















