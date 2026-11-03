import { defineConfig } from "tsup";

// Bundles the demo page (React included) into demo/dist for viewing in a browser
export default defineConfig({
  entry: { demo: "demo/main.tsx" },
  outDir: "demo/dist",
  format: ["iife"],
  platform: "browser",
  minify: true,
  clean: true,
  noExternal: [/.*/],
  define: { "process.env.NODE_ENV": '"production"' }
});
