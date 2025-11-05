// find-all-dynamic-routes2.js
const fs = require("fs");
const path = require("path");

function findDynamicRoutes(baseDir, prefix = "") {
  const routes = [];
  
  function walk(dir, currentPath = "") {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.next') continue;
      
      const fullPath = path.join(dir, entry.name);
      const routePath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
      
      if (entry.isDirectory()) {
        const isDynamic = entry.name.startsWith("[") && entry.name.endsWith("]");
        if (isDynamic) {
          routes.push({
            path: `${prefix}${routePath}`,
            fullPath: fullPath,
            param: entry.name
          });
        }
        walk(fullPath, routePath);
      }
    }
  }
  
  walk(baseDir);
  return routes;
}

console.log("🔎 تمام مسیرهای داینامیک:\n");

const appRoutes = findDynamicRoutes(path.join(__dirname, "app"), "/app/");
const pagesRoutes = findDynamicRoutes(path.join(__dirname, "pages"), "/pages/");

console.log("📁 مسیرهای app:");
appRoutes.forEach(r => console.log(`  ${r.path} (${r.param})`));

console.log("\n📁 مسیرهای pages:");
pagesRoutes.forEach(r => console.log(`  ${r.path} (${r.param})`));

// بررسی تداخل
console.log("\n🔍 بررسی تداخل:");
const allRoutes = [...appRoutes, ...pagesRoutes];

// گروه‌بندی بر اساس مسیر بدون پارامتر
const pathGroups = {};
for (const route of allRoutes) {
  // حذف /app/ و /pages/ از ابتدای مسیر
  let cleanPath = route.path.replace(/^\/app\//, '').replace(/^\/pages\//, '');
  // حذف /api/ از ابتدای مسیر
  cleanPath = cleanPath.replace(/^api\//, '');
  
  if (!pathGroups[cleanPath]) {
    pathGroups[cleanPath] = [];
  }
  pathGroups[cleanPath].push(route);
}

let hasConflict = false;
for (const [cleanPath, routes] of Object.entries(pathGroups)) {
  if (routes.length > 1) {
    const params = [...new Set(routes.map(r => r.param))];
    if (params.length > 1) {
      hasConflict = true;
      console.log(`\n❗ تداخل در: ${cleanPath}`);
      routes.forEach(r => console.log(`  - ${r.path} (${r.param})`));
    }
  }
}

if (!hasConflict) {
  console.log("\n✅ هیچ تداخلی پیدا نشد.");
}



















