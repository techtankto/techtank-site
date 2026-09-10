"use client";

import { trackEvent } from "@/utils/analytics";

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: string;
  properties?: Record<string, unknown>;
}

export function TrackedLink({ event, properties, onClick, children, href, ...props }: TrackedLinkProps) {
  return (
    <a
      href={href}
      {...props}
      onClick={(e) => {
        trackEvent(event, properties);
        onClick?.(e);
      }}
    >
      {children}
    </a>
  );
}
