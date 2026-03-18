const fs = require("fs");
const path = require("path");

const root = process.cwd();

const envPairs = [
  {
    from: path.join(root, "server", ".env.example"),
    to: path.join(root, "server", ".env"),
  },
  {
    from: path.join(root, "client", ".env.example"),
    to: path.join(root, "client", ".env"),
  },
];

let createdCount = 0;

for (const pair of envPairs) {
  if (!fs.existsSync(pair.from)) {
    console.log("Skipped (missing example): " + path.relative(root, pair.from));
    continue;
  }

  if (fs.existsSync(pair.to)) {
    console.log("Exists (kept as-is): " + path.relative(root, pair.to));
    continue;
  }

  fs.copyFileSync(pair.from, pair.to);
  createdCount += 1;
  console.log("Created: " + path.relative(root, pair.to));
}

if (createdCount === 0) {
  console.log("No new env files were created.");
} else {
  console.log("Done. Created " + createdCount + " env file(s).");
}
