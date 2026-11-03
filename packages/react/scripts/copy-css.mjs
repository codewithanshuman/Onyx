// Ships the core Onyx stylesheet with the React package as @onyx-ui/react/styles.css
import { copyFileSync } from "node:fs";
copyFileSync(new URL("../../../src/onyx.css", import.meta.url), new URL("../dist/styles.css", import.meta.url));
console.log("Copied onyx.css to dist/styles.css");
