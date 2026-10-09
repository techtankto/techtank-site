import { forwardRef, useId, type ComponentProps, type HTMLAttributes } from "react";
import { Subnav } from "@/components/layout/subnav";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("sticky top-18 z-40 border-b border-border bg-background/80 backdrop-blur-xl"),
};

type SectionNavRef = HTMLElement;
type SectionNavProps = HTMLAttributes<SectionNavRef> & {
  label: string;
  items: ComponentProps<typeof Subnav>["items"];
};

const SectionNav = forwardRef<SectionNavRef, SectionNavProps>((props, ref) => {
  const { label, items, className, ...rest } = props;

  const labelId = useId();

  return (
    <nav ref={ref} aria-labelledby={labelId} className={cn(styles.root({ className }))} {...rest}>
      <span id={labelId} className="sr-only">
        {label}
      </span>
      <Subnav items={items} />
    </nav>
  );
});
SectionNav.displayName = "SectionNav";

export { SectionNav };
export type { SectionNavProps, SectionNavRef };
