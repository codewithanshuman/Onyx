// Fails if any internal href/src on the site points at a file that doesn't exist.
//   npm run check:links
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = {
  "index.html": "/", "404.html": "/", "components/index.html": "/components/", "studio/index.html": "/studio/",
  "changelog/index.html": "/changelog/", "blocks/index.html": "/blocks/", "docs/index.html": "/docs/", "assets/site.js": "/"
};
const ATTR = /(?:href|src)=\\?"([^"\\]+)\\?"/g;

function resolves(base, ref) {
  ref = ref.split("#")[0].split("?")[0];
  if (!ref || /^(https?:|mailto:|data:|javascript:)/.test(ref)) return true;
  let local = new URL(ref, "http://x" + base).pathname.replace(/^\//, "");
  if (local === "" || local.endsWith("/")) local += "index.html";
  return existsSync(join(root, local)) || existsSync(join(root, local + ".html"));
}

let checked = 0;
const broken = [];
for (const [file, base] of Object.entries(PAGES)) {
  const text = readFileSync(join(root, file), "utf8");
  for (const [, ref] of text.matchAll(ATTR)) {
    if (ref.includes("'") || ref.includes("+")) continue; // built at runtime
    checked++;
    if (!resolves(base, ref)) broken.push(`${file} -> ${ref}`);
  }
}
console.log(`Links checked: ${checked}`);
if (broken.length) {
  console.error("Broken links:\n  " + [...new Set(broken)].join("\n  "));
  process.exit(1);
}
console.log("No broken links.");
