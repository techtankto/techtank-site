import type { NextConfig } from "next";
import { REMOTE_IMAGE_HOSTS } from "./constants/remote-images";

const contentSecurityPolicy = [
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    useTypeScriptCli: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: REMOTE_IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    return [
      {
        source: "/links/slack",
        destination: "https://join.slack.com/t/thetechtank/shared_invite/zt-3zhdtiavp-afxTnTcQdXEdfx~0mjXGtA",
        permanent: false,
      },
      {
        source: "/join-us",
        destination: "/get-involved",
        permanent: true,
      },
      {
        source: "/get-involved/donate",
        destination: "/donate",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/donate",
        destination: "/get-involved/donate",
      },
    ];
  },
};

export default nextConfig;
