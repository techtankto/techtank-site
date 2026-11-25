"use client";

import Link from "next/link";
import { Calendar, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventLinks, getSocialLinks, getContributeLinks } from "@/constants/social-links";
import { BRAND_ICONS } from "@/components/ui/icons";
import { TrackedLink } from "@/components/analytics/tracked-link";
import { trackEvent } from "@/utils/analytics";
import { cva } from "@/utils/theme";

const styles = {
  root: cva("grid gap-4 lg:grid-cols-2"),
  card: cva("glass relative overflow-hidden rounded-xl p-5 lg:p-6"),
  decoration: cva("absolute top-4 right-4 size-16 text-foreground opacity-15"),
  content: cva("relative"),
  overline: cva("mb-2 inline-block text-xs font-semibold tracking-widest text-overline uppercase"),
  title: cva("mb-2 font-display text-lg font-bold text-foreground lg:text-xl"),
  description: cva("mb-4 max-w-sm text-sm text-muted-foreground"),
  actions: cva("flex flex-wrap gap-2"),
  brandIcon: cva("mr-2 size-4"),
  externalIcon: cva("ml-2 size-3.5"),
};

export function DualCTA() {
  const eventLinks = getEventLinks();
  const socialLinks = getSocialLinks();
  const contributeLinks = getContributeLinks();

  return (
    <div className={styles.root()}>
      {/* Never miss an event */}
      <div className={styles.card()}>
        <Calendar className={styles.decoration()} aria-hidden="true" />
        <div className={styles.content()}>
          <span className={styles.overline()}>Stay in the loop</span>
          <h3 className={styles.title()}>Never miss an event</h3>
          <p className={styles.description()}>Subscribe to our Luma calendar and follow us on socials.</p>
          <div className={styles.actions()}>
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
                    {Icon && <Icon className={styles.brandIcon()} />}
                    {link.name}
                    <ExternalLink className={styles.externalIcon()} aria-hidden="true" />
                  </TrackedLink>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Want to contribute? */}
      <div className={styles.card()}>
        <Users className={styles.decoration()} aria-hidden="true" />
        <div className={styles.content()}>
          <span className={styles.overline()}>Get involved</span>
          <h3 className={styles.title()}>Want to contribute?</h3>
          <p className={styles.description()}>Speak, host, sponsor, or volunteer.</p>
          <div className={styles.actions()}>
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
                    {Icon && <Icon className={styles.brandIcon()} />}
                    {link.name}
                    <ExternalLink className={styles.externalIcon()} aria-hidden="true" />
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
