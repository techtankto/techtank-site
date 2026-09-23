import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/theme";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-semibold transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        warning: "border-transparent bg-warning text-warning-foreground hover:bg-warning/80",
        success: "border-transparent bg-success text-success-foreground hover:bg-success/80",
      },
      size: {
        sm: "gap-1 px-2 py-0.5 text-[11px]",
        md: "gap-1 px-2.5 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface BadgeProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

function Badge({ className, variant, size, asChild = false, ...props }: BadgeProps) {
  const Comp = asChild ? Slot : "span";
  return <Comp className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge };
