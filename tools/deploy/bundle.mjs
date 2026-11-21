// Builds a ready-to-run deploy bundle for GoDaddy Node.js hosting: `npm run bundle`.
// Output: deploy/ (a folder) and ../../pencom-<theme>-godaddy.zip, with package.json at the top level.
// The host only has to run `npm start` (or `npm run dev`; both start the same production server).
// Nothing is built or installed on the host, and no extra processes or ports are used.
import { execSync } from "node:child_process";
import { cpSync, existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const out = join(root, "deploy");
const zip = resolve(root, `../../pencom-${basename(root)}-godaddy.zip`);
const run = (cmd, cwd = root) => execSync(cmd, { cwd, stdio: "inherit", env: { ...process.env, NEXT_STANDALONE: "1" } });

run("npm run build"); // next build --webpack (see package.json)

rmSync(out, { recursive: true, force: true });
cpSync(join(root, ".next/standalone"), out, { recursive: true });
cpSync(join(root, ".next/static"), join(out, ".next/static"), { recursive: true });
cpSync(join(root, "public"), join(out, "public"), { recursive: true });

// HOSTNAME must be 0.0.0.0: containers set it to their own name, and the platform could not reach the server.
const startCmd = "HOSTNAME=0.0.0.0 NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 node server.js";
writeFileSync(
  join(out, "package.json"),
  JSON.stringify(
    {
      name: JSON.parse(readFileSync(join(root, "package.json"), "utf8")).name,
      version: "0.1.0",
      private: true,
      scripts: { start: startCmd, dev: startCmd, build: "echo 'Already built.'" },
      engines: { node: ">=20.9" },
    },
    null,
    2,
  ) + "\n",
);

if (existsSync(zip)) rmSync(zip);
run(`zip -qr -y ${JSON.stringify(zip)} .`, out);
console.log(`\nDeploy bundle: ${zip}`);
