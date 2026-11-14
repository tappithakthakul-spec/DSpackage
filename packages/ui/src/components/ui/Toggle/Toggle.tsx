"use client"

import * as React from "react"
import { variants, type VariantProps } from "../../../lib/variants"
import { cn } from "cn"
import { Toggle as TogglePrimitive } from "radix-ui"

const toggleVariants = variants<{
  variant: "default" | "outline"
  size: "default" | "sm" | "lg"
}>("ui-toggle group/toggle", {
  variant: "default",
  size: "default",
})

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
