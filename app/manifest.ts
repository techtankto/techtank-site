import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TechTank TO - Toronto's Tech Community",
    short_name: "TechTank TO",
    description:
      "Foster a supportive and inclusive environment where people of all skill levels can explore, create, and thrive in technology. Year-round in-person events in Toronto.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#242E52",
    icons: [
      {
        src: "/images/logos/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/images/logos/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
