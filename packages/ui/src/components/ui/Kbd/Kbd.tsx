import { cn } from "cn"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return <kbd data-slot="kbd" className={cn("ui-kbd", className)} {...props} />
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("ui-kbd-group", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
