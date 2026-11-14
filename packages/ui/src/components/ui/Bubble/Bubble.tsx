import * as React from "react"
import { variants, type VariantProps } from "../../../lib/variants"
import { cn } from "cn"
import { Slot } from "radix-ui"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("ui-bubble-group", className)}
      {...props}
    />
  )
}

const bubbleVariants = variants<{
  variant:
    | "default"
    | "secondary"
    | "muted"
    | "tinted"
    | "outline"
    | "ghost"
    | "destructive"
}>("ui-bubble group/bubble", {
  variant: "default",
})

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="bubble-content"
      className={cn("ui-bubble-content", className)}
      {...props}
    />
  )
}

const bubbleReactionsVariants = variants<{
  side: "top" | "bottom"
  align: "start" | "end"
}>("ui-bubble-reactions", {
  side: "bottom",
  align: "end",
})

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { BubbleGroup, Bubble, BubbleContent, BubbleReactions }
