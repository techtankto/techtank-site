import { forwardRef, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva("relative inline-flex w-full"),
  select: cva(
    "w-full appearance-none rounded-xl border border-input bg-card py-2.5 pr-10 pl-4 text-sm text-foreground transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  ),
  chevron: cva("pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"),
};

interface SelectOption {
  value: string;
  label: string;
}

type SelectRef = HTMLSelectElement;
type SelectProps = SelectHTMLAttributes<SelectRef> &
  VariantProps<typeof styles.select> & {
    /** Convenience: render these as `<option>`s. Falls back to children. */
    options?: readonly SelectOption[];
  };

const Select = forwardRef<SelectRef, SelectProps>((props, ref) => {
  // props
  const { className, options, children, ...rest } = props;

  // jsx
  return (
    <span className={cn(styles.root())}>
      <select ref={ref} className={cn(styles.select({ className }))} {...rest}>
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      <ChevronDown className={cn(styles.chevron())} aria-hidden="true" />
    </span>
  );
});
Select.displayName = "Select";

export { Select };
export type { SelectOption, SelectProps, SelectRef };
