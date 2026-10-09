import { forwardRef, type HTMLAttributes } from "react";
import { Check } from "lucide-react";
import { cn, cva, type VariantProps } from "@/utils/theme";

const styles = {
  root: cva("rounded-2xl border p-6 lg:p-8", {
    variants: {
      tone: {
        ring: "border-ring/30 bg-ring/8",
        amber: "border-amber/30 bg-amber/8",
      },
    },
    defaultVariants: {
      tone: "ring",
    },
  }),
  title: cva("mb-6 font-display text-xl font-semibold text-foreground"),
  list: cva("space-y-3"),
  item: cva("flex items-start gap-3"),
  icon: cva("mt-0.5 size-5 shrink-0", {
    variants: {
      tone: {
        ring: "text-ring",
        amber: "text-amber",
      },
    },
    defaultVariants: {
      tone: "ring",
    },
  }),
  label: cva("text-foreground"),
};

type ChecklistPanelRef = HTMLDivElement;
type ChecklistPanelProps = Omit<HTMLAttributes<ChecklistPanelRef>, "title"> &
  VariantProps<typeof styles.root> & {
    title: string;
    items: string[];
  };

const ChecklistPanel = forwardRef<ChecklistPanelRef, ChecklistPanelProps>((props, ref) => {
  // props
  const { title, items, tone, className, ...rest } = props;

  // jsx
  return (
    <div ref={ref} className={cn(styles.root({ tone, className }))} {...rest}>
      <h3 className={cn(styles.title())}>{title}</h3>
      <ul className={cn(styles.list())}>
        {items.map((item) => (
          <li key={item} className={cn(styles.item())}>
            <Check className={cn(styles.icon({ tone }))} aria-hidden="true" />
            <span className={cn(styles.label())}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
});
ChecklistPanel.displayName = "ChecklistPanel";

export { ChecklistPanel };
export type { ChecklistPanelProps, ChecklistPanelRef };
