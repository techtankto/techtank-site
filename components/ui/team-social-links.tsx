import type { ComponentPropsWithoutRef } from "react";
import { Button } from "@/components/ui/button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { cn, cva } from "@/utils/theme";

const styles = {
  root: cva("relative z-10 flex gap-1", {
    variants: {
      align: {
        left: "items-start",
        center: "items-center",
      },
      iconOnly: {
        true: "flex-row items-center",
        false: "flex-col",
      },
    },
    defaultVariants: {
      align: "left",
      iconOnly: false,
    },
  }),
  button: cva("text-muted-foreground hover:text-foreground", {
    variants: {
      align: {
        left: "-ml-2.5 justify-start px-2.5",
        center: "justify-center px-2.5",
      },
      iconOnly: {
        true: "ml-0 size-8 justify-center p-0",
        false: "h-auto gap-2 py-1 text-sm font-normal",
      },
    },
    defaultVariants: {
      align: "left",
      iconOnly: false,
    },
  }),
};

export interface TeamSocialLinksProps extends ComponentPropsWithoutRef<"div"> {
  linkedin?: string;
  github?: string;
  align?: "left" | "center";
  iconOnly?: boolean;
}

/**
 * Normalizes and validates a profile URL string using `URL.canParse` and `URL.protocol`.
 * Prepends `https://` when the input omits a scheme (e.g. "github.com/tkodev") and
 * rejects non-HTTP(S) schemes.
 */
function parseProfileUrl(rawUrl?: string): URL | null {
  const trimmed = rawUrl?.trim();
  if (!trimmed) {
    return null;
  }

  // Parse as-is if already a valid URL; otherwise retry with an explicit https:// scheme
  // so bare host/path values like "linkedin.com/in/tkodev" still resolve cleanly.
  const candidate = URL.canParse(trimmed) ? trimmed : `https://${trimmed}`;
  if (!URL.canParse(candidate)) {
    return null;
  }

  const parsed = new URL(candidate);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return null;
  }

  return parsed;
}

/**
 * Extracts a LinkedIn handle from a profile URL.
 * Personal LinkedIn profiles use `/in/<handle>`; if the URL follows another
 * path structure, the last non-empty path segment is used as a fallback.
 */
export function extractLinkedInUsername(url?: string): string {
  const parsed = parseProfileUrl(url);
  if (!parsed) {
    return "";
  }

  // Split pathname into non-empty segments so leading and trailing slashes are ignored.
  const parts = parsed.pathname.split("/").filter(Boolean);

  // Personal LinkedIn URLs place the member handle immediately after the "in" segment.
  const inIdx = parts.indexOf("in");
  if (inIdx !== -1) {
    return parts[inIdx + 1] ?? "";
  }

  // Fall back to the final path segment for non-standard profile URLs.
  return parts.at(-1) ?? "";
}

/**
 * Extracts a GitHub username from a profile URL.
 * GitHub profile URLs place the account handle in the first path segment (`/<username>`).
 */
export function extractGitHubUsername(url?: string): string {
  const parsed = parseProfileUrl(url);
  if (!parsed) {
    return "";
  }

  // Split pathname into non-empty segments; the first segment is the GitHub username.
  const parts = parsed.pathname.split("/").filter(Boolean);
  return parts[0] ?? "";
}

export function TeamSocialLinks({
  linkedin,
  github,
  align = "left",
  iconOnly = false,
  className,
  ...props
}: TeamSocialLinksProps) {
  if (!linkedin && !github) {
    return null;
  }

  const linkedinUser = extractLinkedInUsername(linkedin);
  const githubUser = extractGitHubUsername(github);
  const buttonClass = styles.button({ align, iconOnly });

  return (
    <div className={cn(styles.root({ align, iconOnly }), className)} {...props}>
      {linkedin && (
        <Button variant="ghost" size="sm" asChild className={buttonClass}>
          <a href={linkedin} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <LinkedInIcon className="size-4 shrink-0" aria-hidden="true" />
            <span className={iconOnly ? "sr-only" : undefined}>{linkedinUser}</span>
            <span className="sr-only">on LinkedIn</span>
          </a>
        </Button>
      )}
      {github && (
        <Button variant="ghost" size="sm" asChild className={buttonClass}>
          <a href={github} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
            <GitHubIcon className="size-4 shrink-0" aria-hidden="true" />
            <span className={iconOnly ? "sr-only" : undefined}>{githubUser}</span>
            <span className="sr-only">on GitHub</span>
          </a>
        </Button>
      )}
    </div>
  );
}
