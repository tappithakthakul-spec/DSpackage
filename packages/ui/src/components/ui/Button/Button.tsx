import * as React from "react"
import { variants, type VariantProps } from "../../../lib/variants"
import { cn } from "cn"
import { Slot } from "radix-ui"

const buttonVariants = variants<{
  variant:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive"
    | "link"
  size:
    | "default"
    | "xs"
    | "sm"
    | "lg"
    | "icon"
    | "icon-xs"
    | "icon-sm"
    | "icon-lg"
}>("ui-button group/button", {
  variant: "default",
  size: "default",
})

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
