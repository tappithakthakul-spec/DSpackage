import { cn } from "./utils"

type VariantValues = Record<string, string>

/** Props a variants function accepts: each variant key optional; null turns that variant off. */
export type VariantOptions<V extends VariantValues> = { [K in keyof V]?: V[K] | null }

/** Variant props of a function made with `variants()`, without `className`. */
export type VariantProps<T> = T extends (options?: infer O) => string
  ? Omit<NonNullable<O>, "className">
  : never

/**
 * Builds class names for a component whose styles live in its own CSS file.
 * The first class in `base` is the block. Each variant adds a
 * `<block>--<key>-<value>` modifier class defined in that CSS.
 *
 *   const buttonVariants = variants<{ variant: "default" | "outline" }>(
 *     "ui-button group/button", { variant: "default" })
 *   buttonVariants({ variant: "outline", className: "w-full" })
 *   // → "ui-button group/button ui-button--variant-outline w-full"
 */
export function variants<V extends VariantValues>(base: string, defaults: Partial<V> = {}) {
  const block = base.split(" ")[0]

  return ({ className, ...options }: VariantOptions<V> & { className?: string } = {}) => {
    const selected: Record<string, string | null | undefined> = { ...defaults }
    for (const [key, value] of Object.entries(options)) {
      if (value !== undefined) selected[key] = value as string | null
    }
    return cn(
      base,
      Object.entries(selected).map(([key, value]) => (value ? `${block}--${key}-${value}` : null)),
      className
    )
  }
}
