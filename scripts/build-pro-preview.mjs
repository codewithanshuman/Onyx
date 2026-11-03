// Copies the Onyx Pro runtime from the private ./pro checkout into docs/pro-preview,
// so the public docs can show live Pro demos. Templates and source stay private.
//
//   npm run build:pro-preview
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "pro");
const out = join(root, "docs", "pro-preview");

if (!existsSync(join(src, "onyx-pro.css"))) {
  console.error("No ./pro checkout found. Clone the private Onyx Pro repo into ./pro first.");
  process.exit(1);
}

const version = JSON.parse(readFileSync(join(src, "package.json"), "utf8")).version;
const banner =
  `/*! Onyx Pro v${version} — PREVIEW BUILD for the Onyx documentation only.\n` +
  ` *  Not licensed for use in your projects. Get a license from the Onyx pricing page. */\n`;

// Strip comments and collapse whitespace. Spaces before ":" are kept, since ".a :hover" differs from ".a:hover".
const css = readFileSync(join(src, "onyx-pro.css"), "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/\s+/g, " ")
  .replace(/\s*([{};,>])\s*/g, "$1")
  .replace(/:\s+/g, ":")
  .replace(/;}/g, "}")
  .trim();

// JS keeps its formatting (no minifier dependency); only the license header is replaced.
const js = readFileSync(join(src, "onyx-pro.js"), "utf8").replace(/^\/\*![\s\S]*?\*\/\s*/, "");

mkdirSync(out, { recursive: true });
writeFileSync(join(out, "onyx-pro.css"), banner + css + "\n");
writeFileSync(join(out, "onyx-pro.js"), banner + js);
console.log(`Wrote docs/pro-preview (v${version}): css ${css.length} bytes, js ${js.length} bytes`);
