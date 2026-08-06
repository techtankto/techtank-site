import { forwardRef, type OutputHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva("inline-flex items-center justify-center text-muted-foreground", {
    variants: {
      size: {
        sm: "[&_svg]:size-4",
        md: "[&_svg]:size-6",
        lg: "[&_svg]:size-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }),
};

type SpinnerRef = HTMLOutputElement;
type SpinnerProps = OutputHTMLAttributes<SpinnerRef> &
  VariantProps<typeof styles.root> & {
    /** Accessible label; defaults to "Loading". */
    label?: string;
  };

const Spinner = forwardRef<SpinnerRef, SpinnerProps>((props, ref) => {
  // props
  const { className, size, label = "Loading", ...rest } = props;

  // jsx
  return (
    <output ref={ref} aria-label={label} className={cn(styles.root({ size, className }))} {...rest}>
      <Loader2 className="animate-spin" aria-hidden="true" />
    </output>
  );
});
Spinner.displayName = "Spinner";

export { Spinner };
export type { SpinnerProps, SpinnerRef };
