"use client"

import * as React from "react"
import { variants, type VariantProps } from "../../../lib/variants"
import { cn } from "cn"

import { Button } from "../Button"
import { CheckIcon, CopyIcon } from "lucide-react"

const codeBlockVariants = variants<{ variant: "default" | "destructive" }>(
  "ui-code-block group/code-block",
  {
    variant: "default",
  }
)

function CodeBlock({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof codeBlockVariants> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="code-block"
      data-variant={variant}
      data-size={size}
      className={cn(codeBlockVariants({ variant }), className)}
      {...props}
    />
  )
}

function CodeBlockHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-header"
      className={cn("ui-code-block-header", className)}
      {...props}
    />
  )
}

function CodeBlockTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-title"
      className={cn("ui-code-block-title", className)}
      {...props}
    />
  )
}

function CodeBlockActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-actions"
      className={cn("ui-code-block-actions", className)}
      {...props}
    />
  )
}

function CodeBlockCopyButton({
  value,
  variant = "ghost",
  size = "icon-xs",
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button> & { value: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) {
      return
    }

    const timeout = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timeout)
  }, [copied])

  return (
    <>
      <Button
        data-slot="code-block-copy-button"
        data-copied={copied || undefined}
        variant={variant}
        size={size}
        aria-label={copied ? "Copied" : "Copy"}
        className={cn(className)}
        onClick={(event) => {
          onClick?.(event)
          navigator.clipboard
            .writeText(value)
            .then(() => setCopied(true))
            .catch(() => {})
        }}
        {...props}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <span aria-live="polite" className="ui-code-block-copy-button__span">
        {copied ? "Copied" : ""}
      </span>
    </>
  )
}

function CodeBlockContent({
  className,
  children,
  style,
  wrap = false,
  lineNumbers = false,
  startLine = 1,
  ...props
}: React.ComponentProps<"pre"> & {
  wrap?: boolean
  lineNumbers?: boolean
  startLine?: number
}) {
  return (
    <pre
      data-slot="code-block-content"
      data-wrap={wrap || undefined}
      data-numbered={lineNumbers || undefined}
      dir="ltr"
      tabIndex={0}
      style={{ counterReset: `line ${startLine - 1}`, ...style }}
      className={cn("ui-code-block-content", className)}
      {...props}
    >
      <code data-slot="code-block-code" className="ui-code-block-code">
        {lineNumbers && typeof children === "string"
          ? children
              .replace(/\n$/, "")
              .split("\n")
              .map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))
          : children}
      </code>
    </pre>
  )
}

const codeBlockLineVariants = variants<{
  variant: "default" | "added" | "removed" | "highlighted"
}>("ui-code-block-line", {
  variant: "default",
})

function CodeBlockLine({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof codeBlockLineVariants>) {
  // An empty line holds a newline so copying a selection keeps blank lines.
  const empty =
    children === undefined ||
    children === null ||
    children === "" ||
    (Array.isArray(children) && children.length === 0)

  return (
    <span
      data-slot="code-block-line"
      data-variant={variant}
      className={cn(codeBlockLineVariants({ variant }), className)}
      {...props}
    >
      <span
        data-slot="code-block-line-content"
        className="ui-code-block-line-content"
      >
        {empty ? "\n" : children}
      </span>
    </span>
  )
}

function CodeBlockFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="code-block-footer"
      className={cn("ui-code-block-footer", className)}
      {...props}
    />
  )
}

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  CodeBlockLine,
  CodeBlockFooter,
}
