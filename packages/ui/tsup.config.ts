import { defineConfig } from "tsup";

// Unbundled ESM build: each source file becomes its own dist file, so per-file
// "use client" directives survive (bundling would strip them) and server-safe
// modules like `cn()` / `buttonVariants` stay importable from React Server Components.
export default defineConfig({
  entry: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.stories.tsx",
    "!src/**/*.test.{ts,tsx}",
  ],
  format: ["esm"],
  bundle: false,
  dts: false, // declarations are emitted by `tsc -p tsconfig.build.json`
  clean: true,
  sourcemap: true,
  target: "es2022",
  outDir: "dist",
  // dist/styles.css is written by scripts/build-styles.mjs after the JS/types build.
});
