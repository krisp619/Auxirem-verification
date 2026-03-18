const fs = require("fs");
const path = require("path");

const root = process.cwd();

const checks = [
  {
    file: path.join(root, "server", ".env"),
    required: ["PORT"],
  },
  {
    file: path.join(root, "client", ".env"),
    required: ["VITE_API_BASE_URL"],
  },
];

function parseEnv(content) {
  const map = new Map();
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) continue;

    const key = line.slice(0, eqIndex).trim();
    const value = line.slice(eqIndex + 1).trim();
    map.set(key, value);
  }

  return map;
}

let hasError = false;

for (const check of checks) {
  const relPath = path.relative(root, check.file);

  if (!fs.existsSync(check.file)) {
    console.log("Missing file: " + relPath);
    hasError = true;
    continue;
  }

  const envMap = parseEnv(fs.readFileSync(check.file, "utf8"));
  const missingKeys = check.required.filter((key) => {
    const value = envMap.get(key);
    return value === undefined || value === "";
  });

  if (missingKeys.length > 0) {
    hasError = true;
    console.log("Missing keys in " + relPath + ": " + missingKeys.join(", "));
  } else {
    console.log("OK: " + relPath);
  }
}

if (hasError) {
  console.log("Env validation failed. Please update your .env files.");
  process.exit(1);
}

console.log("Env validation passed.");
