const fs = require("fs");
const path = require("path");

const foldersToCheck = [
  "pages",
  "pages/tests",
  "pages/api",
  "pages/data",
  "app",
];

let currentDir = __dirname;

function isValidImport(line) {
  const match = line.match(/import.*from ['"](.+)['"]/);
  if (!match) return true;
  const importPath = match[1];
  if (importPath.startsWith(".")) {
    const filePath = path.resolve(currentDir, importPath);
    return (
      fs.existsSync(filePath + ".ts") ||
      fs.existsSync(filePath + ".tsx") ||
      fs.existsSync(path.join(filePath, "index.tsx")) ||
      fs.existsSync(path.join(filePath, "index.ts"))
    );
  }
  return true; // برای پکیج‌های npm چک نمی‌کنیم
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const size = fs.statSync(filePath).size;

  let hasExport = false;
  let hasInvalidImport = false;

  lines.forEach((line) => {
    if (line.includes("export ") || line.startsWith("export")) hasExport = true;
    if (!isValidImport(line)) hasInvalidImport = true;
  });

  return {
    path: filePath,
    empty: size === 0,
    missingExport: !hasExport,
    invalidImport: hasInvalidImport,
  };
}

function scanFolder(folder) {
  const fullPath = path.resolve(__dirname, folder);
  if (!fs.existsSync(fullPath)) return [];

  const results = [];

  const walk = (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const full = path.join(dir, file);
      try {
        const stat = fs.statSync(full);
        if (stat.isDirectory()) {
          walk(full);
        } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
          currentDir = path.dirname(full);
          const result = scanFile(full);
          if (result.empty || result.missingExport || result.invalidImport) {
            results.push(result);
          }
        }
      } catch (e) {
        results.push({ path: full, error: e.message });
      }
    }
  };

  walk(fullPath);
  return results;
}

let allResults = [];

foldersToCheck.forEach((folder) => {
  const results = scanFolder(folder);
  allResults = allResults.concat(results);
});

if (allResults.length === 0) {
  console.log("✅ همه فایل‌ها سالم هستند.");
} else {
  console.log("❌ فایل‌های مشکوک یا دارای مشکل:");
  allResults.forEach((res) => {
    console.log(`\n🔍 ${res.path}`);
    if (res.error) console.log(`   ⛔ خطا: ${res.error}`);
    if (res.empty) console.log("   ⚠️ فایل خالی است.");
    if (res.missingExport) console.log("   ⚠️ فاقد export است.");
    if (res.invalidImport) console.log("   ⚠️ import نامعتبر دارد.");
  });
}
























