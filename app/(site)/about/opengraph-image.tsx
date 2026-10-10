import { createOGImage, size } from "@/components/ui/og-image";

export const alt = "TechTank TO About";
export { size };

export const contentType = "image/png";

export default function OGImage() {
  return createOGImage({
    title: "ABOUT",
    imageAlt: alt,
  });
}
