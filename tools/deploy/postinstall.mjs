// Runs after every `npm install` (package.json "postinstall"): builds the site, so a host that pulls from GitHub,
// installs and restarts (GoDaddy Node.js hosting) serves the new code instead of an old `.next` build.
// Skip it with SKIP_BUILD=1 (for example `SKIP_BUILD=1 npm install` on your own machine).
import { execSync } from "node:child_process";
import { resolve } from "node:path";

if (process.env.SKIP_BUILD === "1") {
  console.log("postinstall: SKIP_BUILD=1, not building.");
} else {
  console.log("postinstall: building the site (next build). Set SKIP_BUILD=1 to skip.");
  execSync("npx next build --webpack", { cwd: resolve(import.meta.dirname, "../.."), stdio: "inherit" });
}
