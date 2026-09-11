import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// Restyled to DESIGN_SPEC §7.9. Focus styling comes from the global
// :focus-visible token (§4.8). Touch targets are 44px below 1024px (§11).
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding font-medium whitespace-nowrap transition-colors duration-150 ease-out outline-none select-none disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "rounded-[8px] bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "rounded-[9px] border-btn-secondary-border bg-btn-secondary text-btn-secondary-fg hover:bg-btn-quiet aria-expanded:bg-btn-quiet",
        quiet:
          "rounded-[9px] border-btn-quiet-border bg-btn-quiet text-ink hover:border-control aria-expanded:border-control",
        chip:
          "rounded-[6px] border-dashed border-dashed bg-transparent text-ink-secondary hover:bg-sunken [&_svg]:text-chip-plus",
        ghost:
          "rounded-[8px] text-ink-secondary hover:bg-btn-quiet hover:text-ink aria-expanded:bg-btn-quiet",
        destructive:
          "rounded-[8px] bg-rejected text-white hover:bg-rejected/90 dark:text-page",
        link: "text-brand-fg underline decoration-brand-underline underline-offset-4 hover:decoration-current",
      },
      size: {
        default: "h-11 gap-1.5 px-3.5 text-[13px] lg:h-9",
        sm: "h-11 gap-1 px-3 text-[12.5px] lg:h-8",
        lg: "h-11 gap-2 px-4 text-[14px]",
        icon: "size-11 rounded-[10px] lg:size-8 lg:rounded-[7px]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "secondary",
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
