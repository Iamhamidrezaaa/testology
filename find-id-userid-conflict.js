// find-id-userid-conflict.js
const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "app");

function walk(dir, level = 0) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(baseDir, fullPath);

    if (entry.isDirectory()) {
      const isDynamic = entry.name.startsWith("[") && entry.name.endsWith("]");
      if (isDynamic) {
        console.log(`${"  ".repeat(level)}🔹 ${entry.name} (${relativePath})`);
      }
      walk(fullPath, level + 1);
    }
  }
}

console.log("🔎 جستجوی تداخل id و userId:\n");
walk(baseDir);



















