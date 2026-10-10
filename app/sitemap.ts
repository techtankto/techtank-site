import type { MetadataRoute } from "next";
import { SITE_ROUTES, SITE_URL } from "@/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map((route) => ({ url: `${SITE_URL}${route === "/" ? "" : route}` }));
}
