import { access, readdir } from "node:fs/promises";
import path from "node:path";

const requiredFiles = [
  "site/index.html",
  "site/styles.css",
  "site/src/app.js",
  "site/src/battle-engine.js",
  "site/src/game-data.js",
];

const missing = [];

for (const file of requiredFiles) {
  try {
    await access(file);
  } catch {
    missing.push(file);
  }
}

try {
  const imageFiles = await readdir(path.join("site", "assets", "images"));
  if (!imageFiles.some((file) => file.endsWith(".png"))) {
    missing.push("site/assets/images/*.png");
  }
} catch {
  missing.push("site/assets/images/");
}

if (missing.length > 0) {
  console.error("Site verification failed. Missing:");
  for (const file of missing) console.error(`- ${file}`);
  process.exit(1);
}

console.log("Site verification passed.");
