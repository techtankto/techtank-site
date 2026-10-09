import { forwardRef, type HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("grid gap-4 sm:grid-cols-2"),
  item: cva("flex items-center gap-3 rounded-lg bg-card p-4"),
  icon: cva("size-5 shrink-0 text-ring"),
  label: cva("text-foreground"),
};

type CheckGridRef = HTMLUListElement;
type CheckGridProps = HTMLAttributes<CheckGridRef> & {
  items: string[];
};

const CheckGrid = forwardRef<CheckGridRef, CheckGridProps>((props, ref) => {
  const { items, className, ...rest } = props;

  return (
    <ul ref={ref} className={cn(styles.root({ className }))} {...rest}>
      {items.map((item) => (
        <li key={item} className={cn(styles.item())}>
          <Check className={cn(styles.icon())} aria-hidden="true" />
          <span className={cn(styles.label())}>{item}</span>
        </li>
      ))}
    </ul>
  );
});
CheckGrid.displayName = "CheckGrid";

export { CheckGrid };
export type { CheckGridProps, CheckGridRef };
