import * as React from "react"
import { variants, type VariantProps } from "../../../lib/variants"
import { cn } from "cn"
import { Slot } from "radix-ui"

const badgeVariants = variants<{
  variant:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "ghost"
    | "link"
}>("ui-badge group/badge", {
  variant: "default",
})

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
