export const SITE_URL = "https://techtankto.com";

/** Public routes, by the path visitors see. `/donate` is rewritten from `/get-involved/donate`. */
export const SITE_ROUTES = [
  "/",
  "/about",
  "/about/faq",
  "/about/team",
  "/events",
  "/get-involved",
  "/get-involved/speak-or-facilitate",
  "/get-involved/host",
  "/get-involved/sponsor",
  "/get-involved/organizer",
  "/donate",
  "/legal/code-of-conduct",
  "/legal/terms-of-service",
  "/legal/privacy-policy",
  "/resources/media-kit",
  "/resources/design-system",
] as const;
