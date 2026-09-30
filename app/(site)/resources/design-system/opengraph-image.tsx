import { createOGImage, size } from "@/components/ui/og-image";

export const alt = "TechTank TO Design System";
export { size };

export const contentType = "image/png";

export default function OGImage() {
  return createOGImage({
    title: "DESIGN SYSTEM",
    imageAlt: alt,
  });
}
