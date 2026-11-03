// Opens every page in a real browser and fails on:
//   - any accessibility violation (axe-core, WCAG 2.1 AA), in light and dark mode
//   - sideways scrolling at phone, tablet and desktop widths
//   - a navbar that wraps, or that shows both (or neither) the links and the menu button
//   - JavaScript errors on the page
//   npm run check:site
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PAGES = ["/", "/components/", "/studio/", "/changelog/", "/docs/#/button", "/docs/#/color", "/docs/#/date-picker"];
const WIDTHS = [320, 390, 768, 1024, 1440];
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".mjs": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json" };

// ---- A tiny static server, serving folders as their index.html (like Vercel) ----
const server = createServer(async (req, res) => {
  let path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  if (path.startsWith("..")) { res.writeHead(403).end(); return; }
  let file = join(root, path);
  try { if ((await stat(file)).isDirectory()) file = join(file, "index.html"); } catch { /* falls through to 404 */ }
  try {
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404, { "content-type": "text/html" }).end(await readFile(join(root, "404.html")));
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const failures = [];
const fail = (msg) => { failures.push(msg); console.error("  ✖ " + msg); };

async function open(page, url) {
  await page.goto(base + url, { waitUntil: "load" });
  // Let scripts render (gallery previews mount progressively), then show reveal-on-scroll content
  await page.waitForTimeout(url.startsWith("/components") ? 4500 : 900);
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in")));
}

for (const url of PAGES) {
  console.log(`\n${url}`);

  // ---- Accessibility, light and dark ----
  for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: theme, reducedMotion: "reduce" });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await open(page, url);
    await page.evaluate((t) => document.documentElement.setAttribute("data-theme", t), theme);
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
    for (const v of violations) fail(`${url} [${theme}] ${v.impact} ${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" ; ")}`);
    for (const e of errors) fail(`${url} [${theme}] JavaScript error: ${e}`);
    if (!violations.length && !errors.length) console.log(`  ✔ accessibility (${theme})`);
    await context.close();
  }

  // ---- Layout at each width ----
  const context = await browser.newContext({ viewport: { width: WIDTHS[0], height: 900 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    await open(page, url);
    const r = await page.evaluate(() => {
      const d = document.documentElement;
      const links = document.querySelector(".ox-navbar-links"), toggle = document.querySelector(".ox-navbar-toggle");
      const shown = (el) => el && getComputedStyle(el).display !== "none";
      const inner = document.querySelector(".ox-navbar-inner");
      return {
        overflow: d.scrollWidth - d.clientWidth,
        hasNav: !!(links && toggle),
        navOk: !(links && toggle) || shown(links) !== shown(toggle),
        navWraps: inner ? inner.getBoundingClientRect().height > 70 : false
      };
    });
    if (r.overflow > 0) fail(`${url} @${width}px scrolls sideways by ${r.overflow}px`);
    if (!r.navOk) fail(`${url} @${width}px navbar shows both or neither of links and menu button`);
    if (r.navWraps) fail(`${url} @${width}px navbar wraps onto two rows`);
  }
  if (!failures.some((f) => f.startsWith(url + " @"))) console.log(`  ✔ layout at ${WIDTHS.join(", ")}px`);
  await context.close();
}

await browser.close();
server.close();
console.log(`\n${failures.length ? failures.length + " problem(s) found." : "All site checks passed."}`);
process.exit(failures.length ? 1 : 0);
