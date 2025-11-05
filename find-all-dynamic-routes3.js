// find-all-dynamic-routes3.js
const fs = require("fs");
const path = require("path");

function findDynamicRoutes(baseDir, prefix = "") {
  const routes = [];
  
  function walk(dir, currentPath = "") {
    if (!fs.existsSync(dir)) return;
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === '.git') continue;
        
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
    } catch (err) {
      console.error(`Error reading ${dir}:`, err.message);
    }
  }
  
  walk(baseDir);
  return routes;
}

console.log("🔎 تمام مسیرهای داینامیک:\n");

const appRoutes = findDynamicRoutes(path.join(__dirname, "app"), "/app/");
const pagesRoutes = findDynamicRoutes(path.join(__dirname, "pages"), "/pages/");

console.log("📁 مسیرهای app (" + appRoutes.length + "):");
appRoutes.forEach(r => console.log(`  ${r.path} (${r.param})`));

console.log("\n📁 مسیرهای pages (" + pagesRoutes.length + "):");
pagesRoutes.forEach(r => console.log(`  ${r.path} (${r.param})`));

console.log("\n🔍 جستجوی therapist/user:");
const therapistRoutes = [...appRoutes, ...pagesRoutes].filter(r => r.path.includes("therapist") && r.path.includes("user"));
console.log("یافت شد:", therapistRoutes.length);
therapistRoutes.forEach(r => console.log(`  ${r.path} (${r.param})`));



















