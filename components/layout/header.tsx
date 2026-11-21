"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { JoinDropdown } from "@/components/ui/join-dropdown";
import { QrDialog } from "@/components/ui/qr-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppStore } from "@/stores/app-state";
import { cn } from "@/utils/theme";

type NavItem = {
  name: string;
  href: string;
  /** Path prefixes of the section the item leads, which mark it active; defaults to `href`. */
  match?: string[];
  disabled?: boolean;
};

const navigation: NavItem[] = [
  { name: "About", href: "/about" },
  // /donate is rewritten to /get-involved/donate (next.config.ts), so the browser path never shows the section.
  { name: "Get Involved", href: "/get-involved", match: ["/get-involved", "/donate"] },
  { name: "Pick a Task", href: "/tasks", disabled: process.env.NEXT_PUBLIC_FEATURE_PICK_A_TASK !== "true" },
  { name: "Events", href: "/events" },
  { name: "Resources", href: "/resources/media-kit", match: ["/resources"] },
  { name: "Code of Conduct", href: "/legal/code-of-conduct", match: ["/legal"] },
];

const visibleNavigation = navigation.filter((item) => !item.disabled);

// Active for the item's own page and everything under it, e.g. About for /about/team.
function isActive(item: NavItem, pathname: string) {
  const prefixes = item.match ?? [item.href];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function Header() {
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu, setQrDialogOpen } = useAppStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-18 w-full shrink-0 border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Named to tell it apart from the section sub-nav below. DOM text (translation
          tools skip aria-label) in a span (a heading would precede the h1). */}
      <nav
        aria-labelledby="primary-nav-name"
        className="mx-auto flex h-full max-w-7xl items-center justify-start gap-8 px-6 lg:px-8"
      >
        <span id="primary-nav-name" className="sr-only">
          Main
        </span>
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/light.svg"
            alt="TechTank TO"
            width={123}
            height={27}
            className="h-7.5 w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/logos/dark.svg"
            alt="TechTank TO"
            width={691}
            height={157}
            className="hidden h-7.5 w-auto dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {visibleNavigation.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Button key={item.name} variant="nav" size="sm" isActive={active} asChild>
                <Link href={item.href} aria-current={active ? "page" : undefined}>
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>

        <div className="flex-1"></div>

        {/* Desktop CTA + theme toggle */}
        <div className="hidden lg:flex lg:items-center lg:gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setQrDialogOpen(true)} label="Show get involved QR code">
            <QrCode className="size-5" aria-hidden="true" />
          </Button>
          <JoinDropdown />
        </div>

        {/* Mobile: QR + theme toggle + menu button */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setQrDialogOpen(true)} label="Show get involved QR code">
            <QrCode className="size-5" aria-hidden="true" />
          </Button>
          <ThemeToggle />
          <button
            type="button"
            className="-m-2 p-2 text-foreground"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
          >
            <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
            {mobileMenuOpen ? (
              <X className="size-6" aria-hidden="true" />
            ) : (
              <Menu className="size-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-border bg-background lg:hidden">
          <div className="space-y-4 p-4">
            {visibleNavigation.map((item) => {
              const active = isActive(item, pathname);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block text-base font-medium text-foreground transition-colors hover:text-ring",
                    active && "font-semibold text-ring",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="space-y-2 border-t border-border pt-4">
              <Button variant="primary" size="sm" className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <Link href="/get-involved">Get involved</Link>
              </Button>
              <Button variant="secondary" size="sm" className="w-full" asChild onClick={() => setMobileMenuOpen(false)}>
                <a href="/links/slack" target="_blank" rel="noopener noreferrer">
                  <SlackIcon className="mr-2 size-4" />
                  Join our Slack
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}

      <QrDialog />
    </header>
  );
}
