import { forwardRef, type HTMLAttributes } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AffiliationLink } from "@/constants/affiliations";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("flex flex-col rounded-2xl border border-border bg-card p-6 lg:p-8"),
  title: cva("mb-3 font-display text-xl font-semibold text-foreground"),
  description: cva("mb-6 leading-relaxed text-muted-foreground"),
  links: cva("mt-auto flex flex-wrap gap-3"),
};

type AffiliationCardRef = HTMLDivElement;
type AffiliationCardProps = Omit<HTMLAttributes<AffiliationCardRef>, "title"> & {
  name: string;
  description: string;
  links: AffiliationLink[];
};

const AffiliationCard = forwardRef<AffiliationCardRef, AffiliationCardProps>((props, ref) => {
  // props
  const { name, description, links, className, ...rest } = props;

  // jsx
  return (
    <div ref={ref} className={cn(styles.root({ className }))} {...rest}>
      <h3 className={cn(styles.title())}>{name}</h3>
      <p className={cn(styles.description())}>{description}</p>
      <div className={cn(styles.links())}>
        {links.map((link) => (
          <Button key={link.href} variant="outline" size="sm" asChild>
            <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              {link.label}
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  );
});
AffiliationCard.displayName = "AffiliationCard";

export { AffiliationCard };
export type { AffiliationCardProps, AffiliationCardRef };
