# AGENTS.md

Guidance for AI coding agents (Claude Code, Codex, Cursor, etc.) working in this repository.

## What this is

A public React + TypeScript design system published to npm as `@scope/ui`. That name is a placeholder: rename it in `package.json`, `src/index.ts` and `src/styles/globals.css` before the first publish. It follows the shadcn/ui pattern (Radix UI via the `radix-ui` package, Tailwind CSS v4, `class-variance-authority`, `cn()`), but consumers install the compiled package instead of copying source. The main consumers are **Next.js App Router** apps on **React 19** (a peer dependency).

## Commands

```bash
npm install
npm run dev              # Storybook on :6006 (toolbar has a light/dark theme switch)
npm run build            # dist/: JS + .d.ts per source file, plus styles.css
npm run typecheck
npm run lint
npm run format           # prettier --write (with prettier-plugin-tailwindcss class sorting)
npm test                 # vitest run (jsdom)
npx vitest run src/components/ui/button.test.tsx   # single file
npx vitest run -t "merges a custom className"      # single test by name
npm run build-storybook
npm pack --dry-run       # check what will be published
```

`prepublishOnly` runs typecheck, lint, test and build.

## Build pipeline (read before touching tsup/tsconfig)

`npm run build` runs three steps, and each one is there for a reason:

1. **`tsup`** (`bundle: false`, ESM only) transpiles every `src/**/*.{ts,tsx}` to its own file in `dist/`, skipping stories and tests. It's unbundled on purpose. Bundling strips per-file `"use client"` directives. It would also force a single directive onto the whole bundle, which would make server-safe exports such as `cn()` and `buttonVariants` unusable from React Server Components. tsup's `onSuccess` copies `src/styles/globals.css` to `dist/styles.css`.
2. **`tsc -p tsconfig.build.json`** emits the `.d.ts` files. tsup's own `dts` option is disabled because it fails on TypeScript 6 (it sets the deprecated `baseUrl` internally).
3. **`scripts/fix-esm-specifiers.mjs`** rewrites relative imports in `dist/` (both `.js` and `.d.ts`) to be fully specified, for example `./lib/utils` becomes `./lib/utils.js`. The package is `"type": "module"`, so Node ESM and Next.js webpack (`fullySpecified`) reject extensionless paths. The script throws if it can't resolve an import.

After changing the build, check that a client component's `dist/*.js` still starts with `"use client"`. You can smoke-test the output with:

```bash
node --input-type=module -e "console.log(Object.keys(await import('@scope/ui')))"
```

Version constraint: TypeScript is pinned to `~6.0` because `typescript-eslint` doesn't support 6.1+ or 7.x yet.

## Architecture

- `src/components/ui/<name>.tsx`: one component per file, in shadcn style. Put `<name>.stories.tsx` and `<name>.test.tsx` next to it.
- `src/index.ts`: **the public API**. Nothing reaches consumers unless it's exported here. Export the component, its props type and its `*Variants` function.
- `src/lib/utils.ts`: `cn()` (`clsx` + `tailwind-merge`).
- `src/styles/globals.css`: design tokens. CSS variables are defined in `:root`/`.dark` (OKLCH) and mapped into Tailwind with `@theme inline`. The file also holds the `dark` custom variant and base layer styles. It does **not** `@import "tailwindcss"`; the consumer and `.storybook/preview.css` do that.
- `components.json`: shadcn CLI config. The `@/*` path alias in `tsconfig.json` exists **only** so the CLI works. The build doesn't rewrite aliases, so ESLint (`no-restricted-imports`) forbids `@/` imports in `src/`.
- `vite.config.ts` (Tailwind + React plugins) is used by Storybook only. Tests use `vitest.config.ts` and `test/setup.ts` (jest-dom matchers, cleanup).

### Adding a component from shadcn

1. Run `npx shadcn@latest add <name>`.
2. Change its `@/…` imports to relative paths. Lint enforces this.
3. Keep the `"use client"` that shadcn adds when the component uses hooks, context or event handlers. Leave it off purely presentational components (Button has none) so they stay usable in Server Components.
4. Add the component to `src/index.ts`, then write a story and a test.
5. New runtime packages go in `dependencies`. `react`, `react-dom` and `tailwindcss` stay in `peerDependencies` and are never bundled.
6. Some components (dialogs, popovers, and others) use `tw-animate-css` classes. That package isn't set up yet, so add it to `globals.css` and to the consumer instructions at that point.

### Consumer contract

Consumers set up Tailwind in their own global CSS:

```css
@import "tailwindcss";
@import "@scope/ui/styles.css";
@source "../node_modules/@scope/ui/dist";
```

- Because Tailwind finds classes with the `@source` scan, component classes must be **static strings**. Never build them dynamically (for example `` `bg-${color}` ``). Use cva variants instead.
- Dark mode works through a `.dark` class on an ancestor element.
- Removing or renaming an export, prop, variant or CSS token is a breaking change and needs a semver major bump.

## Conventions

- Use React 19 patterns: `ref` is a regular prop through `React.ComponentProps<…>`, with no `forwardRef`. Add `data-slot="<name>"` to the root element. Accept `className` and merge it last through `cn()`. Support `asChild` (`Slot.Root` from `radix-ui`) where shadcn does.
- Style with semantic tokens (`bg-primary`, `text-muted-foreground`), never raw palette colors or hex values.
- Tests query by role and accessible name. Radix handles a11y, so don't override its ARIA attributes.
