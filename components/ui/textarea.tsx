import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full rounded-[9px] border border-control bg-field px-3 py-2.5 text-[13.5px] leading-[1.5] text-ink transition-colors duration-150 outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-rejected",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
