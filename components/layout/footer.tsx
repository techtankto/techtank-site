import Link from "next/link";
import Image from "next/image";
import { Mail } from "lucide-react";
import { BRAND_ICONS } from "@/components/ui/icons";
import { CONTACT_EMAIL } from "@/constants/contact";

const footerLinks = {
  community: {
    title: "Community",
    links: [
      { name: "Luma", href: "https://luma.com/techtank", external: true },
      { name: "Meetup", href: "https://meetup.com/techtank-to", external: true },
      { name: "Slack", href: "/links/slack", external: true },
      { name: "LinkedIn", href: "https://linkedin.com/company/techtank-to", external: true },
      { name: "Instagram", href: "https://instagram.com/techtankto", external: true },
      { name: "GitHub", href: "https://github.com/techtankto", external: true },
      { name: "YouTube", href: "https://youtube.com/@TechTankTo", external: true },
    ],
  },
  about: {
    title: "About",
    links: [
      { name: "TechTank", href: "/about", external: false },
      { name: "Team", href: "/about/team", external: false },
      { name: "FAQ", href: "/about/faq", external: false },
    ],
  },
  getInvolved: {
    title: "Get Involved",
    links: [
      { name: "Speak or Facilitate", href: "/get-involved/speak-or-facilitate", external: false },
      { name: "Host", href: "/get-involved/host", external: false },
      { name: "Sponsor", href: "/get-involved/sponsor", external: false },
      { name: "Organizer Team", href: "/get-involved/organizer", external: false },
      { name: "Donate", href: "/donate", external: false },
      { name: "Events", href: "/events", external: false },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Media Kit", href: "/resources/media-kit", external: false },
      { name: "Design System", href: "/resources/design-system", external: false },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Code of Conduct", href: "/legal/code-of-conduct", external: false },
      { name: "Terms of Service", href: "/legal/terms-of-service", external: false },
      { name: "Privacy Policy", href: "/legal/privacy-policy", external: false },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground dark:bg-background dark:text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center">
              <Image src="/images/logos/dark.svg" alt="TechTank TO" width={128} height={56} className="h-10 w-auto" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-primary-foreground dark:text-foreground">
              Toronto&apos;s inclusive tech community. Year-round events since 2023.
            </p>
          </div>

          {/* Links columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold tracking-wider text-primary-foreground/90 uppercase dark:text-foreground/90">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => {
                  const Icon = BRAND_ICONS[link.name.toLowerCase()];

                  return (
                    <li key={link.name}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center gap-2 text-sm text-primary-foreground hover:text-primary-foreground hover:underline dark:text-foreground dark:hover:text-foreground"
                        >
                          {Icon && (
                            <Icon className="size-4 text-primary-foreground group-hover:text-primary-foreground hover:underline dark:text-foreground dark:group-hover:text-foreground" />
                          )}
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-sm text-primary-foreground hover:text-primary-foreground hover:underline dark:text-foreground dark:hover:text-foreground"
                        >
                          {Icon && (
                            <Icon className="size-4 text-primary-foreground group-hover:text-primary-foreground hover:underline dark:text-foreground dark:group-hover:text-foreground" />
                          )}
                          {link.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-primary-foreground/10 pt-8 dark:border-foreground/10">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
            <div className="flex flex-col items-center gap-1 text-center lg:items-start lg:text-left">
              <p className="text-sm text-primary-foreground dark:text-foreground">
                Copyright &copy; {Math.max(new Date().getFullYear(), 2026)} TechTank TO Inc. All rights reserved.
              </p>
              <p className="text-sm text-primary-foreground/80 dark:text-foreground/80">
                Registered Nonprofit &mdash; Ontario Corporation No.{" "}
                <a
                  href="https://www.appmybizaccount.gov.on.ca/onbis/corporations/viewInstance/view.pub?id=280aa9d4fbca6577ccb365bb8f57e85a6ffa0ef043506e27dfa9fa1183d3d47a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-primary-foreground/40 underline-offset-2 hover:decoration-primary-foreground dark:decoration-foreground/40 dark:hover:decoration-foreground"
                >
                  1001581728
                </a>
              </p>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-2 text-sm text-primary-foreground hover:text-primary-foreground hover:underline dark:text-foreground dark:hover:text-foreground"
            >
              <Mail className="size-4" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
