"use client";

import Link from "next/link";
import { Calendar, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventLinks, getSocialLinks, getContributeLinks } from "@/constants/social-links";
import { BRAND_ICONS } from "@/components/ui/icons";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { trackEvent } from "@/utils/analytics";

export function DualCTA() {
  const eventLinks = getEventLinks();
  const socialLinks = getSocialLinks();
  const contributeLinks = getContributeLinks();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Never miss an event */}
      <div className="glass relative overflow-hidden rounded-xl p-5 lg:p-6">
        <Calendar className="absolute top-4 right-4 size-16 text-foreground/15" />
        <div className="relative">
          <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-amber-dark uppercase">
            Stay in the loop
          </span>
          <h3 className="mb-2 font-display text-lg font-bold text-foreground lg:text-xl">Never miss an event</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">
            Subscribe to our Luma calendar and follow us on socials.
          </p>
          <div className="flex flex-wrap gap-2">
            {[...eventLinks, ...socialLinks].map((link) => {
              const Icon = BRAND_ICONS[link.id];

              return (
                <Button key={link.id} variant={link.type === "primary" ? "primary" : "outline"} size="sm" asChild>
                  <TrackedLink
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    event="cta_click"
                    properties={{ id: link.id, name: link.name }}
                  >
                    {Icon && <Icon className="mr-2 size-4" />}
                    {link.name}
                    <ExternalLink className="ml-2 size-3.5" />
                  </TrackedLink>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Want to contribute? */}
      <div className="glass relative overflow-hidden rounded-xl p-5 lg:p-6">
        <Users className="absolute top-4 right-4 size-16 text-foreground/15" />
        <div className="relative">
          <span className="mb-2 inline-block text-xs font-semibold tracking-widest text-amber-dark uppercase">
            Get involved
          </span>
          <h3 className="mb-2 font-display text-lg font-bold text-foreground lg:text-xl">Want to contribute?</h3>
          <p className="mb-4 max-w-sm text-sm text-muted-foreground">Speak, host, sponsor, or volunteer.</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" asChild>
              <Link href="/get-involved" onClick={() => trackEvent("cta_click", { id: "get-involved" })}>
                Get involved
              </Link>
            </Button>
            {contributeLinks.map((link) => {
              const Icon = BRAND_ICONS[link.id];
              return (
                <Button key={link.id} variant="outline" size="sm" asChild>
                  <TrackedLink
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    event="cta_click"
                    properties={{ id: link.id, name: link.name }}
                  >
                    {Icon && <Icon className="mr-2 size-4" />}
                    {link.name}
                    <ExternalLink className="ml-2 size-3.5" />
                  </TrackedLink>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
