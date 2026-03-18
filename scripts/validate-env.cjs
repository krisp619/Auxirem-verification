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

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidPort(value) {
  if (!/^\d+$/.test(value)) return false;
  const num = Number(value);
  return num >= 1 && num <= 65535;
}

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

    if (relPath === path.join("server", ".env")) {
      const port = envMap.get("PORT");
      if (!isValidPort(port)) {
        hasError = true;
        console.log("Invalid PORT in " + relPath + ": must be 1-65535");
      }
    }

    if (relPath === path.join("client", ".env")) {
      const apiBase = envMap.get("VITE_API_BASE_URL");
      if (!isValidHttpUrl(apiBase)) {
        hasError = true;
        console.log(
          "Invalid VITE_API_BASE_URL in " + relPath + ": must start with http:// or https://"
        );
      }
    }
  }
}

if (hasError) {
  console.log("Env validation failed. Please update your .env files.");
  process.exit(1);
}

console.log("Env validation passed.");
