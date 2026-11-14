import * as React from "react"
import { cn } from "cn"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../Collapsible"
import { ChevronRightIcon } from "lucide-react"

function Trace({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="trace" className={cn("ui-trace", className)} {...props} />
  )
}

function TraceLine({
  className,
  status,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "running" | "error" | "pending"
}) {
  return (
    <span
      data-slot="trace-line"
      data-status={status}
      className={cn("ui-trace-line", className)}
      {...props}
    />
  )
}

function TraceIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-icon"
      aria-hidden="true"
      className={cn("ui-trace-icon", className)}
      {...props}
    />
  )
}

function TraceTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-title"
      className={cn("ui-trace-title", className)}
      {...props}
    />
  )
}

function TraceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="trace-description"
      className={cn("ui-trace-description", className)}
      {...props}
    />
  )
}

function TraceCollapsible({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Collapsible>, "asChild" | "open"> &
  (
    | { open?: undefined }
    | {
        open: boolean
        onOpenChange: NonNullable<
          React.ComponentProps<typeof Collapsible>["onOpenChange"]
        >
      }
  )) {
  return (
    <Collapsible
      data-slot="trace-collapsible"
      className={cn("ui-trace-collapsible", className)}
      {...props}
    />
  )
}

function TraceCollapsibleTrigger({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsibleTrigger>, "asChild">) {
  return (
    <CollapsibleTrigger
      data-slot="trace-collapsible-trigger"
      className={cn(
        "ui-trace-collapsible-trigger group/trace-collapsible-trigger",
        className
      )}
      {...props}
    >
      {children}
      <TraceIcon className="ui-trace-collapsible-trigger__trace-icon">
        <ChevronRightIcon />
      </TraceIcon>
    </CollapsibleTrigger>
  )
}

function TraceCollapsibleContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof CollapsibleContent>, "asChild">) {
  return (
    <CollapsibleContent
      data-slot="trace-collapsible-content"
      className="ui-trace-collapsible-content"
      {...props}
    >
      <div
        data-slot="trace-collapsible-content-inner"
        className={cn("ui-trace-collapsible-content-inner", className)}
      >
        {children}
      </div>
    </CollapsibleContent>
  )
}

export {
  Trace,
  TraceLine,
  TraceIcon,
  TraceTitle,
  TraceDescription,
  TraceCollapsible,
  TraceCollapsibleTrigger,
  TraceCollapsibleContent,
}
