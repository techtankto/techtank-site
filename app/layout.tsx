import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://techtankto.com"),
    title: {
      default: "TechTank TO — Toronto's Tech Community",
      template: "%s — TechTank TO",
    },
    description:
      "Foster a supportive and inclusive environment where people of all skill levels can explore, create, and thrive in technology. Year-round in-person events in Toronto.",
    twitter: {
      card: "summary_large_image",
      title: "TechTank TO — Toronto's Tech Community",
      description:
        "Foster a supportive and inclusive environment where people of all skill levels can explore, create, and thrive in technology.",
    },
    robots: {
      index: true,
      follow: true,
    },
    appleWebApp: {
      title: "TechTank TO",
      statusBarStyle: "default",
    },
    openGraph: {
      url: "/",
      type: "website",
      siteName: "TechTank TO",
      title: "TechTank TO — Toronto's Tech Community",
      description:
        "Foster a supportive and inclusive environment where people of all skill levels can explore, create, and thrive in technology.",
    },
    other: {
      "og:logo": "https://techtankto.com/icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#1B4B5A",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable} bg-background`}>
      <body className="flex min-h-screen flex-col font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          themes={["light", "dark"]}
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
