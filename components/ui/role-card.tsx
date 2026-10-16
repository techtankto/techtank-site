"use client";

import Link from "next/link";
import { Check, Mic, Building, Heart, Calendar, Star, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/analytics";
import { cva } from "@/utils/theme";

const styles = {
  root: cva("glass relative flex flex-col rounded-2xl p-6 transition-all duration-300 lg:p-8"),
  icon: cva("mb-4 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground"),
  iconGlyph: cva("size-6"),
  overline: cva("mb-2 text-xs font-semibold tracking-widest text-overline uppercase"),
  title: cva("mb-3 font-display text-xl font-bold text-foreground"),
  description: cva("mb-6 text-sm leading-relaxed text-muted-foreground"),
  benefits: cva("mb-6 flex-1 space-y-2"),
  benefitItem: cva("flex items-start gap-2 text-sm text-foreground"),
  benefitIcon: cva("mt-0.5 size-4 shrink-0 text-mint"),
  cta: cva("w-full text-center"),
  ctaSpan: cva("sr-only"),
};

export interface RoleCardProps {
  role: "attendee" | "speaker" | "host" | "sponsor" | "organizer" | "donate";
  overline: string;
  title: string;
  description: string;
  benefits: string[];
  href: string;
  ctaText?: string;
  external?: boolean;
  comingSoon?: boolean;
}

const icons = {
  attendee: Calendar,
  speaker: Mic,
  host: Building,
  sponsor: Heart,
  organizer: Star,
  donate: HandCoins,
};

export function RoleCard({
  role,
  overline,
  title,
  description,
  benefits,
  href,
  ctaText = "Learn more",
  external = false,
  comingSoon = false,
}: RoleCardProps) {
  const Icon = icons[role];

  return (
    <div className={styles.root()}>
      {/* Icon */}
      <div className={styles.icon()}>
        <Icon className={styles.iconGlyph()} aria-hidden="true" />
      </div>

      {/* Overline */}
      <span className={styles.overline()}>{overline}</span>

      {/* Title */}
      <h3 className={styles.title()}>{title}</h3>

      {/* Description */}
      <p className={styles.description()}>{description}</p>

      {/* Benefits */}
      <ul className={styles.benefits()}>
        {benefits.map((benefit, index) => (
          <li key={index} className={styles.benefitItem()}>
            <Check className={styles.benefitIcon()} aria-hidden="true" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {comingSoon ? (
        <Button variant="outline" size="sm" className={styles.cta()} disabled>
          Coming soon
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild className={styles.cta()}>
          <Link
            href={href}
            onClick={() => trackEvent("role_card_click", { role, href })}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {ctaText}
            {/* Readers navigate by link list, where a bare "Learn more" says nothing. */}
            <span className={styles.ctaSpan()}> about {title}</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
