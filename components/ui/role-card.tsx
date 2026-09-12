"use client";

import Link from "next/link";
import { Check, Mic, Building, Heart, Calendar, Star, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/utils/analytics";

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
    <div className="group glass relative flex flex-col rounded-2xl p-6 transition-all duration-300 lg:p-8">
      {/* Icon */}
      <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
        <Icon className="size-6" />
      </div>

      {/* Overline */}
      <span className="mb-2 text-xs font-semibold tracking-widest text-amber-dark uppercase">{overline}</span>

      {/* Title */}
      <h3 className="mb-3 font-display text-xl font-bold text-foreground">{title}</h3>

      {/* Description */}
      <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{description}</p>

      {/* Benefits */}
      <ul className="mb-6 flex-1 space-y-2">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-mint" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      {comingSoon ? (
        <Button variant="outline" size="sm" className="w-full text-center" disabled>
          Coming soon
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild className="w-full text-center">
          <Link
            href={href}
            onClick={() => trackEvent("role_card_click", { role, href })}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
            {ctaText}
          </Link>
        </Button>
      )}
    </div>
  );
}
