import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/theme";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring",
        secondary:
          "bg-warning text-warning-foreground hover:bg-warning/90 hover:text-warning-foreground focus-visible:ring-ring",
        outline:
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-ring",
        ghost: "text-foreground/70 hover:bg-foreground/5 hover:text-foreground focus-visible:ring-ring",
        nav: "font-medium text-muted-foreground hover:bg-muted/80 focus-visible:ring-ring dark:hover:bg-white/10 dark:hover:text-white",
      },
      isActive: {
        true: "",
        false: "",
      },
      size: {
        icon: "size-9",
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
      },
    },
    compoundVariants: [
      {
        variant: "nav",
        isActive: true,
        className:
          "bg-ring text-primary-foreground hover:bg-ring/90 dark:hover:bg-ring/90 dark:hover:text-primary-foreground",
      },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type ButtonSize = NonNullable<VariantProps<typeof buttonVariants>["size"]>;
type IconButtonSize = "icon";
type TextButtonSize = Exclude<ButtonSize, IconButtonSize>;

type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<VariantProps<typeof buttonVariants>, "size"> & {
    asChild?: boolean;
  };

/**
 * An icon button takes exactly one name. `label` renders `.sr-only` text, which
 * translation tools reach; `aria-label` stays for call sites not yet converted.
 */
type IconButtonLabel = { label: string; "aria-label"?: never } | { label?: never; "aria-label": string };

export type ButtonProps =
  | (ButtonBaseProps & {
      size?: TextButtonSize | null;
      label?: string;
    })
  | (ButtonBaseProps & { size: IconButtonSize } & IconButtonLabel);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isActive, asChild = false, label, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, isActive }), className);

    // Radix `Slot` takes one child, so an `asChild` button carries its name in the
    // element it renders.
    if (asChild) {
      return (
        <Slot className={classes} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {label ? <span className="sr-only">{label}</span> : null}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
