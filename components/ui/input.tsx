import * as React from "react"
import { cn } from "cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-[9px] border border-control bg-field px-3 py-1 text-[13.5px] text-ink transition-colors duration-150 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rejected lg:h-9",
        className
      )}
      {...props}
    />
  )
}

export { Input }
