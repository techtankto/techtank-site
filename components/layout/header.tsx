"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QrDialog } from "@/components/ui/qr-dialog";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAppStore } from "@/stores/app-state";

const navigation = [
  { name: "About", href: "/about" },
  { name: "Get Involved", href: "/get-involved" },
  { name: "Pick a Task", href: "/tasks" },
  { name: "Events", href: "/events" },
  { name: "Resources", href: "/resources/media-kit" },
  { name: "Code of Conduct", href: "/legal/code-of-conduct" },
];

export function Header() {
  const { mobileMenuOpen, setMobileMenuOpen, toggleMobileMenu, setQrDialogOpen } = useAppStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQrDialogOpen(true)}
            aria-label="Show get involved QR code"
          >
            <QrCode className="size-5" />
          </Button>
          <Button variant="primary" size="sm" asChild>
            <Link href="/get-involved">Join us</Link>
          </Button>
        </div>

        {/* Mobile: QR + theme toggle + menu button */}
        <div className="flex items-center gap-1 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQrDialogOpen(true)}
            aria-label="Show get involved QR code"
          >
            <QrCode className="size-5" />
          </Button>
          <ThemeToggle />
          <button
            type="button"
            className="-m-2 p-2 text-foreground"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
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
            <div className="border-t border-border pt-4">
              <Button variant="primary" size="sm" className="w-full" asChild>
                <Link href="/get-involved">Join us</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      <QrDialog />
    </header>
  );
}
