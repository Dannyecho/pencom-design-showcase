// Usage: node tools/i18n/dump-dicts.mjs [out.json]
// Transpiles src/i18n/dict/{ha,yo,ig}.ts and writes them as one JSON file
// ({ ha: {...}, yo: {...}, ig: {...} }), then checks the three have the same keys.
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const root = process.cwd();
const ts = createRequire(path.join(root, "package.json"))("typescript");
const out = {};
for (const l of ["ha", "yo", "ig"]) {
  const src = fs.readFileSync(path.join(root, `src/i18n/dict/${l}.ts`), "utf8");
  const js = ts.transpileModule(src, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const m = { exports: {} };
  new Function("module", "exports", "require", js)(m, m.exports, () => ({}));
  out[l] = m.exports.default;
}
const file = process.argv[2] || "tools/i18n/.out/dicts.json";
fs.mkdirSync(path.dirname(file), { recursive: true });
fs.writeFileSync(file, JSON.stringify(out));
const keys = Object.keys(out.ha);
console.log(Object.fromEntries(Object.entries(out).map(([k, v]) => [k, Object.keys(v).length])));
for (const l of ["yo", "ig"]) {
  const miss = keys.filter((k) => !(k in out[l]));
  const extra = Object.keys(out[l]).filter((k) => !(k in out.ha));
  if (miss.length || extra.length) console.log(l, "missing", miss.slice(0, 10), "extra", extra.slice(0, 10));
}
console.log("written", file);
