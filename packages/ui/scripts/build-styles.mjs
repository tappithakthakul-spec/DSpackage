// Post-build: write dist/styles.css (the `@scope/ui/styles.css` export).
// src/styles/globals.css @imports the shared animation CSS and every component's
// stylesheet. Those imports are inlined here so the published file is
// self-contained: consumers' Tailwind only has to resolve `tailwindcss` itself,
// and @apply rules are compiled against their Tailwind setup.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENTRY = resolve(ROOT, "src/styles/globals.css");
const OUT = resolve(ROOT, "dist/styles.css");
const IMPORT = /^@import\s+["']([^"']+)["'];[^\S\n]*$/gm;

function resolveImport(spec, from) {
  if (spec.startsWith(".")) return resolve(dirname(from), spec);
  // Package import: find it in node_modules (walking up, for hoisted workspace
  // installs) and use its "style" export, like Tailwind does.
  let dir = dirname(from);
  let pkgJson;
  while (!existsSync((pkgJson = join(dir, "node_modules", spec, "package.json")))) {
    if (dir === dirname(dir)) throw new Error(`${from}: cannot resolve "${spec}"`);
    dir = dirname(dir);
  }
  const pkg = JSON.parse(readFileSync(pkgJson, "utf8"));
  const style = pkg.exports?.["."]?.style ?? pkg.style ?? pkg.main;
  return resolve(dirname(pkgJson), style);
}

function inline(file, seen = new Set()) {
  if (seen.has(file)) return "";
  seen.add(file);
  return readFileSync(file, "utf8").replace(IMPORT, (statement, spec) => {
    if (spec === "tailwindcss") {
      throw new Error(`${file}: must not import tailwindcss (consumers do)`);
    }
    return inline(resolveImport(spec, file), seen);
  });
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, inline(ENTRY));
console.log(`build-styles: wrote ${OUT}`);
