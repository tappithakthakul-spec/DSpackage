// Post-build: make relative import specifiers in dist/ fully specified.
// tsup runs unbundled (to keep per-file "use client"), so esbuild leaves
// `./lib/utils` as-is. Node ESM and Next.js (webpack `fullySpecified`) require
// `./lib/utils.js`. Applies to both .js and .d.ts output.
import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";

const DIST = resolve(import.meta.dirname, "../dist");
const SPECIFIER =
  /(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(["'])(\.{1,2}\/[^"']+)\2/g;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function fullySpecify(file, spec) {
  if (/\.(m?js|cjs|json|css)$/.test(spec)) return spec;
  const ext = file.endsWith(".d.ts") ? ".d.ts" : ".js";
  const base = resolve(dirname(file), spec);
  if (existsSync(base + ext)) return `${spec}.js`;
  if (existsSync(join(base, `index${ext}`))) return `${spec}/index.js`;
  throw new Error(`${file}: cannot resolve "${spec}"`);
}

let changed = 0;
for (const file of walk(DIST)) {
  if (!/\.(js|d\.ts)$/.test(file)) continue;
  const source = readFileSync(file, "utf8");
  const output = source.replace(
    SPECIFIER,
    (_, prefix, quote, spec) =>
      `${prefix}${quote}${fullySpecify(file, spec)}${quote}`,
  );
  if (output !== source) {
    writeFileSync(file, output);
    changed++;
  }
}
console.log(`fix-esm-specifiers: updated ${changed} file(s)`);
