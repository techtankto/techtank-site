import { forwardRef, type InputHTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva(
    "w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  ),
};

type InputRef = HTMLInputElement;
type InputProps = InputHTMLAttributes<InputRef> & VariantProps<typeof styles.root>;

const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  // props
  const { className, type = "text", ...rest } = props;

  // jsx
  return <input ref={ref} type={type} className={cn(styles.root({ className }))} {...rest} />;
});
Input.displayName = "Input";

export { Input };
export type { InputProps, InputRef };
