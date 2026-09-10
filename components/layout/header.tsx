"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SlackIcon } from "@/components/ui/icons";
import { JoinDropdown } from "@/components/ui/join-dropdown";
import { QrDialog } from "@/components/ui/qr-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppStore } from "@/stores/app-state";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Events", href: "/events" },
  { name: "Resources", href: "/resources/media-kit" },
  { name: "Code of Conduct", href: "/legal/code-of-conduct" },
];

export function Header() {
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu, setQrDialogOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      {/* Named to tell it apart from the section sub-nav below. DOM text (translation
          tools skip aria-label) in a span (a heading would precede the h1). */}
      <nav
        aria-labelledby="primary-nav-name"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
      >
        <span id="primary-nav-name" className="sr-only">
          Main
        </span>
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logos/light.svg"
            alt="TechTank TO"
            width={192}
            height={56}
            className="h-10 w-auto dark:hidden"
            priority
          />
          <Image
            src="/images/logos/dark.svg"
            alt="TechTank TO"
            width={192}
            height={56}
            className="hidden h-10 w-auto dark:block"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-foreground transition-colors hover:underline"
            >
              {item.name}
            </Link>
          ))}
        </div>

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
        <div className="border-t border-border lg:hidden">
          <div className="space-y-4 p-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-base font-medium text-foreground transition-colors hover:text-ring"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
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
