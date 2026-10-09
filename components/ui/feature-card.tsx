import { forwardRef, type HTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("rounded-2xl border border-border bg-card p-6 lg:p-8"),
  icon: cva("mb-4 flex size-12 items-center justify-center rounded-xl bg-ring/10 text-ring"),
  title: cva("mb-3 font-display text-xl font-semibold text-foreground"),
  description: cva("leading-relaxed text-muted-foreground"),
};

type FeatureCardRef = HTMLDivElement;
type FeatureCardProps = Omit<HTMLAttributes<FeatureCardRef>, "title"> & {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FeatureCard = forwardRef<FeatureCardRef, FeatureCardProps>((props, ref) => {
  const { icon: Icon, title, description, className, ...rest } = props;

  return (
    <div ref={ref} className={cn(styles.root({ className }))} {...rest}>
      <div className={cn(styles.icon())}>
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <h3 className={cn(styles.title())}>{title}</h3>
      <p className={cn(styles.description())}>{description}</p>
    </div>
  );
});
FeatureCard.displayName = "FeatureCard";

export { FeatureCard };
