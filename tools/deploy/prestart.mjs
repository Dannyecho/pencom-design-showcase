// Runs before every `npm start` (package.json "prestart"). `next start` needs a production build, but some hosts
// (the airoapp.ai preview) copy over a `.next` folder that only holds dev-server output and skip the build. If the
// production build is missing, build it here so the site starts instead of failing with ENOENT.
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const built = ["BUILD_ID", "server/preview-props.json"].every((f) => existsSync(resolve(root, ".next", f)));

if (built) {
  console.log("prestart: production build found.");
} else {
  console.log("prestart: no production build in .next, running next build.");
  execSync("npx next build --webpack", { cwd: root, stdio: "inherit" });
}
